import { UseCase } from '@domaincrafters/application';
import { Guard } from '@domaincrafters/std';
import { AmqpController } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { SaveOpenendBookingInput } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { Seat } from 'Howestprime.Ticketing/Domain/mod.ts';

export interface SeatRequest {
    room: string;
    number: number;
}

export interface SaveOpenendBookingRequest {
    id: string;
    movieId: string;
    room: string;
    startTime: Date;
    standardVisitors: number;
    discountVisitors: number;
    seats: SeatRequest[];
}

export class SaveOpenendBookingController implements AmqpController<SaveOpenendBookingRequest> {
    private readonly _saveOpenendBooking: UseCase<SaveOpenendBookingInput, string>;

    constructor(saveOpenendBooking: UseCase<SaveOpenendBookingInput, string>) {
        this._saveOpenendBooking = saveOpenendBooking;
    }

    async handle(request: SaveOpenendBookingRequest): Promise<void> {
        console.log("SaveOpenendBookingController.handle");
        console.log(request);
        console.log(request.id);
        await this._saveOpenendBooking.execute(this.buildSaveOpenendBookingInput(request));
    }
    
    private buildSaveOpenendBookingInput(request: SaveOpenendBookingRequest): SaveOpenendBookingInput {
        // Validate the request
        Guard.check(request.id).againstEmpty("id cannot be empty");
        Guard.check(request.movieId).againstEmpty("MovieId cannot be empty");
        Guard.check(request.room).againstEmpty("Room Name cannot be empty");
        Guard.check(request.startTime).againstNullOrUndefined("StartTime cannot be null");
        Guard.check(request.standardVisitors).againstNegative("StandardVisitors cannot be negative");
        Guard.check(request.discountVisitors).againstNegative("DiscountVisitors cannot be negative");
        Guard.check(request.seats).againstEmpty("Seats cannot be empty");

        const seats: Seat[] = request.seats.map(seat => {
            Guard.check(seat.room).againstEmpty("Room cannot be empty");
            Guard.check(seat.number).againstNegative("Seat Number cannot be negative");
            return Seat.create(seat.room, seat.number);
        });
        console.log("passed validation");

        const SaveOpenendBookingInput: SaveOpenendBookingInput = {
            BookingId: request.id,
            MovieId: request.movieId,
            Room: request.room,
            StartTime: request.startTime,
            StandardVisitors: request.standardVisitors,
            DiscountVisitors: request.discountVisitors,
            Seats: seats,
        };
        return SaveOpenendBookingInput;
    }
}