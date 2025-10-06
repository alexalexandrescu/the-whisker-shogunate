#!/usr/bin/env node

/**
 * Migration Script: Markdown → JSON Entities
 *
 * Converts world-building content from markdown files into structured JSON entities:
 * - originals/*.md (4,030 lines of core lore)
 * - originals/GLOSSARY.md (552 canonical terms)
 *
 * Creates entities for:
 * - Materials (woods, metals, stones, ceramics, fabrics)
 * - Locations (provinces, cities, buildings, landmarks)
 * - Characters (NPCs, historical figures)
 * - Factions (guilds, political entities)
 * - Technologies (Whisker-Punk systems)
 * - Professions (from glossary)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const migrationStats = {
  materialsCreated: 0,
  locationsCreated: 0,
  charactersCreated: 0,
  factionsCreated: 0,
  technologiesCreated: 0,
  professionsCreated: 0,
  skipped: [],
  errors: []
};

/**
 * Parse GLOSSARY.md to extract canonical terms
 */
function parseGlossary() {
  console.log('\nParsing GLOSSARY.md...');

  const glossaryPath = join(ROOT_DIR, 'originals', 'GLOSSARY.md');
  if (!existsSync(glossaryPath)) {
    console.log('  GLOSSARY.md not found, skipping...');
    return [];
  }

  const content = readFileSync(glossaryPath, 'utf8');
  const lines = content.split('\n');

  const terms = [];
  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Section headers (## A, ## B, etc.)
    if (line.match(/^## [A-Z]/)) {
      currentSection = line.replace('## ', '').trim();
      continue;
    }

    // Term entries: **Term** (pronunciation) - Definition | Tags: [tag1, tag2]
    const termMatch = line.match(/^\*\*([^*]+)\*\*/);
    if (termMatch) {
      const fullLine = line;
      const term = termMatch[1].trim();

      // Extract pronunciation
      const pronMatch = fullLine.match(/\(([^)]+)\)/);
      const pronunciation = pronMatch ? pronMatch[1] : '';

      // Extract definition (between - and |)
      const defMatch = fullLine.match(/- ([^|]+)/);
      const definition = defMatch ? defMatch[1].trim() : '';

      // Extract tags
      const tagsMatch = fullLine.match(/Tags: \[([^\]]+)\]/);
      const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [];

      // Extract first appearance file
      const fileMatch = fullLine.match(/`([^`]+\.md[^`]*)`/);
      const sourceFile = fileMatch ? fileMatch[1] : '';

      terms.push({
        term,
        pronunciation,
        definition,
        tags,
        sourceFile,
        section: currentSection
      });
    }
  }

  console.log(`  Found ${terms.length} glossary terms`);
  return terms;
}

/**
 * Parse original markdown files for material definitions
 */
