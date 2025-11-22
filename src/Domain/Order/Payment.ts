import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { Guard } from '@domaincrafters/std';
import { BookingId, OrderId, PaymentStatus } from 'Howestprime.Ticketing/Domain/mod.ts';

export class PaymentId extends UUIDEntityId {
    constructor(id?: string) {
        super(id);
    }
    static create(id?: string): PaymentId {
        return new PaymentId(id);
    }
}

export class Payment extends Entity {
    private _externalId: string;
    private _paymentMethod: string;
    private _cardNumber: string;
    private _expiryDate: string;
    private _cvv: string;
    private _orderId: OrderId;
    private _bookingId: BookingId;
    private _amount: number;
    private _status: PaymentStatus;

    constructor(
        id: PaymentId,
        externalId: string,
        paymentMethod: string,
        cardNumber: string,
        expiryDate: string,
        cvv: string,
        orderId: OrderId,
        bookingId: BookingId,
        amount: number,
        status: PaymentStatus
    ) {
        super(id);
        this._externalId = externalId;
        this._paymentMethod = paymentMethod;
        this._cardNumber = cardNumber;
        this._expiryDate = expiryDate;
        this._cvv = cvv;
        this._orderId = orderId;
        this._bookingId = bookingId;
        this._amount = amount;
        this._status = status;
    }

    static create(
        id: PaymentId,
        externalId: string,
        paymentMethod: string,
        cardNumber: string,
        expiryDate: string,
        cvv: string,
        orderId: OrderId,
        bookingId: BookingId,
        amount: number,
        status: PaymentStatus
    ): Payment {
        const payment = new Payment(id, externalId, paymentMethod, cardNumber, expiryDate, cvv, orderId, bookingId, amount, status)
        payment.validateState();
        return payment;
    }

    public override validateState(): void {
        Guard.check(this._externalId, 'ExternalId').againstNullOrUndefined();
        Guard.check(this._paymentMethod, 'PaymentMethod').againstNullOrUndefined();
        Guard.check(this._cardNumber, 'CardNumber').againstNullOrUndefined();
        Guard.check(this._expiryDate, 'ExpiryDate').againstNullOrUndefined();
        Guard.check(this._cvv, 'CVV').againstNullOrUndefined();
        Guard.check(this._orderId, 'OrderId').againstNullOrUndefined();
        Guard.check(this._bookingId, 'BookingId').againstNullOrUndefined();
        Guard.check(this._amount, 'Amount').againstNegative().againstZero();
        Guard.check(this._status, 'Status').againstNullOrUndefined();
    }

    get externalId(): string {
        return this._externalId;
    }
    get paymentMethod(): string {
        return this._paymentMethod;
    }
    get cardNumber(): string {
        return this._cardNumber;
    }
    get expiryDate(): string {
        return this._expiryDate;
    }
    get cvv(): string {
        return this._cvv;
    }
    get orderId(): OrderId {
        return this._orderId;
    }
    get bookingId(): BookingId {
        return this._bookingId;
    }
    get amount(): number {
        return this._amount;
    }
    get status(): PaymentStatus {
        return this._status;
    }

    public updateStatus(status: PaymentStatus): void {
        this._status = status;
        this.validateState();
    }
}