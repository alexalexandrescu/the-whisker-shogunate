# Whisker Shogunate MCP Server

Model Context Protocol server providing CRUD access to The Whisker Shogunate knowledge base.

## Quick Start

```bash
# Build & validate
pnpm build && pnpm validate

# Development (auto-rebuild on changes)
pnpm watch

# After making changes, restart MCP in Claude Code:
# Command Palette → "Developer: Reload Window"
```

## Status

**✅ Connected** - 226 entities across 8 types with 199+ relationships

## Available Tools

### CRUD Operations
- `whisker_create_entity` - Create with validation
- `whisker_update_entity` - Update (merge or replace)
- `whisker_delete_entity` - Delete with safety checks
- `whisker_get_entity` - Get full entity + relationships

### Search & Query
- `whisker_lore_search` - Search by name/type/tags
- `whisker_list_types` - Summary of all entity types

### Relationships
- `whisker_add_relationship` - Connect entities
- `whisker_remove_relationship` - Remove connections

### Bulk & Analysis
- `whisker_bulk_update` - Update multiple entities
- `whisker_validate` - Check data integrity

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for complete workflow guide.

```bash
# Watch mode (recommended during development)
pnpm watch

# Run all validation tests
pnpm validate  # 9 tests, all passing ✓

# Quick test
pnpm test
```

## Architecture

- **MCP Server** = Authoritative CRUD API (this package)
- **Wiki** = Read-only visualization (packages/wiki)
- **Schemas** = Validation rules (packages/schemas)
- **Data** = JSON entities (packages/data)

## Entity Types

1. Material (4) - Woods, metals
2. Location (33) - Provinces, buildings
3. Character (6) - NPCs, daimyo
4. Profession (31) - Jobs, trades
5. Faction (14) - Guilds, organizations
6. Culture (9) - Holidays, customs
7. Food (46) - Dishes, ingredients
8. Concept (83) - Terminology

## Usage in Claude Code

The server is automatically loaded. Just ask:

> "Use whisker_lore_search to find all food items"

> "Use whisker_create_entity to add a new profession"

> "Use whisker_add_relationship to connect sake to Kawa-no-kuni"

## Validation

All entities are validated against JSON schemas. Required fields:
- All: `id`, `type`, `name`, `description`, `tags`
- Food: `foodType`
- Location: `locationType`
- Material: `category`, `subcategory`
- Profession: `category`

Run `pnpm validate` to test all tools.
