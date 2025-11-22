import type { Repository } from '@domaincrafters/domain';
import { Order } from 'Howestprime.Ticketing/Domain/mod.ts';

export interface OrderRepository extends Repository<Order>{}