# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🚀 Current Project Status (Updated: 2025-10-07)

**Migration Progress**: ~80% Complete

**What's Working**:
- ✅ pnpm workspace monorepo with Turborepo
- ✅ All 6 packages building successfully (TypeScript)
- ✅ Validation scripts working (24/24 entities pass)
- ✅ GitHub Actions workflows created
- ✅ @whisker/schemas, @whisker/data, @whisker/validation, @whisker/analytics, @whisker/migration, @whisker/mcp-server

**What's Next**:
- ⏳ Initialize Next.js wiki package (`packages/wiki/`)
- ⏳ Build progress dashboard UI
- ⏳ Enable GitHub Pages deployment

**See TODO.md for detailed next steps and commands**

---

## Project Overview

**The Whisker Shogunate** is an idle/life-sim game set in Neko-kuni, a feudal Japan-inspired world built by and for cats. Players control isekai'd cats (deceased/abandoned cats from our world) who arrive via the Great Torii Gate and build new lives in a society powered by Whisker-Punk technology.

## Core Concept

- **Genre**: Idle/life-sim game with deep world-building
- **Setting**: Feudal Japan aesthetic + Ghibli-inspired Whisker-Punk technology
- **Theme**: Second chances, finding purpose, transformation from animal to sentient being
- **Tone**: Cozy but meaningful, hopeful but acknowledging difficulty, whimsical yet grounded

## World Structure

### Five Provinces of the Whisker Shogunate

1. **Higashi-hama (East Shore)** - Landing province for newcomers, coastal, transitional
2. **Kawa-no-kuni (River Country)** - Agricultural heartland, traditional, conservative
3. **Yama-takumi (Mountain Forge)** - Industrial province, innovative, engineering hub
4. **Mori-shizuka (Silent Forest)** - Spiritual/medical center, contemplative, ancient
5. **Minato-kassei (Thriving Port)** - Trade capital, cosmopolitan, wealthy, politically complex

### Major Factions & Systems

- **The Shogunate**: Military government led by aging Shogun Tora the Scarred
- **Seven Major Guilds**: Engineer, Merchant, Healer, Farmer Collective, Artisan Union, Scholar's Circle, Performance Guild
- **Social Hierarchy**: Shogun/Daimyo → Samurai → Artisans → Merchants → Farmers → Newcomers
- **The Path System**: Player progression from Newcomer → Apprentice → Journey-Cat → Established → Master → Elder

## Technology: Whisker-Punk Aesthetic

Ghibli-inspired steampunk powered by renewable cat-accessible resources:

- **Whisker-Static Generators**: Cats generate electricity through running/playing on ornate wheels
- **Sun-Warm Collectors**: Solar power via designated napping platforms
- **Water Wheels & Steam**: Traditional power with visible, celebrated infrastructure
- **Kinetic Pawpad Paths**: Walkways that generate power when stepped on
- **Visible Mechanisms**: All technology celebrates gears, pipes, and mechanical beauty

Key principle: Everything is visible, ornate, and scaled for cats. No hidden machinery.

## Core Gameplay Loop

### The Transformation Struggle (Central Theme)

Every isekai'd cat faces the existential challenge of transitioning from a small, dependent animal to a fully sentient being:

- **Physical Adjustment**: Walking upright, using hands, speaking complex language
- **Mental/Emotional Growth**: Processing complex emotions, abstract concepts, meaningful choices
- **Social Integration**: Learning hierarchies, building relationships, finding purpose
- **Identity Crisis**: "I was a pet/stray—now what am I?"

**Why This Matters**: The idle game mechanics gain emotional weight because progress = helping your cat find peace, purpose, and identity. Every skill learned, friendship made, and home improvement represents personal growth toward becoming who they're meant to be.

### Progression Systems

1. **Housing**: Shared Naga-ya → Rental Properties → Owned Property (extensive customization)
2. **Careers**: 40+ professions across guilds with apprenticeship → journeyman → master paths
3. **Relationships**: Friendships, mentorships, rivalries, romance, professional networks
4. **Skills**: Trade skills, arts, combat forms, social abilities
5. **Influence**: Guild ranks, political connections, reputation

