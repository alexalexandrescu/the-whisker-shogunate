# The Whisker Shogunate - World-Building Knowledge Base

A relational, structured knowledge base for The Whisker Shogunate idle/life-sim game world-building, featuring JSON entities, bidirectional relationships, visual asset management, and git-based progress tracking.

---

## 🎯 System Overview

### What This Is

A **Notion/Wiki-style relational database** for game world-building that provides:

- **Structured JSON Entities** with schemas and validation
- **Bidirectional Relationships** between all world elements
- **Visual Asset Integration** (concept art, diagrams, photos)
- **Git-Based Progress Tracking** (automatic metrics from commits)
- **Dependency Graphs** (visualize how materials → buildings → architecture)
- **MCP Server Foundation** (programmatic lore access for Claude)
- **Auto-Generated Wiki Views** (HTML/Markdown from JSON)

### Why Not Markdown?

**Before**: Scattered markdown docs, manual tracking, hard to query, no visual assets

**After**: Structured data, automatic metrics, rich media, queryable via MCP, interconnected

---

## 📁 Directory Structure

```
whisker-shogunate/
├── data/                      # Structured JSON entities (SOURCE OF TRUTH)
│   ├── materials/
│   │   ├── woods/
│   │   │   ├── hinoki.json   # Example: premium cypress wood
│   │   │   └── sugi.json
│   │   ├── metals/
│   │   └── stones/
│   ├── locations/             # Provinces, cities, buildings
│   ├── characters/            # NPCs and historical figures
│   ├── factions/              # Guilds and organizations
│   ├── technologies/          # Whisker-Punk innovations
│   ├── professions/           # Jobs and careers
│   ├── items/                 # Objects, tools, goods
│   ├── events/                # Historical events, festivals
│   └── cultures/              # Customs, language, traditions
│
├── schemas/                   # JSON Schema definitions
│   ├── material.schema.json  # Material entity schema
│   ├── location.schema.json  # Location entity schema
│   ├── character.schema.json # Character entity schema
│   └── relationship.schema.json
│
├── relationships/             # Link tracking between entities
│   ├── graph.json            # Full relationship graph
│   ├── backlinks.json        # Reverse index (auto-generated)
│   └── hierarchies.json      # Category trees
│
├── assets/                    # Visual assets
│   ├── materials/            # Material photos, textures
│   ├── locations/            # Concept art, maps, diagrams
│   ├── characters/           # Portraits, sprites
│   ├── technology/           # Schematics, renders
│   ├── factions/             # Emblems, org charts
│   └── _metadata/            # Asset metadata
│
├── scripts/                   # Automation tools
│   ├── validate.js           # Schema & relationship validation
│   ├── generate-graphs.js    # Visual graph generation (SVG)
│   ├── analyze-progress.js   # Git-based completion metrics
│   ├── migrate-from-markdown.js  # Migration helper
│   └── serve-wiki.js         # Local wiki server
│
├── mcp-server/               # MCP implementation (future)
│   ├── index.js              # MCP server entry point
│   ├── handlers/             # Query handlers
│   └── package.json
│
├── generated/                # Auto-generated content
│   ├── wiki/                 # HTML wiki pages
│   ├── graphs/               # SVG visualizations
│   └── reports/              # Validation & progress reports
│
├── originals/                # Original brainstorming docs (archived)
│   ├── whisker-shogunate-lore.md
│   ├── whisker-shogunate-part2.md
│   ├── whisker-shogunate-part3.md
│   └── whisker-shogunate-part4.md
│
├── package.json              # Node.js dependencies
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Initialize git (if not already initialized)
git init
git add .
git commit -m "Initial world-building system setup"
```

### Quick Start

```bash
# Validate all entities against schemas
npm run validate

# Check for logical contradictions
npm run check-consistency

# Migrate content from markdown to JSON
npm run migrate

# Analyze progress (git-based metrics)
npm run analyze-progress

# Check asset status and priorities
npm run check-assets

# Generate visual dependency graphs (coming soon)
npm run generate-graphs

# Serve local wiki (coming soon)
npm run serve-wiki
```

