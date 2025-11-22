import { OrderByOrderIdQuery,OrderData } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { Collection } from '@mongodb';
import { MongoDbClient } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

export class MongoDbOrderByOrderId implements OrderByOrderIdQuery {
    private readonly _collection: Collection<OrderData>;

    constructor(mongoDbClient: MongoDbClient) {
        this._collection = mongoDbClient.collection<OrderData>('orders');
    }

    async fetch(orderId: string): Promise<OrderData> {
       const pipeline = [
            {
                $match: {
                    id: orderId
                },
            },
            {
                $project:{
                    _id: 0,
                    id: '$id',
                    bookingId: '$bookingId',
                    customer: '$customer',
                    items: '$items',
                    price: '$price',
                    status: '$status',
                    agreeToTerms: '$agreeToTerms'
                }
            }
       ]
       const result = await this._collection.aggregate<OrderData>(pipeline).toArray();
       if (!result[0]) {
           throw new Error(`Order with id ${orderId} not found.`);
       }
       return result[0];
    }
}