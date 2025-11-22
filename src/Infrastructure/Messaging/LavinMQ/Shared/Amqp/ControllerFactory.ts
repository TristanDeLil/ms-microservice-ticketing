import { ConsumerContext } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/Amqp/mod.ts';
import { AmqpController } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';

export interface ControllerFactory {
    create(consumerContext: ConsumerContext): Promise<AmqpController<unknown>>;
}
