# AERA --- Complete Application Specification

## V1 Product, UX and Screen Architecture

**Product:** AERA\
**Tagline:** *Understand your body. Become your best.*\
**Product type:** Personal AI health, fitness, nutrition and wellness
coach\
**Primary platform:** Mobile-first web application\
**Future:** Native iOS / Android application using the same backend and
product architecture

------------------------------------------------------------------------

# 1. Product Vision

AERA is a personalized digital coach that combines:

-   Fitness
-   Nutrition
-   Body measurements
-   Progress tracking
-   Recovery
-   Wellness guidance
-   AI coaching

The defining product loop is:

`Collect → Understand → Plan → Execute → Measure → Learn → Adapt`

AERA should become more useful as it learns the user's history.

The product is not simply a workout generator or calorie tracker.

Its central promise is:

> **AERA understands the user's journey and continuously adapts the plan
> around the user.**

------------------------------------------------------------------------

# 2. Target User

Primary users are adults who want to:

-   Lose body fat
-   Build muscle
-   Recompose their body
-   Become stronger
-   Improve fitness
-   Improve consistency
-   Improve nutrition
-   Track body changes
-   Understand recovery
-   Receive personalized guidance

AERA should work for beginners and intermediate users.

------------------------------------------------------------------------

# 3. Product Architecture

Primary navigation:

1.  Home
2.  Coach
3.  Training
4.  Nutrition
5.  You

Secondary navigation:

-   Weekly Review
-   AERA Health
-   Settings
-   Account
-   Privacy

Mobile:

`Home | Coach | Training | Nutrition | You`

Desktop:

Persistent sidebar, based on the current design reference.

------------------------------------------------------------------------

# 4. Public Landing Page

## `/`

### Hero

AERA

**Understand your body. Become your best.**

Supporting copy:

> Your personal AI coach for fitness, nutrition, recovery and long-term
> progress.

Actions:

`Start Your Journey`

`See How It Works`

Visual:

Premium lifestyle hero image/video with clean negative space.

------------------------------------------------------------------------

## Section: One Coach. Everything Connected.

Show five pillars:

-   Fitness
-   Nutrition
-   Body
-   Recovery
-   Progress

------------------------------------------------------------------------

## Section: Your Plan Evolves With You

Explain that AERA uses measurements, workouts, nutrition, check-ins and
progress to adapt recommendations.

------------------------------------------------------------------------

## Section: Ask AERA Anything

Show realistic coach conversation examples.

------------------------------------------------------------------------

## Section: Your Progress, Clearly

Show:

-   Weight trend
-   Waist trend
-   Training consistency
-   Strength progression

------------------------------------------------------------------------

## Section: Built Around You

Explain personalization.

------------------------------------------------------------------------

## Final CTA

**Ready to understand your body better?**

`Start with AERA`

------------------------------------------------------------------------

# 5. Authentication

## `/login`

Options:

-   Email
-   Password
-   Google

Actions:

`Sign In`

`Create Account`

`Forgot Password`

------------------------------------------------------------------------

## `/signup`

Collect:

-   First name
-   Email
-   Password

Then route into onboarding.

------------------------------------------------------------------------

# 6. Onboarding

The onboarding must be mobile-first and progressive.

Target completion time:

Approximately 3--5 minutes.

------------------------------------------------------------------------

## Screen 1 --- Welcome

**Welcome to AERA**

> Your personal AI coach for a stronger, healthier you.

`Get Started`

------------------------------------------------------------------------

## Screen 2 --- Primary Goal

Question:

**What do you want to achieve?**

Options:

-   Lose fat
-   Build muscle
-   Get stronger
-   Improve fitness
-   Maintain weight
-   Body recomposition

One primary goal required.

Secondary goals optional.

------------------------------------------------------------------------

## Screen 3 --- About You

Collect:

-   First name
-   Age
-   Sex
-   Height
-   Weight

------------------------------------------------------------------------

