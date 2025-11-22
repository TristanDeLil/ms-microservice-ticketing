import { ClientSession, TransactionOptions } from '@mongodb';
import {
    IllegalArgumentException,
    IllegalStateException,
    NotFoundException,
} from '@domaincrafters/std';
import { UnitOfWork } from 'Howestprime.Ticketing/Application/Contracts/mod.ts';

export const defaultMongoDbTransactionOptions: TransactionOptions = {
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
};

export class MongoDbUnitOfWork implements UnitOfWork {
    private readonly _session: ClientSession;
    private readonly _transactionOptions: TransactionOptions;

    constructor(
        session: ClientSession,
        transactionOptions: TransactionOptions = defaultMongoDbTransactionOptions,
    ) {
        this._transactionOptions = transactionOptions;
        this._session = session;
    }

    async do<Output>(action: () => Promise<Output>): Promise<Output> {
        this._session.startTransaction(this._transactionOptions);

        try {
            const result = await action();
            await this._session.commitTransaction();
            return result;
        } catch (error) {
            console.log(error);
            if (this._session.inTransaction()) {
                await this._session.abortTransaction();
            }

            if (error instanceof NotFoundException) {
                throw error;
            }

            if (error instanceof IllegalArgumentException) {
                throw error;
            }

            throw new IllegalStateException(
                error instanceof Error ? error.message : 'Unknown error occurred',
            );
        }
    }
}
