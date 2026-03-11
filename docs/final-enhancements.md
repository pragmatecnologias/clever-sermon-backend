CURRENT UI PAGES / SECTIONS
Page: Workspace
Purpose: Workspace metadata and sermon setup.
Features on this page:

Title/series/main passage/additional passages
Theme/audience/goals/theological lens/style/story arc/language
EGW toggle
Page: Scripture
Purpose: Passage lookup + passage intelligence generation.
Features on this page:

Scripture lookup (reference + translation + suggestions)
Parallel translation comparison display
Scripture snapshot history
Audio player for passage
Passage Summary panel
Per-Verse Context panel
Translation Comparison panel
Verse Commentary panel
Structural Analysis panel
Interpretive Challenges panel
Canonical Theme Tracing panel
Study Synthesis panel
Study Notes panel
EGW Passage Panel
Page: Word Study
Purpose: Lexical analysis.
Features on this page:

Word lookup (Greek/Hebrew/Aramaic)
Suggested words from passage
Morphology/semantic/distribution insights
Page: Cross References
Purpose: Cross-reference discovery and ranking.
Features on this page:

Cross-reference lookup
Ranked cross-reference results
Cross-reference SOP panel
Page: Study Report
Purpose: Consolidated exegetical study report.
Features on this page:

Generate study report
Report rendering (overview/context/flow/structure/key terms/cross refs/challenges/themes/pastoral implications)
EGW study section block
Page: Outlines
Purpose: Generate and edit sermon outlines.
Features on this page:

Generate outline options
Select active outline
Edit intro/points/conclusion/call-to-action
Point-level chips/toggles (Subpoints, Verses, Themes, Applications, Media, EGW)
Verse evidence panel
Outline point EGW support component
Page: Manuscript
Purpose: Generate/edit manuscript.
Features on this page:

Generate manuscript from selected outline
Tone/minutes/format/audience options
Edit manuscript text
Page: Applications
Purpose: Generate/edit applications list.
Features on this page:

Prompt override
Generate applications
Edit applications by audience tag
Page: Questions
Purpose: Generate/edit discussion questions.
Features on this page:

Prompt override
Generate questions
Edit questions
Page: Illustrations
Purpose: Generate/edit illustrations.
Features on this page:

Prompt override
Generate illustrations
Edit title/content/source
Page: Citations
Purpose: Generate/edit/validate citation claims.
Features on this page:

Prompt override
Generate citations
Edit statement + verse refs
Validate citation support
Page: Socratic Coach
Purpose: Coaching/refinement loop.
Features on this page:

Generate Socratic question set
Submit answers and receive feedback
Push coach suggestions to outline/manuscript
Page: Sermon DNA
Purpose: Integrity/scoring diagnostics.
Features on this page:

Run DNA analysis
Integrity dashboard + issue/score reporting
Mentor/pattern dashboards
Page: Visualizations
Purpose: 3D insight tools.
Features on this page:

Interactive Canonical Constellation
Sanctuary/Prophecy Mapper (conditional by passage)
Interactive Prophecy Web
Sermon Flow Sculptor
Biblical Narrative Map
Page: Media
Purpose: Media production/publishing assets.
Features on this page:

MediaProductionStudio
CURRENT FEATURES (with data + storage)
I’m listing the concrete features currently wired in UI/API:

Feature	UI location	What it does	Data generated	Storage (known)	Best step
Workspace metadata editor	Workspace	Sets sermon setup inputs	title/theme/audience/goals/lens/style/storyArc/etc	sermon_workspaces columns	Theme
EGW toggle	Workspace	Enables EGW-aware generation paths	boolean flag	workspace config/metadata	Theme
Scripture lookup	Scripture	Fetches passage text	passage payload	workspace.scriptureCache.scriptureResult	Passage
Scripture snapshots/history	Scripture	Saves/restores lookup state	lookup snapshots	scriptureCache.lookupHistory	Passage
Passage Summary panel	Scripture	Generates passage summary	summary JSON	scriptureCache.passageSummary	Passage
Per-Verse Context panel	Scripture	Generates verse context	context JSON	scriptureCache.perVerseContext	Passage
Translation Comparison panel	Scripture	Generates comparison	comparison JSON	scriptureCache.translationComparison	Passage
Verse Commentary panel	Scripture	Generates verse commentary	commentary JSON	scriptureCache.verseCommentary	Passage
Structural Analysis panel	Scripture	Generates literary structure analysis	structure JSON	scriptureCache.structuralAnalysis	Passage
Interpretive Challenges panel	Scripture	Generates interpretive tensions	challenge JSON	scriptureCache.interpretiveChallenges	Passage
Canonical Theme Tracing panel	Scripture	Generates canonical theme traces	theme trace JSON	scriptureCache.canonicalThemes	Passage
Study Synthesis panel	Scripture	Generates synthesis	synthesis JSON	scriptureCache.studySynthesis	Passage
Study Notes panel	Scripture	Displays notes from scripture response	notes list	response payload	Passage
EGW Passage Panel	Scripture	Shows EGW insight for passage	EGW insights	fetched on demand	Passage
Word Study lookup	Word Study	Lexical/morphology lookup	word study + insights	scriptureCache.wordStudy	Passage
Word suggestions	Word Study	Suggests lexical terms from current passage	suggested term list	in-memory UI (derived)	Passage
Cross-reference lookup	Cross References	Finds related verses	ranked refs	scriptureCache.crossReferences	Passage
Cross-reference SOP panel	Cross References	SOP lens on cross refs	SOP insights	fetched on demand	Passage
Study report generation	Study Report	Produces consolidated exegetical report	report sections JSON	sermon_study_reports.sections	Study
Study report EGW section	Study Report	Renders EGW section inside report	EGW report block	inside report sections	Study
Outline generation	Outlines	Generates 3 outline options	outline structures	sermon_outlines.structure	Outline
Outline point enrichment (current)	Outlines	Stores pointNodes with summary/subpoints/verses/themes/media/illustration	pointNodes[]	sermon_outlines.structure.pointNodes	Outline
Outline point app relation (current)	Outlines	Computes related apps from Applications tab	ranked app subset	derived in UI	Misplaced (should be Outline-owned data)
Outline point EGW support	Outlines	Fetches EGW support per point	EGW quote list	fetched on demand	Outline
Manuscript generation	Manuscript	Generates sermon manuscript	manuscript text + metadata	sermon_manuscripts.content	Write
Applications generation	Applications	Generates audience applications	application rows	sermon_applications	Study
Discussion questions generation	Questions	Generates questions	question rows	discussion_questions	Study
Illustrations generation	Illustrations	Generates illustrations	illustration rows	sermon_illustrations	Study
Citations generation	Citations	Generates supporting citations	citation rows	sermon_citations	Write
Citation validation	Citations	Verifies citation support	verification flags/errors	sermon_citations.isVerified + UI results	Refine
Socratic coach generation	Socratic Coach	Generates coaching questions	coach session JSON	workspace metadata/session payload	Refine
Coach answer feedback	Socratic Coach	Feedback on answers + rewrite hints	feedback object	metadata/session payload	Refine
Push coach to outline/manuscript	Socratic Coach	Applies feedback to artifacts	outline/manuscript updates	outline/manuscript persisted	Refine
Sermon DNA analysis	Sermon DNA	Runs integrity analysis	DNA analysis + issue report	sermon_dna_analyses, integrity payload	Refine
3D Canonical Constellation	Visualizations	Canonical graph exploration	interaction-side insights	UI-only unless saved as reference	Passage/Study support
Sanctuary/Prophecy Mapper	Visualizations	Prophecy/sanctuary relation map	interaction-side insights	UI-only	Passage/Study support
Prophecy Web	Visualizations	Prophecy fulfillment graph	interaction-side insights	UI-only	Passage/Study support
Sermon Flow Sculptor	Visualizations	Spatial sermon integrity view	interaction-side insights	UI-only	Refine support
Biblical Narrative Map	Visualizations	Timeline/storyline map	interaction-side insights	UI-only	Passage
Saved references from 3D	Visualizations/backend service	Adds refs into workspace	reference list	workspace.references JSONB	Study
Media Production Studio	Media	Creates delivery assets	media artifacts	media subsystem/workspace metadata	Deliver
DATA STRUCTURES (currently present/used)
workspace (sermon_workspaces)
workspace.scriptureCache
workspace.references
studyReports (sermon_study_reports.sections)
outlines (sermon_outlines.structure, structure.pointNodes)
manuscripts (sermon_manuscripts.content)
applications (sermon_applications)
discussionQuestions (discussion_questions)
illustrations (sermon_illustrations)
citations (sermon_citations)
dnaAnalyses (sermon_dna_analyses)
notes
aiConversations
workspace metadata (coach/integrity/session side data)
KNOWN PROBLEMS (from current code behavior)
Applications/Questions/Illustrations are generated in separate pages, but Outline also tries to show them via cross-tab matching.
Outline points use chips/toggles and can display “No related applications found in current Applications tab.” (ownership confusion).
Study Report does not own/render dedicated “study material cards” (apps/questions/illustrations/media/refs) as first-class outputs.
workspace.references exists but has weak explicit ownership in UI flow (created from 3D, not clearly surfaced as Study-owned material).
Cross-reference/thematic content appears in multiple places (Scripture panels, Study Report, Outline) without a single ownership rule.
Citations page mixes Write and Refine concerns (generation + validation).
study-report loading overlay appears twice in render conditions (duplicate overlay condition).
1) Feature -> Correct Workflow Step Mapping
Workflow Step	Features that should be owned here
Passage	Scripture lookup, passage summary, per-verse context, translation comparison, verse commentary, structural analysis, interpretive challenges, canonical theme tracing, study synthesis, word study, cross references, EGW passage panel, narrative map
Study	Study report, applications generation, discussion questions generation, illustrations generation, study references (workspace.references), media suggestions (if generated from study context)
Theme	Workspace-level sermon direction fields (theme, audience profile, sermon goals, style, story arc, theological lens, language, EGW mode)
Outline	Outline generation/selection/editing, pointNodes, point-level supporting verses/themes/subpoints, point-level EGW support display
Write	Manuscript generation/editing, citations generation/editing
Refine	Socratic coach, DNA integrity analysis, citation validation, coach push-to-outline/manuscript, sermon flow sculptor (as refinement aid)
Deliver	MediaProductionStudio
2) Features Currently Misplaced
Applications, Discussion Questions, Illustrations currently live as standalone Create pages but are conceptually Study-owned.
Outline page currently derives applications from Applications tab (cross-step dependency); point-level app ownership should be Outline data, not tab lookup.
Citation validation currently sits in Citations page (Write area), but belongs to Refine ownership.
3D-saved references are created in visualization flows but lack clear Study ownership/display path.
3) Duplicated Features
Application material appears in:
Applications page (generated rows)
Outline point “Applications” chip (derived lookup from applications rows)
Cross-reference/thematic intelligence appears in:
Scripture panels
Study report sections
Outline point references/themes
EGW support appears in:
Scripture EGW panel
Study report EGW section
Outline point EGW support
study-report loading overlay condition is duplicated in render.
4) Clean Feature Organization by Workflow Step (using existing features only)
Passage: all scripture intelligence + lexical + cross-reference + canonical tools.
Study: study report + applications/questions/illustrations generation + explicit ownership/display of saved references and study material.
Theme: workspace direction controls only.
Outline: structure + point-level sermon content only (no cross-tab dependency).
Write: manuscript + citation drafting.
Refine: coach + DNA + citation verification + refinement-only visualization aid.
Deliver: media studio outputs.
5) Simplification Suggestions (no new features)
Stop cross-tab data inference in Outline (remove “related applications from Applications tab” behavior).
Make Study Report the explicit owner view for study material outputs (apps/questions/illustrations/references) using existing stored data.
Keep Applications/Questions/Illustrations pages as editing/expansion views, not primary ownership views.
Move citation validation action under Refine ownership in navigation/labeling (feature stays the same).
Surface workspace.references in Study Report so 3D discoveries have a clear step owner.
Remove duplicated study-report loading overlay condition.
Keep 3D Visualizations page intact as exploration/refinement support, not primary data owner.