---

## 📝 Creating Entities

### Example: Create a New Material

1. **Create JSON file**: `data/materials/metals/brass.json`

2. **Use schema structure**:
```json
{
  "id": "material_metal_brass",
  "type": "material",
  "category": "metal",
  "subcategory": "whisker-punk",
  "name": "Brass",
  "nameJapanese": "真鍮",
  "pronunciation": "SHIN-chuu",
  "description": "Copper-zinc alloy used extensively in Whisker-Punk mechanisms...",
  "properties": {
    "durability": "high",
    "cost": "moderate",
    "workability": "moderate",
    "appearance": "bright gold when polished, browns when aged",
    "weight": "moderate",
    "cultural": "Symbol of Whisker-Punk innovation"
  },
  "assets": {
    "primary": "assets/materials/metals/brass-sample.jpg",
    "gallery": [],
    "diagrams": []
  },
  "usedIn": [
    "technology_gear-tower",
    "technology_whisker-static-generator"
  ],
  "sources": [
    "location_yama-takumi-foundries"
  ],
  "tags": ["metal", "whisker-punk", "decorative", "mechanical"],
  "completionPercentage": 60,
  "lastModified": "2025-10-07T14:30:00Z",
  "contributors": ["you"],
  "status": "in-progress",
  "notes": "Need to add: specific alloy ratios, pricing, production volume"
}
```

3. **Validate**:
```bash
npm run validate
```

4. **Commit**:
```bash
git add data/materials/metals/brass.json
git commit -m "Add brass material entity"
```

Progress tracking automatically updates from this commit!

---

## 🔗 Relationships

### How Relationships Work

**Example**: Hinoki wood is used in Healer Temples

**In `data/materials/woods/hinoki.json`**:
```json
{
  "usedIn": ["location_healer-temple"]
}
```

**In `data/locations/buildings/healer-temple.json`**:
```json
{
  "architecture": {
    "primaryMaterials": ["material_wood_hinoki"]
  }
}
```

**In `relationships/graph.json`**:
```json
{
  "relationships": [
    {
      "id": "rel_001",
      "type": "relationship",
      "relationshipType": "uses",
      "from": "location_healer-temple",
      "to": "material_wood_hinoki",
      "context": "primary construction material",
      "strength": "required",
      "bidirectional": true
    }
  ]
}
```

This creates a **bidirectional link** that:
- Appears in hinoki's "Used In" section
- Appears in temple's "Materials" section
- Shows in dependency graphs
- Validates that both entities exist

---

## 🎨 Visual Assets

### Adding Assets

1. **Place asset file**: `assets/materials/woods/hinoki-sample.jpg`

2. **Reference in entity**:
```json
{
  "assets": {
    "primary": "assets/materials/woods/hinoki-sample.jpg",
    "gallery": [
      "assets/materials/woods/hinoki-texture-closeup.jpg"
    ]
  }
}
```

3. **Validate**:
```bash
npm run validate
# Will warn if asset file doesn't exist
```

### Asset Types Supported

- **Reference Photos**: Real-world inspiration, material samples
- **Concept Art**: Character designs, location paintings
- **Diagrams**: Technical schematics, maps, org charts
- **UI Mockups**: Game interface designs
- **3D Renders**: Building models, tech visualization
- **Icons**: Item icons, faction emblems
- **Sprites**: Character sprites, game assets

---

## ✅ Validation

### What Gets Validated

```bash
npm run validate
```

Checks:
- ✓ **Schema compliance** - All required fields present
- ✓ **Relationship integrity** - Referenced entities exist
- ✓ **Asset references** - Asset files exist on disk
- ✓ **Bidirectional links** - Relationships work both ways
- ✓ **Circular dependencies** - No infinite loops
- ✓ **Orphaned entities** - All entities are connected

