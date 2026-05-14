# SharpMind — Ocean Journey

Train the brain's management system. Cognitive training as a descent through the deep sea — complete daily dives to unlock the next ocean zone and discover exotic sea creatures.

## What is Executive Function?

Executive function is the set of higher-order mental processes — managed primarily by the prefrontal cortex — that lets you set goals, plan, focus, regulate emotion, and adapt to new situations. Cognitive neuroscientist Adele Diamond identifies **three core EFs**:

1. **Inhibitory control** — overriding automatic responses
2. **Working memory** — holding and manipulating information in mind
3. **Cognitive flexibility** — shifting between rules, sets, or perspectives

Higher-order functions like **planning**, **reasoning**, and **problem-solving** are built on top of these.

## The Games

All 8 games are grounded in validated neuropsychological paradigms:

| Game | Skill | Based On |
|---|---|---|
| 🎨 **Stroop Showdown** | Inhibition | Stroop Task (Stroop, 1935) |
| 🧩 **Pattern Recall** | Working Memory | Corsi block-tapping |
| 🔁 **Dual N-Back** | Working Memory | N-Back (Kirchner 1958; Jaeggi 2008) |
| 🔀 **Rule Shift** | Cognitive Flexibility | Wisconsin Card Sorting Test (Berg, 1948) |
| 🛥️ **Reef Crossing** | Planning | River-crossing paradigm |
| 🎯 **Focus Grid** | Selective Attention | Visual search paradigm |
| 🔢 **Number Flow** | Fluid Reasoning | Sequence completion / mental arithmetic |
| 🔤 **Word Maze** | Verbal Fluency | Semantic chain construction |

### Why these specifically?

The previous "Decision Lab" and "Priority Matrix" tested business judgment — useful, but those are crystallized knowledge tasks, not exercises for the cortical machinery that *underlies* good judgment. The replacements target the actual prefrontal mechanics:

- **Stroop Showdown** — Words like "RED" are printed in conflicting ink colors. You must respond to the *ink color*, not the word. This forces the prefrontal cortex to suppress the automatic reading response — the canonical test of inhibitory control.
- **Reef Crossing** — A river-crossing puzzle: ferry sea creatures across a deep trench in a shuttle that holds only 2 (you + 1 passenger). Some pairs of creatures can't be left alone together — sharks eat fish, fish eat plankton. Solving it requires thinking 3+ moves ahead, holding multiple constraints in working memory, suppressing the obvious-but-wrong move, and the willingness to bring a creature *back* temporarily to make progress. Classic planning/EF puzzle dating to the 9th century.
- **Rule Shift** — A Wisconsin Card Sorting paradigm. You sort cards by an unannounced hidden rule (color, shape, or count) using only correct/wrong feedback. Periodically the rule silently changes — you must detect it and adapt. The gold-standard cognitive flexibility task.

## What's New (v2.0)

- 🌊 **8 ocean zones** to descend through, from Sunlit Shallows (0–30m) to the Abyss (4000m+)
- 🐠 **16 collectible sea creatures**, each hand-drawn as a detailed SVG with anatomical accuracy
- 🤿 **Daily Dives unlock progress** — finish 4 cognitive games to descend to the next zone and reveal that zone's creatures
- 💎 **Rarity tiers** (Common → Uncommon → Rare → Legendary → Mythic) with educational facts about each creature
- 🧠 **8 cognitive games**, all grounded in validated EF paradigms (see above)

## Navigation

| Tab | Purpose |
|---|---|
| 🌊 Journey | View your current depth, descent timeline, and start today's dive |
| 🐚 Collection | Browse your field journal of discovered creatures |
| 🤿 Dive | Center button — start a daily dive (4 random games) |
| 🎮 Games | Practice individual games (filter by EF skill) |
| 📈 Progress | Skill bars across all 7 EF dimensions, weekly chart, achievements |

## Run It

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

There's a "Skip to Demo" link on onboarding that loads a profile at Stage 4 with 6 creatures already collected.

## Deploy to Vercel

Push to GitHub then import at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Vite — no config needed.

## File Structure

```
sharpmind-ocean/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx    ← everything lives here
```

## Tech

React 18 + Vite. No external UI library — every component, animation, and creature SVG is hand-built.

## References

- Diamond, A. (2013). Executive Functions. *Annual Review of Psychology*, 64, 135–168.
- Miyake, A. et al. (2000). The unity and diversity of executive functions. *Cognitive Psychology*, 41(1), 49–100.
- Jaeggi, S. M. et al. (2008). Improving fluid intelligence with training on working memory. *PNAS*, 105(19), 6829–6833.
- Shallice, T. (1982). Specific impairments of planning. *Philosophical Transactions of the Royal Society B*, 298(1089), 199–209.
- Stroop, J. R. (1935). Studies of interference in serial verbal reactions. *Journal of Experimental Psychology*, 18(6), 643–662.
