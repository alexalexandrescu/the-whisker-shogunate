/**
 * Extract the 5 provinces with full details from lore files
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../../..');
const DATA_DIR = join(ROOT_DIR, 'packages/data');

const provinces = [
  {
    id: 'location_higashi-hama',
    type: 'location',
    locationType: 'province',
    name: 'Higashi-hama',
    nameJapanese: 'Higashi-hama',
    pronunciation: 'hee-GAH-shee-HAH-mah',
    description: 'The Landing Province - Transitional, hopeful, bustling with newcomers. Coastal region with beaches, cliffs, and the iconic Great Torii Gate. Economy based on immigration services, basic trade, fishing, and hospitality.',
    character: 'Transitional, hopeful, bustling with newcomers',
    geography: 'Coastal region with beaches, cliffs, and the iconic Great Torii Gate',
    economy: 'Immigration services, basic trade, fishing, hospitality',
    culture: 'Most diverse, accepting, focused on helping newcomers adapt. Speech is welcoming and fast-paced.',
    daimyo: 'Lady Shiro - white Persian, native-born, compassionate',
    keyLocations: [
      'The Great Torii Gate - Arrival point for all isekai\'d cats',
      'The Welcome Halls - Processing and orientation centers',
      'Naga-ya Districts - Shared housing communities for newcomers',
      'The Fisherman\'s Wharf - Major fishing port',
      'Rice Terraces - Stepped paddies in the valleys'
    ],
    childLocations: [],
    tags: ['province', 'coastal', 'landing-zone', 'diverse', 'major-location'],
    status: 'in-progress',
    completionPercentage: 85,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-lore.md. Province 1/5. Entry point for all isekai\'d cats.'
  },
  {
    id: 'location_kawa-no-kuni',
    type: 'location',
    locationType: 'province',
    name: 'Kawa-no-kuni',
    nameJapanese: 'Kawa-no-kuni',
    pronunciation: 'KAH-wah-noh-KOO-nee',
    description: 'River Country - Agricultural Heartland. Traditional, peaceful, conservative province with vast river networks, fertile plains, and gentle hills. Economy based on farming (rice, vegetables), tea plantations, and traditional crafts.',
    character: 'Traditional, peaceful, conservative',
    geography: 'Vast river networks, fertile plains, gentle hills',
    economy: 'Farming (rice, vegetables), tea plantations, traditional crafts',
    culture: 'Most traditional, values hard work and community, suspicious of rapid change. Slow, polite speech patterns.',
    daimyo: 'Lord Tanuki - tabby, native-born, traditional',
    keyLocations: [
      'The Thousand Bridges - Ancient stone bridges crossing the rivers',
      'Tea Master\'s Valley - Premium tea growing region',
      'Village of Wheels - Water wheel manufacturing center',
      'The Granary Fortress - Massive food storage complex'
    ],
    childLocations: [],
    tags: ['province', 'agricultural', 'traditional', 'conservative', 'major-location'],
    status: 'in-progress',
    completionPercentage: 70,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-lore.md. Province 2/5. Agricultural heartland.'
  },
  {
    id: 'location_yama-takumi',
    type: 'location',
    locationType: 'province',
    name: 'Yama-takumi',
    nameJapanese: 'Yama-takumi',
    pronunciation: 'YAH-mah-tah-KOO-mee',
    description: 'Mountain Forge - Industrial Province. Innovative, ambitious, industrious province with mountain ranges, deep forests, and mineral-rich caves. Economy based on mining, manufacturing, engineering, and innovation.',
    character: 'Innovative, ambitious, industrious',
    geography: 'Mountain ranges, deep forests, mineral-rich caves',
    economy: 'Mining, manufacturing, engineering, innovation',
    culture: 'Meritocratic, values innovation and skill, somewhat elitist. Direct, efficient speech.',
    daimyo: 'Lord Tetsu - gray shorthair, isekai\'d (30 years), progressive',
    keyLocations: [
      'The Copper Peaks - Primary mining region',
      'Gear City - Largest manufacturing center',
      'The Engineer Academies - Technical universities',
      'The Great Workshops - Massive factory complexes',
      'Steam Vents - Natural geothermal power sources'
    ],
    childLocations: [],
    tags: ['province', 'industrial', 'innovative', 'engineering', 'major-location'],
    status: 'in-progress',
    completionPercentage: 65,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-lore.md. Province 3/5. Engineering and innovation hub.'
  },
  {
    id: 'location_mori-shizuka',
    type: 'location',
    locationType: 'province',
    name: 'Mori-shizuka',
    nameJapanese: 'Mori-shizuka',
    pronunciation: 'MOH-ree-shee-ZOO-kah',
    description: 'Silent Forest - Spiritual Center. Contemplative, ancient, mysterious province with ancient forests, hidden glades, and mountain temples. Economy based on medicine, education, spiritual services, and rare herbs.',
    character: 'Contemplative, ancient, mysterious',
    geography: 'Ancient forests, hidden glades, mountain temples',
    economy: 'Medicine, education, spiritual services, rare herbs',
    culture: 'Intellectual, spiritual, focused on knowledge and healing. Soft, contemplative speech.',
    daimyo: 'The Silent One - black cat, native-born, mysterious',
    keyLocations: [
      'The Healer Temples (Byōin-dera) - Medical centers and schools',
      'The Philosopher\'s Grove - Academic institutions',
      'The Meditation Peaks - Mountaintop monasteries',
      'The Rare Garden - Medicinal plant cultivation',
      'The Archive of Whiskers - Historical library'
    ],
    childLocations: [],
    tags: ['province', 'spiritual', 'medical', 'academic', 'mysterious', 'major-location'],
    status: 'in-progress',
    completionPercentage: 60,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-lore.md. Province 4/5. Spiritual and medical center.'
  },
  {
    id: 'location_minato-kassei',
    type: 'location',
    locationType: 'province',
    name: 'Minato-kassei',
    nameJapanese: 'Minato-kassei',
    pronunciation: 'mee-NAH-toh-kahs-SAY',
    description: 'Thriving Port - Trade Capital. Cosmopolitan, wealthy, politically complex province with natural deep-water harbor, urban sprawl, and coastal islands. Economy based on international trade, banking, luxury goods, and services.',
    character: 'Cosmopolitan, wealthy, politically complex',
    geography: 'Natural deep-water harbor, urban sprawl, coastal islands',
    economy: 'International trade, banking, luxury goods, services',
    culture: 'Sophisticated, materialistic, politically savvy, trend-setting. Business-like, status-conscious speech.',
    daimyo: 'Lady Koban - calico, isekai\'d (15 years), shrewd merchant',
    keyLocations: [
      'The Grand Harbor - Massive port complex',
      'The Merchant Towers - Guild headquarters and exchanges',
      'The Night Markets - 24-hour trading districts',
      'The Embassy Quarter - Diplomatic district',
      'Luxury Hills - Wealthy residential area'
    ],
    childLocations: [],
    tags: ['province', 'trade', 'wealthy', 'cosmopolitan', 'port', 'major-location'],
    status: 'in-progress',
    completionPercentage: 55,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-lore.md. Province 5/5. Trade and economic capital.'
  }
];

// Also create the capital location
const capital = {
  id: 'location_shiro-tsume',
  type: 'location',
  locationType: 'city',
  name: 'Shiro-tsume',
  nameJapanese: 'Shiro-tsume',
  pronunciation: 'SHEE-roh-TSOO-meh',
  description: 'Claw Castle - The Shogun\'s seat of power, located at the geographic center where all provinces meet. Heavily fortified with beautiful architecture, serves as the capital of the Whisker Shogunate.',
  geography: 'Central location at the meeting point of all five provinces',
  significance: 'Seat of the Shogun, capital city, neutral territory',
  tags: ['city', 'capital', 'fortress', 'neutral-territory', 'major-location'],
  status: 'in-progress',
  completionPercentage: 40,
  lastModified: new Date().toISOString(),
  contributors: ['lore-migration', 'manual-extraction'],
  notes: 'Extracted from whisker-shogunate-lore.md. Capital city and Shogun\'s residence.'
};

// Write provinces to files
const locationsDir = join(DATA_DIR, 'locations');
mkdirSync(locationsDir, { recursive: true });

console.log('🗺️  Writing 5 provinces + capital...\n');

for (const province of provinces) {
  const filepath = join(locationsDir, `${province.id}.json`);
  writeFileSync(filepath, JSON.stringify(province, null, 2));
  console.log(`   ✅ ${province.name}`);
}

const capitalPath = join(locationsDir, `${capital.id}.json`);
writeFileSync(capitalPath, JSON.stringify(capital, null, 2));
console.log(`   ✅ ${capital.name} (capital)\n`);

console.log('✨ Provinces extraction complete!');
