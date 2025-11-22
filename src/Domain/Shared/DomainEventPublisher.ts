import { DomainEvent, DomainEventSubscriber } from 'Howestprime.Ticketing/Domain/Shared/mod.ts';

export class DomainEventPublisher {
    private static _instance: DomainEventPublisher;
    private readonly _subscribers: Array<DomainEventSubscriber>;

    private constructor() {
        this._subscribers = [];
    }

    public static instance(): DomainEventPublisher {
        if (!DomainEventPublisher._instance) {
            DomainEventPublisher._instance = new DomainEventPublisher();
        }
        return DomainEventPublisher._instance;
    }

    public addDomainEventSubscriber(subscriber: DomainEventSubscriber): void {
        this._subscribers.push(subscriber);
    }

    publish(domainEvent: DomainEvent): void {
        console.log(`Publishing domain event: ${domainEvent.eventName}`);
        this._subscribers
            .filter((subscriber) => subscriber.isSubscribedTo(domainEvent))
            .forEach((subscriber) => subscriber.handleEvent(domainEvent));
    }
}
