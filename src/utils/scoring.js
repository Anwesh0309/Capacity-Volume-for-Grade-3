import { shuffleArray } from './shuffle.js';
import { formatMl } from './unitConversion.js';

export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 5) return 1;
  return 0;
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}

export function loseHeart(hearts) {
  return Math.max(0, hearts - 1);
}

export function generateDistractors(correctMl, count = 3) {
  const distractors = new Set();
  const offsets = [100, -100, 1000, -1000, 250, -250, 500, -500, 50, -50, 200, -200];
  let attempts = 0;
  while (distractors.size < count && attempts < 100) {
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    const d = correctMl + offset;
    if (d >= 0 && d !== correctMl) distractors.add(d);
    attempts++;
  }
  // Ensure we have exactly count distractors
  let extra = 0;
  while (distractors.size < count) {
    extra += 100;
    if (correctMl + extra >= 0 && correctMl + extra !== correctMl) distractors.add(correctMl + extra);
    if (distractors.size < count && correctMl - extra >= 0 && correctMl - extra !== correctMl) distractors.add(correctMl - extra);
  }
  return shuffleArray([correctMl, ...[...distractors].slice(0, count)]).map(formatMl);
}
