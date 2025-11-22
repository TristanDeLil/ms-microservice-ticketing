import { MongoDbRepository, DocumentMapper, MongoDbClient } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { PaymentRepository } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { Payment } from 'Howestprime.Ticketing/Domain/mod.ts';

export class MongoDbPaymentRepository extends MongoDbRepository<Payment> implements PaymentRepository {
    constructor(
        client: MongoDbClient,
        documentMapper: DocumentMapper<Payment>,
    ) {
        super(client, "payments", documentMapper);
    }
}