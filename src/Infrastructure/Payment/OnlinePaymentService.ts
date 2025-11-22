import {
    PaymentResponse,
    PaymentService,
} from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { UUID } from '@domaincrafters/std';

const CHANCE_OF_SUCCESS = 0.2;

export class OnlinePaymentService implements PaymentService {
    pay(amount: number): Promise<PaymentResponse> {
        const success = Math.random() > CHANCE_OF_SUCCESS;

        console.log(`Paying ${amount} online`);
        console.log('Payment successful?', success ? 'yes' : 'no');

        return Promise.resolve({
            success,
            paymentId: UUID.create().toString(),
        });
    }
}
