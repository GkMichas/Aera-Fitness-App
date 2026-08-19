# AERA --- Design System

## V1 Master Design Specification

**Product:** AERA\
**Positioning:** AI-powered personal health, fitness, nutrition and
wellness coach\
**Tagline:** *Understand your body. Become your best.*\
**Design principle:** Premium wellness + intelligent technology +
human-centered coaching

------------------------------------------------------------------------

## 1. Design North Star

AERA must feel like a **premium consumer health product**, not a
gym-management dashboard, medical portal, calorie spreadsheet, or
generic AI chatbot.

The current desktop reference establishes a strong foundation: large
typography, generous whitespace, clear information hierarchy, direct
actions and restrained UI. Preserve that clarity while evolving the
visual language with carefully selected photography, exercise video
previews, food imagery, subtle color and motion.

The visual balance should be:

> **70% clarity and data + 30% emotional/visual storytelling.**

Images and videos should be used strategically, never as decoration on
every card.

### Core feelings

-   Confidence
-   Clarity
-   Calm
-   Progress
-   Strength
-   Health
-   Intelligence
-   Personal attention
-   Premium quality

### Avoid

-   Neon gym aesthetics
-   Aggressive bodybuilding visuals
-   Excessive gradients
-   Medical/hospital styling
-   Generic stock-photo appearance
-   Childish gamification
-   Overly futuristic AI graphics
-   Excessive cards and borders
-   Visual clutter

------------------------------------------------------------------------

# 2. Brand Identity

## Wordmark

Use the wordmark:

**AERA**

Typography should be bold, clean and modern.

The wordmark can be used in uppercase in the application shell.

## Brand voice

AERA speaks like a highly competent personal coach:

-   Calm
-   Direct
-   Encouraging
-   Intelligent
-   Practical
-   Non-judgmental
-   Concise

Never shame the user.

Never use exaggerated motivational language.

Example:

**Bad:**\
"You failed your diet today!"

**AERA:**\
"Today was above your calorie target. That is one day. Let's look at the
full week and adjust if needed."

------------------------------------------------------------------------

# 3. Color System

The current prototype uses a very strong black/white/red direction.
Retain the strong contrast and editorial character, but evolve red into
a more refined warm accent and introduce a restrained wellness palette.

## Core colors

### AERA Ink

Primary text, navigation, headings, icons.

`#171717`

### AERA Ivory

Primary application background.

`#F7F5F1`

### AERA Surface

Cards and elevated surfaces.

`#FFFFFF`

### AERA Stone

Secondary surface / muted blocks.

`#E9E6E0`

### AERA Forest

Primary wellness/positive color.

`#24463A`

### AERA Sage

Secondary wellness accent.

`#8FA99A`

### AERA Terracotta

Primary energetic/action accent.

`#E6533A`

This replaces the harsher pure-red feeling in the current prototype
while preserving energy.

### AERA Sand

Warm secondary accent.

`#D9C7AA`

### AERA Recovery Blue

Sleep/recovery information.

`#6F8792`

### Semantic colors

Success: `#3F7D5A`

Warning: `#B8863B`

Critical: `#B9433D`

Use semantic colors sparingly and never rely on color alone to
communicate meaning.

------------------------------------------------------------------------

# 4. Color Rules

Use color according to meaning:

  Area                Primary treatment
  ------------------- -------------------
  Brand / main CTA    Terracotta
  Positive progress   Forest / Sage
  Nutrition           Sand / Terracotta
  Training            Forest
  Recovery / sleep    Muted Blue
  Neutral data        Ink / Stone
  Alerts              Semantic critical

Do not make every section a different color.

The overall interface must remain coherent.

------------------------------------------------------------------------

# 5. Typography

Use a modern sans-serif family with excellent mobile readability.

Preferred direction:

-   Inter
-   Geist
-   SF Pro-like system font stack

## Hierarchy

### Display

Large, bold, compact.

Example:

`Good morning, George`

Desktop: approximately 52--64 px\
Mobile: approximately 34--42 px

### H1

32--40 px, bold.

### H2

24--30 px, bold.

### H3

18--22 px, semibold.

### Body

15--17 px.

### Supporting text

13--14 px.

### Micro labels

11--12 px, uppercase, letter spacing.

Use uppercase labels sparingly for categories such as:

`TRAINING`\
`NUTRITION`\
`AERA INSIGHT`

Do not overuse all-caps.

------------------------------------------------------------------------

# 6. Layout Principles

## Desktop

Use a persistent left sidebar.

Reference structure:

-   Sidebar: approximately 280--320 px
-   Main content: max-width approximately 1200--1400 px
-   Generous horizontal padding
-   Large vertical rhythm

