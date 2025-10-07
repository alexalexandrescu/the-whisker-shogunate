#!/usr/bin/env node

/**
 * MCP Server for The Whisker Shogunate
 * Implements Model Context Protocol for entity CRUD operations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { mcpTools } from './index.js';

// Create MCP server instance
const server = new Server(
  {
    name: 'whisker-lore',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'whisker_lore_search',
        description: 'Search entities by name, type, or tags. Returns matching entities with basic info.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Text to search for in name and description' },
            type: { type: 'string', description: 'Filter by entity type (e.g., food, profession, character)' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Filter by tags' },
            limit: { type: 'number', description: 'Maximum number of results (default: 50)', default: 50 },
          },
        },
      },
      {
        name: 'whisker_get_entity',
        description: 'Get complete entity data including relationships. Returns full entity JSON.',
        inputSchema: {
          type: 'object',
          properties: {
            entityId: { type: 'string', description: 'The entity ID (e.g., food_miso, character_tora-the-scarred)' },
            includeRelationships: { type: 'boolean', description: 'Include relationship data', default: true },
            depth: { type: 'number', description: 'Depth of relationship traversal', default: 1 },
          },
          required: ['entityId'],
        },
      },
      {
        name: 'whisker_create_entity',
        description: 'Create a new entity with validation. Automatically adds metadata (status, lastModified, contributors).',
        inputSchema: {
          type: 'object',
          properties: {
            type: { type: 'string', description: 'Entity type (material, location, character, profession, faction, culture, food, event, concept)' },
            data: { type: 'object', description: 'Entity data including id, name, description, and type-specific fields' },
          },
          required: ['type', 'data'],
        },
      },
      {
        name: 'whisker_update_entity',
        description: 'Update an existing entity. Can merge with existing data or replace entirely.',
        inputSchema: {
          type: 'object',
          properties: {
            entityId: { type: 'string', description: 'The entity ID to update' },
            updates: { type: 'object', description: 'Fields to update' },
            merge: { type: 'boolean', description: 'Merge with existing data (true) or replace (false)', default: true },
          },
          required: ['entityId', 'updates'],
        },
      },
      {
        name: 'whisker_delete_entity',
        description: 'Delete an entity. Checks for relationships unless force=true.',
        inputSchema: {
          type: 'object',
          properties: {
            entityId: { type: 'string', description: 'The entity ID to delete' },
            force: { type: 'boolean', description: 'Force delete even if relationships exist', default: false },
          },
          required: ['entityId'],
        },
      },
      {
        name: 'whisker_add_relationship',
        description: 'Add a relationship between two entities. Can be bidirectional.',
        inputSchema: {
          type: 'object',
          properties: {
            sourceId: { type: 'string', description: 'Source entity ID' },
            targetId: { type: 'string', description: 'Target entity ID' },
            relationshipField: { type: 'string', description: 'Field name (e.g., relatedProfessions, relatedLocations)' },
            bidirectional: { type: 'boolean', description: 'Create reverse relationship', default: false },
          },
          required: ['sourceId', 'targetId', 'relationshipField'],
        },
      },
      {
        name: 'whisker_remove_relationship',
        description: 'Remove a relationship between two entities.',
        inputSchema: {
          type: 'object',
          properties: {
            sourceId: { type: 'string', description: 'Source entity ID' },
            targetId: { type: 'string', description: 'Target entity ID' },
            relationshipField: { type: 'string', description: 'Field name' },
            bidirectional: { type: 'boolean', description: 'Remove reverse relationship', default: false },
          },
          required: ['sourceId', 'targetId', 'relationshipField'],
        },
      },
      {
        name: 'whisker_list_types',
        description: 'List all entity types with counts and examples. Returns summary of the entire knowledge base.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'whisker_bulk_update',
        description: 'Update multiple entities at once with the same changes.',
        inputSchema: {
          type: 'object',
          properties: {
            entityIds: { type: 'array', items: { type: 'string' }, description: 'Array of entity IDs to update' },
            updates: { type: 'object', description: 'Fields to update on all entities' },
          },
          required: ['entityIds', 'updates'],
        },
      },
      {
        name: 'whisker_validate',
        description: 'Validate data consistency and check for integrity issues (missing references, orphaned entities).',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Call the appropriate tool function
    const toolFn = mcpTools[name];
    if (!toolFn) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const result = await toolFn(args || {});

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}\n\n${error.stack || ''}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Whisker Lore MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
