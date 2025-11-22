import { Document } from '@mongodb';
import { EntityId } from '@domaincrafters/domain';

export interface DocumentMapper<Entity> {
    reconstitute(document: Document): Entity;
    toDocument(entity: Entity): Document;
}

function isEntityId(value: unknown): value is EntityId {
    return (
        value !== null &&
        typeof value === 'object' &&
        typeof (value as EntityId).value === 'string' &&
        typeof (value as EntityId).toString === 'function'
    );
}

// deno-lint-ignore no-explicit-any
export function mapEntityToDocument(entity: any): any {
    if (Array.isArray(entity)) {
        return entity.map(mapEntityToDocument);
    }

    if (isEntityId(entity)) {
        return entity.toString();
    }

    if(entity instanceof Date) {
        return new Date(entity);
    }

    if (entity !== null && typeof entity === 'object') {
        const newObj: Record<string, unknown> = {};
        for (const key in entity) {
            if (Object.hasOwn(entity, key)) {
                const newKey = key.startsWith('_') ? key.substring(1) : key;
                newObj[newKey] = mapEntityToDocument((entity as Record<string, unknown>)[key]);
            }
        }

        return newObj;
    }

    return entity;
}
