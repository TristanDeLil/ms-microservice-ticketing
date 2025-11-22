import { UseCase } from '@domaincrafters/application';
import { UnitOfWork, OrderRepository, BookingRepository, MovieRepository } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';
import { Customer,Order,OrderId,OrderStatus, BookingId, CreateTicketsFromBooking, Ticket} from 'Howestprime.Ticketing/Domain/mod.ts';

export interface CreateOrderInput {
    bookingId: string,
    customerDetails: {
        salutation: string,
        firstname: string,
        lastname: string,
        email: string,
    },
    agreedToTerms: boolean,
}

export class CreateOrder implements UseCase<CreateOrderInput, string> {
    private readonly _orderRepository: OrderRepository;
    private readonly _unitOfWork: UnitOfWork;
    private readonly _bookingRepository: BookingRepository;
    private readonly _movieRepository: MovieRepository;

    constructor(
        orderRepository: OrderRepository,
        unitOfWork: UnitOfWork,
        bookingRepository: BookingRepository,
        movieRepository: MovieRepository,
    ) {
        this._orderRepository = orderRepository;
        this._unitOfWork = unitOfWork;
        this._bookingRepository = bookingRepository;
        this._movieRepository = movieRepository;
    }
    
    async execute(input: CreateOrderInput): Promise<string> {
        console.log('CreateOrder input:', input);
        return await this._unitOfWork.do(async () => {
            // 2. Retrieve the associated booking details using the Booking ID
            const bookingId = BookingId.create(input.bookingId);
            const bookingOpt = await this._bookingRepository.byId(bookingId);
            if (!bookingOpt.isPresent) {
                throw new Error('Booking not found');
            }
            //console.log('Booking found:', bookingOpt.value);
            const booking = bookingOpt.value;
            const movieOpt = await this._movieRepository.byId(booking.movieId);
            const movie = movieOpt.value;

            // 3. Generate tickets based on seat assignments and visitor types
            const ticketFactory = CreateTicketsFromBooking.create();
            const tickets: Ticket[] = ticketFactory.execute(booking,movie);

            // 4. Calculate the total price for the tickets
            const totalPrice = tickets.reduce((sum, t) => {
                return sum + t.getPrice();
            }, 0);

            // 5. Create a new Order entity with the provided and generated data
            const customer = Customer.create(
                input.customerDetails.salutation,
                input.customerDetails.firstname,
                input.customerDetails.lastname,
                input.customerDetails.email,
            );

            //console.log('Customer created:', customer);
            const order = Order.create(
                OrderId.create(),
                bookingId,
                customer,
                tickets,
                totalPrice,
                OrderStatus.Open,
                input.agreedToTerms,
            );

            await this._orderRepository.save(order);
            return order.id.toString();
        });
    }
}
