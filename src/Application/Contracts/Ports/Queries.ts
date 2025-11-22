import { OrderData } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';

export interface OrderByOrderIdQuery {
    fetch(orderId: string): Promise<OrderData>;
}