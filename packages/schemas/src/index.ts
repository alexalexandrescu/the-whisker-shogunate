/**
 * JSON Schemas for The Whisker Shogunate
 *
 * All entity type schemas exported for validation and type generation
 */

import materialSchema from './material.schema.json' with { type: 'json' };
import locationSchema from './location.schema.json' with { type: 'json' };
import characterSchema from './character.schema.json' with { type: 'json' };
import professionSchema from './profession.schema.json' with { type: 'json' };
import relationshipSchema from './relationship.schema.json' with { type: 'json' };

export const schemas = {
  material: materialSchema,
  location: locationSchema,
  character: characterSchema,
  profession: professionSchema,
  relationship: relationshipSchema,
} as const;

export {
  materialSchema,
  locationSchema,
  characterSchema,
  professionSchema,
  relationshipSchema,
};

export type EntityType = keyof typeof schemas;

// Type guards
export function isEntityType(type: string): type is EntityType {
  return type in schemas;
}

export function getSchema(type: EntityType) {
  return schemas[type];
}
