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
  const dataDir = join(ROOT_DIR, 'data');
  const entityFiles = await glob('**/*.json', { cwd: dataDir });

  for (const entityFile of entityFiles) {
    const entityPath = join(dataDir, entityFile);
    try {
      const entity = JSON.parse(readFileSync(entityPath, 'utf8'));
      if (entity.id) {
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
 * MCP Tool: Create new entity
 */
export async function createEntity(params: any) {
  const type = params.type;
  const dataTyped: any = params.data;
  const schema = schemasByType[type];
  if (!schema) {
    throw new Error(`Unknown entity type: ${type}`);
  }

  // Validate against schema
  const valid = ajv.validate(schema.$id, dataTyped);
  if (!valid) {
    throw new Error(`Validation failed: ${JSON.stringify(ajv.errors, null, 2)}`);
  }

  // Determine file path based on type and category
  let filePath;
  const d: any = dataTyped;
  if (type === 'material') {
    const category = d.category || 'other';
    filePath = join(ROOT_DIR, 'data', 'materials', `${category}s`, `${d.id.replace('material_', '').replace(/_/g, '-')}.json`);
  } else if (type === 'location') {
    const locationType = d.locationType || 'other';
    filePath = join(ROOT_DIR, 'data', 'locations', `${locationType}s`, `${d.id.replace('location_', '').replace(/_/g, '-')}.json`);
  } else if (type === 'character') {
    filePath = join(ROOT_DIR, 'data', 'characters', `${d.id.replace('character_', '').replace(/_/g, '-')}.json`);
  } else {
    filePath = join(ROOT_DIR, 'data', type + 's', `${d.id.replace(type + '_', '').replace(/_/g, '-')}.json`);
  }

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
  writeFileSync(filePath, JSON.stringify(dataTyped, null, 2));

  // Invalidate cache
  entitiesCache = null;

  return {
    success: true,
    entityId: d.id,
    filePath: filePath.replace(ROOT_DIR + '/', '')
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

// Export all MCP tools
export const mcpTools = {
  whisker_lore_search: searchEntities,
  whisker_get_entity: getEntity,
  whisker_dependency_tree: getDependencyTree,
  whisker_create_entity: createEntity,
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