Right now your UI is feature-based, not workflow-based.

Example of your current navigation:

Workspace
Scripture
Word Study
Cross References
Study Report
Outlines
Manuscript
Applications
Questions
Illustrations
Citations
Socratic Coach
Sermon DNA
Visualizations
Media

This is a tool list, not a process.

So the user thinks:

Where should I go next?

And the system starts cross-referencing tabs, which caused the issues you saw:

outline reading applications from Applications tab

study report duplicating scripture insights

references appearing randomly

chips/toggles trying to connect things

The Fix

Do not organize navigation by tools.

Organize it by sermon workflow.

Correct Navigation Structure

Top level navigation should be only the workflow steps.

Theme
Passage
Study
Outline
Write
Refine
Deliver

Inside each step you show the tools.

Example
Theme

Tools inside:

Workspace settings
Series
Audience
Goals
Style
Story arc
EGW toggle
Passage

Tools inside:

Scripture lookup
Parallel translations
Verse commentary
Structural analysis
Interpretive challenges
Canonical themes
Word study
Cross references
Visualizations

Your current pages:

Scripture
Word Study
Cross References
Visualizations

become subsections of Passage, not separate pages.

Study

Tools inside:

Study report
Applications
Questions
Illustrations
References

Your current pages:

Study Report
Applications
Questions
Illustrations

become sections of Study.

Outline

Tools inside:

Generate outline
Edit outline
Point nodes
Verse evidence
EGW support

Your current page:

Outlines

stays mostly unchanged.

Write

Tools inside:

Manuscript editor
Citation generation
Citation editing

Current pages:

Manuscript
Citations

become sections here.

Refine

Tools inside:

Socratic coach
Sermon DNA
Citation validation
Flow sculptor

Your pages:

Socratic Coach
Sermon DNA

live here.

Deliver

Tools inside:

Slides
Media
Exports

Your page:

Media

already matches.

Why This Fix Solves Your Problems

Because the generation order becomes clear.

Users follow this flow:

Theme
↓
Passage
↓
Study
↓
Outline
↓
Write
↓
Refine
↓
Deliver

Then the rules become simple:

Creation order
Passage creates scripture intelligence
Study creates sermon ideas
Outline creates sermon structure
Write creates manuscript
Refine improves sermon
Deliver creates media

And the system never needs to guess:

where something came from
This Also Fixes Your Data Confusion

Example:

Applications.

Current confusion:

Applications page
Outline applications chip
Study report applications

Correct model:

Study creates applications
Outline selects applications
Write expands applications

One origin.

No duplication.

One More Important Rule

Every feature must answer:

Where is this created?

Example:

Illustrations

Created: Study
Selected: Outline
Expanded: Write

If the answer is unclear, the feature is misplaced.

Result

If you reorganize your navigation into workflow steps, 80% of the system complexity disappears without deleting a single feature.

Your app already has the right pieces.

They are just presented in the wrong structure.

Most sermon software fails because they do this:

Feature → new page

So the UI becomes:

Applications
Questions
Illustrations
Quotes
References
Themes
Media ideas
Object lessons
Stories
Examples
etc

This keeps growing forever.

You already started going down this path.

The Correct Pattern: Asset Panels

Instead of one page per feature, use asset panels inside the step that owns them.

Example: Study step

Instead of this navigation:

Study Report
Applications
Questions
Illustrations

Use this layout:

Study
 ├ Study Report
 ├ Study Assets

Inside Study Assets you show cards/panels.

Example UI

Study page:

--------------------------------------------------
Study Report
--------------------------------------------------

[ Generate Study Report ]

--------------------------------------------------
Study Assets
--------------------------------------------------

Applications
[ Generate ]  [ Edit ]

Questions
[ Generate ]  [ Edit ]

Illustrations
[ Generate ]  [ Edit ]

References
[ Saved from cross-refs / 3D ]

Media Ideas
[ Generate ]

Each section is a panel, not a page.

Why This Matters

Because sermon assets are the same type of thing:

Applications
Questions
Illustrations
Quotes
Examples
Stories
Media ideas
References

They are all study assets.

If each becomes a page, the system explodes.

If they are panels, the system stays simple.

Apply the Same Pattern Everywhere
Passage Step

Instead of separate pages:

Scripture
Word Study
Cross References
Visualizations

Use panels:

Passage
 ├ Scripture Viewer
 ├ Context Analysis
 ├ Structural Analysis
 ├ Cross References
 ├ Word Study
 ├ Visualizations
Outline Step

Instead of toggles/chips:

Subpoints
Verses
Themes
Applications
Media
EGW

Use fixed sections per point.

Example:

Point 1

Explanation
Subpoints
Scripture
Illustration
Application
Theme
Transition

Everything visible.

No chips.

Write Step

Use panels again:

