#!/usr/bin/env node

/**
 * Validation script for Whisker Shogunate world-building data
 * - Validates all JSON entities against their schemas
 * - Checks relationship integrity
 * - Verifies asset references
 * - Detects circular dependencies
 * - Generates validation report
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { schemas } from '@whisker/schemas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../../..');

// Initialize AJV validator
const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

// Load all schemas from @whisker/schemas package
console.log('Loading schemas...');
for (const [type, schema] of Object.entries(schemas)) {
  ajv.addSchema(schema, schema.$id);
  console.log(`  ✓ Loaded ${schema.title} schema`);
}

// Create schema lookup by type name
const schemasByType: Record<string, any> = {};
for (const [type, schema] of Object.entries(schemas)) {
  schemasByType[type] = schema;
}

// Validation results
const results: {
  totalEntities: number;
  validEntities: number;
  invalidEntities: number;
  errors: any[];
  warnings: any[];
  relationshipIssues: any[];
  missingAssets: any[];
  circularDependencies: any[];
  orphanedEntities: any[];
} = {
  totalEntities: 0,
  validEntities: 0,
  invalidEntities: 0,
  errors: [],
  warnings: [],
  relationshipIssues: [],
  missingAssets: [],
  circularDependencies: [],
  orphanedEntities: []
};

/**
 * Validate all entities
 */
async function validateEntities() {
  console.log('\nValidating entities...');

  const dataDir = join(ROOT_DIR, 'data');
  const entityFiles = await glob('**/*.json', { cwd: dataDir });

  for (const entityFile of entityFiles) {
    results.totalEntities++;

    const entityPath = join(dataDir, entityFile);
    let entity;

    try {
      entity = JSON.parse(readFileSync(entityPath, 'utf8'));
    } catch (error) {
      results.invalidEntities++;
      results.errors.push({
        file: entityFile,
        error: 'Invalid JSON',
        details: error.message
      });
      continue;
    }

    // Determine entity type and validate against schema
    const entityType = entity.type;
    if (!entityType) {
      results.invalidEntities++;
      results.errors.push({
        file: entityFile,
        error: 'Missing type field'
      });
      continue;
    }

    const schema = schemasByType[entityType];
    if (!schema) {
      results.invalidEntities++;
      results.errors.push({
        file: entityFile,
        error: `Unknown entity type: ${entityType}`
      });
      continue;
    }

    const valid = ajv.validate(schema.$id, entity);

    if (!valid) {
      results.invalidEntities++;
      results.errors.push({
        file: entityFile,
        entity: entity.id,
        errors: ajv.errors
      });
    } else {
      results.validEntities++;
    }

    // Check for asset references
    if (entity.assets) {
      checkAssetReferences(entity, entityFile);
    }
  }

  console.log(`  ✓ Validated ${results.totalEntities} entities`);
  console.log(`    ${results.validEntities} valid, ${results.invalidEntities} invalid`);
}

/**
 * Check asset file references
 */
function checkAssetReferences(entity, entityFile) {
  const assetFields = ['primary', 'gallery', 'diagrams', 'conceptArt', 'maps',
                       'screenshots', 'textures', 'portrait', 'sprites'];

  for (const field of assetFields) {
    if (!entity.assets[field]) continue;

    const assets = Array.isArray(entity.assets[field])
      ? entity.assets[field]
      : [entity.assets[field]];

    for (const assetPath of assets) {
      const fullPath = join(ROOT_DIR, assetPath);

      if (!existsSync(fullPath)) {
        results.missingAssets.push({
          entity: entity.id,
          file: entityFile,
          asset: assetPath,
          field: field
        });
      }
    }
  }
}

/**
 * Validate relationship integrity
 */