The current screenshot's sidebar + content model is a good foundation.

## Mobile

Use:

-   Full-width content
-   Top header where needed
-   Bottom navigation
-   Large touch targets
-   Cards stacked vertically
-   Horizontal carousels only when useful

Bottom navigation:

`Home | Coach | Training | Nutrition | You`

Secondary areas such as Weekly Review and AERA Health can live inside
the You/Profile area or a contextual menu.

------------------------------------------------------------------------

# 7. Grid

Use an 8px base spacing system.

Recommended spacing:

-   4px --- micro
-   8px --- tight
-   12px --- compact
-   16px --- standard
-   24px --- section
-   32px --- large
-   48px --- major
-   64px+ --- page-level

Desktop grids should generally use 12 columns.

Cards should align to the same grid.

------------------------------------------------------------------------

# 8. Borders, Radius and Elevation

AERA should feel editorial and refined rather than overly rounded.

### Radius

-   Small controls: 6--8 px
-   Cards: 10--14 px
-   Large media: 14--20 px
-   Bottom sheets/modals: 20--24 px

Avoid excessive pill-shaped UI.

### Borders

Use subtle borders:

`1px solid rgba(23,23,23,0.12)`

Do not put a border around every element.

### Shadows

Use very subtle shadows only for elevated elements.

Most cards should rely on contrast, whitespace and borders rather than
heavy shadows.

------------------------------------------------------------------------

# 9. Buttons

## Primary

Filled Terracotta.

Examples:

`Start Workout`\
`Start Check-in`\
`Use This Meal`

Strong contrast, compact typography.

## Secondary

White/Ivory surface with subtle border.

Examples:

`View Nutrition`\
`See Progress`

## Tertiary

Text/button-link style.

Examples:

`View all`\
`Edit`

Buttons should be action-oriented and specific.

Avoid generic `Submit`.

------------------------------------------------------------------------

# 10. Cards

Cards are a major part of AERA but must not dominate the interface.

Each card should have:

1.  Clear label
2.  Primary information
3.  Supporting context
4.  One obvious action where applicable

Do not put multiple competing CTAs inside one card.

------------------------------------------------------------------------

# 11. Metric Cards

Used for:

-   Weight
-   Sleep
-   Energy
-   Recovery
-   Steps
-   Calories
-   Protein
-   Waist
-   Strength

Structure:

**LABEL**

`84.2 kg`

`↓ 0.2 kg this week`

Use a small trend indicator.

Avoid excessive decorative graphics.

------------------------------------------------------------------------

# 12. Progress Visualization

Charts should be:

-   Minimal
-   Readable
-   Responsive
-   Data-first

Required chart types:

-   Line chart: weight
-   Line chart: waist
-   Bar/line chart: strength
-   Bar chart: training consistency
-   Progress ring/bar: nutrition adherence
-   Trend indicator: recovery

Never manipulate chart scales to exaggerate progress.

Always show timeframe.

------------------------------------------------------------------------

# 13. Photography System

Photography is an important secondary layer of the AERA identity.

## Style

-   Photorealistic
-   Premium editorial
-   Natural
-   Warm
-   Authentic
-   Modern
-   Soft daylight
-   Realistic skin tones
-   Natural body proportions

## People

Adults approximately 25--45.

Use diverse, realistic body types.

Avoid only highly muscular/lean models.

Clothing:

-   Black
-   White
-   Cream
-   Beige
-   Sage
-   Earth tones

No visible brands/logos.

## Environments

-   Modern home
-   Minimal home gym
-   Premium fitness studio
-   Modern kitchen
-   Urban outdoor environment
-   Mediterranean outdoor environments
-   Natural spaces

------------------------------------------------------------------------

# 14. Image Usage Rules

Photography should appear mainly in:

### Home

One strong daily visual or workout visual.

### Training

Exercise demonstrations and video posters.

### Nutrition

Meal photography.

### Recovery

Occasional lifestyle photography.

### Progress

User progress photos.

### Landing

Large editorial hero imagery.

### AERA Moments

Occasional emotional progress visuals.

Do not add an image to every card.

------------------------------------------------------------------------

# 15. Video System

Training videos are functional, not decorative.

## Exercise video

Recommended:

-   5--12 seconds
-   Vertical/mobile-first
-   Stable camera
-   1--3 controlled repetitions
-   Clear movement angle
-   Neutral background
-   No text
-   No logos
-   No music required

The video should communicate technique immediately.

If a video cannot be generated, use a high-quality poster image with a
play button and keep the component ready for an MP4/video asset.