Write
 ├ Manuscript
 ├ Citations
 ├ Scripture Inserts
Refine Step
Refine
 ├ Socratic Coach
 ├ Sermon DNA
 ├ Flow Visualization
The Key Principle

Every step contains two types of things:

Primary artifact
+
supporting tools

Example:

Study

Primary artifact

Study Report

Supporting tools

Applications
Questions
Illustrations
References
Outline

Primary artifact

Outline structure

Supporting tools

Verse evidence
EGW support
Write

Primary artifact

Manuscript

Supporting tools

Citations
Scripture formatting
Why This Works

The UI becomes:

7 steps

Instead of:

20 tools

Users think in steps, not tools.

Your Current System Is Actually Close

You already have the right data model:

scriptureCache
studyReports
applications
questions
illustrations
outlines
manuscripts
dna analyses

The issue is UI separation, not backend structure.

One More Rule That Will Save You Later

Never allow AI to generate something without a visible place to land.

Example:

Bad:

AI generated illustrations
but user must go find them in another tab

Good:

Study step
Generate illustrations
Illustrations appear immediately in Study Assets
Result if You Apply This

Your system becomes:

Theme
Passage
Study
Outline
Write
Refine
Deliver

Inside each step:

Primary artifact
+
asset panels

This keeps the app powerful but simple.

he one feature pastors almost always expect — and most sermon tools forget — is sermon flow / preaching movement.

Not outline.
Not manuscript.

Movement.

Pastors don’t preach like essays. They preach like journeys.

Example of how a sermon actually moves:

Hook
↓
Problem / tension
↓
Scripture exploration
↓
Truth revealed
↓
Application
↓
Call to action

Your system already has the pieces, but it doesn’t explicitly model the movement of the sermon.

Right now you have:

Outline → points
Manuscript → text

But what pastors actually think is:

Where is the tension?
Where is the emotional shift?
Where does the congregation feel hope?
Where does the call happen?

That is sermon flow.

Where This Feature Belongs

It belongs in Refine, not Outline.

Outline = structure
Flow = preaching dynamics

So it fits perfectly next to:

Socratic Coach
Sermon DNA
What It Should Analyze

The flow analyzer looks at the manuscript or outline and identifies:

1️⃣ Opening Hook

Does the sermon start with engagement?

Example signals:

question

story

tension

surprising statement

2️⃣ Tension

Is there a clear problem the sermon addresses?

Example:

People feel anxious
Faith feels distant
Life feels chaotic

Without tension sermons feel flat.

3️⃣ Revelation

Where the scripture truth resolves the tension.

Example:

Psalm 46: God is our refuge
4️⃣ Application

Where the truth meets life.

Example:

Trust God during uncertainty
5️⃣ Call to Action

What the audience should do or decide.

Example:

Pray
Trust
Repent
Forgive
Serve
What the Analyzer Would Produce

Something like:

Sermon Flow Analysis

Hook: weak
Tension: moderate
Revelation: strong
Application: strong
Call to Action: missing

And suggestions like:

Consider introducing tension earlier.
The call to action is unclear.
Application appears before the central revelation.
Why This Feature Matters

Because pastors often ask:

Is my sermon engaging?
Does it build momentum?

Not:

Is my outline correct?

This is exactly what your Sermon Flow Sculptor visualization is starting to do.

You already have the seed of this idea.

Where It Fits in Your Current System
Theme
Passage
Study
Outline
Write
Refine
Deliver

Flow analysis belongs in:

Refine

Together with:

Socratic Coach
Sermon DNA
Flow Sculptor
Example Refine Dashboard
Refine

Socratic Coach
Ask reflective questions

Sermon DNA
Integrity & theological balance

Flow Analysis
Hook / tension / resolution / application

Flow Sculptor
Visual sermon movement
Why This Feature Is Powerful

Most sermon tools focus on information.

Great preaching depends on movement.

That’s the difference between:

lecture

and

sermon
Good News

You already have 80% of the infrastructure:

outline

manuscript

DNA

flow sculptor

So this feature would not require a major architecture change.

It would simply interpret existing artifacts.


The big mistake almost every AI sermon generator makes with outlines is this:

They generate informational outlines, not preachable outlines.

Meaning the outline looks like a Bible study or essay, not something someone can actually preach.

Example of a typical AI outline:

1. God is our refuge
2. God is our strength
3. God helps in trouble

Technically correct.
But preaching-wise it’s weak.

There is no movement, no tension, no progression.

It feels flat.

What Preachable Outlines Actually Look Like

Good sermon outlines usually follow a progression.

Example:

1. When life feels unstable
2. God remains unshaken
3. Therefore we can stand firm

Notice what changed.

Each point moves the listener forward.

This creates momentum.

The Pattern Preachers Naturally Use

Most strong sermons follow a structure like this:

Observation
↓
Problem
↓
Truth
↓
Response

Example:

1. The storm is real
2. Fear is natural
3. God is present
4. Faith is the response

That is movement.

Why AI Fails Here

AI tends to summarize scripture instead of building a sermon journey.

So it outputs:

Point 1: God's power
Point 2: God's protection
Point 3: God's faithfulness

These are topics, not movements.

How Your System Can Prevent This

You already have the feature that enables it:

Story Arc

inside the Theme step.

Instead of letting outline generation be free-form, the system should guide it with a movement model.

Example arcs:

Problem → Truth → Response
Tension → Revelation → Transformation
Question → Exploration → Answer
Past → Present → Future
Fall → Redemption → Restoration

Then the outline generator uses that arc.

Example

Theme step:

Story Arc: Tension → Revelation → Response

Outline generation then produces something like:

1. Life often feels chaotic (Tension)
2. God is our refuge in the chaos (Revelation)
3. Therefore we can live without fear (Response)

Now the sermon moves.

Where This Fits in Your System

You already have:

Theme
story arc

So the outline generator should use:

theme
audience
story arc
passage synthesis

to create the outline.

Why This Matters

Pastors don’t ask:

What are three facts about this passage?

They ask:

How do I move people toward truth?

That’s why sermons feel powerful.

Good News

Your system already has the pieces:

Theme
Story arc
Outline generation
Flow sculptor
DNA analysis

You just need to make story arc influence outline generation.

No new infrastructure required.

The Final Principle

A sermon outline should always answer this question:

What changes between point 1 and the end of the sermon?

If nothing changes, the sermon is static.

If something transforms, the sermon moves.


The missing step between Passage and Study that dramatically improves sermon quality is:

Observation

Right now your workflow effectively jumps from:

Passage intelligence
↓
Generate sermon ideas

But good Bible study always includes a human or structured observation phase.

Most pastors naturally do this:

Read passage
↓
Observe what is actually there
↓
Then derive meaning
↓
Then derive application

AI tools usually skip observation and go straight to interpretation, which produces generic sermons.

What Observation Actually Means

Observation answers:

What does the text SAY?

Not:

What does it mean for life?

Example with Psalm 46:1

Observation:

God is called refuge
God is called strength
God is present in trouble

Interpretation:

God protects believers during crisis

Application:

Trust God during anxiety

Skipping observation leads to shallow interpretation.

Where This Fits in Your Workflow

Your current flow:

Theme
Passage
Study
Outline
Write
Refine
Deliver

The improved flow:

Theme
Passage
Observation
Study
Outline
Write
Refine
Deliver

But here is the key:

You do not need a new page.

Observation can live inside Study Report generation.

You Actually Already Have the Pieces

Your Study Report already generates:

overview
context
flow
structure
key terms
cross references
challenges
themes
pastoral implications

What’s missing is a clear observation section.

Something like:

Text Observations

Example output:

Key Observations

1. The psalm begins with a declaration of God’s character.
2. Natural disasters are used as imagery of chaos.
3. The city of God contrasts with the shaking earth.
4. The psalm shifts from fear to confidence.

This helps the outline generator work from the text itself, not just summaries.

Why This Improves AI Sermons

Without observation the generator works like this:

passage summary
↓
sermon ideas

With observation it becomes:

passage summary
↓
text observations
↓
sermon ideas

Which produces outlines like:

1. When the world feels unstable
2. God remains unshaken
3. Therefore we can live without fear

Instead of:

1. God's refuge
2. God's strength
3. God's help
Where It Fits in Your Current System

You already have:

Structural Analysis
Interpretive Challenges
Study Synthesis
Study Report

Observation would simply become another Study Report section:

Text Observations

No new data structure needed.

The Simple Rule

Your sermon system should move through these four intellectual phases:

