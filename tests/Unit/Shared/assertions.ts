import { v4 } from '@std/uuid';
import { assert } from '@std/assert';
import type { EntityId } from '@domaincrafters/domain';

export function assertIdIsValid(id: EntityId): void {
    if (!v4.validate(id.value.toString())) {
        assert(false, 'Invalid ID.');
    }
}