## Screen 4 --- Body Measurements

Optional:

-   Waist
-   Neck
-   Chest
-   Arm
-   Thigh
-   Calf

Explain:

> You can update these whenever you want.

------------------------------------------------------------------------

## Screen 5 --- Progress Photos

Optional:

-   Front
-   Side
-   Back

Private by default.

------------------------------------------------------------------------

## Screen 6 --- Activity

Options:

-   Sedentary
-   Lightly active
-   Moderately active
-   Very active

------------------------------------------------------------------------

## Screen 7 --- Training

Collect:

Location:

-   Home
-   Gym
-   Outdoors
-   Mixed

Equipment:

-   None
-   Dumbbells
-   Resistance bands
-   Barbell
-   Full gym
-   Other

Frequency:

-   1--2 days
-   3--4 days
-   5+ days

Session duration:

-   15 min
-   30 min
-   45 min
-   60+ min

------------------------------------------------------------------------

## Screen 8 --- Nutrition

Collect:

-   Meals per day
-   Dietary preference
-   Foods avoided
-   Allergies/intolerances
-   Preferences
-   Approximate food budget

Options:

-   No preference
-   Mediterranean
-   High protein
-   Vegetarian
-   Vegan
-   Low carb
-   Other

------------------------------------------------------------------------

## Screen 9 --- Motivation

**What matters most to you?**

-   Appearance
-   Confidence
-   Strength
-   Energy
-   Health
-   Performance

Multiple selection.

------------------------------------------------------------------------

## Screen 10 --- Initial Plan

Show:

**Your AERA Plan**

Primary goal\
Secondary goal\
Current weight\
Target\
Training frequency\
Nutrition target

CTA:

`Meet Your Coach`

------------------------------------------------------------------------

# 7. Home

## `/home`

The current screenshot is the primary structural reference.

Preserve its core hierarchy:

### Header

`Good morning, George`

`Here's your plan for today.`

Personalize greeting by time of day.

------------------------------------------------------------------------

## Body Status Strip

Metrics:

### Weight

`84.2 kg`

Trend:

`↓ 0.2 kg this week`

### Sleep

`7h 12m`

### Energy

`7/10`

### Recovery

`82%`

### Steps

`4,821 / 8,000`

Each metric must be calculated from user data.

------------------------------------------------------------------------

## AERA Insight

Large insight card.

Example:

> Your weight is trending down while session volume is holding steady.
> Recovery is good today, so keep your planned upper-body session.

Actions:

`Ask AERA`

Insight must be generated from relevant data.

------------------------------------------------------------------------

## Today's Plan

Two primary cards.

### Training

`Upper Body`

45 min\
5 exercises\
Dumbbells

`Start Workout`

Include a strong but restrained training visual.

### Nutrition

Daily calories\
Protein\
Remaining calories

`View Nutrition`

Include food visual where appropriate.

------------------------------------------------------------------------

## Daily Check-In

Question:

**How are you feeling today?**

Collect:

-   Energy
-   Sleep quality
-   Stress
-   Muscle soreness
-   Hunger
-   Mood
-   Weight

Target:

Under 30 seconds.

CTA:

`Start Check-in`

------------------------------------------------------------------------

# 8. Daily Check-In

## `/check-in`

One question per screen or a very compact single-screen flow.

Inputs:

Energy 1--10\
Sleep 1--10\
Stress 1--10\
Soreness 1--10\
Hunger 1--10\
Mood 1--10\
Weight

Optional notes.

Completion:

`Save Check-in`

After saving:

Show a concise AERA interpretation.

Example:

> Your recovery is lower than usual today. AERA adjusted today's
> recommendation toward moderate training.

------------------------------------------------------------------------

# 9. Coach

## `/coach`

Primary AI conversational interface.

Header:

**AERA**

`Your personal coach.`

User can ask natural language questions.

Examples:

-   What should I train today?
-   I don't have time to train.
-   What should I eat now?
-   Why has my weight stopped dropping?
-   I want bigger shoulders.
-   My legs are sore.
-   I slept badly. Should I train?

------------------------------------------------------------------------

## Coach Context

The system can use relevant:

-   Profile
-   Goals
-   Measurements
-   Recent workouts
-   Recent meals
-   Nutrition targets
-   Sleep
-   Check-ins
-   Progress
-   Preferences
-   Equipment
-   Training schedule

Only relevant context should be passed to each request.

------------------------------------------------------------------------

## Contextual Actions

AI responses may include action cards:

`View Workout`

`Alternative Workout`

`Open Meal Plan`

`Recovery Tips`

`Log Meal`

------------------------------------------------------------------------

# 10. Training

## `/training`

Dashboard:

-   Today's workout
-   Weekly schedule
-   Completed sessions
-   Training streak
-   Recent performance

------------------------------------------------------------------------

## Workout Detail

## `/training/workout/:id`

Show:

Workout name\
Duration\
Target muscles\
Difficulty

Exercise list.

Example:

### Push-up

3 × 12

Target: Chest, shoulders, triceps

Exercise video/image

`Start Set`

------------------------------------------------------------------------

# 11. Exercise Detail

## `/training/exercise/:id`

Show:

-   Exercise name
-   Primary muscle
-   Secondary muscles
-   Equipment
-   Difficulty
-   Video
-   Instructions
-   Sets
-   Reps
-   Rest
-   Alternative exercises

The video is functional and instructional.

------------------------------------------------------------------------

# 12. Active Workout

## `/training/session/:id`

Focus entirely on execution.

Show:

Current exercise

Video

Set number

Reps

Weight if relevant

Rest timer

Actions:

`Complete Set`

`Skip`

`Replace Exercise`

After workout:

Ask:

**How did the workout feel?**

-   Very easy
-   Easy
-   Moderate
-   Hard
-   Very hard

Then:

**Any pain?**

-   No
-   Yes

If yes:

-   Body area
-   Severity
-   Description

Pain data must not be interpreted as a diagnosis.

------------------------------------------------------------------------

# 13. Exercise Library

## `/training/exercises`

Filters:

-   Muscle
-   Equipment
-   Difficulty
-   Movement type

Search.

Exercise cards with visual media.

------------------------------------------------------------------------

# 14. Nutrition

## `/nutrition`

Dashboard:

Calories consumed / target\
Protein consumed / target\
Carbs consumed / target\
Fat consumed / target

Today's meals.

------------------------------------------------------------------------

## Meal Detail

## `/nutrition/meal/:id`

Show:

-   Food image
-   Meal name
-   Calories
-   Protein
-   Carbs
-   Fat
-   Preparation time
-   Ingredients
-   Instructions
-   Substitutions

CTA:

`Use This Meal`

------------------------------------------------------------------------

# 15. Meal Logging

## `/nutrition/log`

Allow:

### Text input

Example:

> 2 eggs, one pita and Greek yogurt

Parse into food items and quantities.

The system must show estimates and allow editing.

Never imply laboratory accuracy.

------------------------------------------------------------------------

# 16. Meal Planner

## `/nutrition/plan`

Generate:

-   Daily plan
-   Meals
-   Calories
-   Protein
-   Carbs
-   Fat
-   Shopping list where appropriate

User can request:

-   High protein
-   Low preparation time
-   Mediterranean
-   Budget-friendly
-   Ingredients already available

Example:

> I have chicken, pasta, yogurt, tomatoes and eggs.

AERA creates a practical meal.

------------------------------------------------------------------------

# 17. Food Search

## `/nutrition/foods`

Search and select foods.

Food item fields:

-   Name
-   Serving
-   Calories
-   Protein
-   Carbs
-   Fat

Support editing serving size.

------------------------------------------------------------------------

# 18. Body

## `/you/body`

Show:

