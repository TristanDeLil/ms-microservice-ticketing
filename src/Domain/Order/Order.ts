import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { Guard } from '@domaincrafters/std';
import { BookingId, Customer,Ticket } from 'Howestprime.Ticketing/Domain/mod.ts';

export class OrderId extends UUIDEntityId {
    constructor(id?: string) {
        super(id);
    }
    static create(id?: string): OrderId {
        return new OrderId(id);
    }
}

export enum OrderStatus {
    Open = 'Open',
    Closed = 'Closed',
}

export enum PaymentStatus {
    Pending = 'Pending',
    Success = 'Success',
    Failed = 'Failed',
}

export class Order extends Entity {
    private _bookingId: BookingId;
    private _customer: Customer
    private _items: Ticket[];
    private _price: number;
    private _status: OrderStatus;
    private _agreedToTerms: boolean;

    constructor(
        id: OrderId,
        bookingId: BookingId,
        customer: Customer,
        items: Ticket[],
        price: number,
        status: OrderStatus,
        agreedToTerms: boolean,
    ) {
        super(id);
        this._bookingId = bookingId;
        this._customer = customer;
        this._items = items;
        this._price = price;
        this._status = status;
        this._agreedToTerms = agreedToTerms;
    }

    static create(
        id: OrderId,
        bookingId: BookingId,
        customer: Customer,
        items: Ticket[],
        price: number,
        status: OrderStatus,
        agreeToTerms: boolean,
    ): Order {
        const order = new Order(id, bookingId, customer, items, price, status, agreeToTerms);
        order.validateState();
        return order;
    }

    public override validateState(): void {
        Guard.check(this._bookingId, 'BookingId').againstNullOrUndefined();
        Guard.check(this._customer, 'Customer').againstNullOrUndefined();
        Guard.check(this._items, 'Items').againstNullOrUndefined();
        Guard.check(this._price, 'Price').againstNegative().againstZero();
        Guard.check(this._status, 'Status').againstNullOrUndefined();
        Guard.check(this._agreedToTerms, 'agreeToTerms').againstNullOrUndefined();
    }
    
    public get BookingId(): BookingId {
        return this._bookingId;
    }
    public get Customer(): Customer {
        return this._customer;
    }
    public get Items(): Ticket[] {
        return this._items;
    }
    public get Price(): number {
        return this._price;
    }
    public get Status(): OrderStatus {
        return this._status;
    }
    public get PaymentStatus(): boolean {
        return this._agreedToTerms;
    }
    public updateStatus(status: OrderStatus): Order {
        this._status = status;
        return this;
    }
}