### Example Output

```
Whisker Shogunate World-Building Validator

Loading schemas...
  ✓ Loaded Material schema
  ✓ Loaded Location schema
  ✓ Loaded Character schema

Validating entities...
  ✓ Validated 15 entities
    15 valid, 0 invalid

Validating relationships...
  ✓ Checked 28 relationships

Checking for circular dependencies...
  ✓ No circular dependencies found

Checking for orphaned entities...
  ✓ All entities are connected

==================================================
VALIDATION SUMMARY
==================================================

Entities: 15/15 valid

✓ VALIDATION PASSED
```

---

## 🔍 Consistency Checking

### Prevent Logical Contradictions

```bash
npm run check-consistency
```

The consistency checker **prevents logical fallacies** by detecting:

- ❌ **Property conflicts**: Same entity described differently
  - Example: Hinoki marked as "premium" in one place, "cheap" in another
- ❌ **Relationship conflicts**: Mismatched bidirectional links
  - Example: A says it "uses" B, but B doesn't list A
- ❌ **Definition conflicts**: Same term defined as multiple entity types
  - Example: "Temple" as both location and profession
- ❌ **Cross-reference contradictions**: JSON contradicts source markdown
  - Example: Entity says "durable" but markdown says "fragile"
- ❌ **Orphaned references**: Links to non-existent entities

### Example Output

```
Consistency Check Report
============================================================

Total Issues: 3
  Critical: 1 (definition conflicts)
  High: 2 (cross-reference contradictions)
  Medium: 0
  Low: 0

❌ DEFINITION CONFLICTS (Critical):
  - "Temple" is defined as multiple entity types: location, profession
    Entities: location_healer-temple, profession_temple-keeper

❌ SOURCE CONTRADICTIONS (High):
  - material_wood_hinoki marked as "premium" but source describes it as cheap
    Source: originals/whisker-shogunate-part2.md:245

============================================================
```

**Output**: `generated/reports/consistency-report.json`

---

## 📦 Content Migration

### Convert Markdown → JSON Entities

```bash
npm run migrate
```

Automatically extracts entities from markdown sources:

**Sources**:
- `originals/*.md` (4,030 lines of core lore)
- `originals/GLOSSARY.md` (552 canonical terms)

**Extracts**:
- ✅ Materials (woods, metals, stones, ceramics, fabrics)
- ✅ Locations (provinces, cities, buildings, landmarks)
- ✅ Professions (from glossary tags)
- ✅ Characters (NPCs, historical figures)
- ✅ Factions (guilds, political entities)
- ✅ Technologies (Whisker-Punk systems)

**Features**:
- Auto-generates entity IDs from names
- Creates proper directory structure
- Extracts properties from descriptions
- Flags incomplete data for manual review
- Generates migration report

### Example Output

```
Whisker Shogunate - Markdown to JSON Migration

Parsing GLOSSARY.md...
  Found 212 glossary terms

Parsing materials from originals/whisker-shogunate-part2.md...
  Extracted 3 materials

Extracting professions from glossary...
  Extracted 26 professions

============================================================
Creating JSON entities...
============================================================
✓ Created material_metal_brass
✓ Created material_metal_bronze
✓ Created material_metal_copper
✓ Created profession_daiku
✓ Created profession_itamae
... and 18 more

============================================================
MIGRATION SUMMARY
============================================================
Materials created: 3
Professions created: 20
Errors: 0

✓ Migration complete!
```

---

## 🎨 Asset Management

### Check Asset Status

```bash
npm run check-assets
```

Scans entities for visual asset references:

**Reports**:
- 📊 Total assets vs. existing vs. missing
- 📁 Entity coverage (which entities have assets)
- 🎨 Assets by type (primary, gallery, diagrams, concept art)
- 🎯 Priority list (which entities need assets most)

### Example Output