-   Current weight
-   Target weight
-   Waist
-   Measurements
-   Estimated body composition when enough data exists

All body composition calculations must be explicitly labeled:

**Estimated**

Never present them as medical-grade measurements.

------------------------------------------------------------------------

# 19. Measurements

## `/you/measurements`

Track:

-   Weight
-   Waist
-   Neck
-   Chest
-   Arm
-   Thigh
-   Calf

Actions:

`Add Measurement`

`Edit`

Show measurement history.

------------------------------------------------------------------------

# 20. Progress

## `/you/progress`

Tabs:

-   Weight
-   Waist
-   Strength
-   Training
-   Nutrition

Charts:

Weight\
Waist\
Strength\
Training consistency\
Nutrition adherence

Timeframes:

-   1 month
-   3 months
-   6 months
-   All time

------------------------------------------------------------------------

# 21. Progress Photos

## `/you/photos`

Upload:

-   Front
-   Side
-   Back

Timeline comparison.

Demo mode may use sample photos.

Real user photos must remain private.

------------------------------------------------------------------------

# 22. Goals

## `/you/goals`

Show:

Primary goal\
Secondary goals\
Current state\
Target\
Target date where appropriate

Allow editing.

Avoid unsafe/extreme target recommendations.

------------------------------------------------------------------------

# 23. Weekly Review

## `/weekly-review`

Automated weekly summary.

Example:

### BODY

84.0 → 83.4 kg

`-0.6 kg`

### WAIST

96 → 95.2 cm

### TRAINING

4 / 4 completed

### NUTRITION

89% adherence

### SLEEP

6h 51m average

### AERA SAYS

> Your consistency is strong this week. Weight is moving steadily while
> training performance remains stable.

### Recommendation

> Keep the current plan for another week.

All conclusions must be based on actual data.

------------------------------------------------------------------------

# 24. AERA Health

## `/health`

Purpose:

General wellness and health guidance, not diagnosis.

Entry:

**Something doesn't feel right?**

User can describe symptoms.

AERA asks structured follow-up questions where needed:

-   Where?
-   When did it start?
-   Severity?
-   During exercise?
-   Injury?
-   Swelling?
-   Weakness?
-   Limited movement?
-   Better or worse?

------------------------------------------------------------------------

## Health Safety Rules

AERA must never claim certainty about a diagnosis.

Never say:

-   "You definitely have X."
-   "This proves X."
-   "You don't need a doctor."

For potentially urgent symptoms, recommend appropriate urgent/emergency
professional care.

For non-urgent concerns:

-   General information
-   Safe general self-care where appropriate
-   Monitoring
-   Escalation guidance
-   Appropriate professional referral

Health interactions require a stricter safety layer than fitness or
nutrition interactions.

------------------------------------------------------------------------

# 25. Profile

## `/you`

Sections:

### Personal

Name\
Age\
Sex\
Height

### Body

Weight\
Measurements\
Photos

### Goals

Primary\
Secondary\
Targets

### Lifestyle

Activity\
Training\
Preferences

### Nutrition

Diet\
Restrictions\
Preferences

### Settings

Units\
Notifications\
Privacy\
Account

------------------------------------------------------------------------

# 26. Settings

## `/settings`

Sections:

-   Profile
-   Units
-   Notifications
-   Privacy
-   AI preferences
-   Subscription
-   Account
-   Delete account

------------------------------------------------------------------------

# 27. Notifications

Prepare for:

-   Workout reminder
-   Meal reminder
-   Check-in reminder
-   Weigh-in reminder
-   Weekly review
-   Recovery reminder

V1 can support preferences without requiring native push infrastructure.

------------------------------------------------------------------------

# 28. Demo Mode

The application must include realistic demo data.

Demo user:

**George**

Example baseline:

-   Age: 34
-   Height: 170 cm
-   Weight: 84.2 kg
-   Goal: Fat loss + muscle gain
-   Training: 4 days/week
-   Equipment: Dumbbells + bodyweight

