import { OrderRepository } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { Order } from 'Howestprime.Ticketing/Domain/mod.ts';
import { MongoDbRepository, DocumentMapper, MongoDbClient } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

export class MongoDbOrderRepository extends MongoDbRepository<Order> implements OrderRepository {
    constructor(
        client: MongoDbClient,
        documentMapper: DocumentMapper<Order>,
    ) {
        super(client, "orders", documentMapper);
    }
}