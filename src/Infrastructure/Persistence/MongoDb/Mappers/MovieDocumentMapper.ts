import { Movie,MovieId } from 'Howestprime.Ticketing/Domain/mod.ts';
import { Document } from '@mongodb';
import { DocumentMapper } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { mapEntityToDocument } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/DocumentMapper.ts';

export class MovieDocumentMapper implements DocumentMapper<Movie> {
    toDocument(movie: Movie): Document {
        return mapEntityToDocument(movie);
    }

    reconstitute(document: Document): Movie {
        
        const movie = Movie.create(
            MovieId.create(document.Id),
            document.title,
            document.duration,
            document.genres,
            document.posterUrl,
        );

        movie.validateState();

        return movie;
    }
}