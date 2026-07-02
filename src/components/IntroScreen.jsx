import React from 'react';
import Mascot from './shared/Mascot.jsx';

const IntroScreen = ({ onStart }) => {
  return (
    <div className="intro-screen">
      <div className="badge-tag" style={{ marginBottom: 4 }}>
        ✨ Grade 3 Mathematics · Capacity & Volume
      </div>

      <h1 style={{
        fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900,
        background: 'linear-gradient(135deg, #f5c518, #a29bfe)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        textAlign: 'center', lineHeight: 1.2, marginBottom: 4,
      }}>
        Measuring Capacity
      </h1>
      <h2 style={{ fontSize: 'clamp(14px, 2.5vw, 20px)', fontWeight: 700, color: '#a29bfe', marginBottom: 12 }}>
        Litres &amp; Millilitres
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Mascot mood="celebrating" size={52} />
        <div className="speech-bubble">Ready for a capacity adventure? 🚀</div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: '14px 20px', marginBottom: 16, maxWidth: 460, width: '100%',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#a29bfe', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          YOUR LEARNING JOURNEY
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '🔮', label: 'Wonder', sub: 'Spark curiosity →' },
            { icon: '📖', label: 'Story', sub: 'Hear the tale →' },
            { icon: '🧪', label: 'Simulate', sub: 'Explore & discover' },
            { icon: '🎮', label: 'Play', sub: 'Test your skills →' },
            { icon: '📝', label: 'Reflect', sub: 'What did you learn?' },
          ].map((step, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '6px 10px', minWidth: 70 }}>
              <div style={{ fontSize: 20 }}>{step.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>{step.label}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>{step.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-gold btn-lg anim-pulse" onClick={onStart} style={{ marginBottom: 16 }}>
        🚀 Begin Your Journey!
      </button>

      <div className="intro-tiles" style={{ maxWidth: 460 }}>
        <div className="intro-tile">
          <div className="tile-icon">📏</div>
          <div className="tile-title">Measure &amp; Convert</div>
          <div className="tile-sub">l ↔ ml conversions</div>
        </div>
        <div className="intro-tile">
          <div className="tile-icon">🧩</div>
          <div className="tile-title">4 Simulations</div>
          <div className="tile-sub">Interactive labs</div>
        </div>
        <div className="intro-tile">
          <div className="tile-icon">🏆</div>
          <div className="tile-title">10 Worlds</div>
          <div className="tile-sub">XP, streaks &amp; awards</div>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
