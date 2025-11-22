import type { Repository } from '@domaincrafters/domain';
import { Booking } from 'Howestprime.Ticketing/Domain/mod.ts';

export interface BookingRepository extends Repository<Booking> {}