Observation
↓
Interpretation
↓
Application
↓
Transformation

Your current system covers:

Interpretation
Application
Transformation

Observation just needs to be made explicit.

Why This Matters for Your Product

If you ever compare your system to other AI sermon tools, the difference will be:

Most tools produce devotional summaries.

Your system would produce actual exegesis-driven sermons.

That’s a huge difference for pastors.

The simplest way to clean up your Study step (without deleting any features you already have) is to separate two different things that are currently mixed:

Bible study
↓
Sermon material

Right now your Study area mixes both.

Example of what you currently have spread around:

Study Report
Applications
Questions
Illustrations
References

But these are actually two different layers of thinking.

The Two Layers Inside Study
Layer 1 — Exegesis (understanding the text)

This is Bible study.

Features you already have that belong here:

Study Report
overview
context
flow
structure
key terms
cross references
interpretive challenges
themes
EGW report section

This is understanding the passage.

Data source:

sermon_study_reports.sections
Layer 2 — Sermon Material

This is what you preach from the text.

Features you already have:

Applications
Questions
Illustrations
Saved references

Data sources:

sermon_applications
discussion_questions
sermon_illustrations
workspace.references

These are sermon assets, not Bible study.

Why This Separation Matters

Without this separation, users think:

Is this Bible study?
or
Is this sermon prep?

Pastors actually do:

Understand text
↓
Create sermon material

Two different cognitive steps.

The Clean Study Page Layout

Your Study page should simply show two sections.

STUDY

Exegesis
---------------------------------
Study Report

overview
context
structure
key terms
themes
cross references
interpretive challenges
EGW insights


Sermon Material
---------------------------------
Applications
Questions
Illustrations
References

Everything you already have fits into those two boxes.

No new features.

What This Immediately Fixes
Problem 1 — Scattered sermon assets

Right now these are separate pages:

Applications
Questions
Illustrations

Instead they become panels inside Sermon Material.

Problem 2 — Outline confusion

Now the logic becomes clear:

Study
creates sermon material

Outline simply selects from it.

Example:

Point 2
Application → select from Study assets
Illustration → select from Study assets
Problem 3 — References confusion

Your system has:

workspace.references

generated from visualizations.

These are study assets.

So they belong in:

Study → Sermon Material → References
The Simplified Mental Model

The Study step becomes:

Understand the text
+
Generate preaching material

Two boxes.

What the Final Study Page Looks Like
STUDY

[ Generate Study Report ]

---------------------------------
EXEGESIS
---------------------------------

Overview
Context
Structure
Key Terms
Cross References
Themes
Interpretive Challenges
EGW Insights

---------------------------------
SERMON MATERIAL
---------------------------------

Applications
Questions
Illustrations
References

That’s it.

Everything you already built fits here.

Why This Makes the Whole System Simpler

Because now the workflow becomes extremely clear:

Theme
↓
Passage
↓
Study
↓
Outline
↓
Write
↓
Refine
↓
Deliver

And Study has only two jobs:

Understand the text
Create sermon material

Nothing else.

The Most Important Benefit

This structure prevents the feature explosion problem.

Even if later you add:

Stories
Quotes
Statistics
Object lessons
Analogies

They all simply go under:

Study → Sermon Material

No new pages needed.


1. Final Workflow Structure

Your system should follow this single canonical workflow:

Theme
↓
Passage
↓
Study
↓
Outline
↓
Write
↓
Refine
↓
Deliver

Each step has one responsibility and one type of artifact it owns.

Step	Responsibility	Primary Artifact
Theme	sermon direction	workspace metadata
Passage	scripture intelligence	scriptureCache
Study	sermon material generation	studyReports + studyAssets
Outline	sermon structure	outlines
Write	sermon text	manuscripts
Refine	improvement + analysis	dna + coaching
Deliver	media assets	media outputs
2. Feature Ownership (Correct Mapping)
Theme

Purpose: sermon setup.

Features:

Title

Series

Main passage

Additional passages

Audience

Goals

Theological lens

Style

Story arc

Language

EGW toggle

Data owner:

sermon_workspaces
Passage

Purpose: scripture intelligence.

Pages/tools inside:

Scripture
Word Study
Cross References
Visualizations

Features:

scripture lookup

translation comparison

passage summary

per-verse context

verse commentary

structural analysis

interpretive challenges

canonical theme tracing

study synthesis

study notes

EGW passage insights

word study lookup

cross-reference lookup

cross-reference ranking

narrative map

canonical constellation

prophecy mapper

prophecy web

Data owner:

workspace.scriptureCache

Rule:

Passage produces analysis of scripture, not sermon ideas.

Study

Purpose: generate sermon material from the text.

This step should have two internal sections.

1️⃣ Exegesis

Tools:

Study report generation

Sections rendered:

overview

context

flow

structure

key terms

cross references

interpretive challenges

canonical themes

pastoral implications

EGW study section

Data owner:

sermon_study_reports.sections
2️⃣ Sermon Material

Panels:

Applications
Questions
Illustrations
References

Features:

Applications generation
Applications editing

Discussion questions generation
Questions editing

Illustrations generation
Illustrations editing

Saved references from visualizations

Data owners:

sermon_applications
discussion_questions
sermon_illustrations
workspace.references

Rule:

Study creates sermon ideas, not structure.

Outline

Purpose: organize the sermon.

Features:

generate outline options

select active outline

edit outline

reorder points

Structure fields:

Intro
Points
Conclusion
Call to Action

Each point contains:

title
summary
subpoints
scripture
themes
illustrations
applications
media
transition

Data owner:

sermon_outlines.structure
sermon_outlines.structure.pointNodes

Important rule:

Outline references study assets, but does not compute them.

Bad behavior you currently have:

"No related applications found in Applications tab"

Correct behavior:

Point → select application from Study assets
Write

Purpose: expand sermon structure into speech.

Features:

manuscript generation

manuscript editing

tone control

sermon duration

audience adaptation

Citation tools:

citation generation

citation editing

Data owners:

sermon_manuscripts
sermon_citations

Rule:

Write expands the outline.

Refine

Purpose: analyze and improve sermon quality.

Tools:

Socratic Coach
Sermon DNA
Flow Sculptor
Citation validation

Features:

generate Socratic questions

coaching feedback

push improvements to outline

push improvements to manuscript

run sermon DNA analysis

integrity score

issue detection

mentor pattern insights

citation validation

sermon flow visualization

Data owners:

sermon_dna_analyses
coach session metadata
citation verification flags
Deliver

Purpose: produce publishing assets.

Tools:

Media Production Studio

Outputs:

slides

presentation decks

promotional media

export formats

Data owner:

media subsystem
3. UI Structure (Important)

Navigation should be workflow-based, not tool-based.

Top level navigation:

Theme
Passage
Study
Outline
Write
Refine
Deliver

Inside each step you show panels/tools, not separate navigation pages.

Example:

Study step layout:

Study

Generate Study Report

--------------------------------
Exegesis
--------------------------------

Overview
Context
Structure
Key Terms
Themes
Cross References
Challenges

--------------------------------
Sermon Material
--------------------------------

Applications
Questions
Illustrations
References

This prevents feature explosion.

4. Rules That Prevent Future Complexity

These are the architectural rules your system should enforce.

Rule 1 — Birth Step

Every feature must answer:

Where is this created?

Example:

Applications → Study
Illustrations → Study
Outline → Outline
Manuscript → Write

Later steps can only consume it.

Rule 2 — No Cross-Tab Inference

Bad pattern:

Outline tries to read Applications tab

Correct pattern:

Study creates assets
Outline references them
Rule 3 — Artifact Chain

Every artifact derives from the previous step.

Passage → scripture intelligence
Study → sermon material
Outline → sermon structure
Write → sermon manuscript
Refine → improvements
Deliver → media

Never skip steps.

Rule 4 — AI Output Must Land Somewhere

AI generation should never create invisible content.

Example:

Bad:

AI generated illustrations
but user must go find them elsewhere

Good:

Generate → appears immediately in Study assets
5. Minor Fixes Based on Your Current System

These are small but important improvements.

Fix 1

Remove outline behavior:

"No related applications found in Applications tab"

Outline should link assets, not discover them.

Fix 2

Surface

workspace.references

in Study → Sermon Material → References.

Currently it is hidden.

Fix 3

Separate responsibilities of citations:

Write:

generate citations
edit citations

Refine:

validate citations
Fix 4

Remove duplicated study report loading overlay condition.

Fix 5

