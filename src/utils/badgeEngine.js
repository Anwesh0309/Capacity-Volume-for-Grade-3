export const BADGES = [
  {
    id: 'capacity_curious',
    label: '🏅 Capacity Curious',
    description: 'Complete Wonder & Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'pouring_pro',
    label: '🥈 Pouring Pro',
    description: 'Complete all 4 simulation stations',
    condition: (s) => s.simStationsComplete && s.simStationsComplete.every(Boolean),
  },
  {
    id: 'volume_virtuoso',
    label: '🥇 Volume Virtuoso',
    description: 'Score 80%+ on Play phase',
    condition: (s) => {
      const totalCorrect = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return totalCorrect >= 80;
    },
  },
  {
    id: 'perfect_pour',
    label: '💎 Perfect Pour',
    description: 'Score 10/10 in any world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_sensation',
    label: '🔥 Streak Sensation',
    description: 'Achieve a 10-answer streak',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'full_journey',
    label: '🌟 Full Journey',
    description: 'Complete all 5 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
];

export function checkBadges(state) {
  return BADGES.filter(b => !state.badges.includes(b.id) && b.condition(state)).map(b => b.id);
}
