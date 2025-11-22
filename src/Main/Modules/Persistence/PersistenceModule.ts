import { ServiceCollection, ServiceProvider } from '@domaincrafters/di';
import { Config } from 'Howestprime.Ticketing/Infrastructure/Shared/mod.ts';
import {
    DocumentMapper,
    MongoDbClient,
    MongoDbServices,
} from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
//movie repo
import { Movie } from 'Howestprime.Ticketing/Domain/mod.ts';
import { MovieDocumentMapper,MongoDbMovieRepository } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/mod.ts';
//booking repo
import { Booking } from 'Howestprime.Ticketing/Domain/mod.ts';
import { BookingDocumentMapper,MongoDbBookingRepository } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/mod.ts';
//order repo
import { Order } from 'Howestprime.Ticketing/Domain/mod.ts';
import { OrderDocumentMapper,MongoDbOrderRepository } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/mod.ts';
import { MongoDbOrderByOrderId } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Queries/MongoDbOrderByOrderId.ts';
//payment repo
import { Payment } from 'Howestprime.Ticketing/Domain/mod.ts';
import { PaymentDocumentMapper, MongoDbPaymentRepository } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/mod.ts';


export class PersistenceModule {
    static add(serviceCollection: ServiceCollection, config: Config): void {
        MongoDbServices.add(config, serviceCollection);

        this.addRepositories(serviceCollection).addQueries(serviceCollection);

    }
    static addRepositories(serviceCollection: ServiceCollection): typeof PersistenceModule {
        //movie
        serviceCollection.addScoped('mongoDbMovieRepository', async (_serviceProvider: ServiceProvider) => {
            const movieMapper: DocumentMapper<Movie> = new MovieDocumentMapper();
            const MongoDbClient: MongoDbClient = (await _serviceProvider.getService<MongoDbClient>('mongoDbClient')).value;
            return new MongoDbMovieRepository(MongoDbClient, movieMapper);
        });
        //booking
        serviceCollection.addScoped('mongoDbBookingRepository', async (_serviceProvider: ServiceProvider) => {
            const bookingMapper: DocumentMapper<Booking> = new BookingDocumentMapper();
            const MongoDbClient: MongoDbClient = (await _serviceProvider.getService<MongoDbClient>('mongoDbClient')).value;
            return new MongoDbBookingRepository(MongoDbClient, bookingMapper);
        });
        //order
        serviceCollection.addScoped('mongoDbOrderRepository', async (_serviceProvider: ServiceProvider) => {
            const orderMapper: DocumentMapper<Order> = new OrderDocumentMapper();
            const MongoDbClient: MongoDbClient = (await _serviceProvider.getService<MongoDbClient>('mongoDbClient')).value;
            return new MongoDbOrderRepository(MongoDbClient, orderMapper);
        });
        //payment
        serviceCollection.addScoped('mongoDbPaymentRepository', async (_serviceProvider: ServiceProvider) => {
            const paymentMapper: DocumentMapper<Payment> = new PaymentDocumentMapper();
            const MongoDbClient: MongoDbClient = (await _serviceProvider.getService<MongoDbClient>('mongoDbClient')).value;
            return new MongoDbPaymentRepository(MongoDbClient, paymentMapper);
        });
        return this;
    }
    static addQueries(serviceCollection: ServiceCollection): typeof PersistenceModule {
        serviceCollection.addScoped('mongoDbOrderByOrderIdQuery', async (_serviceProvider: ServiceProvider) => {
            const mongoDbClient = (await _serviceProvider.getService<MongoDbClient>('mongoDbClient')).getOrThrow();
            return new MongoDbOrderByOrderId(mongoDbClient);
        });
        return this;
    }
}
