import { Document } from '@mongodb';
import { DocumentMapper } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { mapEntityToDocument } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/DocumentMapper.ts';
import { Order, OrderId, OrderStatus } from 'Howestprime.Ticketing/Domain/mod.ts';

export class OrderDocumentMapper implements DocumentMapper<Order> {
    toDocument(order: Order): Document {
        return mapEntityToDocument(order);
    }

    reconstitute(document: Document): Order {
        const order = Order.create(
            OrderId.create(document.orderId),
            document.bookingId,
            document.customer,
            document.items, // changed from document.tickets to document.items
            document.price, // changed from document.totalPrice to document.price
            document.status as OrderStatus,
            document.agreedToTerms as boolean,
        );
        order.validateState();
        return order;
    }
}