Ensure scripture intelligence appears only in:

Passage

Study should only summarize it, not regenerate it.

Final Result

Your system becomes:

Theme
   workspace setup

Passage
   scripture intelligence

Study
   exegesis + sermon material

Outline
   sermon structure

Write
   manuscript

Refine
   coaching + diagnostics

Deliver
   media outputs

And every feature you already built fits cleanly into it.

Make the Outline Generator Use the Workspace Context

Right now you collect excellent inputs in Theme / Workspace:

theme

audience

goals

theological lens

style

story arc

language

EGW mode

But most outline generators ignore most of this and only use:

passage
study summary

That’s why outlines often feel generic.

Instead, the outline generator should explicitly consume the workspace context.

The Inputs the Outline Generator Should Use

The outline generation prompt/context should always include:

Main passage
Passage synthesis
Study report highlights
Theme
Audience
Goals
Story arc
Theological lens
Style
Language
EGW toggle

So the model is not just answering:

What does this passage say?

But:

How should this passage be preached to THIS audience with THIS goal and THIS story arc?
Example

Same passage:

Psalm 46

Different workspace inputs produce different outlines.

Youth audience

Story arc:

Problem → Truth → Response

Outline might become:

1. Life sometimes feels chaotic
2. God remains steady when life shakes
3. We can trust Him even in uncertainty
Evangelistic audience

Story arc:

Question → Answer → Invitation

Outline might become:

1. Where can we find security in a broken world?
2. The Bible reveals God as our refuge
3. Today you can place your trust in Him
Mature church audience

Story arc:

Observation → Revelation → Transformation

Outline might become:

1. The psalm describes a world that is shaking
2. Yet God’s presence stabilizes His people
3. The church can live with fearless confidence

Same passage.

Completely different sermon.

Where This Fits in Your System

The outline generator should combine:

workspace metadata
+
study report synthesis
+
passage intelligence

To generate:

outline options

You already have the fields stored in:

sermon_workspaces
sermon_study_reports
workspace.scriptureCache

So this requires no new infrastructure.

Only a better generation context.

The Internal Outline Generation Flow
1. Gather workspace context
2. Gather passage intelligence
3. Gather study synthesis
4. Apply story arc
5. Generate outline options

Example pipeline:

workspace
   theme
   audience
   goals
   storyArc

+

scriptureCache
   passageSummary
   structuralAnalysis
   canonicalThemes

+

studyReport
   pastoralImplications
   keyTerms
   challenges

↓

outline generation
One Small Adjustment to Outline Structure

Your current outline stores:

pointNodes
summary
subpoints
verses
themes
media
illustrations

Add one conceptual expectation (not a new field necessarily):

Each point should represent a movement in the sermon.

Meaning the points should progress.

Example:

Bad outline:

1 God's power
2 God's protection
3 God's help

Good outline:

1 When the world feels unstable
2 God remains our refuge
3 Therefore we can live without fear

The difference is movement.

How to Encourage Movement

Your generator should check:

Does each point logically progress from the previous one?

You already have tools that can evaluate this later:

Sermon DNA
Flow Sculptor

So outline generation only needs to aim for movement, not perfection.

Final Outline Generation Context

Your generator prompt should conceptually look like this:

Inputs

Passage
Passage summary
Structural analysis
Study report highlights

Workspace context
Theme
Audience
Goals
Story arc
Style
Language
EGW mode

Task

Generate 3 sermon outline options that:
- follow the selected story arc
- progress logically between points
- remain faithful to the passage
- serve the audience and goals
Why This Matters

Most AI sermon tools produce:

passage summaries

Your system can produce:

context-aware sermons

Which is a major difference for pastors.

What You Now Have (Complete System)

Your platform now has a clear architecture:

Theme
workspace direction

Passage
scripture intelligence

Study
exegesis + sermon material

Outline
sermon structure

Write
manuscript

Refine
coaching + diagnostics

Deliver
media outputs

All your existing features now fit cleanly into that workflow.


Right now your outline points use chips like:

Subpoints
Verses
Themes
Applications
Media
EGW

This creates three problems:

Users must hunt through toggles to see content.

It encourages cross-tab dependencies.

It hides sermon flow.

The fix is simple.

Replace Chips With Fixed Point Sections

Each point should always render the same structured layout.

Example:

Point 1
--------------------------------

Title
Summary

Subpoints

Scripture

Illustration

Application

Theme

Transition

No toggles.
No chips.

Everything is visible.

Example Point UI
Point 1: When the world feels unstable
------------------------------------------------

Summary
The psalm opens with the image of a shaking earth,
describing the instability people experience in life.

Subpoints
• Natural disasters symbolize chaos
• Fear emerges when stability disappears

Scripture
Psalm 46:1–3

Illustration
Story of a family during a major storm

Application
Trust God when life feels uncertain

Theme
God remains our refuge even in chaos

Transition
If chaos reveals our fear, the next verses reveal God's stability.
Where Study Assets Fit

Your Study step generates:

Applications
Questions
Illustrations
References

In the Outline page, you simply allow selection.

Example:

Illustration section:

Illustration

[ Select from Study Assets ]
[ Add new ]

Selected:
Storm survival story

Application section:

Application

[ Select from Study Assets ]
[ Add new ]

Selected:
Trust God during uncertainty

No cross-tab inference.

Why This Works Better

Because sermon points actually contain the same types of information.

The structure is always:

Idea
Explain
Illustrate
Apply
Move forward

Your UI should mirror that.

Minimal Data Model Change

Your current structure already supports this.

You have:

pointNodes
summary
subpoints
verses
themes
media
illustrations

You just render them as fixed sections instead of chips.

Optional Improvement (but powerful)

Add one more optional field per point:

movement

Example values:

tension
truth
response

This helps:

Flow Sculptor
Sermon DNA

understand sermon movement.

But it is optional.

Final Outline Page Layout
Outline

Intro

Point 1
   Title
   Summary
   Subpoints
   Scripture
   Illustration
   Application
   Theme
   Transition

Point 2
   Title
   Summary
   Subpoints
   Scripture
   Illustration
   Application
   Theme
   Transition

Conclusion

Call to Action
Result

You eliminate:

chip toggles
cross-tab asset guessing
hidden content

And the Outline page becomes the central sermon editor.

What Your System Now Has

You now have a complete, coherent design:

Theme
sermon direction

Passage
scripture intelligence

Study
exegesis + sermon material

Outline
sermon structure

Write
manuscript

Refine
coaching + diagnostics

Deliver
media outputs

Everything you already built fits cleanly.

Here is the small backend adjustment that will make the Study → Outline relationship clean and future-proof without changing your architecture.

Right now your system likely behaves like this:

Study step
   applications table
   illustrations table
   questions table

Outline step
   pointNodes contain their own versions of applications / illustrations

or the UI tries to infer them from other tabs.

That creates the problem you already saw:

"No related applications found in Applications tab"

The correct solution is simple asset linking.

The Core Idea

Study creates assets.

Outline points reference those assets by ID, instead of copying them.

Study → creates assets
Outline → selects assets
Write → expands assets
Your Current Tables

You already have something like:

sermon_applications
discussion_questions
sermon_illustrations
sermon_outlines

Good.

We only need to adjust pointNodes.

Current Outline Structure (likely)

Your pointNodes probably look like this:

pointNodes

title
summary
subpoints
verses
themes
illustrations
applications
media

The problem is those fields often contain text copies.

Instead they should store references.

Correct Point Node Structure

Example:

pointNodes: [
  {
    "id": "point1",
    "title": "When the world feels unstable",
    "summary": "...",

    "verses": ["Psalm 46:1-3"],

    "illustrationIds": ["illustration_23"],
    "applicationIds": ["application_9"],
    "questionIds": ["question_4"],

    "themes": ["God as refuge"]
  }
]

Notice:

illustrationIds
applicationIds
questionIds

These reference rows in the Study tables.

Example Study Tables

Applications table:

sermon_applications

id
workspace_id
text
audience_tag
created_at

Illustrations table:

sermon_illustrations

id
workspace_id
title
content
source
created_at

Questions table:

discussion_questions

id
workspace_id
question
created_at
How Outline Uses Them

When editing a point:

User sees:

Application

[ Select from Study Assets ]
[ Create new ]

System stores:

applicationIds: ["application_9"]

Not the text.

Why This Is Important

Without asset references, problems happen:

Problem 1

Editing application in Study doesn't update Outline.

Problem 2

Same application duplicated in many places.

Problem 3

