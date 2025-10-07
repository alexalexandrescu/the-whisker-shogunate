#!/usr/bin/env node

/**
 * MCP Server for The Whisker Shogunate Knowledge Base
 *
 * Provides tools for programmatic access to world-building data:
 * - Search entities by name, type, tags
 * - Retrieve complete entity data with relationships
 * - Get dependency trees
 * - Create and validate new entities
 * - Query assets and visual media
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { schemas } from '@whisker/schemas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../../..');

// Initialize validator
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load schemas from package
const schemasByType: Record<string, any> = {};
for (const [type, schema] of Object.entries(schemas)) {
  schemasByType[type] = schema;
  ajv.addSchema(schema, schema.$id);
}

/**
 * Load all entities into memory (cached)
 */
let entitiesCache = null;
let relationshipsCache = null;

async function loadAllEntities() {
  if (entitiesCache) return entitiesCache;

  const entities = new Map();
  const dataDir = join(ROOT_DIR, 'packages/data');
  const entityFiles = await glob('**/*.json', {
    cwd: dataDir,
    ignore: ['**/node_modules/**', '**/dist/**', '**/package.json', '**/tsconfig.json']
  });

  for (const entityFile of entityFiles) {
    const entityPath = join(dataDir, entityFile);
    try {
      const entity = JSON.parse(readFileSync(entityPath, 'utf8'));
      if (entity.id && entity.type) {
        entities.set(entity.id, { ...entity, _file: entityFile });
      }
    } catch (error) {
      console.error(`Error loading ${entityFile}:`, error.message);
    }
  }

  entitiesCache = entities;
  return entities;
}

async function loadRelationshipGraph() {
  if (relationshipsCache) return relationshipsCache;

  const graphPath = join(ROOT_DIR, 'relationships', 'graph.json');
  if (!existsSync(graphPath)) {
    relationshipsCache = { relationships: [] };
    return relationshipsCache;
  }

  relationshipsCache = JSON.parse(readFileSync(graphPath, 'utf8'));
  return relationshipsCache;
}

/**
 * MCP Tool: Search entities
 */
export async function searchEntities({ query, type, tags, limit = 50 }) {
  const entities = await loadAllEntities();
  let results: any[] = Array.from(entities.values());

  // Filter by type
  if (type) {
    results = results.filter(e => e.type === type);
  }

  // Filter by tags
  if (tags && tags.length > 0) {
    results = results.filter(e =>
      e.tags && tags.some(tag => e.tags.includes(tag))
    );
  }

  // Text search in name and description
  if (query) {
    const queryLower = query.toLowerCase();
    results = results.filter(e =>
      e.name?.toLowerCase().includes(queryLower) ||
      e.description?.toLowerCase().includes(queryLower) ||
      e.nameJapanese?.includes(query)
    );
  }

  // Sort by relevance (name match first, then description match)
  if (query) {
    const queryLower = query.toLowerCase();
    results.sort((a, b) => {
      const aNameMatch = a.name?.toLowerCase().includes(queryLower) ? 1 : 0;
      const bNameMatch = b.name?.toLowerCase().includes(queryLower) ? 1 : 0;
      return bNameMatch - aNameMatch;
    });
  }

  return results.slice(0, limit).map(e => ({
    id: e.id,
    type: e.type,
    name: e.name,
    nameJapanese: e.nameJapanese,
    description: e.description?.substring(0, 200) + '...',
    tags: e.tags,
    category: e.category,
    subcategory: e.subcategory
  }));
}

/**
 * MCP Tool: Get complete entity with relationships
 */
export async function getEntity({ entityId, includeRelationships = true, depth = 1 }) {
  const entities = await loadAllEntities();
  const entity = entities.get(entityId);

  if (!entity) {
    throw new Error(`Entity not found: ${entityId}`);
  }

  const result = { ...entity };

  if (includeRelationships && depth > 0) {
    const graph = await loadRelationshipGraph();
    const relationships = graph.relationships || [];

    // Find all relationships involving this entity
    result.relationships = {
      outgoing: relationships.filter(r => r.from === entityId),
      incoming: relationships.filter(r => r.to === entityId)
    };

    // If depth > 1, recursively fetch related entities
    if (depth > 1) {
      const relatedIds = new Set([
        ...result.relationships.outgoing.map(r => r.to),
        ...result.relationships.incoming.map(r => r.from)
      ]);

      result.relatedEntities = {};
      for (const relId of relatedIds) {
        const relEntity = await getEntity({
          entityId: relId,
          includeRelationships: true,
          depth: depth - 1
        });
        result.relatedEntities[relId] = relEntity;
      }
    }
  }

  return result;
}

/**
 * MCP Tool: Get dependency tree
 */
