# The Whisker Shogunate - TODO List

**Last Updated**: 2025-10-07 (Evening Session)
**Status**: ~90% Complete - MCP Server, Wiki, and Graph all working!

---

## 📊 Current State

### Architecture Complete ✅
- **MCP Server**: ✓ Connected - Full CRUD API with validation
- **Wiki**: Running at localhost:3000 - 232 static pages
- **Graph**: Hierarchical visualization with 199+ relationships
- **Data**: 226 entities across 8 types (down from 237 after cleanup)

### What's Working
- ✅ MCP tools accessible via Claude Code
- ✅ Entity relationship graph with dagre layout
- ✅ Bidirectional relationships displayed on entity pages
- ✅ Watch mode for MCP development (`pnpm watch`)
- ✅ Validation script (`pnpm validate` - 9/9 tests passing)
- ✅ Semantic relationships (food→profession→material→location)

---

## 🎯 Next Session Priority Tasks

### 1. Deploy Wiki to GitHub Pages (~15 min) ⭐
**Status**: Ready to deploy
**Priority**: HIGH

```bash
cd packages/wiki
pnpm build
git add -A
git commit -m "Build static site for GitHub Pages"
git push

# Then go to: Settings → Pages → Source: "GitHub Actions"
# Site will be at: https://alexalexandrescu.github.io/the-whisker-shogunate
```

### 2. Test MCP Tools End-to-End (~30 min)
**Status**: MCP connected, needs real-world testing
**Priority**: HIGH

Use MCP tools via Claude Code to:
- Create a new profession entity (sake brewer)
- Add relationships between sake → brewer → Kawa-no-kuni
- Search for all rice-related entities
- Update multiple entities with bulk_update
- Validate the changes work in wiki + graph

**Goal**: Prove the full workflow (MCP create → wiki displays → graph shows relationships)

### 3. Expand Entity Relationships (~1 hour)
**Status**: 199 relationships, target 500+
**Priority**: MEDIUM

Missing connections:
- [ ] All professions → their primary provinces (31 professions)
- [ ] All guilds → their members/professions (7 guilds)
- [ ] Materials → their source locations (4 materials)
- [ ] Foods → their regional origins (46 foods)
- [ ] Cultures → their associated foods/events (9 cultures)

**Use MCP tools to add these systematically**

### 4. Visual Improvements (~1 hour)
**Status**: Basic graph working, needs polish
**Priority**: LOW

Wiki enhancements:
- [ ] Add relationship type filters to graph (food-only, profession-only, etc.)
- [ ] Add search box to graph page
- [ ] Improve homepage stats dashboard
- [ ] Add "Recently Modified" entities list
- [ ] Show relationship counts on entity cards

---

## ✅ Completed This Session (2025-10-07 Evening)

### Lore Migration & Content
- [x] Migrated 237 entities from GLOSSARY.md and world-building docs
- [x] Created 5 new schemas (culture, faction, food, event, concept)
- [x] Manually extracted 5 provinces, 7 guilds, 6 characters
- [x] Added semantic relationships (128 → 199 references, +71)

### Wiki Implementation
- [x] Fixed entity linking (show both incoming and outgoing relationships)
- [x] Added hierarchical graph with dagre layout
- [x] Improved relationship display with field names
- [x] Color-coded badges (blue=outgoing, green=incoming)
- [x] Fixed basePath for local preview vs GitHub Pages

### MCP Server Transformation
- [x] Implemented proper MCP protocol with @modelcontextprotocol/sdk
- [x] Added full CRUD operations (Create, Update, Delete)
- [x] Added relationship management (add/remove)
- [x] Added bulk operations and validation
- [x] Connected to Claude Code (✓ Connected status)
- [x] Created watch mode for development
- [x] Built validation script (9/9 tests passing)
- [x] Wrote DEVELOPMENT.md guide

### Semantic Relationships Added
- [x] Food → Profession (miso → chefs, dashi → chefs)
- [x] Profession → Location (itamae → coastal cities)
- [x] Profession → Faction (all culinary → Artisan Union)
- [x] Material → Profession (brass → sculptor, hinoki → carpenter)
- [x] Material → Location (brass → Yama-takumi)

---

## 📦 Package Status

| Package | Status | Lines of Code | Notes |
|---------|--------|---------------|-------|
| @whisker/schemas | ✅ Built | ~500 | 10 JSON schemas |
| @whisker/data | ✅ Built | ~1000 | 226 entities, loader functions |
| @whisker/validation | ✅ Built | ~300 | Validation scripts |
| @whisker/analytics | ✅ Built | ~200 | Progress tracking |
| @whisker/migration | ✅ Built | ~400 | Lore parsing tools |
| @whisker/mcp-server | ✅ Built | ~700 | MCP protocol + CRUD API |
| @whisker/wiki | ✅ Running | ~600 | Next.js 15.5.4, 232 pages |

**Total**: ~3,700 lines of code

---

## 🔧 Working Commands

### Development
```bash
# MCP Server development
cd packages/mcp-server
pnpm watch              # Auto-rebuild on changes
pnpm validate           # Run all tests (9/9 passing)

# Wiki development
cd packages/wiki
pnpm dev               # http://localhost:3000
pnpm build             # Static export for GitHub Pages

# After MCP changes
# In Claude Code: Command Palette → "Developer: Reload Window"
```

### MCP Tools (via Claude Code)
```
whisker_create_entity - Create with validation
whisker_update_entity - Update (merge or replace)
whisker_delete_entity - Delete with safety checks
whisker_get_entity - Get full entity + relationships
whisker_lore_search - Search by name/type/tags
whisker_add_relationship - Connect entities
whisker_remove_relationship - Remove connections
whisker_list_types - Summary (226 entities, 8 types)
whisker_bulk_update - Update multiple entities
whisker_validate - Check data integrity
```