Include realistic:

-   Workouts
-   Meals
-   Measurements
-   Check-ins
-   Progress
-   Weekly review

Provide:

`Reset Demo Data`

------------------------------------------------------------------------

# 29. AI Architecture

AERA AI is divided into:

### Coach Engine

Conversation and orchestration.

### Training Engine

Workout generation and adaptation.

### Nutrition Engine

Meal plans and nutrition recommendations.

### Progress Engine

Trend analysis and weekly reports.

### Safety Engine

Health/safety classification and response policies.

------------------------------------------------------------------------

# 30. AI Rules

AERA should:

-   Use user context
-   Avoid repeating questions already answered
-   Explain recommendations
-   Be concise
-   Be supportive
-   Use uncertainty appropriately
-   Never fabricate user data
-   Never fabricate medical diagnoses

Deterministic code should calculate:

-   BMI
-   BMR
-   Estimated TDEE
-   Calorie targets
-   Protein targets
-   Progress percentages
-   Weight changes
-   Measurement changes
-   Adherence
-   Training volume

The AI should interpret these results rather than being responsible for
arithmetic.

------------------------------------------------------------------------

# 31. Required Core Data Entities

The eventual backend should support:

-   users
-   profiles
-   goals
-   measurements
-   progress_photos
-   daily_checkins
-   nutrition_targets
-   foods
-   meals
-   meal_items
-   exercises
-   workouts
-   workout_sessions
-   exercise_sets
-   coach_conversations
-   coach_messages
-   health_events
-   weekly_reviews
-   notification_preferences
-   subscriptions

All user-owned data must be isolated per user.

------------------------------------------------------------------------

# 32. Security and Privacy

Required:

-   Secure authentication
-   Row Level Security
-   Private progress-photo storage
-   Server-side AI API calls
-   No exposed API keys
-   Environment variables
-   Input validation
-   Rate limiting where practical
-   No health data in URLs
-   Account deletion flow

------------------------------------------------------------------------

# 33. Responsive Requirements

## Desktop

Persistent sidebar.

Main content centered.

Large dashboard.

## Mobile

Bottom navigation.

Cards stack.

Charts become mobile-friendly.

Workout videos prioritize vertical media.

Food images become full-width or large card media.

All actions must be touch-friendly.

------------------------------------------------------------------------

# 34. Empty States

Create thoughtful empty states.

Examples:

### No measurements

> Start tracking your body to see your progress.

### No workouts

> Complete your first workout and AERA will start learning your training
> patterns.

### No meals

> Log your first meal to start understanding your nutrition.

### No weekly review

> Your first weekly review will appear after you've used AERA for a few
> days.

------------------------------------------------------------------------

# 35. Loading and Error States

Every major flow must have:

-   Loading
-   Skeleton
-   Empty
-   Error
-   Retry

AI failure should have a graceful fallback.

------------------------------------------------------------------------

# 36. Media Asset Mapping

The design must use named media assets rather than anonymous
placeholders.

Required categories:

### Home

`HOME_HERO_WORKOUT`\
`HOME_RECOVERY`\
`HOME_NUTRITION`

### Training

`TRAINING_PUSHUP`\
`TRAINING_DUMBBELL_ROW`\
`TRAINING_SHOULDER_PRESS`\
`TRAINING_LATERAL_RAISE`\
`TRAINING_BICEPS_CURL`\
`TRAINING_TRICEPS_EXTENSION`\
`TRAINING_SQUAT`\
`TRAINING_REVERSE_LUNGE`\
`TRAINING_RDL`\
`TRAINING_GLUTE_BRIDGE`\
`TRAINING_CALF_RAISE`\
`TRAINING_PLANK`\
`TRAINING_SIDE_PLANK`\
`TRAINING_DEAD_BUG`\
`TRAINING_MOUNTAIN_CLIMBER`\
`TRAINING_AB_WHEEL`\
`TRAINING_GOBLET_SQUAT`\
`TRAINING_THRUSTER`\
`TRAINING_STEP_UP`

