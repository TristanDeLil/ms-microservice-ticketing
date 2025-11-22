import { Document } from '@mongodb';
import { DocumentMapper } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { mapEntityToDocument } from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/DocumentMapper.ts';
import { BookingId, OrderId, Payment, PaymentId, PaymentStatus } from 'Howestprime.Ticketing/Domain/mod.ts';

export class PaymentDocumentMapper implements DocumentMapper<Payment> {
    toDocument(payment: Payment): Document {
        return mapEntityToDocument(payment);
    }
    reconstitute(document: Document): Payment {
        //new Payment(id, externalId, paymentMethod, cardNumber, expiryDate, cvv, orderId, bookingId, amount, status)
        const payment = Payment.create(
            PaymentId.create(document.paymentId),
            document.externalId,
            document.paymentMethod,
            document.cardNumber,
            document.expiryDate,
            document.cvv,
            OrderId.create(document.orderId),
            BookingId.create(document.bookingId),
            document.amount,
            document.status as PaymentStatus
        );
        payment.validateState();
        return payment;
    }
}