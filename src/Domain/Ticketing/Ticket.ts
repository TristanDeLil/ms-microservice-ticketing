import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { Guard } from '@domaincrafters/std';
import { Movie, Seat } from 'Howestprime.Ticketing/Domain/mod.ts';

export class TicketId extends UUIDEntityId {
    constructor(id?: string) {
        super(id);
    }
    static create(id?: string): TicketId {
        return new TicketId(id);
    }
}

export class Ticket extends Entity {
    private _Price: number;
    private _Movie: Movie;
    private _Seat: Seat;
    private _Date: Date;

    constructor(
        id: TicketId,
        price: number,
        movie: Movie,
        seat: Seat,
        date: Date,
    ) {
        super(id);
        this._Price = price;
        this._Movie = movie;
        this._Seat = seat;
        this._Date = date;
    }

    static create(
        id: TicketId,
        price: number,
        movie: Movie,
        seat: Seat,
        date: Date,
    ): Ticket {
        const order = new Ticket(id, price, movie, seat, date);
        order.validateState();
        return order;
    }

    public override validateState(): void {
        Guard.check(this._Price, 'Price').againstNegative().againstZero();
        Guard.check(this._Movie, 'Movie').againstNullOrUndefined();
        Guard.check(this._Seat, 'Seat').againstNullOrUndefined();
        Guard.check(this._Date, 'Date').againstNullOrUndefined();
    }

    public getPrice(): number {
        return this._Price;
    }
    public get Movie(): Movie {
        return this._Movie;
    }
    public get Seat(): Seat {
        return this._Seat;
    }
    public get Date(): Date {
        return this._Date;
    }
}