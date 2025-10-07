/**
 * Extract major NPC characters (Shogun, Daimyo, notable figures)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../../..');
const DATA_DIR = join(ROOT_DIR, 'packages/data');

const characters = [
  {
    id: 'character_tora-the-scarred',
    type: 'character',
    name: 'Tora the Scarred',
    nameJapanese: 'Tora',
    pronunciation: 'TOH-rah',
    description: 'The current Neko-Shogun (Cat Shogun). An isekai\'d tabby cat who arrived 50 years ago and rose through military ranks during the Territorial Wars. United the provinces through military prowess and political skill. Now aging (75 in human years equivalent), succession uncertain.',
    title: 'Neko-Shogun',
    species: 'Cat (tabby)',
    origin: 'Isekai\'d (arrived 50 years ago)',
    age: '75 (human years equivalent)',
    residence: 'location_shiro-tsume',
    role: 'Supreme military and political leader of the Whisker Shogunate',
    personality: 'Strategic, battle-hardened, politically skilled, aging but still sharp',
    tags: ['npc', 'major-character', 'political-leader', 'military', 'shogun'],
    status: 'in-progress',
    completionPercentage: 50,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration'],
    notes: 'Extracted from whisker-shogunate-lore.md. Current ruler, succession crisis looming.'
  },
  {
    id: 'character_lady-shiro',
    type: 'character',
    name: 'Lady Shiro',
    nameJapanese: 'Shiro-sama',
    pronunciation: 'SHEE-roh-SAH-mah',
    description: 'Daimyo of Higashi-hama province. White Persian cat, native-born, compassionate ruler who oversees the Landing Province and welcomes all newcomers.',
    title: 'Daimyo of Higashi-hama',
    species: 'Cat (white Persian)',
    origin: 'Native-born',
    residence: 'location_higashi-hama',
    role: 'Provincial ruler, oversees immigration and newcomer integration',
    personality: 'Compassionate, welcoming, diplomatic',
    tags: ['npc', 'major-character', 'political-leader', 'daimyo'],
    status: 'in-progress',
    completionPercentage: 40,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration'],
    notes: 'Extracted from whisker-shogunate-lore.md. Daimyo 1/5.'
  },
  {
    id: 'character_lord-tanuki',
    type: 'character',
    name: 'Lord Tanuki',
    nameJapanese: 'Tanuki-dono',
    pronunciation: 'tah-NOO-kee-DOH-noh',
    description: 'Daimyo of Kawa-no-kuni province. Tabby cat, native-born, traditional ruler who values hard work and community.',
    title: 'Daimyo of Kawa-no-kuni',
    species: 'Cat (tabby)',
    origin: 'Native-born',
    residence: 'location_kawa-no-kuni',
    role: 'Provincial ruler, agricultural heartland administrator',
    personality: 'Traditional, conservative, values community and hard work',
    tags: ['npc', 'major-character', 'political-leader', 'daimyo'],
    status: 'in-progress',
    completionPercentage: 35,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration'],
    notes: 'Extracted from whisker-shogunate-lore.md. Daimyo 2/5.'
  },
  {
    id: 'character_lord-tetsu',
    type: 'character',
    name: 'Lord Tetsu',
    nameJapanese: 'Tetsu-dono',
    pronunciation: 'TEH-tsoo-DOH-noh',
    description: 'Daimyo of Yama-takumi province. Gray shorthair cat, isekai\'d (arrived 30 years ago), progressive ruler who champions innovation and meritocracy.',
    title: 'Daimyo of Yama-takumi',
    species: 'Cat (gray shorthair)',
    origin: 'Isekai\'d (arrived 30 years ago)',
    residence: 'location_yama-takumi',
    role: 'Provincial ruler, industrial and engineering hub administrator',
    personality: 'Progressive, innovative, meritocratic, direct',
    tags: ['npc', 'major-character', 'political-leader', 'daimyo'],
    status: 'in-progress',
    completionPercentage: 35,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration'],
    notes: 'Extracted from whisker-shogunate-lore.md. Daimyo 3/5.'
  },
  {
    id: 'character_the-silent-one',
    type: 'character',
    name: 'The Silent One',
    nameJapanese: 'Shizuka-sama',
    pronunciation: 'shee-ZOO-kah-SAH-mah',
    description: 'Daimyo of Mori-shizuka province. Black cat, native-born, mysterious ruler who oversees the spiritual and medical center.',
    title: 'Daimyo of Mori-shizuka',
    species: 'Cat (black)',
    origin: 'Native-born',
    residence: 'location_mori-shizuka',
    role: 'Provincial ruler, spiritual and medical center administrator',
    personality: 'Mysterious, contemplative, spiritual, enigmatic',
    tags: ['npc', 'major-character', 'political-leader', 'daimyo', 'mysterious'],
    status: 'in-progress',
    completionPercentage: 20,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration'],
    notes: 'Extracted from whisker-shogunate-lore.md. Daimyo 4/5. Least is known about this character.'
  },
  {
    id: 'character_lady-koban',
    type: 'character',
    name: 'Lady Koban',
    nameJapanese: 'Koban-sama',
    pronunciation: 'KOH-bahn-SAH-mah',
    description: 'Daimyo of Minato-kassei province. Calico cat, isekai\'d (arrived 15 years ago), shrewd merchant-ruler who oversees the trade capital.',
    title: 'Daimyo of Minato-kassei',
    species: 'Cat (calico)',
    origin: 'Isekai\'d (arrived 15 years ago)',
    residence: 'location_minato-kassei',
    role: 'Provincial ruler, trade capital administrator',
    personality: 'Shrewd, politically savvy, business-minded, sophisticated',
    tags: ['npc', 'major-character', 'political-leader', 'daimyo', 'merchant'],
    status: 'in-progress',
    completionPercentage: 30,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration'],
    notes: 'Extracted from whisker-shogunate-lore.md. Daimyo 5/5.'
  }
];

// Write characters to files
const charactersDir = join(DATA_DIR, 'characters');
mkdirSync(charactersDir, { recursive: true});

console.log('👥 Writing major NPCs...\n');

for (const character of characters) {
  const filepath = join(charactersDir, `${character.id}.json`);
  writeFileSync(filepath, JSON.stringify(character, null, 2));
  console.log(`   ✅ ${character.name} (${character.title})`);
}

console.log('\n✨ Characters extraction complete!');
console.log(`   Total: ${characters.length} major characters (Shogun + 5 Daimyo)`);
