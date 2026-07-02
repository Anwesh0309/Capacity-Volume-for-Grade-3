# Measuring Capacity: Litres & Millilitres — Grade 3 Math

**Intellia SG | Singapore Primary Mathematics Curriculum (MOE)**

An interactive gamified lesson module for teaching capacity and volume (litres and millilitres) to Grade 3 students (ages 8-9), fully aligned with Singapore MOE Mathematics Syllabus.

## 🎯 Features

- **5-Phase Learning Journey**: Wonder → Story → Simulate → Play → Reflect
- **100 Randomised Questions** across 10 themed worlds
- **4 Interactive Simulations**: Pour & Fill, Read Scale, Capacity Slider, Spot Error
- **Full Audio Narration** via ElevenLabs TTS (37 narration clips)
- **Gamification**: XP, hearts, stars, streak counter, badges
- **Singapore MOE Aligned**: Primary 3 Measurement (Volume/Capacity)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate audio files (requires ElevenLabs API key)
node scripts/generate_audio.cjs

# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── phases/              # 5 learning phases
│   ├── simulations/         # 4 interactive stations
│   └── shared/              # Reusable components
├── data/
│   ├── questionBank.js      # 100 questions
│   └── storyContent.js      # Story panels
├── utils/                   # Audio, scoring, conversions
└── index.css               # Global styles
```

## 🎮 Technologies

- React 18 + Vite 6
- Lucide React (icons)
- ElevenLabs API (narration)
- Web Audio API (sound effects)
- localStorage (progress persistence)

## 📚 Curriculum

**Topic**: Measurement — Volume/Capacity (Litres and Millilitres)
**Grade**: Primary 3 (Singapore MOE)
**Learning Objectives**:
- Measure volume in litres and millilitres
- Read graduated scales
- Compare capacities
- Convert compound units (1 l = 1000 ml)
- Add/subtract with regrouping

## 🏆 Learning Journey

1. **Wonder** — Curiosity hook question
2. **Story** — "Uncle James's Lemonade Stand" (4 slides)
3. **Simulate** — 4 hands-on stations
4. **Play** — 10 worlds × 10 questions
5. **Reflect** — Journal + scoreboard

## 🎨 Design

- **Theme**: Deep purple/indigo gradient background
- **Typography**: Nunito, Fredoka (large, bold, high-contrast for children)
- **UI**: Matches reference Intellia modules
- **Responsive**: iPad (768px+), Desktop (1024px+), Mobile (375px+)

## 📄 License

© 2026 Intellia SG. All rights reserved.

## 🔗 Links

- **GitHub**: https://github.com/Anwesh0309/Capacity-Volume-for-Grade-3
- **Reference**: https://regrouping-with-hundreds.vercel.app/
