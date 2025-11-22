import { RouterBuilder } from 'Howestprime.Ticketing/Infrastructure/WebApi/Shared/mod.ts';
import { CreateOrderController, GetOrderByIdController, PayOrderController } from 'Howestprime.Ticketing/Infrastructure/WebApi/mod.ts';
import { Router } from '@oak/oak';

export class Routes {
    static map(routerBuilder: RouterBuilder): Router {
        return routerBuilder
            .mapPost(
                CreateOrderController.name,
                '/api/orders',
            )
            .mapGet(
                GetOrderByIdController.name,
                '/api/orders/:orderId',
            )
            .mapPost(
                PayOrderController.name,
                '/api/orders/:orderId/payments',
            )
            .build();
    }
}