async function validateRelationships() {
  console.log('\nValidating relationships...');

  const relationshipsDir = join(ROOT_DIR, 'relationships');
  if (!existsSync(relationshipsDir)) {
    console.log('  ⚠ Relationships directory not found, skipping...');
    return;
  }

  const graphPath = join(relationshipsDir, 'graph.json');
  if (!existsSync(graphPath)) {
    console.log('  ⚠ Relationship graph not found, skipping...');
    return;
  }

  const graph = JSON.parse(readFileSync(graphPath, 'utf8'));
  const relationships = graph.relationships || [];

  // Load all entity IDs
  const dataDir = join(ROOT_DIR, 'data');
  const entityFiles = await glob('**/*.json', { cwd: dataDir });
  const entityIds = new Set();

  for (const entityFile of entityFiles) {
    const entityPath = join(dataDir, entityFile);
    try {
      const entity = JSON.parse(readFileSync(entityPath, 'utf8'));
      if (entity.id) entityIds.add(entity.id);
    } catch (error) {
      // Already caught in validateEntities
    }
  }

  // Check each relationship
  for (const rel of relationships) {
    // Check that from/to entities exist
    if (!entityIds.has(rel.from)) {
      results.relationshipIssues.push({
        relationship: rel.id,
        issue: 'Source entity not found',
        entity: rel.from
      });
    }

    if (!entityIds.has(rel.to)) {
      results.relationshipIssues.push({
        relationship: rel.id,
        issue: 'Target entity not found',
        entity: rel.to
      });
    }

    // Check bidirectional consistency
    if (rel.bidirectional) {
      const reverseRel = relationships.find(r =>
        r.from === rel.to && r.to === rel.from && r.relationshipType === rel.relationshipType
      );

      if (!reverseRel) {
        results.warnings.push({
          relationship: rel.id,
          warning: 'Bidirectional relationship missing reverse link',
          from: rel.from,
          to: rel.to
        });
      }
    }
  }

  console.log(`  ✓ Checked ${relationships.length} relationships`);
  if (results.relationshipIssues.length > 0) {
    console.log(`    ✗ Found ${results.relationshipIssues.length} issues`);
  }
}

/**
 * Detect circular dependencies
 */
async function detectCircularDependencies() {
  console.log('\nChecking for circular dependencies...');

  const relationshipsDir = join(ROOT_DIR, 'relationships');
  if (!existsSync(relationshipsDir)) {
    console.log('  ⚠ Skipping (no relationship graph)');
    return;
  }

  const graphPath = join(relationshipsDir, 'graph.json');
  if (!existsSync(graphPath)) {
    console.log('  ⚠ Skipping (no relationship graph)');
    return;
  }

  const graph = JSON.parse(readFileSync(graphPath, 'utf8'));
  const relationships = graph.relationships || [];

  // Build adjacency list for dependency relationships
  const adjList: Record<string, string[]> = {};
  const dependencyTypes = ['requires', 'dependsOn', 'precedes'];

  for (const rel of relationships) {
    if (dependencyTypes.includes(rel.relationshipType)) {
      if (!adjList[rel.from]) adjList[rel.from] = [];
      adjList[rel.from].push(rel.to);
    }
  }

  // DFS to detect cycles
  const visited = new Set();
  const recStack = new Set();

  function hasCycle(node, path = []) {
    if (recStack.has(node)) {
      // Found a cycle
      const cycleStart = path.indexOf(node);
      const cycle = path.slice(cycleStart).concat(node);
      results.circularDependencies.push({
        cycle: cycle,
        description: cycle.join(' → ')
      });
      return true;
    }

    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);
    path.push(node);

    const neighbors = adjList[node] || [];
    for (const neighbor of neighbors) {
      hasCycle(neighbor, [...path]);
    }

    recStack.delete(node);
    return false;
  }

  // Check all nodes
  for (const node in adjList) {
    if (!visited.has(node)) {
      hasCycle(node);
    }
  }

  if (results.circularDependencies.length > 0) {
    console.log(`  ⚠ Found ${results.circularDependencies.length} circular dependencies`);
  } else {
    console.log(`  ✓ No circular dependencies found`);
  }
}

/**
 * Find orphaned entities (no incoming relationships)
 */
