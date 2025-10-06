# The Whisker Shogunate - TODO List

**Last Updated**: 2025-10-07
**Status**: ~80% Complete - TypeScript conversion done, Wiki pending

---

## 🎯 Next Session Tasks

### 1. Initialize Next.js Wiki Package (~3 hours)

**Priority**: HIGH
**Status**: Not started

```bash
cd packages/wiki
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir
```

**Configuration needed** (`next.config.js`):
```js
module.exports = {
  output: 'export',
  basePath: '/the-whisker-shogunate',
  images: { unoptimized: true }
}
```

**Pages to create**:
- [ ] `app/page.tsx` - Progress dashboard homepage
- [ ] `app/browse/page.tsx` - Entity browser with filters
- [ ] `app/entities/[type]/[id]/page.tsx` - Individual entity detail pages
- [ ] `app/stats/page.tsx` - Analytics and progress charts

**Components to build**:
- [ ] `ProgressDashboard.tsx` - Completion metrics, charts, velocity tracking
- [ ] `EntityCard.tsx` - Preview card for entities
- [ ] `EntityBrowser.tsx` - Filterable table of all entities
- [ ] `DependencyGraph.tsx` - D3.js relationship visualization (optional for v1)

**Data integration**:
- [ ] Import from `@whisker/data` package
- [ ] Use `@whisker/analytics` for progress metrics
- [ ] Display validation results from `@whisker/validation`

### 2. Enable GitHub Pages (~5 minutes)

**Priority**: HIGH
**Status**: Not started

**Steps**:
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main branch to trigger deployment
4. Verify site at `https://<username>.github.io/the-whisker-shogunate`

**Note**: GitHub Actions workflows already created in `.github/workflows/`

### 3. Test Full CI/CD Pipeline (~30 minutes)

**Priority**: MEDIUM
**Status**: Not started

- [ ] Create a test PR to verify `ci.yml` workflow runs
- [ ] Verify build succeeds
- [ ] Verify validation runs
- [ ] Push to main and verify `deploy.yml` triggers
- [ ] Check GitHub Pages deployment

---

## ✅ Recently Completed

### Phase 4: TypeScript Conversion (2025-10-07)
- [x] Convert @whisker/validation to TypeScript
- [x] Convert @whisker/analytics to TypeScript
- [x] Convert @whisker/migration to TypeScript
- [x] Convert @whisker/mcp-server to TypeScript
- [x] Fix import attributes (assert → with) for Node 20
- [x] Update turbo.json for Turbo v2 (pipeline → tasks)
- [x] Build all 6 packages successfully
- [x] Test validation script (24/24 entities pass)
- [x] Commit and document changes

### Phase 3: Package Structure (2025-10-07)
- [x] Create all 7 package directories
- [x] Copy scripts to appropriate packages
- [x] Install pnpm dependencies
- [x] Create GitHub Actions workflows
- [x] Document migration status

### Phase 2: Data Migration (2025-10-07)
- [x] Create @whisker/data package with 24 entities
- [x] Create loader functions
- [x] Set up package dependencies

### Phase 1: Workspace Foundation (2025-10-07)
- [x] Set up pnpm workspace
- [x] Configure Turborepo
- [x] Create @whisker/schemas package
- [x] Set up .gitignore for monorepo

---

## 📦 Current Package Status

| Package | Status | Ready to Use |
|---------|--------|--------------|
| @whisker/schemas | ✅ Built | Yes |
| @whisker/data | ✅ Built | Yes |
| @whisker/validation | ✅ Built | Yes |
| @whisker/analytics | ✅ Built | Yes |
| @whisker/migration | ✅ Built | Yes |
| @whisker/mcp-server | ✅ Built | Yes |
| @whisker/wiki | ⏳ Empty | No - needs Next.js init |

---

## 🔧 Working Commands

### Build Commands
```bash
pnpm install              # Install all dependencies
pnpm build                # Build all packages (Turbo cached)
pnpm dev                  # Watch mode for development
```

### Package-Specific Commands
```bash
pnpm --filter @whisker/schemas build
pnpm --filter @whisker/data build
pnpm --filter @whisker/validation build
pnpm --filter @whisker/analytics build
pnpm --filter @whisker/migration build
pnpm --filter @whisker/mcp-server build
```

### Validation & Analysis
```bash
node packages/validation/dist/validate.js          # Validate all entities
node packages/validation/dist/check-consistency.js # Check for contradictions
node packages/validation/dist/check-assets.js      # Asset tracking
node packages/analytics/dist/index.js              # Progress analytics
```

### Future Commands (after wiki init)
```bash
pnpm wiki:dev             # Start Next.js dev server
pnpm wiki:export          # Build static site for GitHub Pages
```

---

## 🐛 Known Issues

### None Currently!
All packages building successfully. Validation working. CI/CD workflows created.

---

## 🎯 Long-term Roadmap

### After Wiki Launch
- [ ] Add more entities from original markdown files (currently 24, target ~100+)
- [ ] Create relationship graph (relationships/graph.json)
- [ ] Add visual assets (images, diagrams, concept art)
- [ ] Create character entities for major NPCs
- [ ] Create location entities for all 5 provinces
- [ ] Add faction/guild entities

### Future Packages
- [ ] `apps/game` - The actual idle game
- [ ] `apps/character-builder` - Character creation tool
- [ ] `@whisker/game-engine` - Shared game logic
- [ ] `@whisker/ui-components` - Reusable React components

---

## 📚 Reference Documents

- `MIGRATION-COMPLETE.md` - Comprehensive migration status and guides
- `CLAUDE.md` - Project instructions for Claude Code
- `originals/*.md` - Source world-building documents
- `.github/workflows/` - CI/CD pipeline definitions

---

## 💡 Quick Start for Next Session

```bash
# 1. Pull latest changes
git pull origin main

# 2. Verify everything still builds
pnpm build

# 3. Initialize wiki package
cd packages/wiki
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir

# 4. Configure for GitHub Pages (see next.config.js above)

# 5. Start developing
pnpm dev
```

---

## ✨ Success Criteria

**Wiki v1 is complete when**:
- [ ] Homepage shows progress dashboard (% complete, entity counts, recent updates)
- [ ] Entity browser page lists all 24 entities with filtering
- [ ] Individual entity pages render full JSON data in readable format
- [ ] Static export works (`pnpm wiki:export` creates `out/` directory)
- [ ] GitHub Pages deployment successful
- [ ] Site accessible at GitHub Pages URL

---

**Current Status**: Infrastructure complete, ready for UI development! 🚀
