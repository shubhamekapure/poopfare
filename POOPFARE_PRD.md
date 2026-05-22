# PoopFare — Product Requirements Document
### Version 1.0 | May 2026

---

## The Pitch

**"Because someone has to take the blame."**

PoopFare is the world's first poop charity. A web-based satire app where you're handed a daily quota of virtual poop coins and forced to choose which awful person on the planet deserves them most. You can't abstain. You can't dump on everyone. You pick — and the crowd's verdict accumulates into a living, breathing ranking of humanity's worst.

It's a parody of empathy apps that do nothing. Here, the nothing is the point. And it's deeply, infectiously shareable.

---

## 1. Product Vision

### 1.1 The Problem It Solves
The internet is full of people who want to express outrage but have no satisfying outlet. Twitter gives you a retweet. Reddit gives you a downvote. Nothing makes you feel like the universe has registered your complaint. PoopFare gives you the ceremony of a decision — a real choice between two deserving targets — and the catharsis of allocation.

### 1.2 The Joke (And Why It Works)
Silicon Valley built PeaceFare: an app that lets you feel good without helping anyone. PoopFare flips it. Instead of fake empathy, it's fake justice. The product knows it's absurd. The copy knows it's absurd. The user knows it's absurd. That shared awareness is the brand.

### 1.3 Strategic Pillars
- **Forced choice mechanics** drive debate and social sharing
- **Scarcity** (poop coins) makes each allocation feel weighty and strategic
- **Crowdsourced rankings** create an evolving, viral leaderboard of infamy
- **Self-aware corporate tone** — Jared-earnest copy on a ridiculous product — earns comedic trust

---

## 2. Target Audience

| Segment | Description |
|---|---|
| Primary | Ages 18–34, high social media usage, enjoy political satire and dark comedy |
| Secondary | Pop culture consumers who follow "villain of the week" discourse |
| Tertiary | Office workers who need a 2-minute rage outlet during lunch |

**Not a fit for:** People looking for actual social impact apps, or anyone who can't tolerate PG-13 toilet humor.

---

## 3. Core Concepts