```
Asset Check Report
============================================================

📊 OVERALL ASSET STATISTICS
Total assets referenced: 45
Existing assets: 12 (27%)
Missing assets: 33 (73%)

📁 ENTITY COVERAGE
Entities with assets: 8
Entities without assets: 16
Total entities: 24

🎨 ASSETS BY TYPE
  gallery: 4/15 (27% complete)
  diagrams: 3/10 (30% complete)
  primary: 5/8 (63% complete)
  conceptArt: 0/12 (0% complete)

🎯 TOP PRIORITY ASSETS TO CREATE
(Based on entity completion % and number of missing assets)

  1. Hinoki (85% complete, 7 missing assets)
  2. Brass (60% complete, 5 missing assets)
  3. Healer Temple (75% complete, 4 missing assets)

============================================================
```

---

## 📊 Progress Tracking

### Git-Based Metrics

Progress is **automatically calculated** from git commits:

```bash
npm run analyze-progress
```

Generates:
- **Completion percentages** from git history
- **Velocity metrics** (% per week)
- **Contributor statistics**
- **Entity activity** (commits per entity)
- **Staleness indicators** (days since last update)

### What Gets Tracked

- **Commits per entity** = development activity
- **File size growth** = detail added
- **Relationship additions** = integration depth
- **Time since last update** = staleness
- **Contributor count** = collaboration level

### No Manual Updates Needed!

Just commit your work:
```bash
git add data/materials/woods/hinoki.json
git commit -m "Add hinoki processing details and sources"
```

Progress tracking updates automatically.

---

## 🗺️ Dependency Graphs

### Generate Visual Graphs

```bash
npm run generate-graphs
```

Creates:
- `generated/graphs/materials/dependency-tree.svg` - Material dependencies
- `generated/graphs/locations/hierarchy.svg` - Location hierarchies
- `generated/graphs/characters/relationship-network.svg` - Character relationships
- `generated/graphs/technology/requirement-chain.svg` - Tech requirements
- `generated/graphs/full-world-graph.svg` - Entire world interconnections

### Example: Material Dependency Tree

```
Hinoki Wood
  ├── Used In
  │   ├── Healer Temple (required)
  │   ├── Bath House (required)
  │   └── Fine Furniture (optional)
  ├── Sources
  │   ├── Mori-shizuka Forests
  │   └── Mountain Groves
  └── Produced By
      ├── Woodcutter (profession)
      └── Artisan Union (faction)
```

Rendered as interactive SVG with clickable nodes.

---

## 🔍 MCP Server (Future)

### Planned MCP Interface

```typescript
// Query materials by properties
mcp.query({
  type: "material",
  category: "wood",
  properties: { cost: "premium" }
})
// Returns: [hinoki, keyaki]

// Find what uses brass
mcp.getRelationships("material_metal_brass", {
  type: "uses",
  direction: "incoming"
})
// Returns: [gear-tower, cable-car, decorative-fixtures...]

// Get all assets for a location
mcp.getAssets("location_healer-temple", {
  type: ["concept-art", "diagram"]
})
// Returns: [array of asset objects with URLs]
```

### MCP Tools for Claude

Claude will be able to:
- **Search the knowledge base** ("find all premium woods")
- **Add new entities** ("create a new character named...")
- **Query relationships** ("what materials does this use?")
- **Retrieve assets** ("show me concept art for temples")
- **Validate consistency** ("check if this makes sense")

---

## 📖 Entity Types & Schemas

### Core Entity Types

