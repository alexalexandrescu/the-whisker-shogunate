#!/usr/bin/env node

/**
 * Consistency Checker for Whisker Shogunate Knowledge Base
 *
 * Detects logical contradictions and inconsistencies:
 * - Property conflicts (same entity described differently)
 * - Relationship conflicts (mismatched bidirectional links)
 * - Definition conflicts (same term defined multiple ways)
 * - Cross-reference validation (JSON vs. original markdown)
 * - Orphaned references (links to non-existent entities)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const issues = {
  propertyConflicts: [],
  relationshipConflicts: [],
  definitionConflicts: [],
  crossReferenceConflicts: [],
  orphanedReferences: [],
  missingBidirectional: [],
  severityCount: { critical: 0, high: 0, medium: 0, low: 0 }
};

/**
 * Load all entities into memory
 */
async function loadAllEntities() {
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

  return entities;
}

/**
 * Load relationship graph
 */
function loadRelationships() {
  const graphPath = join(ROOT_DIR, 'relationships', 'graph.json');
  if (!existsSync(graphPath)) {
    return { relationships: [] };
  }

  try {
    return JSON.parse(readFileSync(graphPath, 'utf8'));
  } catch (error) {
    console.error('Error loading relationship graph:', error.message);
    return { relationships: [] };
  }
}

/**
 * Check for property conflicts
 * Example: Entity A says hinoki is "premium" but Entity B says it's "cheap"
 */
function checkPropertyConflicts(entities) {
  console.log('\nChecking for property conflicts...');

  const propertyValues = new Map(); // entityId -> property -> values seen

  for (const [entityId, entity] of entities) {
    if (!entity.properties) continue;

    for (const [propName, propValue] of Object.entries(entity.properties)) {
      const key = `${entityId}:${propName}`;

      if (!propertyValues.has(key)) {
        propertyValues.set(key, []);
      }

      const values = propertyValues.get(key);
      const valueStr = JSON.stringify(propValue);

      if (!values.includes(valueStr)) {
        values.push(valueStr);
      }
    }
  }

  // Check for conflicts in cross-references
  for (const [entityId, entity] of entities) {
    // Check if this entity is referenced by others
    for (const [otherEntityId, otherEntity] of entities) {
      if (entityId === otherEntityId) continue;

      // Check if descriptions conflict
      if (otherEntity.usedIn && otherEntity.usedIn.includes(entityId)) {
        // Other entity claims to use this entity - verify consistency
        const thisEntity = entity;

        // Check property consistency
        if (thisEntity.properties && otherEntity.properties) {
          // Example: If material says it's "premium" but location using it says it's "cheap"
          const conflicts = findPropertyMismatches(thisEntity, otherEntity, entityId, otherEntityId);
          issues.propertyConflicts.push(...conflicts);
        }
      }
    }
  }

  console.log(`  Found ${issues.propertyConflicts.length} property conflicts`);
}

function findPropertyMismatches(entity1, entity2, id1, id2) {
  const conflicts = [];

  // This is where we'd implement specific property comparison logic
  // For now, we'll flag any description mismatches

  if (entity1.description && entity2.description) {
    // Check if entity2's description contradicts entity1's properties
    const desc2Lower = entity2.description.toLowerCase();

    if (entity1.properties.cost === 'premium' && desc2Lower.includes('cheap')) {
      conflicts.push({
        severity: 'high',
        type: 'property_conflict',
        entity1: id1,
        entity2: id2,
        property: 'cost',
        value1: 'premium',
        value2: 'described as cheap',
        message: `${id1} is marked as premium, but ${id2} describes it as cheap`
      });
      issues.severityCount.high++;
    }
  }

  return conflicts;
}

/**
 * Check relationship conflicts
 * Example: A says it "uses" B, but B doesn't list A in "usedBy"
 */
