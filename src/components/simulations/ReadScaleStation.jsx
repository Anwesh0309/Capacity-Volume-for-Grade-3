import React, { useState, useCallback } from 'react';
import GraduatedCylinder from '../shared/GraduatedCylinder.jsx';
import { formatMl } from '../../utils/unitConversion.js';

function randomLevel() {
  const levels = [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1500, 1600, 1800, 2000];
  return levels[Math.floor(Math.random() * levels.length)];
}

function getOptions(correct) {
  const all = [correct];
  const offsets = [100, -100, 200, -200, 300, -300, 400, 500, -500];
  for (const off of offsets) {
    const v = correct + off;
    if (v > 0 && !all.includes(v)) all.push(v);
    if (all.length >= 4) break;
  }
  return all.slice(0, 4).sort(() => Math.random() - 0.5);
}

const ReadScaleStation = ({ onComplete }) => {
  const [level, setLevel] = useState(randomLevel);
  const [options, setOptions] = useState(() => getOptions(randomLevel()));
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const total = 5;

  const newRound = useCallback(() => {
    const l = randomLevel();
    setLevel(l);
    setOptions(getOptions(l));
    setSelected(null);
    setCorrect(null);
  }, []);

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const isCorrect = opt === level;
    setCorrect(isCorrect);
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      if (round >= total) {
        setTimeout(() => onComplete && onComplete(), 800);
      } else {
        setTimeout(() => { setRound(r => r + 1); newRound(); }, 900);
      }
    } else {
      setTimeout(() => { setRound(r => r + 1); newRound(); if (round >= total) onComplete && onComplete(); }, 1200);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
        Round {round}/{total} — Look at the cylinder. What is the volume shown?
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ width: 160 }}>
          <GraduatedCylinder fillMl={level} maxMl={2000} markingStepMl={100} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase' }}>Choose the correct reading:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {options.map(opt => (
              <button
                key={opt}
                className={`option-btn ${selected !== null ? (opt === level ? 'correct' : opt === selected ? 'incorrect' : '') : ''}`}
                onClick={() => handleSelect(opt)}
                disabled={selected !== null}
              >
                {formatMl(opt)}
              </button>
            ))}
          </div>
          {selected !== null && (
            <div style={{ marginTop: 10, textAlign: 'center', fontSize: 14, fontWeight: 800, color: correct ? '#4ade80' : '#ff6b6b' }}>
              {correct ? '✅ Correct!' : `❌ Answer: ${formatMl(level)}`}
            </div>
          )}
        </div>
      </div>

      <div style={{ fontSize: 13, color: '#f5c518', fontWeight: 800 }}>Score: {score}/{round - 1 < 0 ? 0 : round - 1}</div>
    </div>
  );
};

export default ReadScaleStation;
