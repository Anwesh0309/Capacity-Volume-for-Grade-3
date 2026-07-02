import React, { useEffect, useState } from 'react';
import Mascot from '../shared/Mascot.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';

const WonderPhase = ({ audioEnabled, onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (audioEnabled) narrate(wonderNarration());
    return () => stopNarration();
  }, [audioEnabled]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Mascot mood="curious" size={50} />
        <div className="speech-bubble">Hmm... I wonder... 🤔</div>
      </div>

      <div className="card-solid anim-slideInUp" style={{ maxWidth: 540, width: '100%', textAlign: 'center', padding: '32px 28px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 36,
        }}>
          ❓
        </div>

        <h2 style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 900, color: 'white', marginBottom: 12, lineHeight: 1.3 }}>
          Emma has a 2-litre bottle and a 500 ml cup. How many cups can she fill?
        </h2>

        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 20, fontStyle: 'italic' }}>
          What if we need to measure and compare different amounts of liquid?
        </p>

        <div style={{
          background: 'rgba(108,92,231,0.2)', border: '1.5px solid rgba(108,92,231,0.4)',
          borderRadius: 12, padding: '10px 16px', marginBottom: 24, fontSize: 14, fontWeight: 700, color: '#a29bfe',
        }}>
          ✨ We might need to convert litres and millilitres! ✨
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 8, fontSize: 32 }}>
          <span>🍋</span><span>💧</span><span>🥤</span>
        </div>

        <button className="btn btn-gold btn-lg" onClick={onComplete} style={{ marginTop: 12 }}>
          🔍 Let's Investigate!
        </button>
      </div>
    </div>
  );
};

export default WonderPhase;
