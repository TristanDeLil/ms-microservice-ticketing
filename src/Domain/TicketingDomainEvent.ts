import { DomainEvent } from 'Howestprime.Ticketing/Domain/Shared/mod.ts';

export abstract class TicketingDomainEvent implements DomainEvent {
    private readonly _boundedContext: string;
    public readonly _eventName: string;
    public readonly occurredOn: Date;

    protected constructor(eventName: string, occurredOn: Date) {
        this._boundedContext = 'ticketing';
        this.occurredOn = occurredOn;
        this._eventName = eventName;
    }

    public get eventName(): string {
        return `${this._boundedContext}.${this._eventName}`;
    }
}
