# MCP Server Development Guide

## Quick Start

```bash
# Install dependencies
pnpm install

# Build the server
pnpm build

# Run validation tests
pnpm validate

# Start watch mode for development
pnpm watch
```

## Development Workflow

### 1. Watch Mode (Recommended)

Run TypeScript compiler in watch mode to automatically rebuild on changes:

```bash
pnpm watch
```

This will:
- Watch for changes in `src/` directory
- Automatically recompile TypeScript
- Output to `dist/` directory

### 2. Testing Changes

After making changes to the server code:

```bash
# Rebuild
pnpm build

# Validate all tools work
pnpm validate

# Test specific tool via CLI
pnpm test
```

### 3. Restarting MCP Server in Claude Code

When you make changes to the MCP server, Claude Code needs to reconnect:

**Option A: Reload Window (Recommended)**
- In Claude Code, use Command Palette: "Developer: Reload Window"
- Or restart Claude Code entirely

**Option B: Manually Restart MCP**
```bash
# Remove and re-add the server
claude mcp remove whisker-lore -s local
claude mcp add whisker-lore node packages/mcp-server/dist/server.js

# Check status
claude mcp list
```

### 4. Validation Script

The validation script tests all MCP tools:

```bash
pnpm validate
```

Tests include:
- ✓ List entity types
- ✓ Search entities by query
- ✓ Get entity by ID
- ✓ Search by type
- ✓ Search by tags
- ✓ Data validation
- ✓ Create/Read/Delete cycle

### 5. Adding New Tools

1. **Add tool function** in `src/index.ts`:
   ```typescript
   export async function myNewTool(params: any) {
     // Implementation
     return { result: 'data' };
   }
   ```

2. **Register in mcpTools** object:
   ```typescript
   export const mcpTools = {
     // ... existing tools
     whisker_my_new_tool: myNewTool
   };
   ```

3. **Add MCP protocol handler** in `src/server.ts`:
   ```typescript
   {
     name: 'whisker_my_new_tool',
     description: 'What this tool does',
     inputSchema: {
       type: 'object',
       properties: {
         param1: { type: 'string', description: 'Description' }
       },
       required: ['param1']
     }
   }
   ```

4. **Add test** in `scripts/validate-tools.js`

5. **Rebuild and test**:
   ```bash
   pnpm build
   pnpm validate
   ```

## Architecture

```
src/
├── index.ts      # CRUD functions and business logic
├── server.ts     # MCP protocol wrapper (stdio transport)
└── types.ts      # TypeScript type definitions (future)

scripts/
└── validate-tools.js  # Integration tests

dist/             # Compiled JavaScript (gitignored)
```

## Common Issues

### MCP Server Not Connecting

```bash
# Check if it's running
claude mcp list

# Should show: ✓ Connected

# If not, check the path
cat ~/.claude.json | jq '.projects["/Users/alex/Projects/the-whisker-shogunate"].mcpServers'

# Ensure it points to: packages/mcp-server/dist/server.js
```

### Schema Validation Errors

All entities must match their JSON schemas in `@whisker/schemas`. Check:

```bash
# View food schema
cat packages/schemas/src/food.schema.json

# Common required fields:
# - id, type, name, description, tags (all entities)
# - foodType (food entities)
# - locationType (location entities)
# - category (materials, professions)
```

### Cache Issues

The MCP server caches loaded entities. If data seems stale:

1. Restart the MCP server (reload Claude Code window)
2. Or clear cache programmatically (cache is invalidated on writes)

## Performance Tips

- **Watch mode**: Use `pnpm watch` during active development
- **Validation**: Run `pnpm validate` before commits
- **Build time**: ~1-2 seconds for incremental builds
- **Test time**: ~500ms for full validation suite

## Environment Variables

None required for local development. The server auto-detects:
- Project root: `ROOT_DIR = join(__dirname, '../../..')`
- Data directory: `packages/data/`
- Schemas: `@whisker/schemas`

## Debugging

Enable detailed logging:

```javascript
// In src/server.ts, after server.connect():
console.error('MCP Server debugging enabled');
console.error('Tools loaded:', Object.keys(mcpTools));
```

View Claude Code logs:
```bash
# Location varies by OS
tail -f ~/Library/Logs/Claude\ Code/main.log
```

## Production Deployment

This MCP server is designed for local development only. For production:

1. Use HTTP-based MCP server with authentication
2. Add rate limiting
3. Add audit logging
4. Use read-only mode for wiki access

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Claude Code MCP Guide](https://docs.claude.com/en/docs/claude-code/mcp)
- [MCP SDK Reference](https://github.com/modelcontextprotocol/sdk)
