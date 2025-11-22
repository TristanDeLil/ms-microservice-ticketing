import type { Repository } from '@domaincrafters/domain';
import { Movie } from 'Howestprime.Ticketing/Domain/mod.ts';

export interface MovieRepository extends Repository<Movie> {}