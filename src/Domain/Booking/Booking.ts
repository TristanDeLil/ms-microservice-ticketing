import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { Guard } from '@domaincrafters/std';
import { Seat } from 'Howestprime.Ticketing/Domain/mod.ts';
import { MovieId } from 'Howestprime.Ticketing/Domain/mod.ts';

export class BookingId extends UUIDEntityId {
    constructor(id?: string) {
        super(id);
    }
    static create(id?: string): BookingId {
        return new BookingId(id);
    }
}

export class Booking extends Entity {
    private _movieId: MovieId;
    private _room: string;
    private _startTime: Date;
    private _standardVisitors: number;
    private _discountVisitors: number;
    private _seats: Seat[];

    constructor(
        id: BookingId,
        movieId: MovieId,
        room: string,
        startTime: Date,
        standardVisitors: number,
        discountVisitors: number,
        seats: Seat[],
    ) {
        super(id);
        this._movieId = movieId;
        this._room = room;
        this._startTime = startTime;
        this._standardVisitors = standardVisitors;
        this._discountVisitors = discountVisitors;
        this._seats = seats;
    }

    static create(
        id: BookingId,
        movieId: MovieId,
        room: string,
        startTime: Date,
        standardVisitors: number,
        discountVisitors: number,
        seats: Seat[],
    ): Booking {
        const booking = new Booking(id, movieId, room, startTime, standardVisitors, discountVisitors, seats);
        booking.validateState();
        return booking;
    }

    public override validateState(): void {
        //Guard.check(this._movieId).againstEmpty("MovieId cannot be empty");
        Guard.check(this._room).againstEmpty("Room cannot be empty");
        Guard.check(this._startTime).againstEmpty("StartTime cannot be empty");
        Guard.check(this._standardVisitors).againstNegative("StandardVisitors cannot be negative");
        Guard.check(this._discountVisitors).againstNegative("DiscountVisitors cannot be negative");
        Guard.check(this._seats).againstEmpty("Seats cannot be empty");
    }

    get movieId(): MovieId {
        return this._movieId;
    }
    get room(): string {
        return this._room;
    }
    get startTime(): Date {
        return this._startTime;
    }
    get standardVisitors(): number {
        return this._standardVisitors;
    }
    get discountVisitors(): number {
        return this._discountVisitors;
    }
    get seats(): Seat[] {
        return this._seats;
    }
}