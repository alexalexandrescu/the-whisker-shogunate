# Whisker Shogunate MCP Server

Model Context Protocol server for programmatic access to The Whisker Shogunate knowledge base.

## Overview

This MCP server provides AI assistants (like Claude) with tools to query, search, and interact with the world-building knowledge base. All tools validate data against JSON schemas and maintain consistency.

## Available Tools

### 1. `whisker_lore_search` - Search Knowledge Base

Search for entities by name, type, tags, or text content.

**Parameters:**
```json
{
  "query": "string (optional) - Search text for name/description",
  "type": "string (optional) - Entity type filter (material, location, character, etc.)",
  "tags": "array (optional) - Array of tags to filter by",
  "limit": "number (optional, default: 50) - Max results to return"
}
```

**Example:**
```javascript
// Find all premium woods
whisker_lore_search({ type: "material", tags: ["premium", "wood"] })

// Search for temples
whisker_lore_search({ query: "temple", type: "location" })

// Find any entity mentioning "brass"
whisker_lore_search({ query: "brass" })
```

**Response:**
```json
[
  {
    "id": "material_wood_hinoki",
    "type": "material",
    "name": "Hinoki",
    "nameJapanese": "檜",
    "description": "Premium cypress wood known for...",
    "tags": ["construction", "premium", "sacred"],
    "category": "wood",
    "subcategory": "premium"
  }
]
```

### 2. `whisker_get_entity` - Get Complete Entity Data

Retrieve full entity data with optional relationship traversal.

**Parameters:**
```json
{
  "entityId": "string (required) - Entity ID (e.g., 'material_wood_hinoki')",
  "includeRelationships": "boolean (optional, default: true) - Include relationships",
  "depth": "number (optional, default: 1) - Relationship traversal depth"
}
```

**Example:**
```javascript
// Get entity with relationships
whisker_get_entity({
  entityId: "material_wood_hinoki",
  includeRelationships: true,
  depth: 2
})
```

**Response:**
```json
{
  "id": "material_wood_hinoki",
  "type": "material",
  "name": "Hinoki",
  "properties": { ... },
  "assets": { ... },
  "relationships": {
    "outgoing": [
      {
        "id": "rel_001",
        "relationshipType": "usedIn",
        "from": "material_wood_hinoki",
        "to": "location_healer-temple"
      }
    ],
    "incoming": [ ... ]
  },
  "relatedEntities": {
    "location_healer-temple": { ... }
  }
}
```

### 3. `whisker_dependency_tree` - Get Dependency Visualization

Build a dependency tree showing what an entity requires.

**Parameters:**
```json
{
  "entityId": "string (required) - Entity ID to analyze",
  "maxDepth": "number (optional, default: 5) - Max tree depth"
}
```

**Example:**
```javascript
// What does a Healer Temple need?
whisker_dependency_tree({
  entityId: "location_healer-temple",
  maxDepth: 3
})
```

**Response:**
```json
{
  "id": "location_healer-temple",
  "name": "Healer Temple",
  "type": "location",
  "dependencies": [
    {
      "relationshipType": "requires",
      "target": "material_wood_hinoki",
      "targetName": "Hinoki Wood",
      "strength": "required",
      "children": {
        "id": "material_wood_hinoki",
        "dependencies": [
          {
            "relationshipType": "requires",
            "target": "profession_woodcutter",
            "targetName": "Woodcutter"
          }
        ]
      }
    }
  ]
}
```

### 4. `whisker_create_entity` - Create New Entity

Create and validate a new entity in the knowledge base.

**Parameters:**
```json
{
  "type": "string (required) - Entity type (material, location, character, etc.)",
  "data": "object (required) - Entity data (must conform to schema)"
}
```

**Example:**
```javascript
whisker_create_entity({
  type: "material",
  data: {
    "id": "material_metal_brass",
    "type": "material",
    "category": "metal",
    "subcategory": "alloy",
    "name": "Brass",
    "nameJapanese": "真鍮",
    "description": "Warm golden alloy of copper and zinc...",
    "properties": {
      "durability": "high",
      "cost": "moderate",
      "workability": "easy"
    },
    "tags": ["construction", "decorative", "whisker-punk"],
    "status": "in-progress",
    "completionPercentage": 60
  }
})
```

**Response:**
```json
{
  "success": true,
  "entityId": "material_metal_brass",
  "filePath": "data/materials/metals/brass.json"
}
```

### 5. `whisker_get_assets` - Get Entity Assets

Retrieve all visual assets (images, diagrams, concept art) for an entity.

**Parameters:**
```json
{
  "entityId": "string (required) - Entity ID"
}
```

**Example:**
```javascript
whisker_get_assets({ entityId: "material_wood_hinoki" })
```

**Response:**
```json
{
  "entityId": "material_wood_hinoki",
  "entityName": "Hinoki",
  "assets": [
    {
      "type": "primary",
      "path": "assets/materials/woods/hinoki-sample.jpg",
      "exists": false
    },
    {
      "type": "gallery",
      "path": "assets/materials/woods/hinoki-texture-closeup.jpg",
      "exists": false
    },
    {
      "type": "diagrams",
      "path": "assets/materials/woods/hinoki-growth-rings.svg",
      "exists": false
    }
  ],
  "totalAssets": 7,
  "existingAssets": 0,
  "missingAssets": 7
}
```

