import React, { useState, useEffect } from 'react';
import Mascot from '../shared/Mascot.jsx';
import { calcStars } from '../../utils/scoring.js';
import { narrate, stopNarration } from '../../utils/audio.js';
import { reflectQuestionNarration, resultsNarration } from '../../utils/narration.js';

const WORLDS = [
  { emoji: '🧋', name: 'Bubble Tea Bar' },
  { emoji: '🍋', name: 'Lemonade Stand' },
  { emoji: '🐠', name: 'Fish Tank Depot' },
  { emoji: '🧃', name: 'Juice Stall' },
  { emoji: '🧪', name: 'Science Lab' },
  { emoji: '🏊', name: 'Swimming Pool' },
  { emoji: '🌊', name: 'Water Park' },
  { emoji: '🪣', name: 'Rainwater Tank' },
  { emoji: '🐟', name: 'Aquarium World' },
  { emoji: '🏰', name: 'Capacity Castle' },
];

const Confetti = () => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }}>
    {[...Array(30)].map((_, i) => (
      <div key={i} className="confetti-piece" style={{
        left: `${Math.random() * 100}%`,
        top: `-20px`,
        background: ['#f5c518','#6c5ce7','#4ecdc4','#ff6b6b','#00b894','#a29bfe'][i % 6],
        '--dur': `${2 + Math.random() * 2}s`,
        '--delay': `${Math.random() * 1.5}s`,
        '--br': `${Math.random() > 0.5 ? '50%' : '2px'}`,
      }} />
    ))}
  </div>
);

const ReflectPhase = ({ audioEnabled, state, onComplete }) => {
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const totalCorrect = state.worldScores.reduce((s, w) => s + (w || 0), 0);
  const totalAttempted = state.worldScores.filter(s => s !== null).length * 10;
  const pct = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  useEffect(() => {
    stopNarration();
    if (audioEnabled) narrate(reflectQuestionNarration());
    return () => stopNarration();
  }, [audioEnabled]);

  const handleSubmit = () => {
    stopNarration();
    if (audioEnabled) narrate(resultsNarration(pct));
    setSubmitted(true);
    setShowResults(true);
    onComplete();
  };

  if (showResults) {
    const totalStars = state.worldScores.reduce((s, w) => s + (w !== null ? calcStars(w) : 0), 0);
    const mascotMsg = pct >= 80 ? 'Outstanding! You are a capacity expert! 🌟' : pct >= 60 ? 'Great job! Keep practising! 💪' : 'Good start! Try again to improve! 👍';

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
        <Confetti />
        <div className="results-modal">
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 4 }}>Journey Complete!</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>You finished all 5 phases!</p>

          <div className="score-ring" style={{ marginBottom: 12 }}>
            <div className="pct">{pct}%</div>
            <div className="frac">{totalCorrect}/{totalAttempted > 0 ? totalAttempted : 100}</div>
          </div>

          <div style={{ fontSize: 20, marginBottom: 12 }}>
            {'⭐'.repeat(Math.min(totalStars, 3))}{'☆'.repeat(Math.max(0, 3 - Math.min(totalStars, 3)))}
          </div>

          <div className="stat-tiles">
            <div className="stat-tile"><div className="val">{state.xp}</div><div className="lbl">XP Earned</div></div>
            <div className="stat-tile"><div className="val">🔥 {state.maxStreak}</div><div className="lbl">Max Streak</div></div>
            <div className="stat-tile"><div className="val">{state.badges.length}/6</div><div className="lbl">Badges</div></div>
          </div>

          <div style={{ marginBottom: 12, maxHeight: 160, overflowY: 'auto' }}>
            {WORLDS.map((w, i) => {
              const score = state.worldScores[i];
              if (score === null) return null;
              const stars = calcStars(score);
              return (
                <div key={i} className="world-score-row">
                  <span>{w.emoji} {w.name}</span>
                  <span>{score}/10 {'⭐'.repeat(stars)}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, justifyContent: 'center' }}>
            <Mascot mood="celebrating" size={44} />
            <div className="speech-bubble" style={{ maxWidth: 180 }}>{mascotMsg}</div>
          </div>

          {reflection && (
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'left' }}>
              <strong>Your reflection:</strong> "{reflection}"
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-gold" onClick={() => window.location.reload()}>🎮 Play Again</button>
            <button className="btn btn-outline">🏠 Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, maxWidth: 540, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Mascot mood="thinking" size={50} />
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f5c518' }}>📝 Reflect</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>What did you learn today?</p>
        </div>
      </div>

      <div className="card-solid" style={{ width: '100%', padding: '20px 24px' }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 14, textAlign: 'center' }}>
          Tell me one thing you learned about litres and millilitres today! 💡
        </p>
        <textarea
          className="reflect-textarea"
          rows={4}
          placeholder="e.g. 1 litre = 1000 millilitres. I learned how to regroup when subtracting..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />
      </div>

      <button
        className="btn btn-gold btn-lg"
        onClick={handleSubmit}
        disabled={reflection.trim().length < 5}
        style={{ opacity: reflection.trim().length < 5 ? 0.5 : 1 }}
      >
        ✅ See My Scoreboard!
      </button>
    </div>
  );
};

export default ReflectPhase;