Manuscript generation becomes messy.

With Asset References

Everything stays synchronized.

Example flow:

Study
   application_9 = "Trust God in chaos"

Outline
   point2.applicationIds = [application_9]

Write
   manuscript references application_9

Edit application once → updates everywhere.

Manuscript Generation

Manuscript generator can then expand assets.

Example:

Point 2

Explanation
Illustration → illustration_23
Application → application_9
Why This Is a Small Change

You do not need new tables.

You only need to ensure:

pointNodes store asset IDs

instead of raw text.

One Optional Improvement (Nice but not required)

Add a generic asset registry concept.

Example:

study_assets

id
type
workspace_id
payload

Types:

application
illustration
question
reference

But you do not need this now.

Your current tables already work fine.

The Clean Data Flow

Your system becomes:

Theme
   workspace config

Passage
   scriptureCache

Study
   applications
   questions
   illustrations
   references

Outline
   pointNodes referencing study assets

Write
   manuscript expanding outline

Refine
   DNA / coaching

Deliver
   media

Everything now flows forward only.

Result

This change eliminates:

cross-tab asset guessing
duplicate content
outline dependency on other pages

And it makes the architecture stable long-term.


The improvement is about how your studyReports.sections are structured so that later steps (Outline and Write) can reliably use them.

Right now your study report probably looks roughly like this:

{
  "overview": "...",
  "context": "...",
  "flow": "...",
  "structure": "...",
  "keyTerms": "...",
  "crossReferences": "...",
  "interpretiveChallenges": "...",
  "themes": "...",
  "pastoralImplications": "..."
}

This works for display, but it is not ideal for AI reuse later when generating outlines or manuscripts.

The problem is that AI must re-interpret large paragraphs every time.

Instead, you want the study report to contain structured insights that are easy to retrieve.

The Improvement: Add Structured Insight Blocks

Inside studyReports.sections, introduce a structured list like this:

{
  "observations": [],
  "themes": [],
  "tensions": [],
  "movements": [],
  "preachingInsights": []
}

These are derived from the study report, not new features.

1. Observations

These capture what the text explicitly shows.

Example:

"observations": [
  "The psalm opens with a declaration of God's character.",
  "Natural disasters symbolize instability.",
  "The city of God contrasts with the shaking earth."
]

Why useful:

Outline generation often needs text-driven insights.

2. Themes

You already generate themes but they should be normalized.

Example:

"themes": [
  "God as refuge",
  "Faith during crisis",
  "Divine presence"
]

These help:

outline titles

sermon direction

sermon DNA analysis

3. Tensions

These are interpretive or emotional tensions.

Example:

"tensions": [
  "Fear vs trust",
  "Chaos vs divine stability"
]

This is extremely useful for sermon hooks and openings.

4. Movements

Movements describe how the passage progresses.

Example:

"movements": [
  "Chaos described",
  "God's refuge declared",
  "Confidence established"
]

This helps generate better outlines.

5. Preaching Insights

These are distilled pastoral insights.

Example:

"preachingInsights": [
  "Faith grows when believers see God's presence in chaos.",
  "The church can live with confidence despite instability."
]

These feed:

outline summaries

manuscript paragraphs

Example Full Study Report Structure

Your improved structure would look like this:

{
  "overview": "...",
  "context": "...",
  "flow": "...",
  "structure": "...",
  "keyTerms": "...",

  "observations": [
    "...",
    "...",
    "..."
  ],

  "themes": [
    "...",
    "...",
    "..."
  ],

  "tensions": [
    "...",
    "...",
    "..."
  ],

  "movements": [
    "...",
    "...",
    "..."
  ],

  "preachingInsights": [
    "...",
    "...",
    "..."
  ],

  "crossReferences": "...",
  "interpretiveChallenges": "...",
  "pastoralImplications": "...",
  "EGWInsights": "..."
}
Why This Helps Your System

Because later steps can retrieve precise structured inputs.

Outline generation

Instead of feeding the entire study report, you can give:

movements
themes
tensions
preachingInsights
Manuscript generation

It can use:

preachingInsights
themes
applications
illustrations
Sermon DNA

It can analyze:

themes
tensions
applications
The Big Benefit

This reduces AI hallucination and drift.

Because the model no longer has to reinterpret paragraphs each time.

It receives structured insights extracted from the passage.

Important

This change does not require new tables.

You can store these directly inside:

sermon_study_reports.sections

as additional fields.

Final Architecture (with this improvement)

Your system now has a clean pipeline:

Theme
↓
Passage → scriptureCache
↓
Study → studyReports + studyAssets
↓
Outline → outlines.pointNodes
↓
Write → manuscripts
↓
Refine → dna + coaching
↓
Deliver → media

And the study report becomes the intelligence layer that powers the rest of the system.


This is the last structural improvement I would recommend, and it is mainly about keeping the system maintainable as AI features grow.

Right now your architecture already has the right pipeline:

Theme → Passage → Study → Outline → Write → Refine → Deliver

The risk as the system grows is that each AI feature starts calling the model independently, each with its own prompt and context. That eventually leads to:

duplicated prompt logic

inconsistent outputs

features drifting apart

difficult debugging

The improvement is to introduce a Generation Context Layer.

The Idea: One Shared Generation Context

Before any AI generation happens, build a single structured context object that represents the sermon workspace.

Think of it as a snapshot of the sermon state.

Example:

{
  "workspace": {
    "title": "...",
    "theme": "...",
    "audience": "...",
    "goals": "...",
    "style": "...",
    "storyArc": "...",
    "language": "...",
    "egwEnabled": true
  },
  "passage": {
    "reference": "Psalm 46",
    "summary": "...",
    "structuralAnalysis": "...",
    "canonicalThemes": [...]
  },
  "study": {
    "observations": [...],
    "themes": [...],
    "tensions": [...],
    "movements": [...],
    "preachingInsights": [...]
  },
  "studyAssets": {
    "applications": [...],
    "questions": [...],
    "illustrations": [...],
    "references": [...]
  },
  "outline": {
    "points": [...]
  }
}

Every AI feature receives this same structured input.

How Each Step Uses It
Study generation

Uses:

workspace
passage

Produces:

studyReports
studyAssets
Outline generation

Uses:

workspace
passage
study.observations
study.movements
study.themes
studyAssets

Produces:

outlines
Manuscript generation

Uses:

workspace
outline
studyAssets

Produces:

manuscripts
Refine tools

Use:

workspace
outline
manuscript
study

Produces:

coaching suggestions
DNA diagnostics
Why This Matters

Without a shared context layer, each feature will start doing things like:

feature A → fetch passage
feature B → fetch study report
feature C → fetch outline

Eventually each feature builds its own context slightly differently.

That leads to inconsistent AI behavior.

With a context layer:

AI features become simple functions

Example:

generateStudy(context)
generateOutline(context)
generateManuscript(context)
analyzeSermonDNA(context)

All features receive the same structured input.

Implementation (Simple)

You do not need new tables.

You only need a context builder service.

Example concept:

buildWorkspaceContext(workspaceId)

Internally it collects:

workspace metadata

scriptureCache

studyReports

studyAssets

outlines

manuscripts

and produces the structured object.

Benefits

Consistency

All AI features see the same state.

Better prompts

You can design prompts around a stable schema.

Debugging

You can log the full context used for a generation.

Future AI tools

New features can plug in easily.

Example future tools:

sermon title generator
sermon summary generator
social post generator
small group guide generator

All use the same context.

Final Architecture Summary

Your system now has five clean layers.

1. Workspace
sermon_workspaces

Sermon direction.

2. Passage Intelligence
scriptureCache

Scripture analysis.

3. Study Intelligence
sermon_study_reports
studyAssets tables

Exegesis + sermon material.

4. Sermon Artifacts
sermon_outlines
sermon_manuscripts

Structure and text.

5. Diagnostics & Delivery
sermon_dna_analyses
coach sessions
media outputs

Refinement and publishing.

The System You Now Have

Conceptually your platform now works like this:

Theme
 ↓
Passage intelligence
 ↓
Study intelligence
 ↓
Sermon structure
 ↓
Sermon manuscript
 ↓
Sermon refinement
 ↓
Media delivery

Each step has clear ownership, clean data flow, and no cross-tab guessing.

Add a Persistent “Sermon Workspace Canvas”

Right now the user navigates between pages:

Theme
Passage
Study
Outline
Write
Refine
Deliver

Even if the architecture is correct, the user still feels like they are jumping between tools.