export async function getDependencyTree({ entityId, maxDepth = 5 }) {
  const entities = await loadAllEntities();
  const graph = await loadRelationshipGraph();
  const relationships = graph.relationships || [];

  const entity = entities.get(entityId);
  if (!entity) {
    throw new Error(`Entity not found: ${entityId}`);
  }

  const dependencyTypes = ['requires', 'dependsOn', 'precedes', 'uses'];

  function buildTree(currentId, depth = 0, visited = new Set()) {
    if (depth >= maxDepth || visited.has(currentId)) {
      return null;
    }

    visited.add(currentId);
    const currentEntity = entities.get(currentId);

    if (!currentEntity) return null;

    const dependencies = relationships
      .filter(r => r.from === currentId && dependencyTypes.includes(r.relationshipType))
      .map(r => ({
        relationshipType: r.relationshipType,
        target: r.to,
        targetName: entities.get(r.to)?.name,
        strength: r.strength,
        children: buildTree(r.to, depth + 1, new Set(visited))
      }))
      .filter(d => d.children !== null || d.target);

    return {
      id: currentId,
      name: currentEntity.name,
      type: currentEntity.type,
      dependencies: dependencies.length > 0 ? dependencies : undefined
    };
  }

  return buildTree(entityId);
}

/**
 * Helper: Get file path for entity
 */
function getEntityFilePath(entity: any): string {
  const type = entity.type;
  const ROOT_DATA_DIR = join(ROOT_DIR, 'packages/data');

  if (type === 'material') {
    const category = entity.category || 'other';
    return join(ROOT_DATA_DIR, 'materials', `${category}s`, `${entity.id.replace('material_', '').replace(/_/g, '-')}.json`);
  } else if (type === 'location') {
    return join(ROOT_DATA_DIR, 'locations', `${entity.id.replace('location_', '').replace(/_/g, '-')}.json`);
  } else if (type === 'character') {
    return join(ROOT_DATA_DIR, 'characters', `${entity.id.replace('character_', '').replace(/_/g, '-')}.json`);
  } else {
    return join(ROOT_DATA_DIR, `${type}s`, `${entity.id.replace(type + '_', '').replace(/_/g, '-')}.json`);
  }
}

/**
 * MCP Tool: Create new entity
 */
export async function createEntity(params: any) {
  const type = params.type;
  const dataTyped: any = params.data;
  const schema = schemasByType[type];
  if (!schema) {
    throw new Error(`Unknown entity type: ${type}`);
  }

  // Add metadata if not present
  if (!dataTyped.status) dataTyped.status = 'in-progress';
  if (!dataTyped.completionPercentage) dataTyped.completionPercentage = 0;
  if (!dataTyped.lastModified) dataTyped.lastModified = new Date().toISOString();
  if (!dataTyped.contributors) dataTyped.contributors = ['mcp-server'];

  // Validate against schema
  const valid = ajv.validate(schema.$id, dataTyped);
  if (!valid) {
    throw new Error(`Validation failed: ${JSON.stringify(ajv.errors, null, 2)}`);
  }

  // Get file path
  const filePath = getEntityFilePath(dataTyped);

  // Ensure directory exists
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Check if file already exists
  if (existsSync(filePath)) {
    throw new Error(`Entity already exists at: ${filePath}`);
  }

  // Write entity
  writeFileSync(filePath, JSON.stringify(dataTyped, null, 2) + '\n');

  // Invalidate cache
  entitiesCache = null;

  return {
    success: true,
    entityId: (dataTyped as any).id,
    filePath: filePath.replace(ROOT_DIR + '/', ''),
    entity: dataTyped
  };
}

/**
 * MCP Tool: Update existing entity
 */
export async function updateEntity(params: any) {
  const { entityId, updates, merge = true } = params;

  const entities = await loadAllEntities();
  const existingEntity = entities.get(entityId);

  if (!existingEntity) {
    throw new Error(`Entity not found: ${entityId}`);
  }

  // Merge or replace
  const updatedEntity = merge
    ? { ...existingEntity, ...updates, lastModified: new Date().toISOString() }
    : { ...updates, id: entityId, type: existingEntity.type, lastModified: new Date().toISOString() };

  // Remove internal fields
  delete updatedEntity._file;

  // Validate
  const schema = schemasByType[updatedEntity.type];
  if (!schema) {
    throw new Error(`Unknown entity type: ${updatedEntity.type}`);
  }

  const valid = ajv.validate(schema.$id, updatedEntity);
  if (!valid) {
    throw new Error(`Validation failed: ${JSON.stringify(ajv.errors, null, 2)}`);
  }

  // Write to file
  const filePath = getEntityFilePath(updatedEntity);
  writeFileSync(filePath, JSON.stringify(updatedEntity, null, 2) + '\n');

  // Invalidate cache
  entitiesCache = null;

  return {
    success: true,
    entityId: (updatedEntity as any).id,
    filePath: filePath.replace(ROOT_DIR + '/', ''),
    entity: updatedEntity
  };
}

