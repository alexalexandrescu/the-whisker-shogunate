/**
 * Extract the 7 major guilds with full details from lore files
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../../..');
const DATA_DIR = join(ROOT_DIR, 'packages/data');

const guilds = [
  {
    id: 'faction_engineer-guild',
    type: 'faction',
    factionType: 'guild',
    name: 'Engineer Guild',
    nameJapanese: 'Haguruma Kumiai',
    pronunciation: 'hah-GOO-roo-mah koo-MIGH-eye',
    description: 'The Engineer Guild focuses on Whisker-Punk technology, innovation, and infrastructure. Members include mechanical engineers, structural engineers, inventors, and maintenance technicians. Progressive culture that embraces change and innovation.',
    focus: 'Whisker-Punk technology, innovation, infrastructure',
    members: 'Mechanical engineers (gear systems, power distribution), Structural engineers (bridges, towers, buildings), Inventors (new devices and processes), Maintenance technicians',
    hierarchy: 'Apprentice Engineer → Journeyman Engineer → Master Engineer → Grand Engineer → Guild Master',
    culture: 'Progressive, embrace change. Competitive (innovation races). Document everything (extensive libraries). Public demonstrations of new inventions. Some secrecy around cutting-edge work.',
    headquarters: 'location_yama-takumi',
    otherLocations: [],
    influence: 'high',
    wealth: 'prosperous',
    membershipSize: '2000+ members across all provinces',
    tags: ['guild', 'engineering', 'technology', 'innovation', 'major-faction'],
    status: 'in-progress',
    completionPercentage: 70,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-part3.md. Guild 1/7.'
  },
  {
    id: 'faction_merchant-guild',
    type: 'faction',
    factionType: 'guild',
    name: 'Merchant Guild',
    nameJapanese: 'Akindo Kumiai',
    pronunciation: 'ah-KIN-doh koo-MIGH-eye',
    description: 'The Merchant Guild focuses on trade, commerce, banking, and market regulation. Members include shopkeepers, traveling merchants, import/export specialists, bankers, and auctioneers. Networked culture where information is currency.',
    focus: 'Trade, commerce, banking, market regulation',
    members: 'Shopkeepers, Traveling merchants, Import/export specialists, Bankers and moneylenders, Auctioneers',
    hierarchy: 'Apprentice Merchant → Journeyman Merchant → Master Merchant → Trade Master → Guild Master',
    culture: 'Networked, information is currency. Shrewd but honor-bound (contracts sacred). Wealth display acceptable. Annual grand market (all members convene).',
    headquarters: 'location_minato-kassei',
    otherLocations: [],
    influence: 'critical',
    wealth: 'wealthy',
    membershipSize: '3000+ members across all provinces',
    tags: ['guild', 'commerce', 'trade', 'banking', 'major-faction'],
    status: 'in-progress',
    completionPercentage: 70,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-part3.md. Guild 2/7. Growing political influence.'
  },
  {
    id: 'faction_healer-guild',
    type: 'faction',
    factionType: 'guild',
    name: 'Healer Guild',
    nameJapanese: 'Ishi Kumiai',
    pronunciation: 'EE-shee koo-MIGH-eye',
    description: 'The Healer Guild focuses on medicine, herbalism, healing arts, and mental health. Members include physicians, surgeons, herbalists, therapists, midwives, and medical researchers. Dedicated, compassionate culture committed to healing all.',
    focus: 'Medicine, herbalism, healing arts, mental health',
    members: 'Physicians (general practice), Surgeons (specialists), Herbalists (medicine preparation), Therapists (mental/emotional health), Midwives (birth assistance), Medical researchers',
    hierarchy: 'Apprentice Healer (3-5 years) → Journeyman Healer → Master Healer → Grand Healer → Arch Healer (Guild Master)',
    culture: 'Dedicated, compassionate. Knowledge-sharing (not secretive). Oath-bound (do no harm). Apolitical (heal all regardless). Continuous learning expected.',
    headquarters: 'location_mori-shizuka',
    otherLocations: [],
    influence: 'high',
    wealth: 'comfortable',
    membershipSize: '1500+ healers across all provinces',
    tags: ['guild', 'medicine', 'healing', 'healthcare', 'major-faction'],
    status: 'in-progress',
    completionPercentage: 65,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-part3.md. Guild 3/7. Medical services are free (universal healthcare).'
  },
  {
    id: 'faction_farmer-collective',
    type: 'faction',
    factionType: 'guild',
    name: 'Farmer Collective',
    nameJapanese: 'Hyakusho Rengō',
    pronunciation: 'HYAH-koo-shoh ren-GOH',
    description: 'The Farmer Collective focuses on agriculture, fishing, and food production. Members include rice farmers, vegetable growers, tea plantation workers, fishermen, and orchardists. Traditional culture following seasonal rhythms with strong community focus.',
    focus: 'Agriculture, fishing, food production',
    members: 'Rice farmers, vegetable growers, tea plantation workers, Fishermen (river and sea), Orchardists, apiarists (beekeepers), silkworm farmers',
    hierarchy: 'Worker → Farmer → Master Farmer → Representative → Collective Leader (less formal than other guilds)',
    culture: 'Traditional, seasonal rhythms. Community-focused (help each other). Suspicious of rapid change. Weather-watching, superstitions. Strong work ethic, harvest celebrations.',
    headquarters: 'location_kawa-no-kuni',
    otherLocations: [],
    influence: 'high',
    wealth: 'modest',
    membershipSize: '5000+ farmers (largest membership)',
    tags: ['guild', 'agriculture', 'farming', 'food-production', 'major-faction'],
    status: 'in-progress',
    completionPercentage: 60,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-part3.md. Guild 4/7. Largest membership, most traditional.'
  },
  {
    id: 'faction_artisan-union',
    type: 'faction',
    factionType: 'guild',
    name: 'Artisan Union',
    nameJapanese: 'Shokunin Renmei',
    pronunciation: 'SHOH-koo-nin ren-MAY',
    description: 'The Artisan Union focuses on crafts, arts, and skilled trades. Subdivided by craft including carpenters, blacksmiths, potters, weavers, paper makers, glassblowers, jewelers, and instrument makers. Strong pride in craftsmanship with respect for tradition.',
    focus: 'Crafts, arts, skilled trades',
    members: 'Carpenters, blacksmiths/metalworkers, potters/ceramicists, Weavers/textile workers, paper makers, furniture makers, Glassblowers, jewelers, leatherworkers, instrument makers',
    hierarchy: 'Apprentice (years of learning) → Journeyman → Master → Grand Master (by craft)',
    culture: 'Pride in craftsmanship. Respect for tradition with room for innovation. Competition at festivals (friendly). Apprenticeships start young. Secrets passed down (special techniques). Tools are treasured (hand-me-downs).',
    headquarters: '',
    otherLocations: [],
    influence: 'medium',
    wealth: 'comfortable',
    membershipSize: '4000+ artisans across all crafts',
    tags: ['guild', 'crafts', 'artisans', 'skilled-trades', 'major-faction'],
    status: 'in-progress',
    completionPercentage: 55,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-part3.md. Guild 5/7. Decentralized with craft-specific gathering houses.'
  },
  {
    id: 'faction_scholars-circle',
    type: 'faction',
    factionType: 'academic',
    name: "Scholar's Circle",
    nameJapanese: 'Gakusha no Wa',
    pronunciation: 'gah-KOO-shah noh WAH',
    description: "The Scholar's Circle focuses on knowledge, research, education, and archives. Members include historians, philosophers, scientists, mathematicians, astronomers, librarians, teachers, linguists, and archaeologists. Intellectual culture prioritizing preservation of knowledge.",
    focus: 'Knowledge, research, education, archives',
    members: 'Historians, philosophers, scientists (natural philosophy), Mathematicians, astronomers, librarians/archivists, Teachers, linguists, archaeologists (studying ancient ruins)',
    hierarchy: 'Student → Scholar → Senior Scholar → Master Scholar → Circle Keeper',
    culture: 'Intellectual, debate-loving. Preservation of knowledge priority. Peer review system. Publishing papers and books. Lectures open to public. Some academic rivalries (intense but not violent). Travel for research encouraged.',
    headquarters: 'location_mori-shizuka',
    otherLocations: [],
    influence: 'medium',
    wealth: 'modest',
    membershipSize: '800+ scholars',
    tags: ['guild', 'academic', 'knowledge', 'research', 'education', 'major-faction'],
    status: 'in-progress',
    completionPercentage: 60,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-part3.md. Guild 6/7. Libraries and schools in all provinces.'
  },
  {
    id: 'faction_performance-guild',
    type: 'faction',
    factionType: 'guild',
    name: 'Performance Guild',
    nameJapanese: 'Geinō Kumiai',
    pronunciation: 'GAY-noh koo-MIGH-eye',
    description: 'The Performance Guild focuses on arts, entertainment, and culture. Members include actors, musicians, dancers, puppeteers, storytellers, singers, and comedians. Colorful, expressive culture with tight-knit traveling troupes.',
    focus: 'Arts, entertainment, culture',
    members: 'Actors (kabuki, noh, etc.), musicians, dancers, Puppeteers, storytellers, singers, comedians',
    hierarchy: 'Apprentice Performer → Performer → Master Performer → Troupe Leader → Guild Master',
    culture: 'Colorful, expressive. Tight-knit (traveling together). Respect for tradition but innovative. Celebrity culture (famous performers). Competitive but supportive. Irregular income (feast or famine).',
    headquarters: '',
    otherLocations: [],
    influence: 'medium',
    wealth: 'modest',
    membershipSize: '1200+ performers',
    tags: ['guild', 'performance', 'arts', 'entertainment', 'major-faction'],
    status: 'in-progress',
    completionPercentage: 55,
    lastModified: new Date().toISOString(),
    contributors: ['lore-migration', 'manual-extraction'],
    notes: 'Extracted from whisker-shogunate-part3.md. Guild 7/7. Headquarters near major theaters, members travel frequently.'
  }
];

// Write guilds to files
const factionsDir = join(DATA_DIR, 'factions');
mkdirSync(factionsDir, { recursive: true });

console.log('⚔️  Writing 7 major guilds...\n');

for (const guild of guilds) {
  const filepath = join(factionsDir, `${guild.id}.json`);
  writeFileSync(filepath, JSON.stringify(guild, null, 2));
  console.log(`   ✅ ${guild.name} (${guild.nameJapanese})`);
}

console.log('\n✨ Guilds extraction complete!');
console.log(`   Total: ${guilds.length} major guilds`);
