import { DomainEvent } from 'Howestprime.Ticketing/Domain/Shared/mod.ts';

export interface DomainEventSubscriber {
    isSubscribedTo(event: DomainEvent): boolean;
    handleEvent(event: DomainEvent): void;
}
