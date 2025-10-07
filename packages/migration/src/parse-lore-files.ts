/**
 * Comprehensive Lore File Parser
 *
 * Extracts structured entities from markdown world-building documents
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../../..');
const ORIGINALS_DIR = join(ROOT_DIR, 'originals');
const DATA_DIR = join(ROOT_DIR, 'packages/data');

interface EntityBase {
  id: string;
  type: string;
  name: string;
  description: string;
  tags: string[];
  status: string;
  completionPercentage: number;
  lastModified: string;
  contributors: string[];
  notes: string;
}

// Parse the GLOSSARY.md file for terms
function parseGlossary(): Map<string, any> {
  const entities = new Map();
  const content = readFileSync(join(ORIGINALS_DIR, 'GLOSSARY.md'), 'utf-8');

  // Split by alphabetical sections
  const sections = content.split(/^## [A-Z]/m);

  for (const section of sections) {
    // Match glossary entries: **Term** (pronunciation) - Definition | metadata
    const entryRegex = /\*\*([^*]+)\*\*\s*(?:\(([^)]+)\))?\s*-\s*([^|]+)(?:\|(.+))?/g;

    let match;
    while ((match = entryRegex.exec(section)) !== null) {
      const [, name, pronunciation, description, metadata] = match;

      if (!name || !description) continue;

      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const tags: string[] = [];
      let entityType = 'concept'; // default type

      // Extract tags from metadata
      if (metadata) {
        const tagMatch = metadata.match(/Tags:\s*\[([^\]]+)\]/);
        if (tagMatch) {
          tags.push(...tagMatch[1].split(',').map(t => t.trim()));

          // Determine entity type from tags
          if (tags.includes('location') || tags.includes('architecture')) {
            entityType = 'location';
          } else if (tags.includes('profession')) {
            entityType = 'profession';
          } else if (tags.includes('food') || tags.includes('beverage')) {
            entityType = 'food';
          } else if (tags.includes('guild') || tags.includes('faction')) {
            entityType = 'faction';
          } else if (tags.includes('culture') || tags.includes('activity')) {
            entityType = 'culture';
          }
        }
      }

      entities.set(id, {
        id: `${entityType}_${id}`,
        type: entityType,
        name: name.trim(),
        nameJapanese: name.trim(),
        pronunciation: pronunciation?.trim() || '',
        description: description.trim(),
        tags,
        status: 'in-progress',
        completionPercentage: 50,
        lastModified: new Date().toISOString(),
        contributors: ['glossary-migration'],
        notes: 'Migrated from GLOSSARY.md'
      });
    }
  }

  return entities;
}

// Parse the 5 provinces from lore files
function parseProvinces(): any[] {
  const provinces = [];
  const content = readFileSync(join(ORIGINALS_DIR, 'whisker-shogunate-lore.md'), 'utf-8');

  // Extract each province section
  const provinceRegex = /####\s+(\d+)\.\s+([^-]+)\s+-\s+([^\n]+)\n\*\*Character:\*\*\s*([^\n]+)\n\*\*Geography:\*\*\s*([^\n]+)\n\*\*Economy:\*\*\s*([^\n]+)\n/g;

  let match;
  while ((match = provinceRegex.exec(content)) !== null) {
    const [, number, nameEn, subtitle, character, geography, economy] = match;

    const id = nameEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fullName = nameEn.trim();

    provinces.push({
      id: `location_${id}`,
      type: 'location',
      locationType: 'province',
      name: fullName,
      nameJapanese: fullName.split('(')[0].trim(),
      pronunciation: extractPronunciation(fullName),
      description: `${character} ${geography} ${economy}`.trim(),
      character,
      geography,
      economy,
      tags: ['province', 'major-location'],
      status: 'in-progress',
      completionPercentage: 70,
      lastModified: new Date().toISOString(),
      contributors: ['lore-migration'],
      notes: `Migrated from whisker-shogunate-lore.md. Province ${number}/5.`
    });
  }

  return provinces;
}

//Helper function to extract pronunciation
function extractPronunciation(text: string): string {
  const match = text.match(/\(([^)]+)\)/);
  return match ? match[1] : '';
}

// Parse the 7 major guilds
function parseGuilds(): any[] {
  const guilds = [];
  const content = readFileSync(join(ORIGINALS_DIR, 'whisker-shogunate-part3.md'), 'utf-8');

  // Find the Major Guilds section
  const guildsSection = content.match(/###\s+Major Guilds([\s\S]+?)(?=###|$)/);
  if (!guildsSection) return guilds;

  // Extract each guild
  const guildRegex = /####\s+\d+\.\s+([^\n]+)\n([^\n]+)\n\*\*Focus:\*\*\s*([^\n]+)/g;

  let match;
  while ((match = guildRegex.exec(guildsSection[1])) !== null) {
    const [, nameWithJapanese, description, focus] = match;

    const [nameEn, nameJa] = nameWithJapanese.split('(');
    const id = nameEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    guilds.push({
      id: `faction_${id}`,
      type: 'faction',
      factionType: 'guild',
      name: nameEn.trim(),
      nameJapanese: nameJa ? nameJa.replace(')', '').trim() : '',
      description: `${description.trim()} Focus: ${focus.trim()}`,
      focus: focus.trim(),
      influence: 'high',
      tags: ['guild', 'major-faction'],
      status: 'in-progress',
      completionPercentage: 60,
      lastModified: new Date().toISOString(),
      contributors: ['lore-migration'],
      notes: 'Migrated from whisker-shogunate-part3.md'
    });
  }

  return guilds;
}

// Main migration function
function migrateLoreFiles() {
  console.log('🚀 Starting comprehensive lore file migration...\n');

  // 1. Parse glossary
  console.log('📖 Parsing GLOSSARY.md...');
  const glossaryEntities = parseGlossary();
  console.log(`   Found ${glossaryEntities.size} glossary terms\n`);

  // 2. Parse provinces
  console.log('🗺️  Parsing provinces...');
  const provinces = parseProvinces();
  console.log(`   Found ${provinces.length} provinces\n`);

  // 3. Parse guilds
  console.log('⚔️  Parsing guilds...');
  const guilds = parseGuilds();
  console.log(`   Found ${guilds.length} guilds\n`);

  // Organize entities by type
  const entitiesByType: Map<string, any[]> = new Map();

  // Add glossary entities
  for (const entity of glossaryEntities.values()) {
    const type = entity.type;
    if (!entitiesByType.has(type)) {
      entitiesByType.set(type, []);
    }
    entitiesByType.get(type)!.push(entity);
  }

  // Add provinces
  for (const province of provinces) {
    if (!entitiesByType.has('location')) {
      entitiesByType.set('location', []);
    }
    entitiesByType.get('location')!.push(province);
  }

  // Add guilds
  for (const guild of guilds) {
    if (!entitiesByType.has('faction')) {
      entitiesByType.set('faction', []);
    }
    entitiesByType.get('faction')!.push(guild);
  }

  // Write entities to files
  console.log('💾 Writing entities to files...\n');
  let totalWritten = 0;

  for (const [type, entities] of entitiesByType) {
    const typeDir = join(DATA_DIR, `${type}s`);
    mkdirSync(typeDir, { recursive: true });

    for (const entity of entities) {
      const filename = `${entity.id}.json`;
      const filepath = join(typeDir, filename);
      writeFileSync(filepath, JSON.stringify(entity, null, 2));
      totalWritten++;
    }

    console.log(`   ✅ ${type}: ${entities.length} entities`);
  }

  console.log(`\n✨ Migration complete! Total entities written: ${totalWritten}`);
  console.log('\n📊 Summary by type:');
  for (const [type, entities] of entitiesByType) {
    console.log(`   - ${type}: ${entities.length}`);
  }
}

// Run migration
migrateLoreFiles();
