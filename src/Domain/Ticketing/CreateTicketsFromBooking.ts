import { Booking, Movie, Ticket, TicketId } from 'Howestprime.Ticketing/Domain/mod.ts';

const PRICES = {
    standardVisitors: 12,
    discountedVisitors: 9,
};

export class CreateTicketsFromBooking {
    private constructor() {}

    public static create() {
        return new CreateTicketsFromBooking();
    }
    
    execute(booking: Booking,movie: Movie): Ticket[] {
        const tickets: Ticket[] = [];
        const seats = booking.seats;
        let seatIndex = 0;
        const date = booking.startTime;

        // Standard visitors
        for (let i = 0; i < booking.standardVisitors; i++) {
            if (seatIndex >= seats.length) break;
            tickets.push(Ticket.create(
                TicketId.create(), // Generate a new TicketId
                PRICES.standardVisitors,
                movie,
                seats[seatIndex++],
                date
            ));
        }
        // Discounted visitors
        for (let i = 0; i < booking.discountVisitors; i++) {
            if (seatIndex >= seats.length) break;
            tickets.push(Ticket.create(
                TicketId.create(), // Generate a new TicketId
                PRICES.discountedVisitors,
                movie,
                seats[seatIndex++],
                date
            ));
        }
        return tickets;
    }
    
}
