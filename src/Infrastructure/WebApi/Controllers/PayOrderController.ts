import { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import { UseCase } from '@domaincrafters/application';
import {
    RequestValidator,
    WebApiController,
    WebApiRequest,
    WebApiResult,
} from  'Howestprime.Ticketing/Infrastructure/WebApi/Shared/mod.ts';
import { PayOrderInput } from 'Howestprime.Ticketing/Application/mod.ts';


export interface PayOrderBody {
    paymentMethod: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

export class PayOrderController implements WebApiController {
    private readonly _payOrder: UseCase<PayOrderInput, string>;

    constructor(
        payOrder: UseCase<PayOrderInput, string>,
    ) {
        this._payOrder = payOrder;
    }
    
    async handle(ctx: RouterContext<string>): Promise<void> {
        const request: WebApiRequest = await WebApiRequest.create(ctx,this.validateRequest);

        const body: PayOrderBody = (await request.body<PayOrderBody>() as PayOrderBody);

        const input: PayOrderInput = {
            orderId: request.parameter('orderId'),
            paymentMethod: body.paymentMethod,
            cardNumber: body.cardNumber,
            expiryDate: body.expiryDate,
            cvv: body.cvv,
        };

        const payment: string = await this._payOrder.execute(input);
        WebApiResult.created(ctx, `/orders/${payment}/payments`);
    }

    private async validateRequest(ctx: RouterContext<string>): Promise<void> {
        const body: PayOrderBody = await ctx.request.body.json() as PayOrderBody;

        RequestValidator.create([
            () => Guard.check(body.paymentMethod, 'PaymentMethod is required').againstNullOrUndefined(),
            () => Guard.check(body.cardNumber, 'CardNumber is required').againstNullOrUndefined(),
            () => Guard.check(body.expiryDate, 'ExpiryDate is required').againstNullOrUndefined(),
            () => Guard.check(body.cvv, 'CVV is required').againstNullOrUndefined(),
        ]);
    }
}