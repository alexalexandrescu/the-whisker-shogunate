# The Whisker Shogunate - World-Building System

Welcome to the organized world-building documentation system for **The Whisker Shogunate**!

---

## 🎯 Quick Start

### New to the project?
1. Read `../CLAUDE.md` for overall project overview
2. Review `INDEX.md` to see what exists and completion status
3. Check `GLOSSARY.md` for canonical terms and spellings
4. Start with the brainstorming docs in `../originals/` to understand the vision

### Want to add content?
1. Check `INDEX.md` - does it already exist?
2. Choose appropriate template from `TEMPLATES.md`
3. Follow the process in `WORKFLOW.md` → "Creating New Documentation"
4. Update `INDEX.md` and `GLOSSARY.md`
5. Request review if significant addition

### Want to expand existing content?
1. Find the document in `INDEX.md`
2. Read the full document for context
3. Follow the process in `WORKFLOW.md` → "Updating Existing Documentation"
4. Update completion percentage in `INDEX.md`

---

## 📁 Directory Structure

```
world-building/
├── README.md              ← You are here
├── INDEX.md               ← Master index with completion tracking
├── GLOSSARY.md            ← Canonical terms and spellings
├── TEMPLATES.md           ← Standardized templates for new docs
├── WORKFLOW.md            ← Iterative development process
│
├── systems/               ← Game mechanics, social systems, core rules
│   ├── cosmology.md
│   ├── progression.md
│   ├── economy.md
│   ├── guilds.md
│   └── ...
│
├── locations/             ← Places: provinces, cities, landmarks, buildings
│   ├── higashi-hama.md
│   ├── architecture.md
│   ├── world-map.md
│   └── ...
│
├── factions/              ← Organizations, guilds, political groups
│   ├── guilds/
│   │   ├── engineer-guild.md
│   │   ├── merchant-guild.md
│   │   └── ...
│   ├── samurai.md
│   └── political-movements.md
│
├── cultures/              ← Cultural elements, traditions, language
│   ├── social-structure.md
│   ├── language.md
│   ├── cuisine.md
│   ├── festivals.md
│   └── ...
│
├── technology/            ← Whisker-Punk tech, infrastructure, innovation
│   ├── whisker-punk-core.md
│   ├── power-generation.md
│   ├── transportation.md
│   └── ...
│
├── history/               ← Historical events, timelines, eras
│   ├── ancient-era.md
│   ├── great-arrival.md
│   ├── territorial-wars.md
│   └── ...
│
├── characters/            ← NPCs, historical figures
│   ├── leaders/
│   │   ├── shogun-tora.md
│   │   ├── lady-koban.md
│   │   └── ...
│   ├── guild-masters/
│   └── npcs/
│
└── conflicts/             ← Current events, tensions, plot threads
    ├── succession-crisis.md
    ├── automation-conflict.md
    └── ...
```

---

## 📊 Current Status

**Overall Completion**: 42% (see `INDEX.md` for detailed breakdown)

### Priority Areas for Development

**Critical** (needed for MVP):
- Character Creation System: 15% → Target: 80%
- Idle Mechanics Core: 25% → Target: 90%
- Basic Quest System: 10% → Target: 70%
- Core NPC Systems: ~15% → Target: 70%

**High** (needed for Alpha):
- Succession Crisis: 60% → Target: 100%
- Guild System Mechanics: varied → Target: 85%
- Career Progression: 35% → Target: 80%
- Province Details: 55-85% → Target: 95%

See `INDEX.md` for complete priority breakdown.

---

## 🔧 Core Documents

### INDEX.md
- **Master tracking document**
- Lists all topics with completion percentages
- Organized by category
- Shows status, priority, and file paths
- **Update after every significant change**

### GLOSSARY.md
- **Canonical terminology reference**
- Alphabetical listing of all terms, names, locations
- Includes pronunciations for Japanese-inspired terms
- Shows where terms first appear
- **Add new terms immediately upon creation**

