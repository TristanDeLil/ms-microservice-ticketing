import { AmqpBroker } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/Amqp/mod.ts';
import { DomainEvent, DomainEventSubscriber } from 'Howestprime.Ticketing/Domain/Shared/mod.ts';

export class AmqpTopicPublisher implements DomainEventSubscriber {
    private readonly _amqpBroker: AmqpBroker;
    private readonly _exchange: string;
    private readonly _allowedTopics: string[] = [];

    public static create(
        messageBroker: AmqpBroker,
        exchange: string,
        _allowedTopics: string[] = [],
    ): AmqpTopicPublisher {
        console.log('Registering allowed topics:\n' + _allowedTopics.join(', '));
        return new AmqpTopicPublisher(messageBroker, exchange, _allowedTopics);
    }

    private constructor(
        messageBroker: AmqpBroker,
        exchage: string,
        allowedTopics: string[],
    ) {
        this._amqpBroker = messageBroker;
        this._exchange = exchage;
        this._allowedTopics = allowedTopics;
    }

    isSubscribedTo(event: DomainEvent): boolean {
        const routingKey: string = this.getRoutingKey(event.eventName);
        return this._allowedTopics.includes(routingKey);
    }

    handleEvent(event: DomainEvent): void {
        if (this.isSubscribedTo(event)) {
            this._amqpBroker.publishOnTopic(
                this._exchange,
                this.getRoutingKey(event.eventName),
                JSON.stringify(event, this.ignorePrivateFields),
            );
        }

        console.log(`Published domain event: ${event.eventName} to ${this._exchange}`);
    }

    private ignorePrivateFields(key: string, value: unknown): unknown {
        if (key.startsWith('_')) {
            return undefined;
        }

        return value;
    }

    private getRoutingKey(eventName: string): string {
        return `${this._exchange}.${eventName}`;
    }
}