### 3.1 Poop Coins
- Each user receives a **fixed daily quota of 💩 coins** (default: **10 per day**)
- Coins reset at midnight (user's local time)
- Coins **cannot be saved** — they expire unused. Scarcity with urgency.
- No way to earn extra coins organically. You can't buy your way to more poop.
- Visual presentation: physical poker-chip aesthetic, stacked in a sidebar/header

### 3.2 The Matchup
- Each session presents a **head-to-head matchup**: Person A vs Person B
- Both are real public figures, categorized as "timeless offenders," "villains of the week," or "legacy evil"
- User **must pick one** — no skipping, no abstaining
- The poop coin is "donated" to the chosen person's tally
- After selection: brief animation (💩 flies toward chosen target), result revealed, next matchup loads
- After all coins are spent: session ends. Show summary screen.

### 3.3 The Ranking System
- Every allocation globally contributes to a **cumulative poop score** per person
- The **World's Richest in Poop** leaderboard is always live
- Filterable by: **Country** (of the public figure), **Gender**, **Category** (Politician / Corporate / Celebrity / Historical)
- Rankings update in near-real-time

---

## 4. Product Features

### 4.1 MVP Feature Set (V1)

#### F1 — Daily Poop Quota Dashboard
- Landing page = current coin count prominently displayed
- Countdown timer to next reset
- Visual depletion as coins are spent (coins visually disappear from stack)
- "Your poop coins expire in X hours" urgency nudge

#### F2 — Matchup Engine
- Two person cards shown side by side
- Each card includes:
  - Photo / illustrated avatar
  - Name
  - Short 1-line "crime" descriptor (e.g., "Invented skip ads" / "Said NFTs were art")
  - Current cumulative poop score (global, updating live)
- Tap/click on card = allocate one poop coin
- Confirm micro-interaction (brief delay, animation) before advancing
- After choice: show which % of users agreed with you

#### F3 — Session Summary
- After final coin is spent: full-screen summary
- "Today you condemned:" — list of choices made
- Most controversial pick highlighted
- Share card auto-generated:
  - "I picked [X] over [Y]. Do your part. poopfare.com"
  - Shareable as image (OG card) or pre-drafted tweet/X post
- Option to bookmark / save summary

#### F4 — The Leaderboard (World's Richest in Poop)
- Full-page leaderboard accessible anytime
- Default: Global ranking, all time
- Filters:
  - **Country** — filter by the subject's nationality
  - **Gender** — filter by the subject's gender
  - **Time range** — Today / This Week / All Time
  - **Category** — (V2) Politician, CEO, Celebrity, etc.
- Each entry shows:
  - Rank
  - Name + photo
  - Total 💩 score
  - 7-day trend arrow
  - "Your poop contribution" if user has allocated to them
- Top 3 get crown/medal treatment (💩🥇, 💩🥈, 💩🥉)

#### F5 — Person Profiles (Lightweight)
- Click any person from leaderboard or matchup = brief modal/drawer
- Shows: name, photo, "charges" (humorous list of offenses), global rank, total poop received
- Social share: "X is ranked #4 in the World's Richest in Poop. poopfare.com"

#### F6 — Share Mechanics
- Every shareable moment generates a styled OG image
- Pre-filled share copy for X/Twitter, WhatsApp, iMessage
- Shareable URL for individual matchups: `/matchup/[slug]` — opens with the same two people so others can vote
- Copy-to-clipboard fallback for all platforms

#### F7 — Onboarding
- First visit: 3-screen splash explaining the rules (skip-able after 2)
  - Screen 1: "You have 10 poop coins."
  - Screen 2: "Pick who deserves it more."
  - Screen 3: "The crowd decides the worst."
- No signup required for core experience
- Optional account creation to: save history, track your impact on the leaderboard, persist coins across devices

### 4.2 V2 Features (Post-Launch)
- **Country Chapters** — separate leaderboards for local villains (India's worst, UK's worst, etc.)
- **Weekly Villain of the Week** spotlight — editorially surfaced, gets a dedicated matchup marathon
- **Streaks** — come back 7 days in a row, earn cosmetic "golden poop" coins (same behavior, different skin)
- **Contested Matchups** — when a matchup is 49%/51%, it gets flagged as "still contested" and resurfaces
- **PoopFare Wrapped** — year-end summary of your allocations
- **Nominate Mode** — submit someone to be added to the pool (moderated)

---

## 5. Content & Editorial

### 5.1 The Person Database
- Maintained by the PoopFare editorial team (initially: a human-curated JSON/CMS)
- Each entry includes:
  - Name, photo/avatar, nationality, gender, category
  - "Charges" — 2–5 humorous but factually rooted offenses
  - Severity tier: Timeless Offender / Villain of the Week / Legacy Evil
- **Moderation rules:**
  - Only public figures — no private individuals, no minors
  - No one whose inclusion could constitute harassment (edge cases reviewed)
  - Clearly satirical framing at all times

### 5.2 Matchup Curation
- Matchups are **editorially seeded** then weighted by engagement algorithm
- High-engagement matchups (close splits, high volume) get more airtime
- "Wild card" matchups: different categories (e.g., a CEO vs a pop star) for surprise
- Regional targeting: surface locally relevant matchups for users in specific countries

### 5.3 Copy Tone
- **Jared-earnest**: Written like a real charity's mission statement, with complete sincerity about an absurd product
- Headlines: "Make your poop count." / "Change starts with a single 💩." / "Together, we poop."
- Error states: "Your poop coins have expired. Return tomorrow. The world's worst people will still be here."
- Empty state: "No one is safe from accountability. Check back at midnight."
- Confirmation: "Your 💩 has been received by [Name]. The world thanks you for your service."

---

## 6. UX & Interaction Design

### 6.1 Core Loop Flow

```
Landing Page (coin count visible)
        ↓
Matchup Card (Person A vs Person B)
        ↓
User taps one → 💩 animation → Coins decrement
        ↓
Consensus reveal ("X% of users agreed with you")
        ↓
[Coin > 0] → Next Matchup
[Coin = 0] → Session Summary Screen
        ↓
Share / View Leaderboard / Come Back Tomorrow
```

### 6.2 Design Principles
- **Mobile-first** — the core loop should be completable with one thumb
- **Instant comprehension** — the UI teaches the mechanic in under 5 seconds without reading
- **Reward the decision** — every allocation gets a micro-animation worth of satisfaction
- **Shareability baked in** — share CTAs at every natural exit point

### 6.3 Key Screens
1. **Home / Dashboard** — coin stack, CTA "Start Pooping", leaderboard teaser
2. **Matchup Screen** — two cards, current coin count, choose button or tap-to-select
3. **Post-Choice Screen** — consensus %, coin remaining, Next CTA
4. **Session End Screen** — summary, share card, leaderboard CTA
5. **Leaderboard Screen** — ranked list, filters, each entry tappable
6. **Person Profile Modal** — offenses, rank, personal contribution
7. **Onboarding Screens** (3 slides)
8. **Auth Screen** (optional, minimal)

### 6.4 Visual Direction
- **Color palette:** Brown/gold tones for poop coins; clean white/offwhite backgrounds; bold typography
- **Aesthetic:** Corporate charity meets toilet humor — think clean sans-serif fonts, generous whitespace, but with 💩 everywhere that feels intentional, not crass
- **Illustrations:** Slightly caricatured avatars for public figures (reduces legal risk, amplifies satire reading)
- **Animations:** Satisfying 💩 arc from user to target on selection; coin stack depletes with a slight wobble

---

## 7. Virality Mechanics

This is the engine. Everything is in service of sharing.

### 7.1 Tagline Options (pick one to test)
- **"Because the world's worst deserve your worst."**
- **"Your daily deuce of justice."**
- **"Finally, accountability with a smell."**
- **"Poop where it counts."**
- **"The only charity where everyone gets what they deserve."**

### 7.2 One-Liner Pitch
- **"It's like a voting app, but the ballot is poop and the candidates are the world's worst people."**
- **"Fantasy Football for public humiliation, powered by your daily 💩 allowance."**

### 7.3 Built-In Virality Triggers
| Trigger | Mechanic |
|---|---|
| Debate bait | Forced choice between two villains = instant hot take material |
| Social proof | "87% of people agreed with you" = validation or outrage |
| Contested results | "This matchup is only 51/49 — still being decided" = urgency to share |
| Personal leaderboard | "I've given 340 💩 to [X] this year" = identity flex |
| Share cards | Auto-generated, beautiful, ready for X/Instagram stories |
| URL sharing | Each matchup has a permanent link — you can send someone a specific choice |
| Seasonal events | "It's [Award Season] — special matchups unlocked" |

### 7.4 Launch Virality Strategy
- Seed with 5–10 "uncontroversial" matchups that almost everyone agrees on (frictionless first experience)
- First viral moment: post a share card on X with a highly debatable matchup, no CTA, just the question
- Target: reply guys will quote-tweet arguing — each one becomes organic distribution

---

## 8. Technical Architecture

### 8.1 Platform
- **Web-first** (desktop + mobile responsive)
- PWA support for home screen install on mobile
- No native app in V1

### 8.2 Tech Stack (Recommended)
| Layer | Tech |
|---|---|
| Frontend | Next.js (React) + Tailwind CSS |
| Backend | Node.js / Next.js API routes or a lightweight Hono/Express service |
| Database | PostgreSQL (persons, matchups, allocations, leaderboard) |
| Real-time | Supabase Realtime or Pusher for live leaderboard updates |
| Auth | Clerk or Supabase Auth (optional account system) |
| CDN / Hosting | Vercel |
| OG Image Gen | Vercel OG / Satori for dynamic share cards |
| CMS (persons DB) | Sanity or Contentful for editorial management |
| Analytics | PostHog or Mixpanel |

### 8.3 Key Data Models

**Person**
```
id, name, slug, photo_url, nationality, gender, category,
severity_tier, charges[], total_poop_score, created_at
```

**Matchup**
```
id, person_a_id, person_b_id, is_active, total_votes,
a_votes, b_votes, created_at
```

**Allocation**
```
id, user_id (nullable), matchup_id, chosen_person_id,
ip_hash (for anon rate limiting), created_at
```

**User**
```
id, email (optional), daily_coins_remaining, last_reset_at,
total_allocations, country (optional)
```

### 8.4 Rate Limiting & Anti-Abuse
- Daily coin quota enforced server-side, not just client-side
- Anonymous users tracked by: session cookie + IP hash (no PII stored)
- Registered users tracked by account
- Bot prevention: simple honeypot + rate limit per IP per minute
- No financial transactions — abuse surface is minimal

---

## 9. Monetization (Non-Extractive)

PoopFare should never feel like it's trying to make money. But it can.

| Model | Description |
|---|---|
| **Merch** | Physical 💩 coins, "I Pooped On [X]" shirts, certificates of participation |
| **Sponsored Matchups** | A brand sponsors "Villain of the Week" placement (clearly labeled) |
| **PoopFare Pro** | Unlock history, all-time personal stats, custom themes — $2/month |
| **Gifting** | Send a friend 5 bonus poop coins as a gift |
| **Charity Tie-in (ironic)** | Optional: $1 to a real charity = 5 extra coins. Reverse PeaceFare. |

---

## 10. Legal & Moderation

| Risk | Mitigation |
|---|---|
| Defamation | All "charges" are clearly satirical, rooted in public record, marked as satire |
| Privacy | Only public figures, no private individuals, no addresses/contact info |
| Harassment | No real-world action mechanism — purely virtual and clearly fictional |
| Minors | No public figures under 18, age gate on sign-up |
| Platform liability | Section 230 protections apply; clear satire labeling throughout |
| Trademark | "PoopFare" is distinct; footer reads "Purely satirical. No real poop is harmed." |

Add a **"Legal Poop"** page in the footer (this is also a brand moment) covering the disclaimer.

---

## 11. Success Metrics

### 11.1 North Star Metric
**Daily Active Poopers (DAP)** — users who complete at least one matchup per day

### 11.2 Launch Goals (30 days)
| Metric | Target |
|---|---|
| Total sessions | 50,000 |
| Daily Active Poopers | 5,000 |
| Share cards generated | 10,000 |
| Viral coefficient (K) | ≥ 1.2 |
| Avg matchups per session | ≥ 7 of 10 coins used |

### 11.3 Engagement Metrics
- Coin utilization rate (coins used / coins issued)
- Session completion rate (used all 10 coins)
- Share rate (sessions that result in a share)
- D1 / D7 / D30 retention
- Matchup consensus spread (50/50 vs 90/10 — both signal engagement differently)

### 11.4 Leaderboard Metrics
- % of sessions that visit leaderboard
- Click-through from leaderboard to matchup
- Country/gender filter usage (signals expansion opportunity)

---

## 12. Go-To-Market

### 12.1 Pre-Launch (2 weeks before)
- Set up `poopfare.com` with a single-screen teaser: "The world's first poop charity. Coming soon. 💩"
- Drop cryptic post on X: "We've built the world's first poop charity. No, really." — no link
- Seed 3–5 influencer accounts in political comedy / tech satire niche with early access

### 12.2 Launch Day
- Publish "The Manifesto" — a blog post in full Jared-earnest corporate voice about PoopFare's mission
- Drop the matchup-of-the-week share card on X/Instagram with zero context
- Submit to Product Hunt with tagline: "The world's first poop charity."
- Post in relevant subreddits: r/ProgrammerHumor, r/tech, r/funny, r/OutOfTheLoop

### 12.3 Ongoing Growth
- Weekly "Villain of the Week" announcement — email + social
- Monthly "State of the Poop" — top 10 ranking summary, shareable
- Community Discord for the most dedicated poopers
- Respond to every share on X in corporate-charity voice

---

## 13. Roadmap

| Phase | Timeline | Focus |
|---|---|---|
| **V0 — Prototype** | Week 1–2 | 5 hardcoded matchups, coin mechanic, share card |
| **V1 — MVP** | Week 3–6 | Full matchup engine, leaderboard, onboarding, OG sharing |
| **V1.5 — Social** | Week 7–10 | Auth, personal stats, matchup URLs, leaderboard filters |
| **V2 — Scale** | Month 3–4 | CMS editorial pipeline, nomination system, weekly villains |
| **V3 — Expand** | Month 5+ | Country chapters, Wrapped, merch, sponsorships |

---

## 14. Open Questions

1. **Moderation bandwidth** — who curates the person database and vets new nominations?
2. **International figures** — how localized do we go in V1? English-only content first?
3. **Tie-in charity** — does the optional real-charity donation feature help or muddy the satire?
4. **Identity at signup** — is the optional account enough, or do we need social login for friction reduction?
5. **Poop coin count** — is 10 the right number? Too few = frustrating. Too many = no scarcity.
6. **Legal review** — run the "charges" copy format past a lawyer before launch

---

## Appendix A: Sample "Charges" Copy

**Generic Corporate Villain**
> "Pioneered the 'Reply All' corporate email culture. Introduced unlimited PTO that no one can use. Described laying off 3,000 people as 'right-sizing the team.'"

**Generic Political Figure**
> "Said 'thoughts and prayers' 47 times in 2023. Voted against the thing they campaigned for. Owns seven houses and calls themselves 'just a regular person.'"

**Generic Tech Bro**
> "Described their app as 'like Uber but for empathy.' Wore a turtleneck to a Senate hearing. Wrote a 4,000-word Medium post about their 'journey' after firing 40% of staff."

---

## Appendix B: Sample Share Cards

**Post-session card:**
> "Today I donated 10 💩 to the people who deserve it most.
> My top pick: [Name].
> Do your part. → poopfare.com"

**Leaderboard card:**
> "[Name] is currently ranked #1 in the World's Richest in Poop.
> 2.4M 💩 and counting.
> poopfare.com"

**Contested matchup card:**
> "[Person A] vs [Person B] is 49% / 51%.
> The world can't decide. Can you?
> poopfare.com/matchup/[slug]"

---

*PoopFare. Because the world's worst deserve your worst.*
*Purely satirical. No real poop is harmed in the making of this product.*
