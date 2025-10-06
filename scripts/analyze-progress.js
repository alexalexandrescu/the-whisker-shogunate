#!/usr/bin/env node

/**
 * Progress Analysis Script
 *
 * Git-based progress tracking:
 * - Total entities created (by type)
 * - Average completion percentage
 * - Entities modified this week/month
 * - Contributors and activity
 * - Velocity (entities per day/week)
 * - Staleness (entities not touched in 30+ days)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { execSync } from 'child_process';

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
 * Get git stats for entity files
 */
function getGitStats() {
  try {
    // Get first commit date
    const firstCommit = execSync('git log --reverse --format=%aI --max-count=1', { encoding: 'utf8' }).trim();

    // Get total commits
    const totalCommits = parseInt(execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim());

    // Get commits this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const commitsThisWeek = execSync(`git log --since="${weekAgo.toISOString()}" --oneline | wc -l`, { encoding: 'utf8' }).trim();

    // Get contributors
    const contributors = execSync('git log --format=%an | sort -u', { encoding: 'utf8' })
      .split('\n')
      .filter(c => c.trim())
      .length;

    return {
      firstCommit: new Date(firstCommit),
      totalCommits,
      commitsThisWeek: parseInt(commitsThisWeek),
      contributors,
      daysActive: Math.ceil((new Date() - new Date(firstCommit)) / (1000 * 60 * 60 * 24))
    };
  } catch (error) {
    console.error('Error getting git stats:', error.message);
    return {
      firstCommit: new Date(),
      totalCommits: 0,
      commitsThisWeek: 0,
      contributors: 0,
      daysActive: 1
    };
  }
}

/**
 * Calculate entity statistics
 */
function calculateEntityStats(entities) {
  const stats = {
    byType: {},
    byStatus: {},
    totalEntities: entities.size,
    averageCompletion: 0,
    fullyComplete: 0,
    inProgress: 0,
    draft: 0,
    staleEntities: [] // Not modified in 30+ days
  };

  let totalCompletion = 0;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  for (const [entityId, entity] of entities) {
    // Count by type
    const type = entity.type || 'unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;

    // Count by status
    const status = entity.status || 'unknown';
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

    // Completion tracking
    const completion = entity.completionPercentage || 0;
    totalCompletion += completion;

    if (completion >= 100) stats.fullyComplete++;
    else if (completion >= 50) stats.inProgress++;
    else stats.draft++;

    // Staleness check
    if (entity.lastModified) {
      const lastMod = new Date(entity.lastModified);
      if (lastMod < thirtyDaysAgo) {
        stats.staleEntities.push({
          id: entityId,
          lastModified: entity.lastModified,
          daysAgo: Math.ceil((new Date() - lastMod) / (1000 * 60 * 60 * 24))
        });
      }
    }
  }

  stats.averageCompletion = Math.round(totalCompletion / entities.size);

  return stats;
}

/**
 * Calculate velocity (entities per time period)
 */
function calculateVelocity(gitStats, entityCount) {
  const daysActive = gitStats.daysActive || 1;
  const weeksActive = Math.max(1, Math.ceil(daysActive / 7));

  return {
    entitiesPerDay: (entityCount / daysActive).toFixed(2),
    entitiesPerWeek: (entityCount / weeksActive).toFixed(2),
    commitsPerDay: (gitStats.totalCommits / daysActive).toFixed(2),
    commitsPerWeek: (gitStats.totalCommits / weeksActive).toFixed(2)
  };
}

/**
 * Estimate completion timeline
 */
function estimateCompletion(entityCount, velocity, targetCount = 1000) {
  const remaining = targetCount - entityCount;
  const entitiesPerWeek = parseFloat(velocity.entitiesPerWeek);

  if (entitiesPerWeek <= 0) {
    return {
      remaining,
      weeksRemaining: Infinity,
      estimatedDate: null
    };
  }

  const weeksRemaining = Math.ceil(remaining / entitiesPerWeek);
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + (weeksRemaining * 7));

  return {
    remaining,
    weeksRemaining,
    estimatedDate: estimatedDate.toISOString().split('T')[0]
  };
}