### 6. `whisker_validate` - Validate System Consistency

Check relationship integrity, orphaned entities, and data consistency.

**Parameters:**
```json
{}
```

**Example:**
```javascript
whisker_validate({})
```

**Response:**
```json
{
  "totalEntities": 1,
  "totalRelationships": 0,
  "issues": [],
  "errors": 0,
  "warnings": 0,
  "status": "PASS"
}
```

## CLI Usage (Testing)

```bash
# Search for entities
node mcp-server/index.js whisker_lore_search '{"query": "temple"}'

# Get entity details
node mcp-server/index.js whisker_get_entity '{"entityId": "material_wood_hinoki"}'

# Get dependency tree
node mcp-server/index.js whisker_dependency_tree '{"entityId": "location_healer-temple"}'

# Validate consistency
node mcp-server/index.js whisker_validate '{}'

# Get assets
node mcp-server/index.js whisker_get_assets '{"entityId": "material_wood_hinoki"}'
```

## Integration with Claude Desktop

Add to your Claude Desktop MCP configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "whisker-shogunate": {
      "command": "node",
      "args": ["/Users/alex/Projects/the-whisker-shogunate/mcp-server/index.js"],
      "env": {}
    }
  }
}
```

## Use Cases

### For World-Building Development

**Query existing lore:**
```javascript
// Find all materials used in sacred buildings
whisker_lore_search({ tags: ["sacred", "construction"] })

// Check what a temple requires
whisker_dependency_tree({ entityId: "location_healer-temple" })
```

**Add new content:**
```javascript
// Create a new material
whisker_create_entity({
  type: "material",
  data: { /* complete material data */ }
})

// Validate everything is consistent
whisker_validate({})
```

### For Game Development

**Content generation:**
```javascript
// Get all materials for crafting system
whisker_lore_search({ type: "material" })

// Get character with full relationship network
whisker_get_entity({
  entityId: "character_shogun-tora",
  depth: 3
})
```

**Asset management:**
```javascript
// Check what visual assets exist
whisker_get_assets({ entityId: "location_healer-temple" })
```

### For Documentation

**Generate reports:**
```javascript
// Find incomplete entities
whisker_lore_search({}).then(entities =>
  entities.filter(e => e.completionPercentage < 100)
)

// Map dependencies for documentation
whisker_dependency_tree({ entityId: "technology_whisker-static" })
```

## Response Format

All tools return JSON. Errors throw exceptions with descriptive messages.

**Success response:**
```json
{
  /* Tool-specific data */
}
```

**Error response:**
```json
{
  "error": "Validation failed: ...",
  "details": { /* AJV validation errors */ }
}
```

## Caching

The server caches loaded entities and relationships in memory for performance. The cache is invalidated when:
- New entities are created via `whisker_create_entity`
- Server is restarted

For long-running servers, implement cache invalidation watching the `data/` directory.

## Schema Validation

All entity creation is validated against JSON schemas:
- `schemas/material.schema.json`
- `schemas/location.schema.json`
- `schemas/character.schema.json`
- `schemas/relationship.schema.json`

Invalid data will throw detailed validation errors.

## Next Steps

1. **Implement MCP server protocol wrapper** for full Claude Desktop integration
2. **Add authentication** if exposing externally
3. **Add file watching** for automatic cache invalidation
4. **Implement relationship creation tool** for building connections between entities
5. **Add bulk operations** for migrating markdown content
6. **Create visualization tools** for dependency graphs

## Example Workflows

### Building a New Location

```javascript
// 1. Search for required materials
const woods = await whisker_lore_search({
  type: "material",
  tags: ["wood", "construction"]
});

// 2. Create the location
await whisker_create_entity({
  type: "location",
  data: {
    id: "location_tea-house",
    type: "location",
    locationType: "building",
    name: "Moonlit Tea House",
    architecture: {
      primaryMaterials: woods.map(w => w.id)
    },
    // ... rest of data
  }
});

// 3. Verify dependencies
const deps = await whisker_dependency_tree({
  entityId: "location_tea-house"
});

// 4. Validate consistency
await whisker_validate({});
```

### Analyzing World Completeness

```javascript
// Get all entities
const allEntities = await whisker_lore_search({ limit: 10000 });

// Calculate average completion
const avgCompletion = allEntities.reduce((sum, e) =>
  sum + (e.completionPercentage || 0), 0
) / allEntities.length;

// Find gaps
const incomplete = allEntities.filter(e =>
  (e.completionPercentage || 0) < 50
);

console.log(`World is ${avgCompletion}% complete`);
console.log(`${incomplete.length} entities need work`);
```

## Architecture Notes

- **Stateless design**: Each tool call loads fresh data
- **No database**: Pure file-based system (JSON files)
- **Git-integrated**: All changes tracked in version control
- **Schema-first**: Validation prevents inconsistent data
- **Relationship graph**: Separate from entities for flexibility