### TEMPLATES.md
- **Standardized formats**
- Templates for: Locations, Factions, Systems, Characters, Technology
- [REQUIRED] sections marked
- Use these to maintain consistency
- **Copy entire template when creating new docs**

### WORKFLOW.md
- **Process guide**
- Iterative development cycle
- Creating and updating documentation
- Review and QA processes
- Consistency checking
- **Follow this for all world-building work**

---

## 🎨 Design Principles

### Tone
- **Cozy but meaningful**: Warm and inviting, but acknowledges real difficulty
- **Hopeful but realistic**: Things get better, but not instantly or easily
- **Whimsical yet grounded**: Magical realism that feels lived-in
- **Beautiful but authentic**: Aesthetic world that's weathered and functional

### Core Themes
1. Second chances and redemption
2. Finding purpose and community
3. Balance between tradition and progress
4. Individual journey within collective society
5. Processing loss while embracing new life
6. **The transformation struggle** - from animal to sentient being

### Ghibli Inspiration
- Intricate visible mechanisms (Howl's Moving Castle)
- Peaceful rural life (My Neighbor Totoro)
- Coming of age journeys (Kiki's Delivery Service)
- Community and found family (Spirited Away)
- Environmental harmony (Princess Mononoke)

**Key principle**: No clear villains, quiet contemplative moments, food as culture, work as dignity

---

## ✅ Quality Standards

Before marking anything "Complete" (100%):

- [ ] All [REQUIRED] sections filled
- [ ] No "[To Be Determined]" placeholders in critical areas
- [ ] Cross-references verified and bidirectional
- [ ] All proper nouns added to `GLOSSARY.md`
- [ ] Completion percentage updated in `INDEX.md`
- [ ] No contradictions with existing documentation
- [ ] Tone matches style guide
- [ ] Reviewed by at least one other person
- [ ] Examples provided where helpful
- [ ] Player/gameplay impact clarified (if applicable)

---

## 🔄 The Iterative Cycle

```
1. ASSESS  → Review INDEX.md, identify gaps
2. PLAN    → Choose 2-5 related topics, set targets
3. CREATE  → Use templates, fill in content
4. REVIEW  → Self-check, cross-reference, peer review
5. UPDATE  → Update INDEX.md, GLOSSARY.md
           ↓
        (REPEAT)
```

**Tempo**: Weekly iterations recommended for sustainable progress

See `WORKFLOW.md` for detailed process.

---

## 🛠️ Useful Scripts

Create these scripts to automate consistency checking:

### check-consistency.sh
```bash
#!/bin/bash
# Find terms not in GLOSSARY.md
# Check for broken cross-references
# Identify orphaned files (not in INDEX.md)
```

### calculate-completion.sh
```bash
#!/bin/bash
# Sum up all completion percentages
# Calculate category averages
# Generate progress report
```

### find-todos.sh
```bash
#!/bin/bash
# List all "[To Be Determined]" placeholders
# Find uncompleted checklist items
# Identify 0% completion files
```

### validate-index.sh
```bash
#!/bin/bash
# Verify all INDEX.md references exist
# Check all files are registered in INDEX.md
# Validate completion percentages (0-100)
```

---

## 🚨 Common Mistakes to Avoid

1. **Creating duplicate documentation** - Always check `INDEX.md` first
2. **Not updating tracking** - Keep `INDEX.md` and `GLOSSARY.md` current
3. **Overestimating completion** - Be honest about percentages
4. **Ignoring cross-references** - Make them bidirectional
5. **Working in isolation** - Communicate what you're working on
6. **Violating established lore** - Check existing docs before contradicting
7. **Skipping [REQUIRED] sections** - These are required for a reason
8. **Not using templates** - They ensure consistency
9. **Creating shadow documentation** - If it's not in INDEX, it's lost
10. **Marking incomplete work as complete** - It creates confusion

---

## 📝 Naming Conventions

### Files
- Use kebab-case: `yama-takumi-province.md`
- Be descriptive: `engineer-guild.md` not `guild1.md`
- Match topic: filename should reflect primary content

### Terms (Japanese-inspired)
- Use macrons for long vowels if available: `Shōgun`
- Otherwise use standard spelling: `Shogun`
- Always add to `GLOSSARY.md` with pronunciation
- Be consistent with existing terms

### Cross-References
```markdown
→ [Document Name](path/to/file.md)
→ [Document Name](path/to/file.md#section-anchor)
```

---

## 🤝 Collaboration

### Roles

**World-Building Lead**:
- Arbitrates contradictions
- Prioritizes development areas
- Reviews major additions
- Maintains INDEX.md integrity

**Content Creators**:
- Follow templates and guidelines
- Update glossary and index
- Request reviews
- Communicate progress

**Reviewers**:
- Check consistency
- Provide constructive feedback
- Verify integration
- Approve completions

### Communication

**Before starting**: Announce intention, check for conflicts
**While working**: Push regularly, note discoveries, ask questions
**After completing**: Announce completion, request review, update team

---

## 📚 Learning Resources

### Essential Reading
1. `../CLAUDE.md` - Project overview
2. `../originals/whisker-shogunate-lore.md` - Core concepts
3. `INDEX.md` - Current state
4. `WORKFLOW.md` - How to contribute

### When Creating Specific Content
- **Location** → `TEMPLATES.md` Location template + existing location docs for examples
- **Faction** → `TEMPLATES.md` Faction template + guild docs for examples
- **Character** → `TEMPLATES.md` Character template + leader docs for examples
- **System** → `TEMPLATES.md` System template + existing system docs

---

## 🎯 Milestones

Track progress toward these goals in `INDEX.md`:

- **Alpha Ready**: All Critical items 80%+
- **Beta Ready**: All High items 70%+, Critical 90%+
- **Launch Ready**: All Medium 60%+, High 85%+, Critical 100%
- **Post-Launch**: Low items 50%+

---

## 🔍 Finding Information

### "Where is information about X?"
1. Check `INDEX.md` table of contents
2. Search `GLOSSARY.md` for term
3. Use file system search
4. Check `../originals/` brainstorm docs

### "Is this defined yet?"
1. Look in `INDEX.md` under relevant category
2. Check completion percentage
3. If 0-24%, it's mostly undefined
4. If 25-49%, structure exists but needs detail
5. If 50%+, substantial content exists

### "What can I work on?"
1. Check `INDEX.md` "Priority Areas for Development"
2. Look for Critical/High priority items under 70%
3. Choose areas that interest you
4. Announce intention to team

---

## ❓ FAQ

**Q: I found a contradiction. What do I do?**
A: Document both versions, determine correct one (consult team if needed), update incorrect version(s), check cascade effects, note for team.

**Q: Can I change existing lore?**
A: Discuss with team/lead first. If approved, update all affected documents and notify team of retcon.

**Q: How detailed should I be?**
A: Detailed enough to implement without guessing, but not so detailed you bog down. If someone could create the content from your docs alone, it's detailed enough.

**Q: What if I don't know something?**
A: Use "[To Be Determined]" placeholder and continue. Come back to it later or ask for help.

**Q: How often should I update INDEX.md?**
A: After every significant addition. At minimum, weekly.

---

## 🎉 Acknowledgments

This world-building system is designed to:
- **Track progress** with clear completion percentages
- **Maintain consistency** through glossaries and cross-references
- **Enable iteration** with structured workflows
- **Support collaboration** with clear processes
- **Scale sustainably** as the world grows

**Remember**: World-building is iterative. You don't need to define everything perfectly upfront. Start with structure, add detail progressively, refine through review.

---

## 📞 Getting Help

- **Stuck on what to write?** Check examples in existing docs
- **Unsure about lore?** Consult `../originals/` brainstorm docs
- **Need process guidance?** See `WORKFLOW.md`
- **Looking for a term?** Check `GLOSSARY.md`
- **Want to know status?** Review `INDEX.md`

---

**Welcome to world-building for The Whisker Shogunate!**

*A world where lost cats find home, small lives become meaningful, work is purpose not burden, and becoming yourself is the greatest adventure.*

---

*Last Updated: 2025-10-07*