async function findOrphanedEntities() {
  console.log('\nChecking for orphaned entities...');

  const relationshipsDir = join(ROOT_DIR, 'relationships');
  if (!existsSync(relationshipsDir)) {
    console.log('  ⚠ Skipping (no relationship graph)');
    return;
  }

  const graphPath = join(relationshipsDir, 'graph.json');
  if (!existsSync(graphPath)) {
    console.log('  ⚠ Skipping (no relationship graph)');
    return;
  }

  // Load all entities
  const dataDir = join(ROOT_DIR, 'data');
  const entityFiles = await glob('**/*.json', { cwd: dataDir });
  const allEntities = new Set();

  for (const entityFile of entityFiles) {
    const entityPath = join(dataDir, entityFile);
    try {
      const entity = JSON.parse(readFileSync(entityPath, 'utf8'));
      if (entity.id) allEntities.add(entity.id);
    } catch (error) {
      // Skip
    }
  }

  // Load relationship graph
  const graph = JSON.parse(readFileSync(graphPath, 'utf8'));
  const relationships = graph.relationships || [];

  // Track entities with incoming links
  const linkedEntities = new Set();
  for (const rel of relationships) {
    linkedEntities.add(rel.to);
    if (rel.bidirectional) {
      linkedEntities.add(rel.from);
    }
  }

  // Find orphans (entities with no incoming links)
  for (const entityId of allEntities) {
    if (!linkedEntities.has(entityId)) {
      results.orphanedEntities.push(entityId);
    }
  }

  if (results.orphanedEntities.length > 0) {
    console.log(`  ⚠ Found ${results.orphanedEntities.length} orphaned entities`);
  } else {
    console.log(`  ✓ All entities are connected`);
  }
}

/**
 * Generate HTML report
 */
function generateReport() {
  console.log('\nGenerating validation report...');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalEntities: results.totalEntities,
      validEntities: results.validEntities,
      invalidEntities: results.invalidEntities,
      totalErrors: results.errors.length,
      totalWarnings: results.warnings.length,
      missingAssets: results.missingAssets.length,
      relationshipIssues: results.relationshipIssues.length,
      circularDependencies: results.circularDependencies.length,
      orphanedEntities: results.orphanedEntities.length
    },
    details: results
  };

  const reportPath = join(ROOT_DIR, 'generated/reports/validation-report.json');

  // Ensure directory exists
  const reportDir = dirname(reportPath);
  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true });
  }

  // Write report
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`  ✓ Report saved to ${reportPath}`);

  return report;
}

/**
 * Print summary
 */
function printSummary(report) {
  console.log('\n' + '='.repeat(50));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(50));

  console.log(`\nEntities: ${report.summary.validEntities}/${report.summary.totalEntities} valid`);

  if (report.summary.totalErrors > 0) {
    console.log(`\n✗ ${report.summary.totalErrors} ERRORS`);
    results.errors.slice(0, 5).forEach(err => {
      console.log(`  - ${err.file}: ${err.error || 'Schema validation failed'}`);
    });
    if (results.errors.length > 5) {
      console.log(`  ... and ${results.errors.length - 5} more`);
    }
  }

  if (report.summary.totalWarnings > 0) {
    console.log(`\n⚠ ${report.summary.totalWarnings} WARNINGS`);
  }

  if (report.summary.missingAssets > 0) {
    console.log(`\n⚠ ${report.summary.missingAssets} missing asset files`);
  }

  if (report.summary.relationshipIssues > 0) {
    console.log(`\n✗ ${report.summary.relationshipIssues} relationship issues`);
  }

  if (report.summary.circularDependencies > 0) {
    console.log(`\n⚠ ${report.summary.circularDependencies} circular dependencies`);
    results.circularDependencies.slice(0, 3).forEach(cycle => {
      console.log(`  - ${cycle.description}`);
    });
  }

  if (report.summary.orphanedEntities > 0) {
    console.log(`\n⚠ ${report.summary.orphanedEntities} orphaned entities (no incoming links)`);
  }

  console.log('\n' + '='.repeat(50));

  if (report.summary.totalErrors === 0 && report.summary.relationshipIssues === 0) {
    console.log('✓ VALIDATION PASSED');
  } else {
    console.log('✗ VALIDATION FAILED');
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('Whisker Shogunate World-Building Validator\n');

  await validateEntities();
  await validateRelationships();
  await detectCircularDependencies();
  await findOrphanedEntities();

  const report = generateReport();
  printSummary(report);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
