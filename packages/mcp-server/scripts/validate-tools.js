#!/usr/bin/env node

/**
 * Validation script for MCP server tools
 * Tests all CRUD operations and validates data integrity
 */

import { mcpTools } from '../dist/index.js';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

let passCount = 0;
let failCount = 0;

function pass(message) {
  console.log(`${GREEN}✓${RESET} ${message}`);
  passCount++;
}

function fail(message, error) {
  console.log(`${RED}✗${RESET} ${message}`);
  if (error) {
    console.log(`  ${RED}Error: ${error.message}${RESET}`);
  }
  failCount++;
}

function info(message) {
  console.log(`${YELLOW}ℹ${RESET} ${message}`);
}

async function runTests() {
  console.log('\n🧪 Validating Whisker Lore MCP Tools\n');

  // Test 1: List entity types
  try {
    info('Testing whisker_list_types...');
    const types = await mcpTools.whisker_list_types({});
    if (types.totalEntities > 0 && types.types.length > 0) {
      pass(`Found ${types.totalEntities} entities across ${types.types.length} types`);
    } else {
      fail('No entities found');
    }
  } catch (error) {
    fail('whisker_list_types failed', error);
  }

  // Test 2: Search entities
  try {
    info('Testing whisker_lore_search...');
    const results = await mcpTools.whisker_lore_search({ query: 'miso', limit: 5 });
    if (results.length > 0) {
      pass(`Search found ${results.length} results for "miso"`);
    } else {
      fail('Search returned no results');
    }
  } catch (error) {
    fail('whisker_lore_search failed', error);
  }

  // Test 3: Get entity
  try {
    info('Testing whisker_get_entity...');
    const entity = await mcpTools.whisker_get_entity({
      entityId: 'food_miso',
      includeRelationships: false
    });
    if (entity && entity.id === 'food_miso') {
      pass(`Retrieved entity: ${entity.name}`);
    } else {
      fail('Entity not found or incorrect');
    }
  } catch (error) {
    fail('whisker_get_entity failed', error);
  }

  // Test 4: Search by type
  try {
    info('Testing search by type...');
    const foodResults = await mcpTools.whisker_lore_search({ type: 'food', limit: 10 });
    if (foodResults.length > 0) {
      pass(`Found ${foodResults.length} food entities`);
    } else {
      fail('Type filter returned no results');
    }
  } catch (error) {
    fail('Type search failed', error);
  }

  // Test 5: Search by tags
  try {
    info('Testing search by tags...');
    const tagResults = await mcpTools.whisker_lore_search({
      tags: ['culinary'],
      limit: 10
    });
    if (tagResults.length > 0) {
      pass(`Found ${tagResults.length} entities with 'culinary' tag`);
    } else {
      fail('Tag filter returned no results');
    }
  } catch (error) {
    fail('Tag search failed', error);
  }

  // Test 6: Validate consistency
  try {
    info('Testing whisker_validate...');
    const validation = await mcpTools.whisker_validate({});
    if (validation.status === 'PASS') {
      pass(`Data validation passed (${validation.totalRelationships} relationships checked)`);
    } else {
      fail(`Data validation failed with ${validation.errors} errors`);
      console.log(`  ${YELLOW}Warnings: ${validation.warnings}${RESET}`);
    }
  } catch (error) {
    fail('whisker_validate failed', error);
  }

  // Test 7: Create and delete test entity
  try {
    info('Testing whisker_create_entity and whisker_delete_entity...');
    const testEntity = {
      id: 'food_test-validation-item',
      type: 'food',
      foodType: 'ingredient',
      name: 'Test Validation Item',
      description: 'Temporary test entity for validation',
      tags: ['test', 'temporary']
    };

    // Create
    const createResult = await mcpTools.whisker_create_entity({
      type: 'food',
      data: testEntity
    });

    if (createResult.success && createResult.entityId === testEntity.id) {
      pass('Created test entity successfully');

      // Verify it exists
      const retrieved = await mcpTools.whisker_get_entity({
        entityId: testEntity.id,
        includeRelationships: false
      });

      if (retrieved && retrieved.id === testEntity.id) {
        pass('Retrieved created test entity');

        // Delete
        const deleteResult = await mcpTools.whisker_delete_entity({
          entityId: testEntity.id,
          force: true
        });

        if (deleteResult.success) {
          pass('Deleted test entity successfully');
        } else {
          fail('Failed to delete test entity');
        }
      } else {
        fail('Could not retrieve created entity');
      }
    } else {
      fail('Failed to create test entity');
    }
  } catch (error) {
    fail('Create/delete test failed', error);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Test Results:`);
  console.log(`   ${GREEN}Passed: ${passCount}${RESET}`);
  console.log(`   ${RED}Failed: ${failCount}${RESET}`);
  console.log(`   Total:  ${passCount + failCount}\n`);

  if (failCount === 0) {
    console.log(`${GREEN}✅ All tests passed!${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`${RED}❌ ${failCount} test(s) failed${RESET}\n`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error(`${RED}Fatal error:${RESET}`, error);
  process.exit(1);
});