Pastors don’t think in tools.
They think in building a sermon in one place.

The solution is to introduce a persistent canvas panel that is always visible.

The Sermon Canvas Concept

The canvas shows the current sermon artifact evolving through the workflow.

Example layout:

-------------------------------------------------
Left Sidebar              Main Canvas
-------------------------------------------------
Theme                     Sermon Workspace
Passage
Study                     Current Outline
Outline
Write                     or Manuscript
Refine
Deliver

The canvas changes what it renders, but it is always the same workspace area.

What Appears in the Canvas by Step
Theme

Canvas shows:

Sermon Setup
Title
Series
Audience
Goals
Story arc
Style
Passage

Canvas shows:

Passage Viewer
Parallel translations
Context panels
Structure
Cross references
Word study
Study

Canvas shows:

Study Report

Exegesis
Overview
Context
Structure
Themes

Sermon Material
Applications
Questions
Illustrations
References
Outline

Canvas shows:

Sermon Outline

Intro

Point 1
Point 2
Point 3

Conclusion
Call to action
Write

Canvas shows:

Manuscript Editor
Refine

Canvas shows:

Sermon Diagnostics

DNA
Flow analysis
Coach insights
Deliver

Canvas shows:

Slides
Exports
Media
Why This Is Important

Right now users feel like they are opening different tools.

With a persistent canvas they feel like:

I am working on ONE sermon

The workspace becomes the sermon itself, not the features.

Another Small UX Trick

Always show the current sermon artifact at the top of the canvas.

Example in Study step:

Current Outline (Preview)

1.
2.
3.

Even before the user opens the Outline step.

This keeps the sermon visible at all times.

What This Changes

Instead of thinking:

I go to Applications tab
I go to Illustrations tab
I go to Outline tab

Users think:

I am building this sermon

The system just gives them tools along the way.

The Complete Product Model You Now Have

You now have a very strong architecture:

Workflow
Theme
Passage
Study
Outline
Write
Refine
Deliver
Intelligence Layers
scriptureCache → passage intelligence
studyReports → exegesis insights
studyAssets → sermon material
Sermon Artifacts
outlines → structure
manuscripts → full sermon
Diagnostics
Sermon DNA
Socratic Coach
Flow Sculptor
Delivery
slides
media
exports
What Makes Your System Different

Most AI sermon tools do this:

Paste passage → generate sermon

Your system supports the real sermon preparation process:

Understand text
↓
Generate sermon ideas
↓
Structure sermon
↓
Write sermon
↓
Refine sermon
↓
Deliver sermon

That’s why the architecture you now have is actually quite strong.

Remove separate asset pages (Applications / Questions / Illustrations)

Right now you have these as standalone pages:

Applications
Questions
Illustrations

Technically they work, but UX-wise they break the workflow.

They create the feeling that the user must leave the sermon to generate pieces of it.

Example of the current mental flow:

Study
↓
Go to Applications page
↓
Generate applications
↓
Go back to Outline
↓
Go to Illustrations page
↓
Generate illustrations
↓
Go back to Outline

This interrupts the sermon-building process.

The Better Model

Applications, Questions, and Illustrations should exist as Study Assets Panels, not as separate pages.

They belong inside Study.

So instead of navigation like:

Study Report
Applications
Questions
Illustrations

You have:

Study
   Exegesis
   Sermon Material

Inside Sermon Material:

Applications
Questions
Illustrations
References
Example Study Page Layout
Study

[ Generate Study Report ]

------------------------------------------------
Exegesis
------------------------------------------------

Overview
Context
Structure
Themes
Interpretive Challenges
Cross References
EGW Insights

------------------------------------------------
Sermon Material
------------------------------------------------

Applications
   [Generate]
   [Edit]

Questions
   [Generate]
   [Edit]

Illustrations
   [Generate]
   [Edit]

References
   Saved from cross refs / visualizations

Everything stays in one place.

What Happens to the Existing Pages

You do not delete their functionality.

You simply convert them into modals or panels.

Example:

Click Generate Applications → modal opens with:

Prompt override
Generate
Edit results
Save

Same for questions and illustrations.

Why This Matters

Because pastors think like this:

Understand the passage
↓
Think about applications
↓
Think about illustrations

All part of the same step.

Not separate tools.

What This Also Fixes

This change automatically removes the problem you described earlier:

"No related applications found in Applications tab"

Because Outline will always reference Study assets, which are visible inside Study.

Your Navigation Becomes Much Cleaner

Instead of this:

Workspace
Scripture
Word Study
Cross References
Study Report
Outlines
Manuscript
Applications
Questions
Illustrations
Citations
Socratic Coach
Sermon DNA
Visualizations
Media

You get:

Theme
Passage
Study
Outline
Write
Refine
Deliver

Everything else becomes panels inside those steps.

The Result

You reduce navigation complexity by almost half without removing any features.

And the user experience becomes:

I am preparing a sermon

instead of:

I am navigating tools
Final Architecture You End Up With
Theme
   workspace metadata

Passage
   scripture intelligence

Study
   exegesis
   sermon material (applications/questions/illustrations/references)

Outline
   sermon structure

Write
   manuscript + citations

Refine
   DNA + coaching + flow diagnostics

Deliver
   slides + media outputs

Every feature you already built fits naturally into this structure.

Multiple Independent AI Generations

Right now the system likely generates things like this:

Study Report → generated
Applications → generated
Outline → generated
Manuscript → generated

Each generation runs independently.

That creates a common AI problem:

Study says one thing
Outline says another
Manuscript drifts even further

Example problem:

Study insight:
God’s refuge removes fear.

Outline point:
God gives strength during trials.

Manuscript:
God teaches us patience through suffering.

All valid ideas — but not coherent.

The sermon loses a clear message.

The Fix: Introduce a Sermon Thesis

Before Outline generation, the system should establish a single guiding statement for the sermon.

This is often called:

Big Idea
Central Truth
Sermon Thesis

Your system already has a place for this:

Theme step

You just need to make it explicitly used everywhere.

Example Thesis
God remains a refuge for His people even when life feels unstable.
How Each Step Uses It
Study

Study insights should align with the thesis.

Example:

Theme: God as refuge
Observation: Chaos imagery
Tension: Fear vs trust
Outline

Every point should develop the thesis.

Example:

1 When life feels unstable
2 God remains our refuge
3 Therefore we can trust Him
Manuscript

Every section should reinforce the thesis.

Refine (DNA)

The DNA analyzer should check:

Does the sermon consistently support the thesis?
Implementation (Very Small)

Add a field to workspace metadata:

sermon_thesis

Example:

workspace.sermonThesis

It can be:

user-written
or
AI-generated
Generation Order
Theme
↓
Generate Thesis
↓
Study
↓
Outline
↓
Write
Outline Generation Example

Instead of prompting the model like:

Generate an outline for Psalm 46

You prompt:

Generate an outline that develops this thesis:

"God remains a refuge for His people even when life feels unstable."

Passage: Psalm 46
Audience: youth
Story arc: tension → truth → response

Now the outline becomes focused.

Why This Matters

Without a thesis, AI produces topic-based sermons.

Example:

1 God's power
2 God's presence
3 God's protection

With a thesis, sermons become argument-driven.

Example:

1 The world feels unstable
2 God remains our refuge
3 We can live without fear

The sermon has a direction.

Where It Fits in Your System
Theme
   thesis

Passage
   scripture intelligence

Study
   exegesis insights

Outline
   points that develop thesis

Write
   manuscript reinforcing thesis

Refine
   check alignment
Bonus: Thesis Consistency Check

Your Sermon DNA tool could easily add a rule like:

Check if outline points support thesis.

If not:

Flag drift.
The Final Design Rule

Every sermon artifact must answer:

How does this support the thesis?

If something does not support the thesis, it likely does not belong in the sermon.

Result

This one small rule prevents:

AI drift
conflicting interpretations
weak outlines
unfocused manuscripts

And it makes the whole system feel intentional and coherent.

The goal now is to standardize how every AI generation happens so Study, Outline, and Manuscript all stay aligned.

Right now each generator probably has its own prompt. Over time that leads to:

inconsistent tone

different interpretations

drift from the thesis

duplication of logic

Instead you want one canonical prompt structure that every generator uses.

The Standard Sermon Generation Prompt Structure

Every generation should conceptually follow this structure:

CONTEXT
PASSAGE
STUDY INTELLIGENCE
SERMON THESIS
AUDIENCE CONTEXT
TASK
OUTPUT FORMAT

