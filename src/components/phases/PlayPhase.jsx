import React, { useState, useEffect } from 'react';
import { Heart, Star, Flame } from 'lucide-react';
import { calcXP, calcStars } from '../../utils/scoring.js';
import { playCorrectSfx, playWrongSfx, playStreakSfx, stopNarration, playDirectMp3, narrate, celebrate, encourage } from '../../utils/audio.js';
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
        const isLocked = i > 0 && (worldScores[i - 1] === null || worldScores[i - 1] < 1);
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

const QuestionVisual = ({ question }) => {
  if (!question.visual || question.visual === 'sentence') return null;
  const isCyl = question.visual === 'cylinder';
  const isCont = question.visual === 'containers';
  const isComp = question.visual === 'compoundSum';
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 16px', minHeight: 80, alignItems: 'center', gap: 16 }}>
      {isCyl && (
        <div style={{ position: 'relative', width: 60, height: 100, border: '3px solid rgba(108,92,231,0.8)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%', background: '#4ecdc4' }} />
          {[20,40,60,80].map(p => (
            <div key={p} style={{ position: 'absolute', bottom: `${p}%`, width: '12px', left: 0, borderBottom: '2px solid rgba(255,255,255,0.5)' }} />
          ))}
        </div>
      )}
      {isCont && (
        <>
          <div style={{ fontSize: 44, textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>{question.containerEmoji || '💧'}</div>
          {question.type === 'compare_containers' && <div style={{ fontSize: 24, opacity: 0.6 }}>⚖️</div>}
          <div style={{ fontSize: 44, textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>{question.containerEmoji || '💧'}</div>
        </>
      )}
      {isComp && (() => {
        const match = question.questionText.match(/(.*?)\s*([+\-])\s*(.*?)\s*=\s*___/);
        if (!match) return <div style={{ fontSize: 32, fontWeight: 900, color: '#f5c518', letterSpacing: 8 }}>+ − =</div>;
        
        const parseV = (str) => {
          let l = null, ml = null;
          const sl = str.toLowerCase();
          if (sl.includes('l') && !sl.includes('ml')) {
             l = parseInt(sl) || 0;
          } else if (sl.includes('ml') && !sl.includes('l')) {
             ml = parseInt(sl) || 0;
          } else {
             const pts = sl.split('l');
             l = parseInt(pts[0]) || 0;
             ml = parseInt(pts[1].replace('ml','')) || 0;
          }
          return { l, ml };
        };

        const v1 = parseV(match[1]);
        const v2 = parseV(match[3]);
        const op = match[2];

        return (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 24px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.1)' }}>
            <table style={{ margin: '0 auto', fontSize: 22, fontFamily: 'monospace', borderCollapse: 'collapse', color: '#fff' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.4)', color: '#f5c518' }}>
                  <th style={{ padding: '0 16px', textAlign: 'right' }}></th>
                  <th style={{ padding: '0 16px', textAlign: 'center' }}>l</th>
                  <th style={{ padding: '0 16px', textAlign: 'center' }}>ml</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td style={{ padding: '8px 16px', textAlign: 'center' }}>{v1.l !== null ? v1.l : ''}</td>
                  <td style={{ padding: '8px 16px', textAlign: 'center' }}>{v1.ml !== null ? v1.ml : (v1.l !== null ? '0' : '')}</td>
                </tr>
                <tr>
                  <td style={{ color: '#f5c518', fontWeight:'bold' }}>{op}</td>
                  <td style={{ padding: '8px 16px', textAlign: 'center' }}>{v2.l !== null ? v2.l : ''}</td>
                  <td style={{ padding: '8px 16px', textAlign: 'center' }}>{v2.ml !== null ? v2.ml : (v2.l !== null ? '0' : '')}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ borderTop: '2px solid white' }}></td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })()}
    </div>
  );
};

const QuestionRenderer = ({ question, onAnswer, onHint, hintsUsed, audioEnabled, disabled }) => {
  const showHint = hintsUsed > 0;
  const hintText = hintsUsed === 1 ? question.hint1 : (hintsUsed >= 2 ? question.hint2 : null);

  useEffect(() => {
    if (audioEnabled) {
      playDirectMp3('/assets/audio/q_' + question.id + '.mp3');
    } else {
      stopNarration();
    }
    return () => stopNarration();
  }, [question.id, audioEnabled]);

  useEffect(() => {
    if (audioEnabled && hintsUsed === 1) {
      playDirectMp3(`/assets/audio/q_${question.id}_hint1.mp3`);
    } else if (audioEnabled && hintsUsed >= 2) {
      playDirectMp3(`/assets/audio/q_${question.id}_hint2.mp3`);
    }
  }, [hintsUsed]);

  return (
    <div style={{ textAlign: 'center' }}>
      <QuestionVisual question={question} />
      <div style={{
        fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 900, color: 'white',
        marginBottom: 20, lineHeight: 1.4, padding: '0 12px',
      }}>
        {question.questionText}
      </div>

      {showHint && (
        <div style={{ marginBottom: 16 }} className="hint-box">
          💡 {hintText}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 520, margin: '0 auto', marginBottom: 16 }}>
        {question.options.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => onAnswer(opt)} disabled={disabled}>
            {opt}
          </button>
        ))}
      </div>

      {hintsUsed < 2 && (
        <button className="btn btn-outline btn-sm" onClick={onHint}>
          {hintsUsed === 0 ? "Get a Hint" : "Another Hint"}
        </button>
      )}
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
      if (state.audioEnabled) narrate([celebrate("That's Correct keep going")]);
      setFeedback({ visible: true, isCorrect: true, explanation: currentQ.explanation });
      setTimeout(() => {
        setFeedback({ visible: false, isCorrect: false, explanation: '' });
        if (qIdx < 9) {
          setQIdx(q => q + 1);
          dispatch({ type: 'NEXT_QUESTION' });
        } else {
          finishWorld();
        }
      }, 2000);
    } else {
      dispatch({ type: 'ANSWER_INCORRECT' });
      playWrongSfx();
      if (state.audioEnabled) narrate([encourage("Not Quite lets try again")]);
      setFeedback({ visible: true, isCorrect: false, explanation: currentQ.explanation });
      setTimeout(() => {
        setFeedback({ visible: false, isCorrect: false, explanation: '' });
        if (qIdx < 9) {
          setQIdx(q => q + 1);
          dispatch({ type: 'NEXT_QUESTION' });
        } else {
          finishWorld();
        }
      }, 2000);
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
        {/* Hearts removed per user request */}
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
          <QuestionRenderer 
            question={currentQ} 
            onAnswer={handleAnswer} 
            onHint={() => dispatch({ type: 'USE_HINT' })} 
            hintsUsed={state.hintsUsed}
            audioEnabled={state.audioEnabled}
            disabled={feedback.visible}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#888' }}>Loading question...</div>
        )}
      </div>
    </div>
  );
};

export default PlayPhase;
