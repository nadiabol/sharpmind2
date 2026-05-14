# SharpMind — Ocean Journey

Cognitive training reimagined as a descent through the deep sea. Complete daily dives to unlock the next ocean zone and discover exotic sea creatures.

## What's New (v2.0)

This is a full re-theme and re-architecture of the original SharpMind app:

- 🌊 **8 ocean zones** to descend through, from Sunlit Shallows (0–30m) to the Abyss (4000m+)
- 🐠 **16 collectible sea creatures**, each hand-drawn as a detailed SVG with anatomical accuracy
- 🤿 **Daily Dives unlock progress** — finish 4 cognitive games to descend to the next zone and reveal that zone's creatures
- 💎 **Rarity tiers** (Common → Uncommon → Rare → Legendary → Mythic) with educational facts about each creature
- 🧠 **All 8 cognitive games preserved**: Pattern Recall, Number Flow, Focus Grid, Decision Lab, Word Maze, Priority Matrix, Dual N-Back, Speed Sort

## Navigation

The app has five sections accessible from the bottom nav:

| Tab | Purpose |
|---|---|
| 🌊 Journey | View your current depth, descent timeline, and start today's dive |
| 🐚 Collection | Browse your field journal of discovered creatures |
| 🤿 Dive | Center button — start a daily dive |
| 🎮 Games | Practice individual games (filter by cognitive skill) |
| 📈 Progress | Skill bars, weekly chart, achievements |

## Run It

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

There's a "Skip to Demo" link on the onboarding screen that loads a profile at Stage 4 with 6 creatures already collected — handy for exploring the later zones.

## File Structure

```
sharpmind-ocean/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx    ← everything lives here (~2,000 lines)
```

## Tech

React 18 + Vite. No external UI library — every component, animation, and creature SVG is hand-built.