This guarantees that every AI step works from the same foundation.

1️⃣ CONTEXT

Basic workspace information.

Example:

Sermon Title
Theme
Audience
Goals
Style
Story Arc
Language
EGW mode

This tells the model how the sermon should feel.

2️⃣ PASSAGE

Scripture information.

Example:

Passage reference
Passage text
Passage summary
Structural analysis
Canonical themes

This keeps the generation grounded in the text.

3️⃣ STUDY INTELLIGENCE

Derived insights from the Study step.

Example:

Observations
Themes
Tensions
Movements
Preaching insights

These are the raw materials for preaching.

4️⃣ SERMON THESIS

Single guiding statement.

Example:

Central thesis:

"God remains a refuge for His people even when life feels unstable."

Every generation must support this thesis.

5️⃣ AUDIENCE CONTEXT

This ensures the sermon fits the congregation.

Example:

Audience: youth
Setting: church service
Goal: encourage trust during anxiety
6️⃣ TASK

This section changes depending on the feature.

Examples:

Study generator
Task:
Generate structured study insights from the passage.
Outline generator
Task:
Create a sermon outline that develops the thesis and follows the story arc.
Manuscript generator
Task:
Expand the outline into a full sermon manuscript suitable for preaching.
7️⃣ OUTPUT FORMAT

Always specify structured output.

Example:

Outline format
Return JSON:

{
  "intro": "...",
  "points": [
    {
      "title": "...",
      "summary": "...",
      "subpoints": [],
      "scriptures": []
    }
  ],
  "conclusion": "...",
  "callToAction": "..."
}

This keeps outputs predictable.

Example: Outline Generation Prompt

Conceptually:

CONTEXT
Theme: God's refuge in chaos
Audience: young adults
Story arc: tension → truth → response

PASSAGE
Psalm 46
Summary: ...

STUDY INTELLIGENCE
Observations: ...
Themes: ...
Tensions: ...
Movements: ...

SERMON THESIS
God remains a refuge for His people even when life feels unstable.

TASK
Generate three sermon outline options that develop this thesis and follow the story arc.

OUTPUT FORMAT
Return JSON outlines.
Why This Works

Every generator now uses the same intellectual foundation.

Meaning:

Study → supports thesis
Outline → develops thesis
Manuscript → reinforces thesis

Instead of drifting.

The Internal Pipeline

With this structure your system behaves like:

workspace context
↓
passage intelligence
↓
study intelligence
↓
outline
↓
manuscript
↓
refinement

Each step uses the same core context object.

Practical Implementation

Each feature should call something like:

buildGenerationContext(workspaceId)

Which collects:

workspace metadata
scriptureCache
studyReports
studyAssets
outline

Then the generator only adds:

task instructions
output schema
Result

Your AI outputs become:

more consistent

more theologically coherent

easier to debug

easier to extend later

And every feature behaves like a stage in one sermon-building process, not a separate AI tool.

The biggest mistake AI sermon tools make with Study reports is this:

They produce beautiful but unusable text.

Example of a typical AI study output:

"This passage reminds believers that God is faithful and present during difficult circumstances, encouraging trust and spiritual perseverance."

That sounds nice, but it is not actionable for sermon generation.

It does not help the system generate:

better outlines

better manuscripts

better applications

It’s devotional language, not analytical insight.

The Correct Rule for Study Reports

Study reports must produce sermon-building materials, not devotional commentary.

Every section should answer one of these questions:

What does the text show?
What tension exists in the passage?
How does the passage move?
What truth resolves the tension?
Why does this matter pastorally?

If the report only contains paragraphs, it becomes hard for the AI to reuse later.

The Ideal Study Report Structure

Your Study report should contain two layers:

Layer 1 — Human-readable explanation

This is what the pastor reads.

Example:

Overview
Context
Structure
Key terms
Cross references
Interpretive challenges
Pastoral implications

This is good for the UI.

Layer 2 — Structured sermon insights

These are machine-friendly insights used later.

Example:

{
  "observations": [],
  "themes": [],
  "tensions": [],
  "movements": [],
  "preachingInsights": []
}

These power:

outline generation

manuscript generation

sermon DNA analysis

Example Using Psalm 46
Observations
The psalm opens with a declaration of God's character.
Natural disasters are used as imagery of chaos.
The city of God contrasts with the shaking earth.
Themes
God as refuge
Faith during crisis
Divine presence
Tensions
Fear vs trust
Chaos vs divine stability

These are powerful sermon hooks.

Movements
Chaos described
God's refuge declared
Confidence established

This helps the outline generator.

Preaching Insights
Believers can remain calm because God's presence stabilizes their lives.
Faith grows when we see God's sovereignty over chaos.

These become outline summaries and manuscript paragraphs.

Why This Structure Is Critical

Without it, the outline generator must re-interpret paragraphs every time.

That leads to:

AI drift
weak outlines
inconsistent sermons

With structured insights, the system can pull exactly what it needs.

Example:

Outline generation may only use:

movements
themes
tensions

Manuscript generation may use:

preachingInsights
applications
illustrations
Your System Is Already Close

You already generate:

overview
context
flow
structure
key terms
cross refs
challenges
themes
pastoral implications

You just need to add the structured insight layer inside studyReports.sections.

No new tables needed.

The Simple Rule

Every Study report should produce five reusable insight types:

observations
themes
tensions
movements
preachingInsights

These become the intelligence layer of your system.

Your System After This Improvement

Your pipeline becomes very powerful:

Passage → scripture intelligence
↓
Study → structured sermon insights
↓
Outline → sermon structure
↓
Write → manuscript
↓
Refine → coaching + diagnostics
↓
Deliver → media

Everything flows forward cleanly.

The one feature pastors subconsciously look for when preparing a sermon — and most software completely ignores — is:

Sermon Focus Check (Clarity of the Message)

Pastors constantly ask themselves a simple question:

“What is the one thing people should remember from this sermon?”

Not:

the outline

the manuscript

the applications

But the single sentence that captures the message.

In preaching theory this is often called:

Big Idea

Central Truth

Fallen Condition Focus (FCF) (in some traditions)

Proposition

Sermon Thesis

Your system already has pieces of this, but it is not yet actively enforced.

The Problem Without This Feature

AI can produce:

Good study
Good outline
Good manuscript

But the sermon can still feel unfocused.

Example outline:

1 God protects
2 God strengthens
3 God guides

These are all true — but the listener leaves thinking:

“What was the sermon about?”

The Solution: Sermon Focus Check

After Outline generation (or during Refine), the system should check:

Can the sermon be summarized in one sentence?

Example output:

Sermon Focus:

God remains our refuge even when the world feels unstable.
Where It Fits in Your System

It belongs between:

Outline
↓
Write

or inside Refine.

Workflow becomes:

Theme
↓
Passage
↓
Study
↓
Outline
↓
Focus Check
↓
Write
↓
Refine
↓
Deliver
What the System Should Do

The Focus Check tool should:

1️⃣ Generate the sermon’s central statement

Example:

Central Message:
God's presence stabilizes believers even when life collapses around them.
2️⃣ Evaluate alignment

Check if:

outline points support the message

Example:

Point 1 ✓
Point 2 ✓
Point 3 ✗
3️⃣ Suggest improvements

Example:

Point 3 introduces a different theme (guidance) that does not directly reinforce the sermon focus.
Consider reframing the point around trust in God’s refuge.
Why This Feature Is So Powerful

Because great sermons are remembered in one sentence.

Examples from famous sermons:

Grace is greater than our sin.

God is faithful even when we fail.

Faith sees beyond circumstances.

Everything in the sermon supports that idea.

How Your System Already Supports It

You already collect:

theme
goals
story arc
study insights
outline
manuscript

So the Focus Check can simply analyze those.

No new infrastructure required.

Example Output in Refine Step
SERMON FOCUS

Central Message
God remains a refuge for His people even when life feels unstable.

Alignment Score
82%

Issues
• Point 3 introduces a secondary theme (divine guidance).
• Conclusion does not restate the central message.

Suggestion
Reframe point 3 to emphasize trusting God's refuge.
Why Pastors Love This

Because during sermon preparation they constantly ask:

Am I saying one clear thing?
Or many scattered things?

A Focus Check helps them tighten the sermon.

Your Final System (Fully Optimized)
Theme
sermon direction

Passage
scripture intelligence

Study
exegesis + sermon material

Outline
sermon structure

Focus Check
clarify central message

Write
manuscript

Refine
DNA + coaching + flow

Deliver
slides + media