# The Whisker Shogunate - TODO List

**Last Updated**: 2025-10-07
**Status**: ~95% Complete - Wiki initialized, ready for deployment!

---

## 🎯 Next Session Tasks

### 1. Enable GitHub Pages & Test Deployment (~15 minutes)

**Priority**: HIGH
**Status**: Ready to deploy

**Steps**:
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main branch to trigger deployment (already done!)
4. Verify site at `https://<username>.github.io/the-whisker-shogunate`

**Note**: GitHub Actions workflows already created in `.github/workflows/`
**Wiki**: Built successfully, 30 static pages generated in `packages/wiki/out/`

### 2. Test Full CI/CD Pipeline (~30 minutes)

**Priority**: MEDIUM
**Status**: Not started

- [ ] Create a test PR to verify `ci.yml` workflow runs
- [ ] Verify build succeeds
- [ ] Verify validation runs
- [ ] Push to main and verify `deploy.yml` triggers
- [ ] Check GitHub Pages deployment

---

## ✅ Recently Completed

### Wiki Package Initialization (2025-10-07)
- [x] Initialize Next.js 15.5.4 with TypeScript and Tailwind CSS
- [x] Configure for static export (output: 'export') for GitHub Pages SPA deployment
- [x] Set basePath to '/the-whisker-shogunate' for GitHub Pages
- [x] Create homepage with progress dashboard (entity statistics)
- [x] Create browse page with searchable entity table
- [x] Create entity detail pages with dynamic routing
- [x] Add workspace dependencies (@whisker/data, @whisker/schemas, etc.)
- [x] Fix entity type field name (type vs entity_type)
- [x] Successfully build and export 30 static pages
- [x] Build time: ~1.4s with Turbopack

### Cleanup (2025-10-07)
- [x] Removed 8 outdated documentation files (MIGRATION-*.md, *-COMPLETE.md, WORLD-BUILDING-*.md)
- [x] Removed old source directories (scripts/, mcp-server/, schemas/)
- [x] Removed backup files (package.json.old, package-lock.json, .DS_Store)
- [x] Removed empty packages/graph-generator directory
- [x] Fixed .gitignore to commit pnpm-lock.yaml for reproducibility
- [x] Verified all 6 packages build successfully

---

## ✅ Previously Completed

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
| @whisker/wiki | ✅ Built | Yes - ready for deployment |

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
