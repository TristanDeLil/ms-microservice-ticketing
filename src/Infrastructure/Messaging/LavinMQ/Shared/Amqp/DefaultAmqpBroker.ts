import { AMQPChannel, AMQPClient, AMQPMessage, type QueueOk } from '@cloudamqp/amqp-client';
import { IllegalStateException } from '@domaincrafters/std';
import {
    AmqpBroker,
    ConsumerContext,
} from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/Amqp/mod.ts';
import { AmqpMessageProcessor } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';

export interface Exchange {
    name: string;
    type: string;
}

export interface ConsumerConfig {
    operationId: string;
    exchange: string;
    event: string;
}

export interface PublisherConfig {
    publisher: string;
    exchange: string;
    events: string[];
}

export interface BrokerConfig {
    host: string;
    exchanges: Exchange[];
}

export class DefaultAmqpBroker implements AmqpBroker {
    private _channel: AMQPChannel | null;
    private readonly _exchanges: Exchange[];
    private readonly _host: string;
    private readonly _messageProcessors: Array<AmqpMessageProcessor> = [];

    static create(config: BrokerConfig): DefaultAmqpBroker {
        const host = config.host;
        const exchanges: Exchange[] = config.exchanges;

        return new DefaultAmqpBroker(host, exchanges);
    }

    async connect(): Promise<void> {
        console.log('Connecting to AMQP');
        const amqp = new AMQPClient(this._host);
        try {
            const connection = await amqp.connect();
            this._channel = await connection.channel();

            for (const exchange of this._exchanges) {
                await this._channel.exchangeDeclare(
                    exchange.name,
                    exchange.type,
                    {
                        autoDelete: true,
                        durable: false,
                        internal: false,
                        passive: false,
                    },
                );
            }

            console.log('Connected to AMQP');
        } catch (_error) {
            throw new IllegalStateException('Could not establish connection to AMQP Broker');
        }
    }

    async stop(): Promise<void> {
        if (this._channel) {
            try {
                await this._channel.close();
                await this._channel.connection.close();
                console.log('Connection to AMQP Broker closed');
            } catch (_error) {
                throw new IllegalStateException('Error closing AMQP channel or connection');
            }
        }
    }

    async publishOnTopic(exchange: string, routingKey: string, message: string): Promise<void> {
        this.validateChannel();
        await this._channel!.basicPublish(exchange, routingKey, message);
    }

    async consumeFromTopic(
        consumerConfig: ConsumerConfig,
    ): Promise<void> {
        this.ensureValidExchange(consumerConfig.exchange);

        const queueOk: QueueOk | undefined = await this._channel?.queueDeclare();

        if (queueOk === undefined) {
            throw new Error('Queue not created');
        }

        const queueName = queueOk.name;

        await this._channel?.queueBind(
            queueName,
            consumerConfig.exchange,
            consumerConfig.event,
        );

        await this._channel!.basicConsume(
            queueName,
            { noAck: true },
            async (data: AMQPMessage) => {
                const ctx: ConsumerContext = {
                    operationId: consumerConfig.operationId,
                    exchangeName: consumerConfig.exchange,
                    eventName: consumerConfig.event,
                    message: data,
                };

                try {
                    for (const processor of this._messageProcessors) {
                        await processor.process(ctx);
                    }
                } catch (e) {
                    console.error('Error parsing message body as JSON:', e);
                }
            },
        );
    }

    addMessageProcessor(messageProcessor: AmqpMessageProcessor): this {
        this._messageProcessors.push(messageProcessor);
        return this;
    }

    private validateChannel(): void {
        if (!this.isChannelReady()) {
            throw new IllegalStateException('Channel is not connected');
        }
    }

    private ensureValidExchange(exchangeName: string) {
        if (!this._exchanges.some(({ name }) => name === exchangeName)) {
            throw new IllegalStateException(`Exchange ${exchangeName} not found`);
        }
    }

    private isChannelReady(): boolean {
        return this._channel !== null;
    }

    private constructor(host: string, exchanges: Exchange[]) {
        this._host = host;
        this._exchanges = exchanges;
        this._channel = null;
    }
}
