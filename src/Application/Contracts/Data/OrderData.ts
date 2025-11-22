import { Customer } from 'Howestprime.Ticketing/Domain/mod.ts';
import { TicketData } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';

export interface OrderData {
    Id: string;
    BookingId: string;
    Customer: Customer;
    Items: TicketData[];
    Price: number;
    Status: string;
    PaymentStatus: string;
}