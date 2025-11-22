import { Document } from '@mongodb';
import { DocumentMapper } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { mapEntityToDocument } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/DocumentMapper.ts';
import { Booking, BookingId, MovieId } from 'Howestprime.Ticketing/Domain/mod.ts';

export class BookingDocumentMapper implements DocumentMapper<Booking> {
    toDocument(entity: Booking): Document {
        return mapEntityToDocument(entity);
    }

    reconstitute(document: Document): Booking {
        const booking = Booking.create(
            BookingId.create(document.id),
            MovieId.create(document.movieId),
            document.room,
            document.startTime,
            document.standardVisitors,
            document.discountVisitors,
            document.seats,
        );
        booking.validateState();
        return booking;
    }
}