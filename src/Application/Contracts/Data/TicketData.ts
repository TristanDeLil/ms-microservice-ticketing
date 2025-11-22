import { Movie, Seat } from 'Howestprime.Ticketing/Domain/mod.ts';

export interface TicketData {
    Id: string;
    Price: number;
    Movie: Movie;
    Seat: Seat;
    Date: Date;
}