async function checkRelationshipConflicts(entities) {
  console.log('\nChecking for relationship conflicts...');

  const graph = loadRelationships();
  const relationships = graph.relationships || [];

  // Build relationship index
  const outgoing = new Map(); // from -> [rels]
  const incoming = new Map(); // to -> [rels]

  for (const rel of relationships) {
    if (!outgoing.has(rel.from)) outgoing.set(rel.from, []);
    if (!incoming.has(rel.to)) incoming.set(rel.to, []);

    outgoing.get(rel.from).push(rel);
    incoming.get(rel.to).push(rel);
  }

  // Check entity-declared relationships vs. graph
  for (const [entityId, entity] of entities) {
    const relationshipFields = [
      'usedIn', 'requiredFor', 'sources', 'producedBy', 'relatedMaterials',
      'connectedLocations', 'family', 'professional', 'personal'
    ];

    for (const field of relationshipFields) {
      if (!entity[field]) continue;

      const references = Array.isArray(entity[field]) ? entity[field] : [entity[field]];

      for (const targetId of references) {
        // Check if target entity exists
        if (!entities.has(targetId)) {
          issues.orphanedReferences.push({
            severity: 'high',
            type: 'orphaned_reference',
            entity: entityId,
            field: field,
            target: targetId,
            message: `${entityId} references non-existent entity: ${targetId}`
          });
          issues.severityCount.high++;
          continue;
        }

        // Check if there's a corresponding relationship in the graph
        const hasOutgoing = relationships.some(r => r.from === entityId && r.to === targetId);

        if (!hasOutgoing) {
          issues.missingBidirectional.push({
            severity: 'medium',
            type: 'missing_graph_relationship',
            entity: entityId,
            field: field,
            target: targetId,
            message: `${entityId}.${field} references ${targetId} but no relationship exists in graph`
          });
          issues.severityCount.medium++;
        }
      }
    }
  }

  // Check bidirectional consistency
  for (const rel of relationships) {
    if (rel.bidirectional) {
      const reverseRel = relationships.find(r =>
        r.from === rel.to && r.to === rel.from && r.relationshipType === rel.relationshipType
      );

      if (!reverseRel) {
        issues.relationshipConflicts.push({
          severity: 'high',
          type: 'missing_bidirectional',
          relationship: rel.id,
          from: rel.from,
          to: rel.to,
          relationshipType: rel.relationshipType,
          message: `Relationship ${rel.id} is marked bidirectional but has no reverse link`
        });
        issues.severityCount.high++;
      }
    }
  }

  console.log(`  Found ${issues.relationshipConflicts.length} relationship conflicts`);
  console.log(`  Found ${issues.orphanedReferences.length} orphaned references`);
  console.log(`  Found ${issues.missingBidirectional.length} missing graph relationships`);
}

/**
 * Check for definition conflicts
 * Example: Same term defined differently in multiple entities
 */
function checkDefinitionConflicts(entities) {
  console.log('\nChecking for definition conflicts...');

  const names = new Map(); // name -> [entities with that name]

  for (const [entityId, entity] of entities) {
    const name = entity.name?.toLowerCase();
    if (!name) continue;

    if (!names.has(name)) {
      names.set(name, []);
    }

    names.get(name).push({ id: entityId, entity });
  }

  // Find duplicates
  for (const [name, entitiesWithName] of names) {
    if (entitiesWithName.length > 1) {
      // Check if they're actually different definitions or just related entities
      const descriptions = entitiesWithName.map(e => e.entity.description);
      const types = entitiesWithName.map(e => e.entity.type);

      // If same name but different types and non-overlapping descriptions, it's a conflict
      const uniqueTypes = new Set(types);

      if (uniqueTypes.size > 1) {
        issues.definitionConflicts.push({
          severity: 'critical',
          type: 'duplicate_name',
          name: name,
          entities: entitiesWithName.map(e => e.id),
          types: Array.from(uniqueTypes),
          message: `"${name}" is defined as multiple different entity types: ${Array.from(uniqueTypes).join(', ')}`
        });
        issues.severityCount.critical++;
      }
    }
  }

  console.log(`  Found ${issues.definitionConflicts.length} definition conflicts`);
}

/**
 * Cross-reference with original markdown
 * Check if JSON entities contradict source lore
 */
async function checkCrossReferences(entities) {
  console.log('\nChecking cross-references with original markdown...');

  const originalsDir = join(ROOT_DIR, 'originals');
  const markdownFiles = await glob('*.md', { cwd: originalsDir });

  const sourceContent = new Map(); // term -> source text context

  // Build index of terms from markdown
  for (const mdFile of markdownFiles) {
    const mdPath = join(originalsDir, mdFile);
    const content = readFileSync(mdPath, 'utf8');

    // Simple term extraction (could be more sophisticated)
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for definitions (lines with ":" or bold text)
      if (line.includes(':') || line.match(/\*\*([^*]+)\*\*/)) {
        const match = line.match(/\*\*([^*]+)\*\*/) || line.match(/^([^:]+):/);
        if (match) {
          const term = match[1].trim().toLowerCase();
          const context = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 3)).join('\n');

          if (!sourceContent.has(term)) {
            sourceContent.set(term, []);
          }

          sourceContent.get(term).push({
            file: mdFile,
            line: i + 1,
            context: context
          });
        }
      }
    }
  }

  // Check entities against source
  for (const [entityId, entity] of entities) {
    const name = entity.name?.toLowerCase();
    if (!name) continue;

    if (sourceContent.has(name)) {
      const sources = sourceContent.get(name);

      // Check for contradictions in properties
      for (const source of sources) {
        const contextLower = source.context.toLowerCase();

        // Example checks
        if (entity.properties?.cost === 'premium' && contextLower.includes('cheap')) {
          issues.crossReferenceConflicts.push({
            severity: 'high',
            type: 'source_contradiction',
            entity: entityId,
            property: 'cost',
            jsonValue: 'premium',
            sourceFile: source.file,
            sourceLine: source.line,
            message: `${entityId} marked as "premium" but source describes it as cheap`
          });
          issues.severityCount.high++;
        }

        if (entity.properties?.durability === 'very-high' && contextLower.match(/fragile|delicate|weak/)) {
          issues.crossReferenceConflicts.push({
            severity: 'high',
            type: 'source_contradiction',
            entity: entityId,
            property: 'durability',
            jsonValue: 'very-high',
            sourceFile: source.file,
            sourceLine: source.line,
            message: `${entityId} marked as "very-high" durability but source describes it as fragile/weak`
          });
          issues.severityCount.high++;
        }
      }
    }
  }

  console.log(`  Found ${issues.crossReferenceConflicts.length} cross-reference conflicts`);
}

