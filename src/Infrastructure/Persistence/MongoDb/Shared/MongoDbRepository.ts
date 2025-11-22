import { DeleteResult, Document, Filter } from '@mongodb';
import { IllegalStateException, Optional } from '@domaincrafters/std';
import type { Entity, EntityId, Repository } from '@domaincrafters/domain';
import {
    DocumentMapper,
    MongoDbClient,
} from 'Howestprime.Ticketing/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

export abstract class MongoDbRepository<E extends Entity> implements Repository<E> {
    protected readonly _dbClient: MongoDbClient;
    private readonly _collectionName: string;
    private readonly _documentMapper: DocumentMapper<E>;

    constructor(
        dbClient: MongoDbClient,
        collectionName: string,
        documentMapper: DocumentMapper<E>,
    ) {
        this._dbClient = dbClient;
        this._collectionName = collectionName;
        this._documentMapper = documentMapper;
    }

    async byId(id: EntityId): Promise<Optional<E>> {
        const document: Optional<Document> = await this._dbClient.findDocument(
            this.buildFilterByEntityId(id),
            this._collectionName,
        );

        if (!document.isPresent) {
            return Promise.resolve(Optional.empty<E>());
        }

        return Promise.resolve(document.map(this._documentMapper.reconstitute));
    }

    protected async allByPipeline(pipeline: Document[]): Promise<E[]> {
        const documents: Document[] = await this._dbClient.findDocumentsByPipeline(
            pipeline,
            this._collectionName,
        );

        return documents.map(this._documentMapper.reconstitute);
    }

    async save(entity: E): Promise<void> {
        const insertResult = await this._dbClient.upsertDocument(
            this.buildFilterByEntityId(entity.id),
            this._documentMapper.toDocument(entity),
            this._collectionName,
        );

        if (
            !insertResult.acknowledged ||
            (insertResult.matchedCount === 0 && insertResult.upsertedCount === 0)
        ) {
            throw new IllegalStateException(
                `Entity with id ${entity.id.value} was not upserted`,
            );
        }

        return Promise.resolve();
    }

    async remove(entity: E): Promise<void> {
        const deleteResult: DeleteResult = await this._dbClient.deleteDocument(
            this.buildFilterByEntityId(entity.id),
            this._collectionName,
        );

        if (!deleteResult.acknowledged || deleteResult.deletedCount === 0) {
            throw new IllegalStateException(`Entity with id ${entity.id.value} was not deleted`);
        }

        return Promise.resolve();
    }

    private buildFilterByEntityId(entityId: EntityId): Filter<Document> {
        return { _id: entityId.toString() } as unknown as Filter<Document>;
    }
}
