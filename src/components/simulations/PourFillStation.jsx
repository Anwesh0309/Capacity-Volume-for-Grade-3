import React, { useState } from 'react';
import { formatMl } from '../../utils/unitConversion.js';

const LiquidBar = ({ current, max, color, label }) => {
  const pct = Math.min(current / max, 1) * 100;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#ccc', marginBottom: 6 }}>{label}</div>
      <div style={{
        width: 72, height: 160, background: 'rgba(255,255,255,0.05)',
        border: '2px solid rgba(108,92,231,0.5)', borderRadius: 10, margin: '0 auto',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: `${pct}%`, background: color,
          transition: 'height 0.4s ease', borderRadius: '0 0 8px 8px',
        }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 900, color: 'white', marginTop: 6 }}>{formatMl(current)}</div>
    </div>
  );
};

const PourFillStation = ({ onComplete }) => {
  const [jugMl, setJugMl] = useState(2000);
  const [cupMl, setCupMl] = useState(0);
  const [poured, setPoured] = useState(false);
  const maxCup = 500;

  const pour = (amount) => {
    const actual = Math.min(amount, jugMl, maxCup - cupMl);
    if (actual <= 0) return;
    setJugMl(j => j - actual);
    setCupMl(c => c + actual);
    setPoured(true);
    if (cupMl + actual >= maxCup || jugMl - actual <= 0) {
      setTimeout(() => onComplete && onComplete(), 600);
    }
  };

  const reset = () => { setJugMl(2000); setCupMl(0); setPoured(false); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
        Pour water from the jug into the cup using the buttons below!
      </p>

      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
        <LiquidBar current={jugMl} max={2000} color="rgba(78,205,196,0.8)" label="🪣 Jug (2 l)" />
        <div style={{ fontSize: 32, paddingBottom: 40 }}>→</div>
        <LiquidBar current={cupMl} max={500} color="rgba(245,197,24,0.8)" label="🥤 Cup (500 ml)" />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[50, 100, 200, 500].map(amt => (
          <button key={amt} className="btn btn-purple btn-sm"
            onClick={() => pour(amt)}
            disabled={jugMl <= 0 || cupMl >= maxCup}
            style={{ opacity: (jugMl <= 0 || cupMl >= maxCup) ? 0.4 : 1 }}>
            + {amt} ml
          </button>
        ))}
        <button className="btn btn-outline btn-sm" onClick={reset}>🔄 Reset</button>
      </div>

      {poured && (
        <div className="hint-box" style={{ maxWidth: 340 }}>
          💡 Poured so far: <strong>{formatMl(2000 - jugMl)}</strong> | Cup now has <strong>{formatMl(cupMl)}</strong>
        </div>
      )}

      {cupMl >= maxCup && (
        <div style={{ background: 'rgba(74,222,128,0.2)', border: '2px solid #4ade80', borderRadius: 12, padding: '10px 20px', color: '#4ade80', fontWeight: 800, textAlign: 'center' }}>
          🎉 Cup is full! {formatMl(maxCup)} = exactly 500 ml!
        </div>
      )}
    </div>
  );
};

export default PourFillStation;
