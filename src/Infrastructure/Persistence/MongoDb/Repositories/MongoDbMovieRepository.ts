import { MovieRepository } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { Movie } from 'Howestprime.Ticketing/Domain/mod.ts';
import { MongoDbRepository,DocumentMapper,MongoDbClient } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

export class MongoDbMovieRepository extends MongoDbRepository<Movie> implements MovieRepository {
    constructor(
        client: MongoDbClient,
        documentMapper: DocumentMapper<Movie>,
    ) {
        super(client,"movies", documentMapper);
    }
}