import { ServiceProvider } from '@domaincrafters/di';
import { Next, RouterContext } from '@oak/oak';
import {
    ControllerFactory,
    RouteHandler,
    WebApiResult,
} from 'Howestprime.Ticketing/Infrastructure/WebApi/Shared/mod.ts';

export class RouteHandlerWithDI implements RouteHandler {
    private readonly _serviceProvider: ServiceProvider;

    constructor(serviceProvider: ServiceProvider) {
        this._serviceProvider = serviceProvider;
    }

    public async handle(ctx: RouterContext<string>, next: Next): Promise<void> {
        const scopedProvider = this._serviceProvider.createScope();
        await this.invokeController(ctx, scopedProvider);
        await next();
        scopedProvider.dispose();
    }

    private async invokeController(
        ctx: RouterContext<string>,
        scopedProvider: ServiceProvider,
    ): Promise<void> {
        WebApiResult.noContent(ctx);
        const controllerFactory =
            (await scopedProvider.getService<ControllerFactory>('webApiControllerFactory')).value;
        await (await controllerFactory.create(ctx)).handle(ctx);
    }
}
