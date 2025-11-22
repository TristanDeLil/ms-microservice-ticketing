import { UseCase } from '@domaincrafters/application';
import { OrderRepository, PaymentRepository, UnitOfWork } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { OnlinePaymentService } from 'Howestprime.Ticketing/Infrastructure/Payment/mod.ts';
import { OrderId, OrderStatus, Payment, PaymentCreated, PaymentId, PaymentStatus } from 'Howestprime.Ticketing/Domain/mod.ts';
import { UUID } from '@domaincrafters/std';
import { DomainEventPublisher } from 'Howestprime.Ticketing/Domain/Shared/mod.ts';


export interface PayOrderInput {
    orderId: string;
    paymentMethod: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

export class PayOrder implements UseCase<PayOrderInput, string> {
    private readonly _paymentRepository: PaymentRepository;
    private readonly _unitOfWork: UnitOfWork;
    private readonly _orderRepository: OrderRepository;
    private readonly _paymentService: OnlinePaymentService;

    constructor(
        paymentRepository: PaymentRepository,
        unitOfWork: UnitOfWork,
        orderRepository: OrderRepository,
    ) {
        this._paymentRepository = paymentRepository;
        this._unitOfWork = unitOfWork;
        this._orderRepository = orderRepository;
        this._paymentService = new OnlinePaymentService();
    }

    async execute(input: PayOrderInput): Promise<string> {
        return await this._unitOfWork.do(async () => {
            // 1. Validate the Order ID.
            const orderId = OrderId.create(input.orderId);
            if (!orderId) throw new Error('Order ID is required');

            // 2. Retrieve the order details using the Order ID.
            const orderOpt = await this._orderRepository.byId(orderId);
            if (!orderOpt.isPresent) throw new Error('Order not found');
            const order = orderOpt.value;

            // 3. Validate the payment details and the total amount.
            if (!input.paymentMethod || !input.cardNumber || !input.expiryDate || !input.cvv) {
                throw new Error('Invalid payment details');
            }
            // 4. Process the payment using the provided details. Using the Gateway PaymentService.
            const paymentResult = await this._paymentService.pay(order.Price); 
            
            const payment = new Payment(
                PaymentId.create(),
                UUID.create().toString(), // Assuming the external ID is a UUID
                input.paymentMethod,
                input.cardNumber,
                input.expiryDate,
                input.cvv,
                order.id as OrderId,
                order.BookingId,
                order.Price,
                PaymentStatus.Failed,
            );
            // 5. Publish a PaymentSuccessful event if the payment is successful.
            if(paymentResult.success) {
                order.updateStatus(OrderStatus.Closed);
                console.log(order)
                await this._orderRepository.save(order);
            
                payment.updateStatus(PaymentStatus.Success);
                DomainEventPublisher.instance().publish(
                    PaymentCreated.create(
                        "PaymentSuccessful",
                        payment.id.toString(),
                        order.id.toString(),
                        order.Price,
                        payment.status,
                    )
                )
            }
               
            // 6. Publish a PaymentFailed event if the payment fails.
            if (!paymentResult.success) {
                DomainEventPublisher.instance().publish(
                    PaymentCreated.create(
                        "PaymentFailed",
                        payment.id.toString(),
                        order.id.toString(),
                        order.Price,
                        payment.status,
                    )
                )
            }
            //save the payment in db
            await this._paymentRepository.save(payment);
            // 7. Return the payment confirmation.
            return payment.orderId.toString();
        });
    }
}