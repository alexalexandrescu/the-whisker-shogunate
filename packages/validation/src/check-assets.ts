#!/usr/bin/env node

/**
 * Asset Checker
 *
 * Scans entities for asset references and reports:
 * - Missing vs. existing assets
 * - Asset priorities (which entities need assets most)
 * - Asset TODO list
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

/**
 * Load all entities
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
 * Check assets for all entities
 */
function checkAssets(entities) {
  const assetReport = {
    totalAssets: 0,
    existingAssets: 0,
    missingAssets: 0,
    entitiesWithAssets: 0,
    entitiesWithoutAssets: 0,
    assetsByType: {},
    missingByEntity: [],
    priorities: []
  };

  for (const [entityId, entity] of entities) {
    if (!entity.assets) {
      assetReport.entitiesWithoutAssets++;
      continue;
    }

    assetReport.entitiesWithAssets++;

    const entityAssets = {
      entityId,
      name: entity.name,
      type: entity.type,
      completion: entity.completionPercentage || 0,
      total: 0,
      existing: 0,
      missing: 0,
      assets: []
    };

    const assetFields = ['primary', 'gallery', 'diagrams', 'conceptArt', 'maps', 'screenshots', 'textures', 'portrait', 'sprites'];

    for (const field of assetFields) {
      if (!entity.assets[field]) continue;

      const assets = Array.isArray(entity.assets[field]) ? entity.assets[field] : [entity.assets[field]];

      for (const assetPath of assets) {
        const fullPath = join(ROOT_DIR, assetPath);
        const exists = existsSync(fullPath);

        assetReport.totalAssets++;
        entityAssets.total++;

        if (exists) {
          assetReport.existingAssets++;
          entityAssets.existing++;
        } else {
          assetReport.missingAssets++;
          entityAssets.missing++;
        }

        entityAssets.assets.push({
          type: field,
          path: assetPath,
          exists
        });

        // Count by asset type
        if (!assetReport.assetsByType[field]) {
          assetReport.assetsByType[field] = { total: 0, existing: 0, missing: 0 };
        }
        assetReport.assetsByType[field].total++;
        if (exists) {
          assetReport.assetsByType[field].existing++;
        } else {
          assetReport.assetsByType[field].missing++;
        }
      }
    }

    if (entityAssets.missing > 0) {
      assetReport.missingByEntity.push(entityAssets);
    }

    // Prioritize based on completion % and missing assets
    if (entityAssets.missing > 0) {
      const priority = (entity.completionPercentage || 0) / 10 + entityAssets.missing;
      assetReport.priorities.push({
        entityId,
        name: entity.name,
        completion: entity.completionPercentage || 0,
        missing: entityAssets.missing,
        priority
      });
    }
  }

  // Sort priorities
  assetReport.priorities.sort((a, b) => b.priority - a.priority);

  return assetReport;
}

/**
 * Generate asset report
 */
function generateReport(report, totalEntities) {
  console.log('\n' + '='.repeat(60));
  console.log('ASSET CHECK REPORT');
  console.log('='.repeat(60));

  console.log(`\n📊 OVERALL ASSET STATISTICS`);
  console.log(`Total assets referenced: ${report.totalAssets}`);
  console.log(`Existing assets: ${report.existingAssets} (${((report.existingAssets / report.totalAssets) * 100).toFixed(1)}%)`);
  console.log(`Missing assets: ${report.missingAssets} (${((report.missingAssets / report.totalAssets) * 100).toFixed(1)}%)`);

  console.log(`\n📁 ENTITY COVERAGE`);
  console.log(`Entities with assets: ${report.entitiesWithAssets}`);
  console.log(`Entities without assets: ${report.entitiesWithoutAssets}`);
  console.log(`Total entities: ${totalEntities}`);

  console.log(`\n🎨 ASSETS BY TYPE`);
  for (const [type, stats] of Object.entries(report.assetsByType).sort((a, b) => b[1].total - a[1].total)) {
    const percent = ((stats.existing / stats.total) * 100).toFixed(0);
    console.log(`  ${type}: ${stats.existing}/${stats.total} (${percent}% complete)`);
  }

  console.log(`\n🎯 TOP PRIORITY ASSETS TO CREATE`);
  console.log('(Based on entity completion % and number of missing assets)\n');
  report.priorities.slice(0, 10).forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.name} (${item.completion}% complete, ${item.missing} missing assets)`);
  });

  console.log(`\n📋 ENTITIES WITH MISSING ASSETS: ${report.missingByEntity.length}`);
  report.missingByEntity.slice(0, 5).forEach(item => {
    console.log(`  - ${item.name}: ${item.missing}/${item.total} missing`);
  });
  if (report.missingByEntity.length > 5) {
    console.log(`  ... and ${report.missingByEntity.length - 5} more`);
  }

  console.log('\n' + '='.repeat(60));

  if (report.missingAssets === 0) {
    console.log('✓ ALL ASSETS PRESENT');
  } else {
    console.log(`⚠️  ${report.missingAssets} ASSETS NEED TO BE CREATED`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('Whisker Shogunate Asset Checker\n');

  const entities = await loadAllEntities();
  console.log(`Loaded ${entities.size} entities\n`);

  const report = checkAssets(entities);
  generateReport(report, entities.size);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