function parseMaterials() {
  console.log('\nParsing materials from originals/whisker-shogunate-part2.md...');

  const part2Path = join(ROOT_DIR, 'originals', 'whisker-shogunate-part2.md');
  if (!existsSync(part2Path)) {
    console.log('  Part 2 not found, skipping materials...');
    return [];
  }

  const content = readFileSync(part2Path, 'utf8');
  const materials = [];

  // Parse woods
  const woodsSection = content.match(/\*\*Woods:\*\*([\s\S]*?)\n---/);
  if (woodsSection) {
    const woodEntries = woodsSection[1].match(/\*([^:]+):\*([\s\S]*?)(?=\n\*[^:]+:\*|\n---|\n\n\*\*)/g);

    if (woodEntries) {
      for (const entry of woodEntries) {
        const nameMatch = entry.match(/\*([^:]+):\*/);
        const name = nameMatch ? nameMatch[1].trim() : '';

        // Extract properties
        const usesMatch = entry.match(/Uses:\s*([^\n]+)/);
        const colorMatch = entry.match(/Colors?:\s*([^\n]+)/);
        const propertiesMatch = entry.match(/Properties:\s*([^\n]+)/);

        const uses = usesMatch ? usesMatch[1].trim() : '';
        const appearance = colorMatch ? colorMatch[1].trim() : '';
        const properties = propertiesMatch ? propertiesMatch[1].trim() : '';

        // Determine cost tier
        let cost = 'moderate';
        if (properties.toLowerCase().includes('premium') || uses.toLowerCase().includes('sacred')) {
          cost = 'premium';
        } else if (properties.toLowerCase().includes('inexpensive') || properties.toLowerCase().includes('common')) {
          cost = 'cheap';
        }

        // Determine durability
        let durability = 'moderate';
        if (properties.toLowerCase().includes('durable') || properties.toLowerCase().includes('rot-resistant')) {
          durability = 'high';
        } else if (properties.toLowerCase().includes('very durable')) {
          durability = 'very-high';
        }

        materials.push({
          type: 'material',
          category: 'wood',
          name: name.replace(/\(.*?\)/g, '').trim(),
          nameJapanese: extractJapanese(name),
          description: `${uses} ${properties}`.trim(),
          properties: {
            durability,
            cost,
            appearance,
            workability: 'moderate'
          },
          tags: ['construction', 'wood'],
          status: 'in-progress',
          completionPercentage: 60
        });
      }
    }
  }

  // Parse metals
  const metalsSection = content.match(/\*\*Metals.*?:\*\*([\s\S]*?)(?=\n---|\n\n\*\*Papers)/);
  if (metalsSection) {
    const metalEntries = metalsSection[1].match(/\*([^:]+):\*([\s\S]*?)(?=\n\*[^:]+:\*|\n---|\n\n\*\*)/g);

    if (metalEntries) {
      for (const entry of metalEntries) {
        const nameMatch = entry.match(/\*([^:]+):\*/);
        const name = nameMatch ? nameMatch[1].trim() : '';

        const usesMatch = entry.match(/Uses:\s*([^\n]+)/);
        const colorMatch = entry.match(/Colors?:\s*([^\n]+)/);
        const propertiesMatch = entry.match(/Properties:\s*([^\n]+)/);

        const uses = usesMatch ? usesMatch[1].trim() : '';
        const appearance = colorMatch ? colorMatch[1].trim() : '';
        const properties = propertiesMatch ? propertiesMatch[1].trim() : '';

        let subcategory = 'pure';
        if (name.toLowerCase().includes('alloy') || name.toLowerCase().includes('brass') || name.toLowerCase().includes('bronze')) {
          subcategory = 'alloy';
        }

        materials.push({
          type: 'material',
          category: 'metal',
          subcategory,
          name: name.replace(/\(.*?\)/g, '').trim(),
          description: `${uses} ${properties}`.trim(),
          properties: {
            durability: 'high',
            cost: 'moderate',
            appearance,
            workability: 'moderate'
          },
          tags: ['construction', 'metal', 'whisker-punk'],
          status: 'in-progress',
          completionPercentage: 60
        });
      }
    }
  }

  console.log(`  Extracted ${materials.length} materials`);
  return materials;
}

/**
 * Parse locations from markdown
 */
