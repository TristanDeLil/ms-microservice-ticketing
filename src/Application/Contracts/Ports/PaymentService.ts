export interface PaymentResponse {
    success: boolean;
    paymentId: string;
}

export interface PaymentService {
    pay(amount: number): Promise<PaymentResponse>;
}
