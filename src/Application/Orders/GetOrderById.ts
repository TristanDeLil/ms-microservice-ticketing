import { UseCase } from '@domaincrafters/application';
import { OrderByOrderIdQuery,OrderData } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';

export interface GetOrderByIdInput {
    orderId: string;
}

export class GetOrderById implements UseCase<GetOrderByIdInput, OrderData> {
    private readonly _orderByOrderIdQuery: OrderByOrderIdQuery;

    constructor(orderByOrderIdQuery: OrderByOrderIdQuery) {
        this._orderByOrderIdQuery = orderByOrderIdQuery;
    }

    async execute(input: GetOrderByIdInput): Promise<OrderData> {
        console.log("GetOrderByIdInput", input);
        return await this._orderByOrderIdQuery.fetch(input.orderId);;
    }
}