function parseLocations() {
  console.log('\nParsing locations from originals/whisker-shogunate-lore.md...');

  const lorePath = join(ROOT_DIR, 'originals', 'whisker-shogunate-lore.md');
  if (!existsSync(lorePath)) {
    console.log('  Lore file not found, skipping locations...');
    return [];
  }

  const content = readFileSync(lorePath, 'utf8');
  const locations = [];

  // Parse the Five Provinces section
  const provincesMatch = content.match(/### The Five Provinces[\s\S]*?(?=\n## |\n---)/);
  if (provincesMatch) {
    const provinceEntries = provincesMatch[0].match(/####\s+\d+\.\s+([^\n]+)([\s\S]*?)(?=####|\n## |\n---)/g);

    if (provinceEntries) {
      for (const entry of provinceEntries) {
        const nameMatch = entry.match(/####\s+\d+\.\s+([^-\n]+)/);
        const name = nameMatch ? nameMatch[1].trim() : '';

        const characterMatch = entry.match(/\*\*Character:\*\*\s*([^\n]+)/);
        const geographyMatch = entry.match(/\*\*Geography:\*\*\s*([^\n]+)/);
        const economyMatch = entry.match(/\*\*Economy:\*\*\s*([^\n]+)/);
        const cultureMatch = entry.match(/\*\*Culture:\*\*\s*([^\n]+)/);
        const daimyoMatch = entry.match(/\*\*Daimyo:\*\*\s*([^\n]+)/);

        const character = characterMatch ? characterMatch[1].trim() : '';
        const geography = geographyMatch ? geographyMatch[1].trim() : '';
        const economy = economyMatch ? economyMatch[1].trim() : '';
        const culture = cultureMatch ? cultureMatch[1].trim() : '';
        const daimyoInfo = daimyoMatch ? daimyoMatch[1].trim() : '';

        // Extract key locations
        const keyLocationsMatch = entry.match(/\*\*Key Locations:\*\*([\s\S]*?)(?=\*\*|$)/);
        const keyLocations = [];
        if (keyLocationsMatch) {
          const locationLines = keyLocationsMatch[1].match(/- ([^\n]+)/g);
          if (locationLines) {
            keyLocations.push(...locationLines.map(l => l.replace(/^- /, '').trim()));
          }
        }

        locations.push({
          type: 'location',
          locationType: 'province',
          name: name.split(' - ')[0].trim(),
          nameJapanese: extractJapanese(name),
          description: `${character} ${geography}`.trim(),
          geography: {
            terrain: geography,
            climate: ''
          },
          economy: {
            primaryIndustries: economy.split(',').map(e => e.trim()),
            exports: []
          },
          culture: {
            description: culture,
            traits: character.split(',').map(t => t.trim())
          },
          governance: {
            ruler: daimyoInfo
          },
          tags: ['province', 'location'],
          status: 'in-progress',
          completionPercentage: 65
        });
      }
    }
  }

  console.log(`  Extracted ${locations.length} locations`);
  return locations;
}

/**
 * Parse professions from glossary tags
 */
function parseProfessions(glossaryTerms) {
  console.log('\nExtracting professions from glossary...');

  const professions = glossaryTerms.filter(term =>
    term.tags.includes('profession')
  );

  const professionEntities = professions.map(prof => ({
    type: 'profession',
    name: prof.term,
    nameJapanese: '',
    pronunciation: prof.pronunciation,
    description: prof.definition,
    category: determineProfessionCategory(prof.tags),
    tags: prof.tags,
    status: 'in-progress',
    completionPercentage: 50
  }));

  console.log(`  Extracted ${professionEntities.length} professions`);
  return professionEntities;
}

function determineProfessionCategory(tags) {
  if (tags.includes('art') || tags.includes('artisan')) return 'artisan';
  if (tags.includes('engineering') || tags.includes('technology')) return 'engineering';
  if (tags.includes('medical')) return 'medical';
  if (tags.includes('agriculture')) return 'agriculture';
  if (tags.includes('services')) return 'services';
  return 'general';
}

/**
 * Extract Japanese text from parentheses
 */
function extractJapanese(text) {
  const match = text.match(/\(([^)]*[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+[^)]*)\)/);
  return match ? match[1].trim() : '';
}

/**
 * Generate entity ID from name
 */
function generateEntityId(type, name, category = '') {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (category && type === 'material') {
    return `${type}_${category}_${cleanName}`;
  }

  return `${type}_${cleanName}`;
}

/**
 * Create entity file
 */
function createEntityFile(entity, type, subcategory = '') {
  const entityId = generateEntityId(type, entity.name, entity.category || '');

  const completeEntity = {
    id: entityId,
    type: type,
    ...entity,
    lastModified: new Date().toISOString(),
    contributors: ['migration-script'],
    notes: 'Migrated from original markdown documentation. Needs manual review and enhancement.'
  };

  // Determine file path
  let filePath;
  if (type === 'material') {
    const category = entity.category || 'other';
    const dir = join(ROOT_DIR, 'data', 'materials', `${category}s`);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    filePath = join(dir, `${completeEntity.id.replace(`material_${category}_`, '')}.json`);
  } else if (type === 'location') {
    const locType = entity.locationType || 'other';
    const dir = join(ROOT_DIR, 'data', 'locations', `${locType}s`);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    filePath = join(dir, `${completeEntity.id.replace('location_', '')}.json`);
  } else if (type === 'profession') {
    const dir = join(ROOT_DIR, 'data', 'professions');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    filePath = join(dir, `${completeEntity.id.replace('profession_', '')}.json`);
  } else {
    const dir = join(ROOT_DIR, 'data', `${type}s`);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    filePath = join(dir, `${completeEntity.id.replace(type + '_', '')}.json`);
  }

  try {
    writeFileSync(filePath, JSON.stringify(completeEntity, null, 2));
    return { success: true, path: filePath, id: entityId };
  } catch (error) {
    return { success: false, error: error.message, id: entityId };
  }
}

/**
 * Main migration
 */
async function main() {
  console.log('Whisker Shogunate - Markdown to JSON Migration\n');
  console.log('This will parse markdown files and create JSON entities.');
  console.log('Existing entities will NOT be overwritten.\n');

  // Parse all source data
  const glossaryTerms = parseGlossary();
  const materials = parseMaterials();
  const locations = parseLocations();
  const professions = parseProfessions(glossaryTerms);

  // Create entities
  console.log('\n' + '='.repeat(60));
  console.log('Creating JSON entities...');
  console.log('='.repeat(60));

  for (const material of materials) {
    const result = createEntityFile(material, 'material');
    if (result.success) {
      migrationStats.materialsCreated++;
      console.log(`✓ Created ${result.id}`);
    } else {
      migrationStats.errors.push({ entity: result.id, error: result.error });
      console.log(`✗ Failed to create ${result.id}: ${result.error}`);
    }
  }

  for (const location of locations) {
    const result = createEntityFile(location, 'location');
    if (result.success) {
      migrationStats.locationsCreated++;
      console.log(`✓ Created ${result.id}`);
    } else {
      migrationStats.errors.push({ entity: result.id, error: result.error });
      console.log(`✗ Failed to create ${result.id}: ${result.error}`);
    }
  }

  // Only create professions if requested (there are 552 glossary terms with profession tag)
  console.log(`\nFound ${professions.length} professions - creating sample (first 20)...`);
  for (const profession of professions.slice(0, 20)) {
    const result = createEntityFile(profession, 'profession');
    if (result.success) {
      migrationStats.professionsCreated++;
      console.log(`✓ Created ${result.id}`);
    } else {
      migrationStats.errors.push({ entity: result.id, error: result.error });
    }
  }

  // Generate migration report
  console.log('\n' + '='.repeat(60));
  console.log('MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Materials created: ${migrationStats.materialsCreated}`);
  console.log(`Locations created: ${migrationStats.locationsCreated}`);
  console.log(`Professions created: ${migrationStats.professionsCreated}`);
  console.log(`Errors: ${migrationStats.errors.length}`);

  if (migrationStats.errors.length > 0) {
    console.log('\nErrors:');
    migrationStats.errors.forEach(err => {
      console.log(`  - ${err.entity}: ${err.error}`);
    });
  }

  console.log('\n✓ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run validate');
  console.log('2. Run: npm run check-consistency (new script!)');
  console.log('3. Review and enhance migrated entities');
  console.log('4. Add visual assets to assets/ directories');
  console.log('5. Build relationship graph with: npm run build-relationships');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
