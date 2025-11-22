import { TicketingDomainEvent } from 'Howestprime.Ticketing/Domain/TicketingDomainEvent.ts';

export class PaymentCreated extends TicketingDomainEvent {
    private readonly _paymentId: string;
    private readonly _orderId: string;
    private readonly _amount: number;
    private readonly _status: string;

    constructor(eventname: string, paymentId: string, orderId: string, amount: number, status: string) {
        super(eventname, new Date());
        this._paymentId = paymentId;
        this._orderId = orderId;
        this._amount = amount;
        this._status = status;
    }

    static create(eventname:string, paymentId: string, orderId: string, amount: number, status: string): PaymentCreated {
        return new PaymentCreated(eventname, paymentId, orderId, amount, status);
    }

    get paymentId(): string {
        return this._paymentId;
    }

    get orderId(): string {
        return this._orderId;
    }

    get amount(): number {
        return this._amount;
    }

    get status(): string {
        return this._status;
    }
}