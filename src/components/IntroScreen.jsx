import React from 'react';
import Mascot from './shared/Mascot.jsx';

const IntroScreen = ({ onStart }) => {
  return (
    <div className="intro-screen" style={{ gap: 12, padding: '12px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Top Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 20px', background: 'rgba(255,255,255,0.1)',
        borderRadius: 30, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
        marginBottom: 4, letterSpacing: 0.5
      }}>
        ✨ Grade 3 Mathematics · Capacity & Volume
      </div>

      {/* Main Title */}
      <div style={{ textAlign: 'center', lineHeight: 1.1, marginBottom: 4 }}>
        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, letterSpacing: -1,
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          marginBottom: 8
        }}>
          <span style={{ color: '#ff6b6b' }}>Measuring</span>
          <span style={{ color: '#f5c518' }}>Capacity</span>
        </h1>
        <h2 style={{ fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 800, color: '#f5c518', letterSpacing: 0.2 }}>
          Litres & Millilitres
        </h2>
      </div>

      {/* Mascot & Welcome text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'linear-gradient(135deg, #f5c518, #e6a800)',
            width: 64, height: 64, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245,197,24,0.3)'
          }}>
            <Mascot mood="happy" size={48} />
          </div>
          <div className="speech-bubble" style={{ fontSize: 14, padding: '10px 20px', borderRadius: 20, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <span style={{ fontWeight: 600, color: '#1a1a1a' }}>Ready for a capacity adventure?</span> 🚀
          </div>
        </div>
        
        <p style={{
          maxWidth: 650, fontSize: 'clamp(14px, 1.8vw, 15px)', lineHeight: 1.6,
          color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontWeight: 500, margin: 0
        }}>
          Learn to measure and compare <span style={{color: '#f5c518', fontWeight: 800}}>liquid capacity</span>, connect litres to millilitres, and master converting between them!
        </p>
      </div>

      {/* Journey Steps Section */}
      <div style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24, padding: '20px 24px', marginBottom: 16, maxWidth: 860, width: '100%',
      }}>
        <div style={{
          fontSize: 13, fontWeight: 900, color: '#f5c518', marginBottom: 16, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1.5
        }}>
          YOUR LEARNING JOURNEY
        </div>
        
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap'
        }}>
          {[
            { icon: '🔮', label: 'Wonder', sub: 'Spark curiosity' },
            { icon: '📖', label: 'Story', sub: 'Hear the tale' },
            { icon: '🧪', label: 'Simulate', sub: 'Interactive labs' },
            { icon: '🎮', label: 'Play', sub: 'Test your skills' },
            { icon: '📝', label: 'Reflect', sub: 'What did you learn?' },
          ].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left', minWidth: 150, gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'rgba(13,10,46,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0
                }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: 'white', marginBottom: 2 }}>{step.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1.3, fontWeight: 600 }}>{step.sub}</div>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <button className="btn btn-gold btn-lg anim-pulse" onClick={onStart} style={{ padding: '14px 40px', fontSize: 18, borderRadius: 16, marginBottom: 16, fontWeight: 800, letterSpacing: 0.5 }}>
        🚀 Begin Your Journey!
      </button>

      {/* Bottom Tiles */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 860, width: '100%' }}>
        {[
          { icon: '📏', text: 'Measure & Convert' },
          { icon: '🧪', text: '4 Simulations' },
          { icon: '🏆', text: '10 Worlds & XP' }
        ].map((tile, idx) => (
          <div key={idx} style={{
            background: 'rgba(255,255,255,0.06)', borderRadius: 20,
            width: 130, height: 110, // compressed dimensions
            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            <div style={{ fontSize: 32, lineHeight: 1 }}>{tile.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.9)', padding: '0 4px' }}>{tile.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntroScreen;
