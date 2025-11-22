import { SaveMovieInput } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { UseCase } from '@domaincrafters/application';
import { Guard } from '@domaincrafters/std';
import { AmqpController } from 'Howestprime.Ticketing/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';

export interface SaveMovieRequest{
    id: string,
    title: string,
    duration: number,
    genres: string[],
    posterUrl : string,
}

export class SaveMovieController implements AmqpController<SaveMovieRequest> {
    private readonly _saveMovie: UseCase<SaveMovieInput, string>;

    constructor(saveMovie: UseCase<SaveMovieInput, string>) {
        this._saveMovie = saveMovie;
    }

    async handle(request: SaveMovieRequest): Promise<void> {
        console.log("SaveMovieController.handle");
        //console.log(request);
        await this._saveMovie.execute(this.buildSaveMovieInput(request));
    }

    private buildSaveMovieInput(request: SaveMovieRequest): SaveMovieInput {
        console.log("SaveMovieController.buildSaveMovieInput");
        console.log(request);
        // Validate the request
        Guard.check(request.id).againstEmpty("id cannot be empty");
        Guard.check(request.title).againstEmpty("Title cannot be empty");
        Guard.check(request.duration).againstNegative("Duration cannot be negative").againstZero("Duration cannot be zero");
        Guard.check(request.genres).againstEmpty("Genres cannot be empty");
        Guard.check(request.posterUrl).againstEmpty("PosterImage cannot be empty");
        
        const SaveMovieInput: SaveMovieInput = {
            movieId: request.id,
            title: request.title,
            duration: request.duration,
            genres: request.genres,
            posterUrl: request.posterUrl,
        };
        return SaveMovieInput;
    }
}