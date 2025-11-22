import { ServiceCollection, ServiceProvider } from '@domaincrafters/di';
import { Config } from 'Howestprime.Ticketing/Infrastructure/Shared/mod.ts';
import {
    OakServices,
    OakWebServer,
} from 'Howestprime.Ticketing/Infrastructure/WebApi/Shared/mod.ts';
import {
    CorsRulesMiddleware,
    GlobalExceptionHandlerMiddleware,
    HealthCheckMiddleware,
} from 'Howestprime.Ticketing/Infrastructure/WebApi/Middleware/Middleware.ts';
import { WebApiControllerFactory } from 'Howestprime.Ticketing/Main/Modules/WebApi/WebApiControllerFactory.ts';

export class WebApiModule {
    static add(serviceCollection: ServiceCollection, config: Config): void {
        OakServices
            .add(serviceCollection, config)
            .addMiddleware(serviceCollection, [
                CorsRulesMiddleware.Add(),
                GlobalExceptionHandlerMiddleware.Add(),
                HealthCheckMiddleware.Add(),
            ]);

        // We've changed this form singleton to scoped, why? Ask teacher
        serviceCollection.addScoped(
            'webApiControllerFactory',
            (serviceProvider: ServiceProvider) => {
                return Promise.resolve(new WebApiControllerFactory(serviceProvider));
            },
        );
    }

    static async use(serviceProvider: ServiceProvider): Promise<void> {
        const webServer: OakWebServer =
            (await serviceProvider.getService<OakWebServer>('webserver'))
                .getOrThrow('Web server not found');

        webServer.run();
    }
}
