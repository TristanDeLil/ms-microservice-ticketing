import { UseCase } from '@domaincrafters/application';
import { UnitOfWork,BookingRepository } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { Booking,BookingId,MovieId } from 'Howestprime.Ticketing/Domain/mod.ts';
import { Seat } from 'Howestprime.Ticketing/Domain/Booking/Seat.ts';

export interface SaveOpenendBookingInput {
    BookingId: string,
    MovieId: string
    Room: string,
    StartTime: Date,
    StandardVisitors: number,
    DiscountVisitors: number,
    Seats: Seat[]
}

export class SaveOpenendBooking implements UseCase<SaveOpenendBookingInput,string>{
    private readonly _bookingRepository: BookingRepository;
    private readonly _unitOfWork: UnitOfWork;
    

    constructor(
        bookingRepository: BookingRepository,
        unitOfWork: UnitOfWork,
    ) {
        this._bookingRepository = bookingRepository;
        this._unitOfWork = unitOfWork;
    }

    async execute(input: SaveOpenendBookingInput): Promise<string> {
        return await this._unitOfWork.do(async () => {
            const bookingId = BookingId.create(input.BookingId);
            const movieId = MovieId.create(input.MovieId);
            console.log("SaveOpenendBooking.execute");
            console.log(bookingId);
            console.log(movieId);
            const booking = Booking.create(
                bookingId,
                movieId,
                input.Room,
                input.StartTime,
                input.StandardVisitors,
                input.DiscountVisitors,
                input.Seats
            );
            console.log("SaveOpenendBooking.execute");
            console.log(booking);
            await this._bookingRepository.save(booking);
            return booking.id.toString();
        })
    }
}
