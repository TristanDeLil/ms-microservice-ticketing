import { ConsumerConfig } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/Amqp/mod.ts';
import { AmqpMessageProcessor } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';

export interface AmqpBroker {
    connect(): Promise<void>;

    stop(): Promise<void>;

    publishOnTopic(
        exchange: string,
        routingKey: string,
        message: string,
    ): Promise<void>;

    consumeFromTopic(
        consumerConfig: ConsumerConfig,
    ): Promise<void>;

    addMessageProcessor(messageProcessor: AmqpMessageProcessor): this;
}
