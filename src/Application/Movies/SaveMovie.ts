import { UseCase } from '@domaincrafters/application';
import { UnitOfWork,MovieRepository } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { Movie,MovieId } from 'Howestprime.Ticketing/Domain/Movie/Movie.ts';

export interface SaveMovieInput {
    movieId: string,
    title: string,
    duration: number,
    genres: string[],
    posterUrl : string,
}

export class SaveMovie implements UseCase<SaveMovieInput,string>{
    private readonly _movieRepository: MovieRepository;
    private readonly _unitOfWork: UnitOfWork;

    constructor(
        movieRepository: MovieRepository,
        unitOfWork: UnitOfWork,
    ) {
        this._movieRepository = movieRepository;
        this._unitOfWork = unitOfWork;
    }

    async execute(input: SaveMovieInput): Promise<string> {
        return await this._unitOfWork.do(async () =>{
            const movieId = MovieId.create(input.movieId);
            const movie = Movie.create(
                movieId,
                input.title,
                input.duration,
                input.genres,
                input.posterUrl,
            );
            console.log("SaveMovie.execute");
            console.log(movie);
            await this._movieRepository.save(movie);
            return movie.id.toString();
        })
    }
}