------------------------------------------------------------------------

# 16. Media Aspect Ratios

### Mobile full-screen

9:16

### Exercise media

4:5 or 9:16

### Food cards

1:1 or 4:5

### Home lifestyle

16:9 or 4:5

### Landing hero

16:9

Always preserve safe negative space for UI overlays.

------------------------------------------------------------------------

# 17. Iconography

Use one consistent icon family.

Preferred:

-   Lucide
-   SF Symbols equivalent
-   Minimal line icons

Icons should be secondary to typography.

Never use multiple icon styles.

------------------------------------------------------------------------

# 18. Motion

Motion should be subtle and purposeful.

Use:

-   150--250 ms micro transitions
-   250--400 ms page/card transitions
-   Progress ring animation
-   Chart reveal
-   Check-in completion
-   Workout completion
-   Meal completion
-   Measurement update

Avoid:

-   bouncing UI
-   excessive parallax
-   flashy transitions
-   unnecessary animations

------------------------------------------------------------------------

# 19. Home Dashboard Visual Rules

The current Home screenshot is the structural reference.

Preserve:

-   Greeting
-   Five key metrics
-   AERA Insight
-   Today's Plan
-   Daily Check-in

Improve it with:

-   stronger color hierarchy
-   one premium training visual
-   restrained media
-   improved metric visualization
-   subtle section backgrounds

The Home screen should answer within 5 seconds:

1.  How am I doing?
2.  What should I do today?
3.  What does AERA recommend?

------------------------------------------------------------------------

# 20. Coach Design

The Coach is intentionally minimal.

Chat should feel:

-   personal
-   calm
-   intelligent

Use contextual cards when AERA recommends actions.

Examples:

`View Alternative Workout`

`See Recovery Tips`

`Open Meal Plan`

Do not make the Coach visually noisy.

------------------------------------------------------------------------

# 21. Training Design

Training is the most video-forward part of the application.

Every workout should show:

-   Workout name
-   Duration
-   Target muscles
-   Exercises
-   Sets/reps
-   Exercise media
-   Rest timer
-   Difficulty
-   Alternatives

The `Start Workout` CTA must be visually dominant.

------------------------------------------------------------------------

# 22. Nutrition Design

Nutrition is the most photography-forward part of the application.

Meal cards should show:

-   Image
-   Meal name
-   Calories
-   Protein
-   Carbs
-   Fat
-   Preparation time
-   Action

The food must look realistic and achievable.

------------------------------------------------------------------------

# 23. Recovery Design

Recovery uses muted colors and softer imagery.

Relevant data:

-   Sleep
-   Energy
-   Soreness
-   Stress
-   Recovery trend

Avoid medical visuals.

------------------------------------------------------------------------

# 24. Accessibility

Minimum requirements:

-   WCAG-aware contrast
-   Keyboard navigation
-   Focus states
-   Semantic HTML
-   Accessible form labels
-   Touch targets at least approximately 44px
-   Do not communicate meaning with color alone
-   Respect reduced motion preferences

------------------------------------------------------------------------

# 25. Responsive Behavior

Every component must define:

-   Desktop
-   Tablet
-   Mobile

Charts must remain readable.

Tables should become cards or horizontally scroll only when necessary.

Do not allow horizontal page scrolling.

------------------------------------------------------------------------

# 26. Design Tokens

The implementation should centralize:

-   colors
-   typography
-   spacing
-   radius
-   shadows
-   transitions
-   breakpoints

Do not hard-code visual values repeatedly.

------------------------------------------------------------------------

# 27. Component Library

Create reusable components:

-   AppShell
-   Sidebar
-   MobileBottomNav
-   PageHeader
-   MetricCard
-   InsightCard
-   PlanCard
-   WorkoutCard
-   MealCard
-   MediaCard
-   ExerciseCard
-   VideoPoster
-   ChartCard
-   ProgressRing
-   TrendIndicator
-   CheckInSelector
-   CoachMessage
-   ActionCard
-   Modal
-   BottomSheet
-   Button
-   Input
-   Select
-   Slider
-   Tabs
-   StatusBadge

------------------------------------------------------------------------

# 28. Design Consistency Rule

Every new screen must feel unmistakably AERA.

Before adding a component, ask:

> Does this improve clarity, personalization or action?

If not, remove it.

------------------------------------------------------------------------

# 29. Final Visual Target

AERA should feel like:

**Premium wellness editorial** + **Modern fitness** + **Intelligent
personal data** + **AI coaching**

The current screenshot's clean structure is retained as the foundation.

The final design should be warmer, more visual and more emotionally
engaging without becoming cluttered.
