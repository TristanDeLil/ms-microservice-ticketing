import { IllegalStateException } from '@domaincrafters/std';
import { ServiceProvider } from '@domaincrafters/di';
import { ConsumerContext } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/Amqp/mod.ts';
import {
    AmqpController,
    ControllerFactory,
} from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { MovieRepository,UnitOfWork,BookingRepository } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { 
    SaveMovieRequest,SaveMovieController,
    SaveOpenendBookingRequest,SaveOpenendBookingController 
} from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/mod.ts';
import { SaveMovie,SaveOpenendBooking } from 'Howestprime.Ticketing/Application/mod.ts';

type CreateControllerFunction = (ctx: ConsumerContext) => Promise<AmqpController<unknown>>;

export class AmqpControllerFactory implements ControllerFactory {
    private readonly _serviceProvider: ServiceProvider;
    private readonly _controllerFactory: Map<string, CreateControllerFunction> = new Map([
        ["SaveMovieWhenMovieRegistered", (ctx) => this.createSaveMovieController(ctx)],
        ["SaveMovieWhenMovieDetailsChanged", (ctx) => this.createSaveMovieController(ctx)],
        ["SaveBookingWhenBookingOpened", (ctx) => this.createSaveOpenendBookingController(ctx)],
    ]);

    constructor(serviceProvider: ServiceProvider) {
        this._serviceProvider = serviceProvider;
    }

    async create(consumerContext: ConsumerContext): Promise<AmqpController<unknown>> {
        const operationId: string = consumerContext.operationId;

        const createFunction = this._controllerFactory.get(operationId);

        if (!createFunction) {
            throw new IllegalStateException(`OperationID ${operationId} not found`);
        }

        return await createFunction(consumerContext);
    }

    private async createSaveMovieController( _consumerContext: ConsumerContext): Promise<AmqpController<unknown>>{
        const movieRepository: MovieRepository = (await this._serviceProvider.getService<MovieRepository>('mongoDbMovieRepository')).value;
        const unitOfWork: UnitOfWork = (await this._serviceProvider.getService<UnitOfWork>('mongoDbUnitOfWork')).value;

        const saveMovie: SaveMovie = new SaveMovie(movieRepository, unitOfWork);
        return new SaveMovieController(saveMovie);
    }

    private async createSaveOpenendBookingController(_consumerContext: ConsumerContext): Promise<AmqpController<SaveOpenendBookingRequest>>{
        const bookingReposistory: BookingRepository = (await this._serviceProvider.getService<BookingRepository>('mongoDbBookingRepository')).value;
        const unitOfWork: UnitOfWork = (await this._serviceProvider.getService<UnitOfWork>('mongoDbUnitOfWork')).value;

        const saveOpenendBooking: SaveOpenendBooking = new SaveOpenendBooking(bookingReposistory, unitOfWork);
        return new SaveOpenendBookingController(saveOpenendBooking);
    }
}   
