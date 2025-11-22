import {
    ServiceCollection,
    ServiceDisposer,
    ServiceFactory,
    ServiceProvider,
} from '@domaincrafters/di';
import { MongoClient } from '@mongodb';
import { Config } from 'Howestprime.Ticketing/Infrastructure/Shared/mod.ts';
import {
    MongoDbClient,
    MongoDbUnitOfWork,
} from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

export class MongoDbServices {
    static add(
        config: Config,
        serviceCollection: ServiceCollection,
    ): void {
        this.addMongoDbClient(config, serviceCollection)
            .addUnitOfWork(serviceCollection);
    }

    static addMongoDbClient(
        config: Config,
        serviceCollection: ServiceCollection,
    ): typeof MongoDbServices {
        serviceCollection.addScoped(
            'mongoDbClient',
            this.buildMongoDbServiceFactory(config),
            this.buildMongoDbServiceDisposer(),
        );

        return this;
    }

    static addUnitOfWork(serviceCollection: ServiceCollection): typeof MongoDbServices {
        serviceCollection.addScoped(
            'mongoDbUnitOfWork',
            async (_serviceProvider: ServiceProvider) => {
                const mongoDbClient: MongoDbClient =
                    (await _serviceProvider.getService<MongoDbClient>('mongoDbClient')).value;

                return new MongoDbUnitOfWork(mongoDbClient.session);
            },
        );

        return this;
    }

    private static buildMongoDbServiceDisposer(): ServiceDisposer<MongoDbClient> {
        return async (mongoDbClient: MongoDbClient): Promise<void> => {
            console.log('Disposing MongoDbClient');
            await mongoDbClient.close();
        };
    }

    private static buildMongoDbServiceFactory(config: Config): ServiceFactory {
        return (
            _serviceProvider: ServiceProvider,
        ): Promise<MongoDbClient> => {
            const protocol: string = config.get('PERSISTENCE_MONGO_DB_PROTOCOL');
            const user: string = config.get('PERSISTENCE_MONGO_DB_USER');
            const pass: string = config.get('PERSISTENCE_MONGO_DB_PASS');
            const host: string = config.get('PERSISTENCE_MONGO_DB_HOST');
            const port: string = config.get('PERSISTENCE_MONGO_DB_PORT');
            const dbName: string = config.get('PERSISTENCE_MONGO_DB_NAME');
            const options: string = config.get('PERSISTENCE_MONGO_DB_OPTIONS');
            const directConnection: boolean =
                config.get('PERSISTENCE_MONGO_DB_DIRECT_CONNECTION') === 'true';

            const connectionString: string = MongoDbClient
                .createConnectionString(protocol, host, port, options, dbName, user, pass);

            const clientOptions = {
                directConnection,
                // replicaSet: "rs0",
            };

            const client: MongoClient = new MongoClient(connectionString, clientOptions);

            return Promise.resolve(new MongoDbClient(client));
        };
    }
}