### Day/Night Cycles

Critical system affecting all gameplay:

- **Diurnal Cats**: Day-active (farmers, merchants, administrators)
- **Nocturnal Cats**: Night-active (guards, artists, night market vendors)
- **Crepuscular Cats**: Twilight-active (diplomats, innkeepers, bridges both worlds)

Different NPCs, quests, and activities available based on time and player's circadian preference.

## World-Building Reference Files

Located in `/originals/`:

- `whisker-shogunate-lore.md` - Core cosmology, geography, politics, technology
- `whisker-shogunate-part2.md` - Architecture (extensive material/building guidelines), flora & fauna
- `whisker-shogunate-part3.md` - Society, culture, professions, language, guilds
- `whisker-shogunate-part4.md` - Cuisine, history, current events, mysteries

**When generating content**: Always reference these files for consistency. The world has specific rules:

- No mammal meat (strong cultural taboo)
- No toxic foods (grapes, onions, chocolate don't exist)
- Fish is primary protein
- Rice is staple grain
- Architecture uses specific materials (brass, copper, bronze, hinoki cypress, cedar)
- Color palettes are warm (natural woods, warm metals, soft lighting)

## Architectural Guidelines

### Key Building Types

- **Naga-ya (Long Houses)**: Shared housing for newcomers, 10-20 private rooms, communal facilities
- **Machiya (Townhouses)**: Narrow frontage, deep layout, integrated shop/residence
- **Gear Towers (Haguruma-tō)**: 4-8 story power generation/distribution centers, spectacular visible mechanisms
- **Healer Temples (Byōin-dera)**: Medical centers with emphasis on tranquility, medicinal gardens
- **Sentō (Bath Houses)**: Social centers with elaborate tilework, multiple pools, heating systems

### Material Specifications

- **Woods**: Hinoki (cypress - premium), Sugi (cedar - common), Keyaki (zelkova - decorative), Bamboo (versatile)
- **Metals**: Brass/bronze/copper for Whisker-Punk (warm tones, visible patina), iron/steel for structure
- **Ceramics**: Kawara roof tiles (burgundy-red common), floor tiles (blues/greens for baths)
- **Color Palette**: Natural wood honey-to-walnut, cream plaster, red-brown roofs, warm metal tones

**Aesthetic Principle**: Nothing is purely functional—everything has artistic merit. Gears and mechanisms are celebrated, not hidden.

## Cultural Details

### Food Culture

- **Diet**: Fish/seafood primary protein, rice with every meal, extensive vegetables/soy products
- **Restaurant Types**: Sushi-ya, Izakaya (tavern), noodle shops, kaiseki (high-end), tea houses, food stalls
- **Chef Training**: 10-20 year apprenticeships (sushi masters take longest)
- **Presentation**: Food must please eyes before mouth, seasonal themes, proper dishware selection

### Language System

- **Neko-go (Common Tongue)**: Universal cat language with pictographic writing (~2,000 characters)
- **Five Regional Dialects**: Each province has distinct speech patterns, vocabulary, cultural markers
- **Honorifics**: Built into verbs/pronouns indicating social relationships
- **Writing Direction**: Vertical (top-to-bottom, right-to-left) traditionally, some modern horizontal

### Current Political Tensions

1. **Succession Crisis**: Shogun Tora aging, three potential successors with different faction support
2. **Technology vs. Labor**: Automation threatening traditional jobs, guild conflicts
3. **Merchant Power**: Economic power challenging political hierarchy, seeking representation
4. **Native vs. Isekai'd**: Minor tensions around cultural change and identity

## Mysteries & Unexplained Elements

**Magical Realism Core**: Some things have no explanation and are accepted as reality:

- The Veil between worlds and how it selects cats
- The transformation from animal to sentient being
- Who built the Great Torii Gate (predates recorded history)
- Ancient ruins scattered throughout (unknown builders, some with functioning technology)
- Diagnostic mirrors that reveal internal medical issues
- Glow-plants (bioluminescent flora)
- Native cats have no evolutionary history—they've always existed as-is

**Do not explain these**. They are part of the world's magical realism aesthetic.

## Tone & Theme Guidelines

### Core Themes

- Second chances and redemption
- Finding purpose and community
- Balance between tradition and progress
- Individual journey within collective society
- Processing loss while embracing new life

### Tone Balance

- **Cozy but not saccharine**: Warm and inviting but acknowledges real difficulty
- **Meaningful without being heavy**: Depth without depression, serious themes treated respectfully
- **Hopeful but realistic**: Things get better, but not instantly or easily—earned happiness
- **Whimsical yet grounded**: Magical realism elements but feels real and lived-in
- **Beautiful but lived-in**: Aesthetic world that's weathered, functional, authentic

### Ghibli Inspiration

Draw from:

- **Howl's Moving Castle**: Intricate visible mechanisms, steam/clockwork aesthetic
- **My Neighbor Totoro**: Peaceful rural life, simple joys, community bonds
- **Kiki's Delivery Service**: Coming of age, finding your craft, gentle growth
- **Spirited Away**: Bathhouse community, diverse characters, found family, magical workplace
- **Princess Mononoke**: Balance between nature and civilization, environmental harmony

**Universal Ghibli qualities**: No clear villains, quiet contemplative moments, food as culture, work as dignity, attention to small details, strong sense of place.

## Writing Guidelines

### Character Creation

- **Every named NPC has**: Origin story, daily schedule, personality traits, preferences, goals, relationship web, dynamic opinions
- **NPCs should**: Move between locations, react to world events, remember past interactions, have their own story arcs
- **Players choose**: Circadian preference (diurnal/nocturnal/crepuscular), career path, housing style, relationship priorities

### Quest Design

- **Reflect the transformation struggle**: Quests should tie to personal growth, not just fetch/grind
- **Multiple solutions**: Honor player agency, no single "correct" path
- **Consequences matter**: But aren't punishing—realistic optimism
- **Emotional resonance**: Help other newcomers, mentor apprentices, resolve conflicts through mediation

### Economy Design

- **Universal basic services**: Healthcare, education, basic housing, emergency food all FREE
- **Currency (Koban)**: Used for comfort, luxury, status, self-expression—wants not needs
- **Income sources**: Job salaries, crafting sales, quest rewards, property income, investments
- **Wealth levels**: Struggling (0-500) → Comfortable (500-2K) → Prosperous (2K-10K) → Wealthy (10K-50K) → Elite (50K+)

**Philosophy**: Safety net ensures dignity while rewarding ambition—taking risks is less frightening.

## Content to Avoid

- **Violence**: This is a peaceful world. Conflicts resolved through mediation, social pressure, hissing/posturing
- **Explicit villainy**: No clear villains, only complex characters with different priorities
- **Punishment mechanics**: Idle game should welcome players back, not punish breaks
- **Grim/dark content**: Can acknowledge difficulty but maintain hopeful tone
- **Breaking food taboos**: Never suggest mammal meat or toxic foods
- **Simplistic solutions**: Real problems require nuanced approaches

## Development Philosophy

### Gameplay Principles

- **Player agency**: Meaningful choices, multiple paths to success, consequences that matter
- **No punishment for breaks**: Idle mechanics mean progress continues—respect player time
- **Multiple valid paths**: No "best" career or lifestyle, all choices have value
- **Horizontal and vertical progression**: Get better at things AND try new things
- **Accessibility**: Easy to learn, hard to master, accommodating different playstyles

### Why Idle Game Works Here

- **Emotional core**: Not just grinding resources but helping your cat find peace/purpose/identity
- **Thematic mechanics**: Cats napping generates power (solar collectors), time passing = cat living their life
- **Multiple time scales**: Minute-to-minute tasks, session-to-session progress, long-term legacy building
- **Always something to do**: But never overwhelming, player sets their own pace

## Summary: What Makes This World Special

- Lost cats find home
- Small lives become meaningful
- Work is purpose, not burden
- Community supports individual
- Tradition and progress coexist
- Everyone deserves a second chance
- **Becoming yourself is the greatest adventure**

---

When developing features for this game, always consider: "How does this help the player's cat find peace, purpose, and identity?" That is the emotional throughline that transforms idle mechanics into meaningful progression.