| Type | Schema | Description | Example |
|------|--------|-------------|---------|
| **Material** | `schemas/material.schema.json` | Materials for construction/crafting | Hinoki wood, Brass |
| **Location** | `schemas/location.schema.json` | Places (provinces, cities, buildings) | Healer Temple, Yama-takumi |
| **Character** | `schemas/character.schema.json` | NPCs, historical figures | Shogun Tora, Lady Shiro |
| **Faction** | `schemas/faction.schema.json` | Guilds, organizations | Engineer Guild, Merchant Guild |
| **Technology** | `schemas/technology.schema.json` | Whisker-Punk innovations | Gear Tower, Static Generator |
| **Profession** | `schemas/profession.schema.json` | Jobs and careers | Carpenter, Sushi Chef |
| **Item** | `schemas/item.schema.json` | Objects, tools, goods | Tools, Furniture, Food |
| **Event** | `schemas/event.schema.json` | Historical events, festivals | Territorial Wars, Hanami |
| **Culture** | `schemas/culture.schema.json` | Customs, traditions, language | Tea Ceremony, Dialects |
| **Relationship** | `schemas/relationship.schema.json` | Links between entities | uses, requires, contains |

### Schema Features

All schemas include:
- **Required fields** (id, type, name, description)
- **Asset support** (images, diagrams, concept art)
- **Relationship tracking** (bidirectional links)
- **Progress tracking** (completion%, lastModified, contributors)
- **Validation** (enums, patterns, formats)
- **Extensibility** (tags, notes, custom fields)

---

## 🛠️ Scripts Reference

### npm run validate
Validates all JSON entities against schemas, checks relationships, verifies assets

### npm run generate-graphs
Creates SVG dependency graphs for visualization

### npm run analyze-progress
Calculates completion metrics from git commit history

### npm run migrate
Helper to convert old markdown content to JSON entities

### npm run serve-wiki
Starts local web server to view auto-generated wiki pages

### npm run check-assets
Verifies all asset references and generates missing asset report

---

## 📐 Example Entity: Hinoki Wood

**File**: `data/materials/woods/hinoki.json`

```json
{
  "id": "material_wood_hinoki",
  "type": "material",
  "category": "wood",
  "subcategory": "premium",
  "name": "Hinoki",
  "nameJapanese": "檜",
  "pronunciation": "hee-NOH-kee",
  "description": "Premium cypress wood known for its light color, pleasant aromatic scent, and exceptional rot-resistance...",
  "properties": {
    "durability": "very-high",
    "cost": "premium",
    "workability": "easy",
    "appearance": "pale yellow to pinkish-cream with fine, straight grain"
  },
  "assets": {
    "primary": "assets/materials/woods/hinoki-sample.jpg",
    "gallery": ["assets/materials/woods/hinoki-texture-closeup.jpg"]
  },
  "usedIn": [
    "location_healer-temple",
    "location_bath-house"
  ],
  "sources": [
    "location_mori-shizuka-forests"
  ],
  "tags": ["construction", "premium", "sacred"],
  "completionPercentage": 85,
  "lastModified": "2025-10-07T14:30:00Z",
  "status": "in-progress"
}
```

**Result**: Rich, queryable entity with visual assets, relationships to temples and forests, validation, and automatic progress tracking.

---

## 🎯 Next Steps

### Immediate (Week 1-2)
- [x] Create JSON schemas for core entity types
- [x] Set up directory structure
- [x] Create validation framework
- [x] Build example entity (Hinoki)
- [ ] Install dependencies (`npm install`)
- [ ] Run validation (`npm run validate`)
- [ ] Migrate 20+ entities from glossary/markdown
- [ ] Create relationship graph

### Short-term (Week 3-4)
- [ ] Build graph generation script
- [ ] Implement progress analysis from git
- [ ] Add more material entities (metals, stones)
- [ ] Create location entities (5 provinces)
- [ ] Link materials to locations

### Medium-term (Week 5-8)
- [ ] Character entities (major NPCs)
- [ ] Faction entities (7 guilds)
- [ ] Technology entities (Whisker-Punk)
- [ ] Wiki page generator
- [ ] Asset management tools

### Long-term (Week 9+)
- [ ] MCP server implementation
- [ ] Complete migration from markdown
- [ ] Full world coverage (1000+ entities)
- [ ] Public documentation site

---

## 💡 Tips & Best Practices