### Nutrition

`NUTRITION_BREAKFAST_01`\
`NUTRITION_LUNCH_01`\
`NUTRITION_DINNER_01`\
`NUTRITION_SNACK_01`

### Recovery

`RECOVERY_SLEEP`\
`RECOVERY_STRETCH`\
`RECOVERY_WALK`\
`RECOVERY_HYDRATION`

### Progress

`PROGRESS_DEMO_FRONT`\
`PROGRESS_DEMO_SIDE`\
`PROGRESS_DEMO_BACK`

### Landing

`LANDING_HERO`\
`LANDING_TRAINING`\
`LANDING_NUTRITION`\
`LANDING_RECOVERY`

### AERA Moments

`AERA_MOMENT_01`\
`AERA_MOMENT_02`\
`AERA_MOMENT_03`

------------------------------------------------------------------------

# 37. Primary User Journey

The complete first-time journey:

`Landing → Sign Up → Onboarding → Initial Plan → Home`

Then:

`Home → Check-in → Training → Nutrition → Coach → Progress → Weekly Review`

The user should never need to understand the internal AI architecture.

The experience should feel like one continuous coach.

------------------------------------------------------------------------

# 38. Key UX Principle

AERA should always answer:

### What should I do now?

The Home page answers it daily.

Training answers it physically.

Nutrition answers it nutritionally.

Coach answers questions.

Progress answers whether it is working.

Health answers when professional attention may be appropriate.

------------------------------------------------------------------------

# 39. V1 Success Criteria

A new user can:

1.  Create account
2.  Complete onboarding
3.  Set goals
4.  Create body profile
5.  See personalized dashboard
6.  Complete daily check-in
7.  Receive workout
8.  Complete workout
9.  Log meals
10. Receive nutrition targets
11. Ask AERA
12. Get contextual answer
13. Update measurements
14. See charts
15. Review progress photos
16. Receive weekly review
17. Navigate comfortably on mobile and desktop

------------------------------------------------------------------------

# 40. What V1 Does NOT Need

Do not overbuild.

V1 does not require:

-   Wearable integrations
-   Apple Health
-   Google Health Connect
-   Garmin
-   Oura
-   WHOOP
-   Advanced computer vision
-   Food image recognition
-   Human trainer marketplace
-   Healthcare provider marketplace
-   Complex social features

Prepare architecture for these later.

------------------------------------------------------------------------

# 41. V2 Direction

Potential future integrations:

-   Apple Health
-   Google Health Connect
-   Garmin
-   Fitbit
-   Oura
-   WHOOP

Future AI:

-   Food photo recognition
-   Exercise form analysis
-   Sleep/recovery analysis
-   Adaptive training load
-   Advanced personalization

Future business:

-   Human trainers
-   Nutritionists
-   Physiotherapists
-   Professional referrals
-   Subscriptions
-   Family accounts

------------------------------------------------------------------------

# 42. Final Product Definition

AERA V1 is successful when the user feels:

> "AERA knows where I am, knows what I am trying to achieve, tells me
> what to do today, remembers what happened, and adjusts what I should
> do next."

The design should make this feeling obvious without requiring the user
to understand the technology behind it.

The application should feel ready to become a serious App Store / web
product.

------------------------------------------------------------------------

# 43. Design-to-Development Contract

These two specification files form the baseline for the AERA design and
implementation.

The Design System defines:

-   Visual identity
-   Colors
-   Typography
-   Layout
-   Components
-   Photography
-   Video
-   Motion
-   Responsive behavior
-   Accessibility

This Application Specification defines:

-   Product structure
-   Navigation
-   User journeys
-   Screens
-   Features
-   AI behavior
-   Data concepts
-   Safety boundaries
-   Media mapping

When future design decisions are made, preserve these documents as the
source of truth unless an intentional product decision supersedes them.
