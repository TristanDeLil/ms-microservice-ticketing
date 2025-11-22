import { ConsumerContext } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/Amqp/mod.ts';

export interface AmqpMessageProcessor {
    process(consumerContext: ConsumerContext): Promise<void>;
}
