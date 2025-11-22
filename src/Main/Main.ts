import {
    DIServiceCollection,
    DIServiceProvider,
    ServiceCollection,
    ServiceProvider,
} from '@domaincrafters/di';
import { Config } from 'Howestprime.Ticketing/Infrastructure/Shared/mod.ts';
import { MessagingModule } from 'Howestprime.Ticketing/Main/Modules/Messaging/MessagingModule.ts';
import { PersistenceModule } from 'Howestprime.Ticketing/Main/Modules/Persistence/PersistenceModule.ts';
import { WebApiModule } from 'Howestprime.Ticketing/Main/Modules/WebApi/WebApiModule.ts';

class Main {
    static async init() {
        const config: Config = Config.create();
        const serviceCollection: ServiceCollection = DIServiceCollection.create();
        const serviceProvider: ServiceProvider = DIServiceProvider.create(serviceCollection);

        PersistenceModule.add(serviceCollection, config);
        WebApiModule.add(serviceCollection, config);
        MessagingModule.add(serviceCollection, config);

        await WebApiModule.use(serviceProvider);
        await MessagingModule.use(serviceProvider);
    }
}

Main.init();
