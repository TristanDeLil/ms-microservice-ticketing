export interface DomainEvent {
    get eventName(): string;
    get occurredOn(): Date;
}