/**
 * Generate consistency report
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('CONSISTENCY CHECK REPORT');
  console.log('='.repeat(60));

  const totalIssues =
    issues.propertyConflicts.length +
    issues.relationshipConflicts.length +
    issues.definitionConflicts.length +
    issues.crossReferenceConflicts.length +
    issues.orphanedReferences.length +
    issues.missingBidirectional.length;

  console.log(`\nTotal Issues: ${totalIssues}`);
  console.log(`  Critical: ${issues.severityCount.critical}`);
  console.log(`  High: ${issues.severityCount.high}`);
  console.log(`  Medium: ${issues.severityCount.medium}`);
  console.log(`  Low: ${issues.severityCount.low}`);

  if (issues.definitionConflicts.length > 0) {
    console.log('\n❌ DEFINITION CONFLICTS (Critical):');
    issues.definitionConflicts.forEach(issue => {
      console.log(`  - ${issue.message}`);
      console.log(`    Entities: ${issue.entities.join(', ')}`);
    });
  }

  if (issues.orphanedReferences.length > 0) {
    console.log('\n❌ ORPHANED REFERENCES (High):');
    issues.orphanedReferences.slice(0, 10).forEach(issue => {
      console.log(`  - ${issue.message}`);
    });
    if (issues.orphanedReferences.length > 10) {
      console.log(`  ... and ${issues.orphanedReferences.length - 10} more`);
    }
  }

  if (issues.crossReferenceConflicts.length > 0) {
    console.log('\n❌ SOURCE CONTRADICTIONS (High):');
    issues.crossReferenceConflicts.forEach(issue => {
      console.log(`  - ${issue.message}`);
      console.log(`    Source: ${issue.sourceFile}:${issue.sourceLine}`);
    });
  }

  if (issues.relationshipConflicts.length > 0) {
    console.log('\n⚠️  RELATIONSHIP CONFLICTS (High):');
    issues.relationshipConflicts.slice(0, 5).forEach(issue => {
      console.log(`  - ${issue.message}`);
    });
    if (issues.relationshipConflicts.length > 5) {
      console.log(`  ... and ${issues.relationshipConflicts.length - 5} more`);
    }
  }

  if (issues.missingBidirectional.length > 0) {
    console.log('\n⚠️  MISSING GRAPH RELATIONSHIPS (Medium):');
    console.log(`  ${issues.missingBidirectional.length} entity references not in relationship graph`);
  }

  // Write detailed report
  const reportPath = join(ROOT_DIR, 'generated/reports/consistency-report.json');
  import('fs').then(fs => {
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues,
        critical: issues.severityCount.critical,
        high: issues.severityCount.high,
        medium: issues.severityCount.medium,
        low: issues.severityCount.low
      },
      issues
    }, null, 2));
    console.log(`\n✓ Detailed report saved to ${reportPath}`);
  });

  console.log('\n' + '='.repeat(60));

  if (issues.severityCount.critical > 0) {
    console.log('❌ CRITICAL ISSUES FOUND - Must fix before deployment');
    return 2;
  } else if (issues.severityCount.high > 0) {
    console.log('⚠️  HIGH PRIORITY ISSUES - Should fix soon');
    return 1;
  } else if (totalIssues > 0) {
    console.log('⚠️  MINOR ISSUES - Review when possible');
    return 0;
  } else {
    console.log('✓ NO CONSISTENCY ISSUES FOUND');
    return 0;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('Whisker Shogunate Consistency Checker\n');

  const entities = await loadAllEntities();
  console.log(`Loaded ${entities.size} entities\n`);

  checkPropertyConflicts(entities);
  await checkRelationshipConflicts(entities);
  checkDefinitionConflicts(entities);
  await checkCrossReferences(entities);

  const exitCode = generateReport();
  process.exit(exitCode);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
