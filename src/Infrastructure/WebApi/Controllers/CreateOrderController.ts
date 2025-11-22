import { RouterContext } from '@oak/oak';
import { Guard } from '@domaincrafters/std';
import { UseCase } from '@domaincrafters/application';
import {
    RequestValidator,
    WebApiController,
    WebApiRequest,
    WebApiResult,
} from  'Howestprime.Ticketing/Infrastructure/WebApi/Shared/mod.ts';
import { CreateOrderInput } from 'Howestprime.Ticketing/Application/Orders/CreateOrder.ts';

export interface CreateOrderBody{
    bookingId: string;
    customer: {
        salutation: string;
        firstname: string;
        lastname: string;
        email: string;
    };
    agreedToTerms: boolean;
}

export class CreateOrderController implements WebApiController {
    private readonly _createOrder: UseCase<CreateOrderInput, string>;

    constructor(
        createOrder: UseCase<CreateOrderInput, string>,
    ) {
        this._createOrder = createOrder;
    }

    async handle(ctx: RouterContext<string>): Promise<void> {
        const request: WebApiRequest = await WebApiRequest.create(ctx,this.validateRequest);
        
        const body: CreateOrderBody = (await request.body<CreateOrderBody>() as CreateOrderBody);

        const input: CreateOrderInput = {
            bookingId: body.bookingId,
            customerDetails: {
                salutation: body.customer.salutation,
                firstname: body.customer.firstname,
                lastname: body.customer.lastname,
                email: body.customer.email,
            },
            agreedToTerms: body.agreedToTerms,
        };
        const orderId: string = await this._createOrder.execute(input);
        WebApiResult.created(ctx, `/Orders/${orderId}`);
    }

    private async validateRequest(ctx: RouterContext<string>): Promise<void> {
        const body: CreateOrderBody = await ctx.request.body.json() as CreateOrderBody;

        RequestValidator.create([
            () => Guard.check(body.bookingId, 'BookingId is required').againstNullOrUndefined(),
            () => Guard.check(body.customer, 'CustomerDetails is required').againstNullOrUndefined(),
            () => Guard.check(body.customer.salutation, 'Salutation is required').againstNullOrUndefined(),
            () => Guard.check(body.customer.firstname, 'FirstName is required').againstNullOrUndefined(),
            () => Guard.check(body.customer.lastname, 'LastName is required').againstNullOrUndefined(),
            () => Guard.check(body.customer.email, 'Email is required').againstNullOrUndefined(),
        ]).validate();
    }
}