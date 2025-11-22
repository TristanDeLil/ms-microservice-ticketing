import { MongoDbRepository,DocumentMapper,MongoDbClient } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { BookingRepository } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { Booking } from 'Howestprime.Ticketing/Domain/mod.ts';

export class MongoDbBookingRepository extends MongoDbRepository<Booking> implements BookingRepository {
    constructor(
        client: MongoDbClient,
        documentMapper: DocumentMapper<Booking>,
    ) {
        super(client,"bookings", documentMapper);
    }
}