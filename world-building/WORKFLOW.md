# World-Building Workflow & Iteration Guide

**Purpose**: Step-by-step processes for developing, reviewing, and maintaining world-building documentation.

**Last Updated**: 2025-10-07

---

## Table of Contents

1. [Iterative Development Process](#iterative-development)
2. [Creating New Documentation](#creating-new-documentation)
3. [Updating Existing Documentation](#updating-existing-documentation)
4. [Review & Quality Assurance](#review-qa)
5. [Consistency Checking](#consistency-checking)
6. [Progress Tracking](#progress-tracking)
7. [Collaboration Guidelines](#collaboration)

---

<a name="iterative-development"></a>
## Iterative Development Process

World-building happens in cycles. Each iteration deepens understanding and fills gaps.

### The Iteration Cycle

```
1. ASSESS → 2. PLAN → 3. CREATE → 4. REVIEW → 5. UPDATE INDEX → (repeat)
```

### Phase 1: ASSESS (Where Are We?)

**Goal**: Understand current state and identify gaps

**Actions**:
1. Review `INDEX.md` for completion percentages
2. Identify lowest-completion critical/high-priority areas
3. Check for:
   - Missing cross-references
   - Contradictions between documents
   - "[To Be Determined]" placeholders
   - Stub sections that need expansion
4. Note dependencies (what blocks what)

**Output**: Prioritized list of areas to develop

**Time**: 15-30 minutes per iteration

---

### Phase 2: PLAN (What Will We Build?)

**Goal**: Choose specific areas to develop this iteration

**Actions**:
1. Select 2-5 related topics to develop together
   - Group by theme (e.g., all Yama-takumi content)
   - Group by type (e.g., all guild structures)
   - Group by dependency (e.g., technology that relies on materials)

2. Set completion targets
   - Example: "Raise Yama-takumi from 65% → 85%"
   - Be realistic about scope

3. Check prerequisites
   - Do we need to define something else first?
   - Are related systems defined enough to reference?

4. Assign responsibilities (if team-based)

**Output**: Iteration plan with specific targets

**Time**: 15-30 minutes

---

### Phase 3: CREATE (Build the Content)

**Goal**: Produce new or expanded documentation

**Actions**:
1. For new documentation:
   - Copy relevant template from `TEMPLATES.md`
   - Fill in all [REQUIRED] sections first
   - Add detail to optional sections as relevant
   - Leave "[To Be Determined]" for genuinely unknown elements

2. For expansions:
   - Review existing content for context
   - Add depth to existing sections
   - Replace placeholders with real content
   - Add examples and use cases

3. While creating:
   - Add new terms to `GLOSSARY.md` immediately
   - Note cross-references to add later
   - Mark completion percentage honestly
   - Document questions/uncertainties

**Output**: New or significantly improved documentation

**Time**: 2-8 hours depending on scope

---

### Phase 4: REVIEW (Is It Good?)

**Goal**: Ensure quality and consistency

**Actions**:
1. Self-review using checklist (see [Review & QA](#review-qa) section)
2. Cross-check against related documentation
3. Verify all cross-references are bidirectional
4. Run consistency checks (see [Consistency Checking](#consistency-checking))
5. Peer review if available

**Output**: Polished, consistent documentation

**Time**: 30 minutes - 2 hours

---

### Phase 5: UPDATE INDEX (Track Progress)

**Goal**: Maintain accurate tracking

**Actions**:
1. Update completion percentage in `INDEX.md`
2. Change status emoji if appropriate
3. Add any new topics discovered during work
4. Update priority if situation changed
5. Note any new dependencies or cross-references
6. Update version history

**Output**: Accurate progress tracking

**Time**: 10-15 minutes

---

### Iteration Tempo

**Recommended Cadence**:
- **Fast iteration**: Daily cycles, small increments (good for intensive development)
- **Standard iteration**: Weekly cycles, moderate progress (sustainable pace)
- **Slow iteration**: Monthly cycles, major expansions (maintenance mode)

**Signs you need a longer iteration**:
- Frequently leaving sections incomplete
- Creating contradictions
- Losing track of what's defined
- Team confusion about current state

**Signs you could iterate faster**:
- Completing all planned work early
- Blocked on reviews rather than creation
- High clarity and alignment

---

<a name="creating-new-documentation"></a>
## Creating New Documentation

### Step-by-Step Process

#### 1. Check If It Already Exists

Before creating new documentation:
- Search `INDEX.md` for the topic
- Check `GLOSSARY.md` for related terms
- Use file system search for keywords
- Ask team if uncertain

**Avoid duplicate documentation!**

---

#### 2. Choose the Right Template

From `TEMPLATES.md`, select:
- **Location** for places (provinces, cities, landmarks, buildings)
- **Faction/Guild** for organizations
- **System/Mechanic** for gameplay or social systems
- **Character/NPC** for named individuals
- **Technology/Innovation** for Whisker-Punk or other tech

If no template fits, create hybrid or request new template.

---

#### 3. Set Up the File

```bash
# File naming convention: kebab-case, descriptive
# Good: yama-takumi-province.md, engineer-guild.md, paw-cart-technology.md
# Bad: YT.md, guild1.md, tech.md

# File location: organized by type
world-building/
  locations/        # For places
  factions/         # For organizations
  systems/          # For mechanics and systems
  characters/       # For NPCs
  technology/       # For tech and innovation
  cultures/         # For cultural elements
  history/          # For historical events
  conflicts/        # For tensions and plots
```

Create file:
```bash
touch world-building/[category]/[descriptive-name].md
```

---

#### 4. Fill In Template

**Priority order**:
1. **[REQUIRED]** sections - Must be completed
2. **Quick Reference** - Summary for fast lookup
3. **High-value optional sections** - Add significant context
4. **Examples & use cases** - Help others understand
5. **Low-priority optional sections** - Nice to have

**Tips**:
- Start with overview - if you can't summarize it clearly, you don't understand it yet
- Fill in what you know confidently first
- Use "[To Be Determined]" for uncertain elements
- Add detail progressively - skeleton first, then flesh
- Write for future you and others who don't have context

---

#### 5. Add to Glossary

For every new term, name, or location:
```markdown
**[Term]** ([pronunciation]) - [Definition] | `file.md#section` | Tags: [categories]
```

**Glossary hygiene**:
- Add immediately while context is fresh
- Check for existing similar terms
- Use consistent formatting
- Include pronunciation for Japanese-inspired terms
- Tag appropriately for finding later

---

#### 6. Set Completion Percentage

Be honest:
- **100%**: Complete, reviewed, locked (rarely achieved initially)
- **75-99%**: Nearly complete, minor gaps only
- **50-74%**: Substantial content, some sections incomplete
- **25-49%**: Structure exists, needs significant detail
- **1-24%**: Stub/placeholder only
- **0%**: Identified but not started

**Common mistake**: Overestimating completion
- If unsure, round down
- It's better to pleasantly surprise with faster progress

---

#### 7. Register in INDEX.md

Add to appropriate section:
```markdown
| [Topic Name] | [Status] | [Completion%] | `path/to/file.md` | [Priority] |
```

Update category completion percentage:
```markdown
## X. Category Name

**Completion: [Recalculate average]%** | **Status: [Highest applicable status]**
```

---

<a name="updating-existing-documentation"></a>
## Updating Existing Documentation

### When to Update

**Regular updates**:
- Filling in "[To Be Determined]" placeholders
- Adding detail to stub sections
- Including newly discovered cross-references
- Fixing errors or inconsistencies

**Major revisions**:
- Significant retcons or changes
- Adding entire new sections
- Restructuring for clarity
- Incorporating feedback

---

### Update Process

#### 1. Review Current State

- Read entire document first (don't just jump to section)
- Check what's already defined
- Note any contradictions with newer content
- Identify actual gaps vs. intentional mysteries

---

#### 2. Make Changes

**For minor updates**:
- Edit in place
- Add to existing sections
- Maintain existing structure

**For major updates**:
- Consider creating new version temporarily
- Compare before/after
- Review impact on dependent documents
- Update all cross-references

**Track changes**:
- Update "Last Updated" date at bottom
- Note significant changes in file if helpful
- Update version history if major revision

---

#### 3. Consistency Check

After updating:
- Run through [Consistency Checking](#consistency-checking) process
- Verify cross-references still work
- Update `GLOSSARY.md` if terms changed
- Check dependent documents for cascade effects

---

#### 4. Update Tracking

- Adjust completion percentage in `INDEX.md`
- Change status if appropriate
- Note in iteration log what was improved

---

<a name="review-qa"></a>
## Review & Quality Assurance

### Self-Review Checklist

Before considering any document "complete":

#### Content Completeness
- [ ] All [REQUIRED] sections filled
- [ ] No "[To Be Determined]" in critical areas
- [ ] Examples provided where helpful
- [ ] Edge cases addressed
- [ ] Player/gameplay impact explained (if applicable)

#### Consistency
- [ ] No contradictions with other documents
- [ ] All proper nouns in `GLOSSARY.md`
- [ ] Consistent terminology used throughout
- [ ] Cross-references verified
- [ ] Lore aligns with core concepts

#### Quality
- [ ] Clear and understandable
- [ ] Appropriate level of detail
- [ ] Good structure and flow
- [ ] Tone matches style guide
- [ ] No typos or grammatical errors

#### Integration
- [ ] Related systems acknowledged
- [ ] Dependencies documented
- [ ] Impact on other systems explained
- [ ] Bidirectional cross-references exist

#### Completeness Tracking
- [ ] Honest completion percentage
- [ ] Status emoji appropriate
- [ ] Priority level correct
- [ ] Registered in `INDEX.md`
- [ ] "Last Updated" date accurate

---

### Peer Review Process

For significant new content or major changes:

#### 1. Request Review

Provide to reviewer:
- The new/updated document
- Context about what changed and why
- Specific areas of concern
- Related documents to check against

#### 2. Reviewer Responsibilities

Check for:
- Contradictions with existing lore
- Unclear or confusing sections
- Missing important connections
- Gameplay balance issues
- Thematic fit
- Completeness

Provide:
- Specific feedback on issues
- Suggestions for improvement
- Questions that arose while reading
- Positive reinforcement on what works

#### 3. Address Feedback

- Fix clear errors immediately
- Discuss debatable points
- Document decisions made
- Update document based on consensus

#### 4. Final Approval

- Reviewer confirms issues addressed
- Update tracking systems
- Mark as reviewed in INDEX if appropriate

---

<a name="consistency-checking"></a>
## Consistency Checking

### Automated Checks (Scripted Tools)

Consider creating scripts to check:

```bash
# Check for terms not in glossary
# Find broken cross-references
# Identify duplicate entries
# Flag potential contradictions (same topic, different values)
# Find orphaned files (not in INDEX)
```

---

### Manual Consistency Checks

#### Cross-Reference Verification

For each document, verify:
1. All references to other docs are accurate
2. Referenced docs reference back (bidirectional)
3. No circular dependencies without resolution
4. Paths/links work correctly

**Process**:
```markdown
Document A references → Document B
Does Document B have a relevant section?
  YES → Should B reference back to A?
    YES → Does it?
      NO → Add cross-reference to B
```

---

#### Terminology Consistency

**Common issues**:
- Same concept, different names
- Same name, different concepts
- Spelling variations
- Formatting inconsistencies

**Fix**:
1. Identify canonical term in `GLOSSARY.md`
2. Search all documents for variants
3. Replace with canonical version
4. Add variants to "Synonyms to Avoid" in glossary

---

#### Numerical Consistency

Check that numbers align across documents:
- Populations match
- Distances/travel times consistent
- Prices reasonable relative to wages
- Timelines align
- Percentages add up correctly

**Create a numbers reference sheet** for key values:
```markdown
# Key Numbers Reference

## Populations
- Total Shogunate: ~X million
- Higashi-hama: ~Y thousand
- etc.

## Distances
- Higashi-hama to Kawa-no-kuni: X km
- Travel time by railway: Y hours
- etc.

## Economics
- Average daily wage (farmer): X Koban
- Average daily wage (artisan): Y Koban
- Rice (1 kg): Z Koban
- etc.
```

---

#### Logical Consistency

Check for logical contradictions:
- Character A couldn't have been at both events (timeline)
- Technology X requires material Y (which doesn't exist yet)
- Faction Z opposes idea W (but their actions support it)
- Location described differently in different docs

**When found**:
1. Determine which version is correct
2. Update incorrect document
3. Check for cascade effects
4. Note in iteration log to prevent recurrence

---

<a name="progress-tracking"></a>
## Progress Tracking

### Using INDEX.md Effectively

#### Weekly Review

Every week:
1. Update completion percentages for worked areas
2. Recalculate category averages
3. Adjust priorities based on progress
4. Note blocked items
5. Celebrate completed sections!

---

#### Milestone Tracking

Define clear milestones:

**Example Milestones**:
- **Alpha Ready**: All Critical priority items 80%+
- **Beta Ready**: All High priority items 70%+, Critical 90%+
- **Launch Ready**: All Medium priority 60%+, High 85%+, Critical 100%
- **Post-Launch**: Low priority items 50%+

Track distance to each milestone in `INDEX.md`:

```markdown
## Milestone Progress

### Alpha Ready (Target: 2025-12-01)
- Critical items: 4/7 complete (57%)
- Blockers: [List]
- Next actions: [List]

### Beta Ready (Target: 2026-03-01)
- High items: 12/25 complete (48%)
- On track / At risk / Behind
```

---

#### Velocity Tracking

Measure progress rate to predict completion:

```markdown
## Iteration Velocity

### Week of 2025-10-07
- Completed: +15% total documentation
- Items finished: 3
- Items started: 5
- Blockers resolved: 2

### Week of 2025-10-14
- [To be filled]
```

Use to estimate future completion:
```
Current completion: 42%
Weekly velocity: ~3%
Weeks to 80% complete: (80-42)/3 = ~13 weeks
```

---

### Visual Progress Indicators

Consider adding progress bars to `INDEX.md`:

```markdown
## Overall Completion: 42%

[████████░░░░░░░░░░░░] 42%

### By Category
Core Cosmology:    [█████████████░░░░░░░] 65%
Geography:         [███████████░░░░░░░░░] 58%
Political Systems: [███████████░░░░░░░░░] 55%
...
```

---

<a name="collaboration"></a>
## Collaboration Guidelines

### Communication

**Before starting work**:
- Announce intention in team channel
- Check if anyone else is working on related areas
- Discuss approach if significant addition

**While working**:
- Push/commit regularly to avoid conflicts
- Note discoveries that affect others
- Ask questions when stuck

**After completing**:
- Announce completion
- Request review if significant
- Update team on findings/changes

---

### Conflict Resolution

When documents contradict:

#### Process:
1. **Identify the conflict**
   - Document both versions
   - Note which docs affected
   - Assess impact

2. **Determine correct version**
   - Which is more recent?
   - Which better serves gameplay/story?
   - Which is more developed?
   - Consult original brainstorm docs if needed

3. **Make decision**
   - Team lead decides if no consensus
   - Document decision and rationale
   - Update all affected documents

4. **Prevent recurrence**
   - Add to consistency checks
   - Create cross-references
   - Update glossary if terminology issue

---

### Roles & Responsibilities

**World-Building Lead**:
- Final arbiter of contradictions
- Prioritizes development areas
- Reviews major additions
- Maintains INDEX.md integrity

**Content Creators**:
- Follow templates and guidelines
- Update glossary and index
- Request reviews
- Ask questions when unclear

**Reviewers**:
- Check consistency
- Provide constructive feedback
- Verify integration
- Approve completions

**All Team Members**:
- Follow this workflow
- Maintain quality standards
- Communicate clearly
- Respect established lore

---

## Quick Reference: Common Tasks

### "I want to add a new location"

1. Check if it exists in `INDEX.md`
2. Copy Location template from `TEMPLATES.md`
3. Create file in `world-building/locations/`
4. Fill in template (at least [REQUIRED] sections)
5. Add terms to `GLOSSARY.md`
6. Register in `INDEX.md`
7. Add cross-references to/from related docs
8. Request review if major location

---

### "I found a contradiction"

1. Document both versions and sources
2. Determine which is correct (or neither)
3. Update incorrect version(s)
4. Check for cascade effects
5. Add to consistency checks
6. Note in team channel

---

### "I want to expand a stub section"

1. Read entire document for context
2. Fill in stub section
3. Add examples if helpful
4. Update completion percentage
5. Update `INDEX.md`
6. Add any new terms to `GLOSSARY.md`
7. Verify cross-references still accurate

---

### "I'm starting a new iteration"

1. Review `INDEX.md` current state
2. Choose 2-5 related topics
3. Set completion targets
4. Announce in team channel
5. Create content
6. Self-review
7. Update tracking
8. Announce completion

---

### "I'm ready to mark something complete"

1. Run through self-review checklist
2. Ensure all [REQUIRED] sections filled
3. Verify no "[To Be Determined]" placeholders
4. Check cross-references bidirectional
5. Request peer review
6. Address feedback
7. Update `INDEX.md` to 100%
8. Celebrate! 🎉

---

## Tools & Scripts

### Recommended Tools

**For writing**:
- Markdown editor with preview
- Spell checker
- Grammar tool

**For tracking**:
- Git for version control
- Diff tool for comparing versions
- Markdown linter for formatting

**For collaboration**:
- Shared repository (Git)
- Communication channel
- Project board for tracking

---

### Useful Scripts to Create

```bash
# check-consistency.sh
# - Find terms not in glossary
# - Check for broken cross-references
# - Identify orphaned files

# calculate-completion.sh
# - Sum up all completion percentages
# - Calculate category averages
# - Generate progress report

# find-todos.sh
# - List all "[To Be Determined]" placeholders
# - Find all uncompleted checklist items
# - Identify files with 0% completion

# validate-index.sh
# - Verify all files in INDEX exist
# - Check all files are in INDEX
# - Validate completion percentages (0-100)
```

---

## FAQ

**Q: How detailed should documentation be?**
A: Detailed enough to implement without guessing, but not so detailed you bog down. If someone could create the content from your docs alone, it's detailed enough.

**Q: What if I disagree with existing lore?**
A: Discuss with team/lead. If compelling reason to change, update documents and notify others of retcon. Document reasoning.

**Q: Can I create content not in INDEX?**
A: Yes, but add it to INDEX immediately after. Don't create "shadow documentation."

**Q: What if I don't know how to fill a section?**
A: Use "[To Be Determined]" placeholder. Add to questions list. Come back to it later or ask for help.

**Q: How often should I update completion percentages?**
A: After every significant addition (more than minor edits). At minimum, weekly.

**Q: What takes priority: new content or filling gaps?**
A: Generally filling critical gaps, but balance is key. Use priority system in INDEX.

**Q: Can I change the templates?**
A: Propose changes to team. If approved, update all docs using that template to maintain consistency.

---

## Related Documentation

- `INDEX.md` - Track all documentation and completion
- `GLOSSARY.md` - Canonical terms and spellings
- `TEMPLATES.md` - Standardized formats for new docs
- `STYLE-GUIDE.md` - Writing tone and guidelines
- `CROSS-REFERENCES.md` - Map of interconnections

---

*Last Updated: 2025-10-07*
