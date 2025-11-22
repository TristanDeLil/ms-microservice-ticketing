import { ServiceCollection, ServiceProvider } from '@domaincrafters/di';
import {
    AmqpBroker,
    AmqpTopicPublisher,
} from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/Amqp/mod.ts';
import { Config } from 'Howestprime.Ticketing/Infrastructure/Shared/mod.ts';
import { DomainEventPublisher } from 'Howestprime.Ticketing/Domain/Shared/mod.ts';
import {
    AmqpBrokerConfigurator,
    AmqpServices,
} from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { AmqpControllerFactory } from 'Howestprime.Ticketing/Main/Modules/Messaging/AmqpControllerFactory.ts';

export class MessagingModule {
    static add(serviceCollection: ServiceCollection, config: Config): void {
        AmqpServices.add(serviceCollection, config);

        serviceCollection.addScoped<AmqpControllerFactory>(
            'amqpControllerFactory',
            (serviceProvider: ServiceProvider) => {
                return Promise.resolve(new AmqpControllerFactory(serviceProvider));
            },
        );
    }

    static async use(serviceProvider: ServiceProvider): Promise<void> {
        await this.addDomainEventPublishers(serviceProvider);

        const amqpBroker: AmqpBroker = await this.connectToAmqpBroker(serviceProvider);

        await this.registerTopicConsumersOnMessageBroker(serviceProvider, amqpBroker);
    }

    // Helper methods
    private static async addDomainEventPublishers(serviceProvider: ServiceProvider): Promise<void> {
        (await serviceProvider.getService<Array<AmqpTopicPublisher>>('amqpTopicPublishers'))
            .getOrThrow()
            .forEach((publisher) =>
                DomainEventPublisher.instance().addDomainEventSubscriber(publisher)
            );
    }

    private static async registerTopicConsumersOnMessageBroker(
        serviceProvider: ServiceProvider,
        amqpBroker: AmqpBroker,
    ): Promise<void> {
        const amqpBrokerConfigurator: AmqpBrokerConfigurator =
            (await serviceProvider.getService<AmqpBrokerConfigurator>('amqpBrokerConfigurator'))
                .getOrThrow();

        await amqpBrokerConfigurator.registerAmqpTopicConsumers(amqpBroker);
    }

    private static async connectToAmqpBroker(
        serviceProvider: ServiceProvider,
    ): Promise<AmqpBroker> {
        const amqpBroker: AmqpBroker = (await serviceProvider.getService<AmqpBroker>('amqpBroker'))
            .getOrThrow();

        await amqpBroker.connect();

        return amqpBroker;
    }
}