### Creating Entities

1. **Start with required fields** (id, type, name, description)
2. **Add relationships gradually** as you create related entities
3. **Use consistent naming** (material_category_name pattern)
4. **Commit frequently** for better progress tracking
5. **Validate often** to catch errors early

### Asset Management

1. **Use descriptive filenames** (hinoki-sample.jpg not img001.jpg)
2. **Organize by entity type** (materials/woods/, locations/temples/)
3. **Include metadata** in asset filenames where helpful
4. **Optimize file sizes** (web-friendly JPG/PNG/SVG)
5. **Version control assets** (commit to git)

### Relationships

1. **Be explicit** about relationship types (uses, requires, contains)
2. **Document context** (why/how things relate)
3. **Maintain bidirectionality** (both entities reference each other)
4. **Use strength indicators** (required vs optional)
5. **Validate regularly** to catch broken links

### Progress Tracking

1. **Write meaningful commits** ("Add hinoki wood details" not "update")
2. **Commit complete work** (don't commit half-finished entities)
3. **Update completion%** honestly
4. **Set status appropriately** (draft, in-progress, review, complete)
5. **Track contributors** for collaboration credit

---

## 🤝 Contributing

### Workflow

1. **Create entity** using appropriate schema
2. **Add assets** to assets/ directory
3. **Create relationships** in graph.json
4. **Validate** with `npm run validate`
5. **Commit** with descriptive message
6. **Push** to shared repository

### Quality Standards

- All entities must pass schema validation
- Asset files must exist for all references
- Relationships must be bidirectional where appropriate
- Completion percentage must be honest
- No circular dependencies allowed

---

## 📚 Resources

### Documentation
- **Schemas**: See `schemas/*.schema.json` for field definitions
- **Examples**: See `data/materials/woods/hinoki.json`
- **Original Lore**: See `originals/` for source material

### External Tools
- **JSON Schema**: https://json-schema.org/
- **AJV Validator**: https://ajv.js.org/
- **GraphViz**: https://graphviz.org/ (for graph generation)
- **MCP Protocol**: https://modelcontextprotocol.io/

---

## 🎮 Game Context

This world-building system supports **The Whisker Shogunate**, an idle/life-sim game where:

- **Lost cats find home** in feudal Japan-inspired Neko-kuni
- **Isekai'd cats** transform from animals to sentient beings
- **Whisker-Punk technology** powers the society
- **Five provinces** offer diverse experiences
- **Seven guilds** provide career paths
- **Deep relationships** create meaningful connections

The knowledge base ensures:
- **Consistency** across all game content
- **Rich lore** for immersive storytelling
- **Queryable data** for dynamic content generation
- **Progress tracking** for development milestones
- **Asset integration** for visual identity

---

## 🔌 MCP Server Integration

### Overview

The system includes a **Model Context Protocol (MCP) server** that provides programmatic access to the knowledge base for AI assistants like Claude.

### Available MCP Tools

1. **`whisker_lore_search`** - Search entities by name, type, tags
2. **`whisker_get_entity`** - Retrieve complete entity data with relationships
3. **`whisker_dependency_tree`** - Build dependency visualization
4. **`whisker_create_entity`** - Create and validate new entities
5. **`whisker_get_assets`** - Query visual assets for entities
6. **`whisker_validate`** - Check system consistency

### Quick Start

```bash
# Search for materials
npm run mcp whisker_lore_search '{"type": "material"}'

# Get entity details
npm run mcp whisker_get_entity '{"entityId": "material_wood_hinoki"}'

# Validate system
npm run mcp whisker_validate '{}'
```

### Claude Desktop Integration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

**Full MCP documentation**: See [mcp-server/README.md](mcp-server/README.md)

---

## 📄 License

UNLICENSED - Private world-building project

---

**System Status**: ✅ Foundation Complete | 🔨 Active Development | 📊 4% Complete

Ready to build a world!
