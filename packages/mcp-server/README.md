# Whisker Shogunate MCP Server

Model Context Protocol (MCP) server providing programmatic CRUD access to The Whisker Shogunate knowledge base.

## Overview

This MCP server acts as the **authoritative API and data management layer** for all world-building entities. The wiki is read-only for visualization; all entity creation, updates, and relationship management should go through this MCP server.

## Features

- **Full CRUD Operations**: Create, Read, Update, Delete entities
- **Schema Validation**: Automatic validation against JSON schemas
- **Relationship Management**: Add/remove relationships between entities
- **Search & Query**: Full-text search, type filtering, tag filtering
- **Bulk Operations**: Update multiple entities at once
- **Dependency Trees**: Analyze entity dependencies
- **Asset Management**: Query visual assets for entities
- **Consistency Validation**: Check data integrity

## Installation

```bash
# Build the server
pnpm build

# Test CLI interface
node dist/index.js whisker_list_types '{}'
```

## MCP Tools

### whisker_create_entity
Create a new entity with validation.

### whisker_update_entity  
Update an existing entity (merge or replace).

### whisker_delete_entity
Delete an entity (checks for relationships first).

### whisker_add_relationship
Add a relationship between two entities.

### whisker_remove_relationship
Remove a relationship between entities.

### whisker_lore_search
Search entities by name, type, or tags.

### whisker_get_entity
Get complete entity data with relationships.

### whisker_list_types
List all entity types with counts and examples.

### whisker_bulk_update
Update multiple entities at once.

See the source code for detailed parameter schemas.

## Entity Types

226 total entities across 10 types with 199+ relationships.

## Architecture

- **Data Layer**: JSON files in `packages/data/`
- **Schema Layer**: JSON schemas in `packages/schemas/`
- **API Layer**: This MCP server (authoritative CRUD)
- **Visualization Layer**: Next.js wiki (read-only)
