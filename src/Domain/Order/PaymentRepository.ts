import type { Repository } from '@domaincrafters/domain';
import { Payment } from 'Howestprime.Ticketing/Domain/mod.ts';

export interface PaymentRepository extends Repository<Payment> {}