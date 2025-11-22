import {
    ClientSession,
    Collection,
    DeleteResult,
    Document,
    Filter,
    InsertOneResult,
    MongoClient,
    OptionalUnlessRequiredId,
    UpdateResult,
    WithId,
} from '@mongodb';
import { Guard, IllegalStateException, Optional } from '@domaincrafters/std';

export class MongoDbClient {
    private readonly _client: MongoClient;
    private readonly _session: ClientSession;

    static createConnectionString(
        protocol: string,
        host: string,
        port: string,
        options: string,
        dbName: string,
        user: string,
        password: string,
    ): string {
        Guard.check(protocol, 'persistence_mongodb_protocol').againstEmpty();
        Guard.check(host, 'persistence_mongodb_host').againstEmpty();
        Guard.check(parseInt(port), 'persistence_mongodb_port').againstNegative();
        Guard.check(dbName, 'persistence_mongodb_db_name').againstEmpty();
        Guard.check(dbName, 'persistence_mongodb_db_name').againstWhitespace();

        const credentials: string = user && password ? `${user}:${password}@` : '';
        return `${protocol}://${credentials}${host}:${port}/${dbName}?${options}`;
    }

    constructor(client: MongoClient) {
        this._client = client;
        this._session = this._client.startSession();
    }

    collection<T extends Document>(collectionName: string): Collection<T> {
        return this._client.db().collection(collectionName) as Collection<T>;
    }

    async findDocument(
        filter: Filter<Document>,
        collectionName: string,
    ): Promise<Optional<Document>> {
        const collection: Collection<Document> = this.collection(collectionName);
        const document: WithId<Document> | null = await collection
            .findOne(filter, { session: this._session });

        if (document === null) {
            return Optional.empty<Document>();
        }

        return Optional.of<Document>(document as Document);
    }

    upsertDocument(
        filter: Filter<Document>,
        document: Document,
        collectionName: string,
    ): Promise<UpdateResult<Document>> {
        return this.collection(collectionName).updateOne(filter, { $set: document }, {
            upsert: true,
            session: this._session,
        });
    }

    insertDocument(
        document: Document,
        collectionName: string,
    ): Promise<InsertOneResult> {
        return this.collection(collectionName).insertOne(
            document as OptionalUnlessRequiredId<Document>,
            {
                forceServerObjectId: true,
                session: this._session,
            },
        );
    }

    deleteDocument(
        filter: Filter<Document>,
        collectionName: string,
    ): Promise<DeleteResult> {
        const collection: Collection<Document> = this.collection<Document>(collectionName);
        return collection.deleteOne(filter, { session: this._session });
    }

    get session(): ClientSession {
        return this._session;
    }

    async connect(): Promise<void> {
        try {
            await this._client.connect();
            console.log('MongoDB connection established');
        } catch (error: unknown) {
            throw this.convertErrorToIllegalStateException(error, 'Failed to connect to MongoDB');
        }
    }

    async close(): Promise<void> {
        try {
            await this._session.endSession();
            console.log('MongoDB session closed');
            await this._client.close();
            console.log('MongoDB connection closed');
        } catch (error: unknown) {
            throw this.convertErrorToIllegalStateException(
                error,
                'Failed to close MongoDB connection',
            );
        }
    }

    endSession(): void {
        Guard.check(this._session, 'session').againstNullOrUndefined();
        this._session.endSession();
    }

    private convertErrorToIllegalStateException(
        error: unknown,
        msg: string,
    ): IllegalStateException {
        const errorMessage: string = String(error);
        const message: string = `${msg}: ${errorMessage}`;
        return new IllegalStateException(message);
    }

    findDocumentsByPipeline(
        pipeline: Document[],
        _collectionName: string,
    ): Promise<Document[]> {
        return this.collection(_collectionName).aggregate(pipeline, { session: this._session })
            .toArray();
    }
}
