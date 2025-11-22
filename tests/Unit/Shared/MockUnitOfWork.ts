import { UnitOfWork } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';

export class MockUnitOfWork implements UnitOfWork {
    async do<Output>(_action: () => Promise<Output>): Promise<Output> {
        return await _action();
    }
}