### Entity Management
```bash
# Validate all entities
pnpm --filter @whisker/validation build
node packages/validation/dist/validate.js

# Check for contradictions
node packages/validation/dist/check-consistency.js

# Progress analytics
node packages/analytics/dist/index.js
```

---

## 🐛 Known Issues

### None Currently!
All systems operational:
- ✓ MCP Server connected
- ✓ Wiki running (localhost:3000)
- ✓ Graph displaying relationships
- ✓ All validation tests passing
- ✓ 226 entities loaded

---

## 🎯 Long-term Roadmap (Ordered by Priority)

### Content Expansion (Next 1-2 months)
- [ ] Extract all professions from Part 3 (target: 100+ professions)
- [ ] Add all architectural elements from Part 2 (buildings, materials)
- [ ] Extract all cuisine from Part 4 (dishes, ingredients, restaurants)
- [ ] Create historical event entities (Territorial Wars, founding, etc.)
- [ ] Add visual assets (concept art, diagrams, maps)

### Features (Next 2-3 months)
- [ ] Entity versioning (track changes over time)
- [ ] Advanced search (fuzzy search, filters, sorting)
- [ ] Relationship visualization filters
- [ ] Export entity as markdown
- [ ] Import/export entity bundles
- [ ] Collaborative editing (multiple contributors)

### Future Packages (Next 6-12 months)
- [ ] `apps/game` - The actual idle game
- [ ] `apps/character-builder` - Character creation tool
- [ ] `@whisker/game-engine` - Shared game logic
- [ ] `@whisker/ui-components` - Reusable React components
- [ ] `@whisker/asset-manager` - Image/media management

---

## 📊 Entity Statistics

### By Type
- Concept: 83 entities
- Food: 46 entities
- Location: 33 entities
- Profession: 31 entities
- Faction: 14 entities
- Culture: 9 entities
- Character: 6 entities
- Material: 4 entities

### Relationships
- Total references: 199+
- Average per entity: ~0.88
- Target: 500+ (2.2 per entity)

### Completion
- Entities with relationships: ~50%
- Entities with descriptions: 100%
- Entities with tags: 100%
- Entities with assets: 5% (hinoki has full asset metadata)

---

## 💡 Quick Start for Next Session

```bash
# 1. Pull latest changes
git pull origin main

# 2. Start wiki locally
cd packages/wiki
pnpm dev
# Open: http://localhost:3000

# 3. Start MCP watch mode (in separate terminal)
cd packages/mcp-server
pnpm watch

# 4. Test MCP tools
# In Claude Code, ask:
# "Use whisker_list_types to show me all entity types"
# "Use whisker_lore_search to find all food items"

# 5. Make changes and validate
pnpm validate

# 6. Commit and push
git add -A
git commit -m "Your changes"
git push
```

---

## 🌟 Success Metrics

### Wiki v1 Complete When:
- [x] Homepage shows progress dashboard ✅
- [x] Entity browser lists all entities with filtering ✅
- [x] Entity pages show full data + relationships ✅
- [x] Static export works ✅
- [ ] GitHub Pages deployment successful 🔄
- [ ] Site accessible at GitHub Pages URL 🔄

### MCP v1 Complete When:
- [x] All CRUD operations work ✅
- [x] Schema validation works ✅
- [x] Connected to Claude Code ✅
- [x] Relationship management works ✅
- [x] Validation tests pass ✅
- [x] Development workflow documented ✅

### Content v1 Complete When:
- [x] 200+ entities (226 currently) ✅
- [ ] 500+ relationships (199 currently) 🔄
- [ ] All 5 provinces detailed 🔄
- [ ] All 7 guilds detailed ✅
- [ ] Major NPCs created ✅
- [ ] Key locations created ✅

---

## 📚 Reference Documents

- `CLAUDE.md` - Project instructions for Claude Code
- `originals/*.md` - Source world-building documents (4 files)
- `packages/mcp-server/DEVELOPMENT.md` - MCP development guide
- `packages/mcp-server/README.md` - MCP quick reference
- `.github/workflows/` - CI/CD pipeline (deploy.yml, ci.yml)
- `.mcp.json` - MCP server configuration

---

## 🎨 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     The Whisker Shogunate                    │
│                    World-Building System                     │
└─────────────────────────────────────────────────────────────┘

                    Data Flow & Layers:

    ┌──────────────┐
    │  Claude Code │  (You + AI via MCP tools)
    └──────┬───────┘
           │
           ▼
    ┌─────────────────┐
    │   MCP Server    │  Authoritative CRUD API
    │  (stdio stdio)  │  - Create/Update/Delete
    │  ✓ Connected    │  - Relationship management
    └─────────┬───────┘  - Schema validation
              │
              ▼
    ┌──────────────────┐
    │  @whisker/data   │  JSON files (226 entities)
    │  packages/data/  │  - foods/*.json
    │                  │  - professions/*.json
    └─────────┬────────┘  - locations/*.json, etc.
              │
              │ Read-only
              ▼
    ┌──────────────────┐
    │  @whisker/wiki   │  Next.js Static Site
    │  localhost:3000  │  - Browse entities
    │                  │  - View relationships
    └──────────────────┘  - Graph visualization
              │
              │ Build → Export
              ▼
    ┌──────────────────┐
    │  GitHub Pages    │  Public deployment
    │  (SPA, static)   │  https://<user>.github.io/
    └──────────────────┘  the-whisker-shogunate/
```

---

**Current Status**: Production-ready system with 226 entities, working MCP CRUD layer, and visual wiki. Ready for deployment and content expansion! 🚀