/**
 * Generate progress report
 */
function generateReport(entities, gitStats, entityStats, velocity) {
  console.log('\n' + '='.repeat(60));
  console.log('PROGRESS ANALYSIS REPORT');
  console.log('='.repeat(60));

  console.log('\n📊 OVERALL METRICS');
  console.log(`Total Entities: ${entityStats.totalEntities}`);
  console.log(`Average Completion: ${entityStats.averageCompletion}%`);
  console.log(`Fully Complete: ${entityStats.fullyComplete}`);
  console.log(`In Progress: ${entityStats.inProgress}`);
  console.log(`Draft: ${entityStats.draft}`);

  console.log('\n📁 ENTITIES BY TYPE');
  for (const [type, count] of Object.entries(entityStats.byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }

  console.log('\n📝 ENTITIES BY STATUS');
  for (const [status, count] of Object.entries(entityStats.byStatus).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${status}: ${count}`);
  }

  console.log('\n⚡ VELOCITY');
  console.log(`Entities per day: ${velocity.entitiesPerDay}`);
  console.log(`Entities per week: ${velocity.entitiesPerWeek}`);
  console.log(`Commits per day: ${velocity.commitsPerDay}`);
  console.log(`Commits per week: ${velocity.commitsPerWeek}`);

  console.log('\n👥 GIT ACTIVITY');
  console.log(`Days active: ${gitStats.daysActive}`);
  console.log(`Total commits: ${gitStats.totalCommits}`);
  console.log(`Commits this week: ${gitStats.commitsThisWeek}`);
  console.log(`Contributors: ${gitStats.contributors}`);

  const estimate = estimateCompletion(entityStats.totalEntities, velocity, 1000);
  console.log('\n📈 COMPLETION ESTIMATE (Target: 1000 entities)');
  console.log(`Remaining: ${estimate.remaining} entities`);
  if (estimate.weeksRemaining !== Infinity) {
    console.log(`Estimated weeks: ${estimate.weeksRemaining}`);
    console.log(`Estimated completion: ${estimate.estimatedDate}`);
  } else {
    console.log('Cannot estimate completion (velocity too low)');
  }

  if (entityStats.staleEntities.length > 0) {
    console.log(`\n⚠️  STALE ENTITIES (not modified in 30+ days): ${entityStats.staleEntities.length}`);
    entityStats.staleEntities.slice(0, 5).forEach(e => {
      console.log(`  - ${e.id} (${e.daysAgo} days ago)`);
    });
    if (entityStats.staleEntities.length > 5) {
      console.log(`  ... and ${entityStats.staleEntities.length - 5} more`);
    }
  }

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalEntities: entityStats.totalEntities,
      averageCompletion: entityStats.averageCompletion,
      fullyComplete: entityStats.fullyComplete,
      inProgress: entityStats.inProgress,
      draft: entityStats.draft
    },
    byType: entityStats.byType,
    byStatus: entityStats.byStatus,
    velocity,
    gitStats,
    estimate,
    staleEntities: entityStats.staleEntities.length,
    percentComplete: ((entityStats.totalEntities / 1000) * 100).toFixed(1)
  };

  const reportPath = join(ROOT_DIR, 'generated/reports/progress-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log(`✓ Detailed report saved to ${reportPath}`);
  console.log('\n🎯 System is ' + report.percentComplete + '% complete (based on 1000 entity target)');
}

/**
 * Main execution
 */
async function main() {
  console.log('Whisker Shogunate Progress Analyzer\n');

  const entities = await loadAllEntities();
  console.log(`Loaded ${entities.size} entities\n`);

  const gitStats = getGitStats();
  const entityStats = calculateEntityStats(entities);
  const velocity = calculateVelocity(gitStats, entities.size);

  generateReport(entities, gitStats, entityStats, velocity);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