/**
 * MCP Tool: Delete entity
 */
export async function deleteEntity(params: any) {
  const { entityId, force = false } = params;

  const entities = await loadAllEntities();
  const entity = entities.get(entityId);

  if (!entity) {
    throw new Error(`Entity not found: ${entityId}`);
  }

  // Check for relationships unless force = true
  if (!force) {
    const graph = await loadRelationshipGraph();
    const relationships = graph.relationships || [];
    const hasRelationships = relationships.some(r => r.from === entityId || r.to === entityId);

    if (hasRelationships) {
      throw new Error(`Entity has relationships. Use force=true to delete anyway, or remove relationships first.`);
    }
  }

  // Get file path and delete
  const filePath = getEntityFilePath(entity);
  if (existsSync(filePath)) {
    const fs = await import('fs');
    fs.unlinkSync(filePath);
  }

  // Invalidate cache
  entitiesCache = null;

  return {
    success: true,
    entityId,
    deletedFile: filePath.replace(ROOT_DIR + '/', '')
  };
}

/**
 * MCP Tool: Get all assets for an entity
 */
export async function getAssets({ entityId }) {
  const entity = await getEntity({ entityId, includeRelationships: false });

  if (!entity.assets) {
    return { entityId, assets: [] };
  }

  const assetList = [];

  // Collect all asset paths
  if (entity.assets.primary) {
    assetList.push({
      type: 'primary',
      path: entity.assets.primary,
      exists: existsSync(join(ROOT_DIR, entity.assets.primary))
    });
  }

  const arrayFields = ['gallery', 'diagrams', 'conceptArt', 'maps', 'screenshots', 'textures', 'sprites'];
  for (const field of arrayFields) {
    if (entity.assets[field] && Array.isArray(entity.assets[field])) {
      for (const assetPath of entity.assets[field]) {
        assetList.push({
          type: field,
          path: assetPath,
          exists: existsSync(join(ROOT_DIR, assetPath))
        });
      }
    }
  }

  if (entity.assets.portrait) {
    assetList.push({
      type: 'portrait',
      path: entity.assets.portrait,
      exists: existsSync(join(ROOT_DIR, entity.assets.portrait))
    });
  }

  return {
    entityId,
    entityName: entity.name,
    assets: assetList,
    totalAssets: assetList.length,
    existingAssets: assetList.filter(a => a.exists).length,
    missingAssets: assetList.filter(a => !a.exists).length
  };
}

/**
 * MCP Tool: Validate consistency
 */
export async function validateConsistency() {
  const entities = await loadAllEntities();
  const graph = await loadRelationshipGraph();
  const relationships = graph.relationships || [];

  const issues = [];

  // Check relationship integrity
  for (const rel of relationships) {
    if (!entities.has(rel.from)) {
      issues.push({
        type: 'missing_entity',
        severity: 'error',
        relationship: rel.id,
        message: `Source entity not found: ${rel.from}`
      });
    }

    if (!entities.has(rel.to)) {
      issues.push({
        type: 'missing_entity',
        severity: 'error',
        relationship: rel.id,
        message: `Target entity not found: ${rel.to}`
      });
    }
  }

  // Check for orphaned entities
  const linkedEntities = new Set();
  for (const rel of relationships) {
    linkedEntities.add(rel.to);
    if (rel.bidirectional) {
      linkedEntities.add(rel.from);
    }
  }

  for (const [entityId, entity] of entities) {
    if (!linkedEntities.has(entityId)) {
      issues.push({
        type: 'orphaned_entity',
        severity: 'warning',
        entityId,
        message: `Entity has no incoming relationships: ${entity.name}`
      });
    }
  }

  return {
    totalEntities: entities.size,
    totalRelationships: relationships.length,
    issues: issues,
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    status: issues.filter(i => i.severity === 'error').length === 0 ? 'PASS' : 'FAIL'
  };
}

/**
 * MCP Tool: Add relationship between entities
 */
