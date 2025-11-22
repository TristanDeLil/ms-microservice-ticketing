import { IllegalStateException } from '@domaincrafters/std';
import {
    ControllerFactory,
    WebApiController,
} from 'Howestprime.Ticketing/Infrastructure/WebApi/Shared/mod.ts';

import { RouterContext } from '@oak/oak';

import { ServiceProvider } from '@domaincrafters/di';
import { BookingRepository, MovieRepository, OrderByOrderIdQuery, OrderRepository, PaymentRepository, UnitOfWork } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { CreateOrderController, GetOrderByIdController, PayOrderController } from 'Howestprime.Ticketing/Infrastructure/WebApi/mod.ts';
import { CreateOrder, PayOrder } from 'Howestprime.Ticketing/Application/mod.ts';
import { GetOrderById } from 'Howestprime.Ticketing/Application/Orders/GetOrderById.ts';

export class WebApiControllerFactory implements ControllerFactory {
    private readonly _serviceProvider: ServiceProvider;

    constructor(serviceProvider: ServiceProvider) {
        this._serviceProvider = serviceProvider;
    }

    create(ctx: RouterContext<string>): Promise<WebApiController> {
        if (!ctx.routeName) {
            throw new IllegalStateException('Route name is not defined');
        }

        switch (ctx.routeName) {
            case CreateOrderController.name:
                return this.buildCreateOrderController();
            case GetOrderByIdController.name:
                return this.buildGetOrderByIdController();
            case PayOrderController.name:
                return this.buildPayOrderController();
            default:
                throw new IllegalStateException(
                    `Controller for route ${ctx.routeName} is not defined`,
                );
        }
    }

    async buildPayOrderController(): Promise<PayOrderController> {
        const unitOfWork: UnitOfWork =
            (await this._serviceProvider.getService<UnitOfWork>('mongoDbUnitOfWork')).value;
        const orderRepository: OrderRepository =
            (await this._serviceProvider.getService<OrderRepository>('mongoDbOrderRepository')).value;
        const paymentRepository: PaymentRepository =
            (await this._serviceProvider.getService<PaymentRepository>('mongoDbPaymentRepository')).value;

        const payOrder: PayOrder = new PayOrder(paymentRepository, unitOfWork,orderRepository);
        return new PayOrderController(payOrder);
    }

    async buildGetOrderByIdController(): Promise<GetOrderByIdController> {
        const orderByOrderIdQueryService: OrderByOrderIdQuery =
            (await this._serviceProvider.getService<OrderByOrderIdQuery>('mongoDbOrderByOrderIdQuery')).value;

        const usecase: GetOrderById = new GetOrderById(orderByOrderIdQueryService);
        return new GetOrderByIdController(usecase);
    }

    async buildCreateOrderController(): Promise<CreateOrderController> {
        const unitOfWork: UnitOfWork =
            (await this._serviceProvider.getService<UnitOfWork>('mongoDbUnitOfWork')).value;
        const orderRepository: OrderRepository =
            (await this._serviceProvider.getService<OrderRepository>('mongoDbOrderRepository')).value;
        const movieRepository: MovieRepository =
            (await this._serviceProvider.getService<MovieRepository>('mongoDbMovieRepository')).value;
        const bookingRepository: BookingRepository =
            (await this._serviceProvider.getService<BookingRepository>('mongoDbBookingRepository')).value;

        const createOrder: CreateOrder = new CreateOrder(
            orderRepository,
            unitOfWork,
            bookingRepository,
            movieRepository,
        );

        return new CreateOrderController(createOrder);
    }

}
