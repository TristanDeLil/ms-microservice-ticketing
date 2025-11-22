export class Seat {
    private _room: string;
    private _number: number;

    constructor(
        room: string,
        number: number,
    ) {
        this._room = room;
        this._number = number;
    }

    static create(
        room: string,
        number: number,
    ): Seat {
        const seat = new Seat(room, number);
        return seat;
    }

    get room(): string {
        return this._room;
    }

    get number(): number {
        return this._number;
    }
}