export async function addRelationship(params: any) {
  const { sourceId, targetId, relationshipField, bidirectional = false } = params;

  const entities = await loadAllEntities();
  const sourceEntity = entities.get(sourceId);
  const targetEntity = entities.get(targetId);

  if (!sourceEntity) throw new Error(`Source entity not found: ${sourceId}`);
  if (!targetEntity) throw new Error(`Target entity not found: ${targetId}`);

  // Add relationship to source entity
  if (!sourceEntity[relationshipField]) {
    sourceEntity[relationshipField] = [];
  }

  if (Array.isArray(sourceEntity[relationshipField])) {
    if (!sourceEntity[relationshipField].includes(targetId)) {
      sourceEntity[relationshipField].push(targetId);
    }
  } else {
    sourceEntity[relationshipField] = targetId;
  }

  // Update source entity
  await updateEntity({ entityId: sourceId, updates: sourceEntity, merge: false });

  const result: any = {
    success: true,
    sourceId,
    targetId,
    relationshipField,
    bidirectional
  };

  // If bidirectional, add reverse relationship
  if (bidirectional && relationshipField) {
    // Try to determine reverse field name
    const reverseField = relationshipField.replace('related', 'referencedBy');
    if (!targetEntity[reverseField]) {
      targetEntity[reverseField] = [];
    }
    if (Array.isArray(targetEntity[reverseField])) {
      if (!targetEntity[reverseField].includes(sourceId)) {
        targetEntity[reverseField].push(sourceId);
      }
    }
    await updateEntity({ entityId: targetId, updates: targetEntity, merge: false });
    result.reverseField = reverseField;
  }

  return result;
}

/**
 * MCP Tool: Remove relationship between entities
 */
export async function removeRelationship(params: any) {
  const { sourceId, targetId, relationshipField, bidirectional = false } = params;

  const entities = await loadAllEntities();
  const sourceEntity = entities.get(sourceId);

  if (!sourceEntity) throw new Error(`Source entity not found: ${sourceId}`);

  // Remove from source
  if (sourceEntity[relationshipField]) {
    if (Array.isArray(sourceEntity[relationshipField])) {
      sourceEntity[relationshipField] = sourceEntity[relationshipField].filter((id: string) => id !== targetId);
    } else if (sourceEntity[relationshipField] === targetId) {
      delete sourceEntity[relationshipField];
    }
  }

  await updateEntity({ entityId: sourceId, updates: sourceEntity, merge: false });

  const result: any = {
    success: true,
    sourceId,
    targetId,
    relationshipField
  };

  // If bidirectional, remove reverse relationship
  if (bidirectional) {
    const targetEntity = entities.get(targetId);
    if (targetEntity) {
      const reverseField = relationshipField.replace('related', 'referencedBy');
      if (targetEntity[reverseField] && Array.isArray(targetEntity[reverseField])) {
        targetEntity[reverseField] = targetEntity[reverseField].filter((id: string) => id !== sourceId);
        await updateEntity({ entityId: targetId, updates: targetEntity, merge: false });
        result.reverseField = reverseField;
      }
    }
  }

  return result;
}

/**
 * MCP Tool: List all entity types and counts
 */
export async function listEntityTypes() {
  const entities = await loadAllEntities();
  const typeCounts: Record<string, number> = {};
  const typeExamples: Record<string, any[]> = {};

  for (const entity of entities.values()) {
    const type = entity.type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;

    if (!typeExamples[type]) {
      typeExamples[type] = [];
    }
    if (typeExamples[type].length < 3) {
      typeExamples[type].push({
        id: entity.id,
        name: entity.name
      });
    }
  }

  return {
    totalEntities: entities.size,
    types: Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      examples: typeExamples[type]
    })).sort((a, b) => b.count - a.count)
  };
}

/**
 * MCP Tool: Bulk update entities
 */
export async function bulkUpdateEntities(params: any) {
  const { entityIds, updates } = params;

  if (!Array.isArray(entityIds)) {
    throw new Error('entityIds must be an array');
  }

  const results = [];
  for (const entityId of entityIds) {
    try {
      const result = await updateEntity({ entityId, updates, merge: true });
      results.push({ entityId, success: true });
    } catch (error) {
      results.push({ entityId, success: false, error: error.message });
    }
  }

  return {
    totalProcessed: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

// Export all MCP tools
export const mcpTools = {
  whisker_lore_search: searchEntities,
  whisker_get_entity: getEntity,
  whisker_dependency_tree: getDependencyTree,
  whisker_create_entity: createEntity,
  whisker_update_entity: updateEntity,
  whisker_delete_entity: deleteEntity,
  whisker_add_relationship: addRelationship,
  whisker_remove_relationship: removeRelationship,
  whisker_list_types: listEntityTypes,
  whisker_bulk_update: bulkUpdateEntities,
  whisker_get_assets: getAssets,
  whisker_validate: validateConsistency
};

// CLI interface for testing
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const args = JSON.parse(process.argv[3] || '{}');

  if (!mcpTools[command]) {
    console.error(`Unknown command: ${command}`);
    console.error('Available commands:', Object.keys(mcpTools).join(', '));
    process.exit(1);
  }

  mcpTools[command](args)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}
