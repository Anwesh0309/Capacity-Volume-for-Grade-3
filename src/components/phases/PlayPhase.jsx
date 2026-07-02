import React, { useState, useEffect } from 'react';
import { Heart, Star, Flame } from 'lucide-react';
import { calcXP, calcStars } from '../../utils/scoring.js';
import { playCorrectSfx, playWrongSfx, playStreakSfx } from '../../utils/audio.js';
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx';

const WORLDS = [
  { id: 0, emoji: '🧋', name: 'Bubble Tea Bar',  range: '1–10' },
  { id: 1, emoji: '🍋', name: 'Lemonade Stand',  range: '11–20' },
  { id: 2, emoji: '🐠', name: 'Fish Tank Depot', range: '21–30' },
  { id: 3, emoji: '🧃', name: 'Juice Stall',     range: '31–40' },
  { id: 4, emoji: '🧪', name: 'Science Lab',     range: '41–50' },
  { id: 5, emoji: '🏊', name: 'Swimming Pool',   range: '51–60' },
  { id: 6, emoji: '🌊', name: 'Water Park',      range: '61–70' },
  { id: 7, emoji: '🪣', name: 'Rainwater Tank',  range: '71–80' },
  { id: 8, emoji: '🐟', name: 'Aquarium World', range: '81–90' },
  { id: 9, emoji: '🏰', name: 'Capacity Castle', range: '91–100' },
];

const WorldSelect = ({ worldScores, onSelectWorld }) => (
  <div style={{ padding: '20px', maxWidth: 700, margin: '0 auto' }}>
    <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f5c518', textAlign: 'center', marginBottom: 4 }}>
      🎮 Play — Choose Your World!
    </h2>
    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 16 }}>
      Answer questions in each world. Earn stars and XP!
    </p>
    <div className="world-grid">
      {WORLDS.map((w, i) => {
        const isLocked = i > 0 && (worldScores[i - 1] === null || worldScores[i - 1] < 5);
        const score = worldScores[i];
        const stars = score !== null ? calcStars(score) : 0;
        return (
          <div
            key={w.id}
            className={`world-card ${isLocked ? 'locked' : ''} ${score !== null ? 'completed' : ''}`}
            onClick={() => !isLocked && onSelectWorld(i)}
          >
            {isLocked && <div className="world-lock">🔒</div>}
            <div className="world-emoji">{w.emoji}</div>
            <div className="world-name">{w.name}</div>
            <div className="world-range">{w.range}</div>
            {score !== null && (
              <div className="world-stars">{'⭐'.repeat(stars)} {score}/10</div>
            )}
            {!isLocked && score === null && (
              <button className="world-play-btn">▶ PLAY</button>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const QuestionRenderer = ({ question, onAnswer }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 900, color: 'white',
        marginBottom: 20, lineHeight: 1.4, padding: '0 12px',
      }}>
        {question.questionText}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 520, margin: '0 auto' }}>
        {question.options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => onAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const PlayPhase = ({ state, dispatch, onComplete }) => {
  const [mode, setMode] = useState('select'); // 'select' | 'play'
  const [worldIdx, setWorldIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [worldScore, setWorldScore] = useState(0);
  const [feedback, setFeedback] = useState({ visible: false, isCorrect: false, message: '' });

  const startWorld = (idx) => {
    setWorldIdx(idx);
    setQIdx(0);
    setWorldScore(0);
    dispatch({ type: 'RESET_HEARTS' });
    setMode('play');
  };

  const questions = state.questionSet.slice(worldIdx * 10, worldIdx * 10 + 10);
  const currentQ = questions[qIdx];

  const handleAnswer = (answer) => {
    if (!currentQ) return;
    const isCorrect = answer === currentQ.correctAnswerDisplay;
    dispatch({ type: 'ATTEMPT' });

    if (isCorrect) {
      const xp = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
      dispatch({ type: 'ANSWER_CORRECT', xpGain: xp });
      setWorldScore(s => s + 1);
      playCorrectSfx();
      if (state.streak >= 4) playStreakSfx();
      setFeedback({ visible: true, isCorrect: true, message: 'Perfectly poured!' });
      setTimeout(() => {
        setFeedback({ visible: false, isCorrect: false, message: '' });
        if (qIdx < 9) {
          setQIdx(q => q + 1);
          dispatch({ type: 'NEXT_QUESTION' });
        } else {
          finishWorld();
        }
      }, 1000);
    } else {
      dispatch({ type: 'ANSWER_INCORRECT' });
      dispatch({ type: 'LOSE_HEART' });
      playWrongSfx();
      setFeedback({ visible: true, isCorrect: false, message: 'Not quite!' });
      setTimeout(() => {
        setFeedback({ visible: false, isCorrect: false, message: '' });
        if (state.hearts <= 1) {
          finishWorld();
        } else {
          if (qIdx < 9) {
            setQIdx(q => q + 1);
            dispatch({ type: 'NEXT_QUESTION' });
          } else {
            finishWorld();
          }
        }
      }, 1000);
    }
  };

  const finishWorld = () => {
    dispatch({ type: 'SET_WORLD_SCORE', world: worldIdx, score: worldScore });
    if (worldIdx >= 9) {
      onComplete();
    } else {
      setMode('select');
    }
  };

  if (mode === 'select') {
    return <WorldSelect worldScores={state.worldScores} onSelectWorld={startWorld} />;
  }

  const world = WORLDS[worldIdx];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 640, margin: '0 auto', gap: 12, justifyContent: 'center' }}>
      <FeedbackOverlay {...feedback} />

      {/* HUD bar */}
      <div className="hud-bar">
        <div className="hud-stars">
          <Star size={16} fill="#f5c518" stroke="#f5c518" /> {state.xp}
        </div>
        <div className="hud-hearts">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} size={18} fill={i < state.hearts ? '#ff6b6b' : 'none'} stroke={i < state.hearts ? '#ff6b6b' : '#444'} />
          ))}
        </div>
        {state.streak > 0 && (
          <div className="hud-streak">
            <Flame size={16} fill="#ff9f43" stroke="#ff9f43" /> {state.streak}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%' }}>
        <div style={{ fontSize: 12, color: '#aaa', fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>
          {world.emoji} {world.name} — Question {qIdx + 1}/10
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${((qIdx + 1) / 10) * 100}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="card-solid" style={{ padding: '24px 20px', width: '100%' }}>
        {currentQ ? (
          <QuestionRenderer question={currentQ} onAnswer={handleAnswer} />
        ) : (
          <div style={{ textAlign: 'center', color: '#888' }}>Loading question...</div>
        )}
      </div>

      <button className="btn btn-outline btn-sm" onClick={() => setMode('select')}>
        ← Back to Worlds
      </button>
    </div>
  );
};

export default PlayPhase;
