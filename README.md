# AGENTICA

**The Agentic AI Periodic Table Game**

AGENTICA is an interactive learning game that teaches agentic AI architecture through a five-stage loop:

**Understand it → Build it → Run it → Break it → Fix it**

The visual direction is a mature Western-comic laboratory: bold black linework, halftone texture, dynamic panels, restrained but vibrant colors, oversized display lettering, and punchy micro-interactions.

## What is included

- 32 Agentic AI elements across 8 families
- 8 playable architecture missions
- Interactive periodic table
- Element discovery and Knowledge Energy (KE)
- Architecture builder and live score
- Simulated agent flow
- Failure injection / blast-radius mechanic
- Repair stage with missing-control suggestions
- Ranks and mission progression
- Local browser persistence with `localStorage`
- Responsive desktop/mobile layout
- No database, API key, or account required for v1

## Agentic families

1. Intelligence
2. Knowledge
3. Memory
4. Tools
5. Agency
6. Collaboration
7. Safety
8. Evaluation

## Missions

1. The Refund Showdown
2. The Citation Caper
3. The Itinerary Stampede
4. The Production Panic
5. The CRM Stampede
6. The Support Saloon
7. The Supplier Heist
8. The Infinite Loop

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel

The project uses the Next.js App Router and requires no environment variables. Import the GitHub repository into Vercel and deploy with the default Next.js settings.

## Project structure

```text
app/
  globals.css        Western-comic visual system and responsive layout
  layout.tsx         Metadata and root document
  page.tsx           Main route
components/
  AgenticGame.tsx    Complete game UI and state machine
lib/
  game-data.ts       Elements, families and mission content
```

## Extend next

Recommended v2 additions:

- Supabase profiles and cloud saves
- Daily missions and challenge seeds
- Shareable architecture cards
- Live LLM simulation mode
- React Flow architecture canvas
- Audio/SFX toggle
- Accessibility mode with reduced motion / increased contrast
- Classroom mode with instructor dashboards
- Community-created missions

## Design principle

AGENTICA does not primarily ask players to memorize definitions. It makes architecture decisions visible and playable. The player learns what a component does by seeing what changes when it is present, absent, over-privileged, or poorly coordinated.

---

Concept and learning experience: Angela Guilherme
