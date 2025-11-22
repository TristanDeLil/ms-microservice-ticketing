import { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import { UseCase } from '@domaincrafters/application';
import {
    RequestValidator,
    WebApiController,
    WebApiRequest,
    WebApiResult,
} from  'Howestprime.Ticketing/Infrastructure/WebApi/Shared/mod.ts';
import { GetOrderByIdInput } from 'Howestprime.Ticketing/Application/Orders/GetOrderById.ts';
import { OrderData } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';

export class GetOrderByIdController implements WebApiController {
    private readonly _getOrderById: UseCase<GetOrderByIdInput,OrderData>;

    constructor(
        getOrderById: UseCase<GetOrderByIdInput, OrderData>,
    ) {
        this._getOrderById = getOrderById;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const request: WebApiRequest = await WebApiRequest.create(ctx, this.validateRequest);

        const orderId: GetOrderByIdInput = {
            orderId: request.parameter('orderId'),
        }

        const orderData: OrderData = await this._getOrderById.execute(orderId);
        WebApiResult.ok(ctx, orderData);
    }

    private async validateRequest(ctx: RouterContext<string>): Promise<void> {
        const orderId = ctx.params.orderId ;
        RequestValidator.create([
            () => Guard.check(orderId, 'OrderId is required').againstNullOrUndefined(),
        ]).validate();
    }
}

