import { IllegalArgumentException } from '@domaincrafters/std';
import { ServiceProvider } from '@domaincrafters/di';
import { ConsumerContext } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/Amqp/mod.ts';
import {
    AmqpMessageProcessor,
    ControllerFactory,
} from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';

export class MessageProcessorWithDI implements AmqpMessageProcessor {
    private readonly _serviceProvider: ServiceProvider;

    constructor(
        serviceProvider: ServiceProvider,
    ) {
        this._serviceProvider = serviceProvider;
    }

    async process(consumerContext: ConsumerContext): Promise<void> {
        const scopedProvider = this._serviceProvider.createScope();
        await this.invokeController(consumerContext, scopedProvider);
        scopedProvider.dispose();
    }

    private parseJsonMessage(messageBody: string | undefined | null): unknown {
        if (!messageBody) {
            throw new IllegalArgumentException('Message body is undefined or null');
        }

        try {
            return JSON.parse(messageBody);
        } catch (error) {
            console.error('Failed to parse JSON message:', error);
            throw new IllegalArgumentException('Failed to parse JSON message');
        }
    }

    private async invokeController(
        consumerContext: ConsumerContext,
        scopedProvider: ServiceProvider,
    ): Promise<void> {
        const jsonMessage = this.parseJsonMessage(consumerContext.message?.bodyToString());
        const constrollerFactory =
            (await scopedProvider.getService<ControllerFactory>('amqpControllerFactory'))
                .value;

        const controller = await constrollerFactory.create(consumerContext);
        await controller.handle(jsonMessage);
    }
}
