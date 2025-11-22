import { RouterContext } from '@oak/oak';
import { WebApiController } from 'Howestprime.Ticketing/Infrastructure/WebApi/Shared/mod.ts';

export interface ControllerFactory {
    create(ctx: RouterContext<string>): Promise<WebApiController>;
}
