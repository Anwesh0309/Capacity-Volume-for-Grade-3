import React, { useState, useEffect } from 'react';
import Mascot from '../shared/Mascot.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { getStoryNarration } from '../../utils/narration.js';
import storySlides from '../../data/storyContent.js';

const StoryImage = ({ slide }) => (
  <div style={{
    background: `linear-gradient(135deg, ${slide.imageColors[0]}, ${slide.imageColors[1]})`,
    borderRadius: 16, padding: 20, textAlign: 'center', minHeight: 180,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', flex: '0 0 auto', width: '100%', maxWidth: 340,
  }}>
    {/* Decorative bg circles */}
    <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
    <div style={{ position: 'absolute', bottom: -10, left: -10, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

    <div style={{
      background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: '6px 14px', marginBottom: 12,
      fontSize: 13, fontWeight: 800, color: 'white',
    }}>
      {slide.imageLabel}
    </div>

    <div style={{ fontSize: 64, marginBottom: 8, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
      {slide.image}
    </div>

    <div style={{
      background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '6px 14px',
      fontSize: 14, fontWeight: 900, color: 'white',
    }}>
      ⭐ {slide.imageCaption} ⭐
    </div>
  </div>
);

const StoryPhase = ({ audioEnabled, onComplete }) => {
  const [current, setCurrent] = useState(0);
  const total = storySlides.length;
  const slide = storySlides[current];

  useEffect(() => {
    stopNarration();
    if (audioEnabled) narrate(getStoryNarration(current));
    // Do NOT auto-start next — only manual navigation triggers narration
    return () => stopNarration();
  }, [current, audioEnabled]);

  const goNext = () => {
    stopNarration();
    if (current < total - 1) setCurrent(c => c + 1);
    else onComplete();
  };

  const goPrev = () => {
    stopNarration();
    if (current > 0) setCurrent(c => c - 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, width: '100%', maxWidth: 800, margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
        {storySlides.map((_, i) => (
          <div key={i} style={{
            width: 32, height: 5, borderRadius: 3, transition: 'background 0.3s',
            background: i <= current ? '#f5c518' : 'rgba(255,255,255,0.15)',
          }} />
        ))}
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginLeft: 8 }}>{current + 1} / {total}</span>
      </div>

      {/* Main card */}
      <div className="card-solid anim-slideInUp" style={{ padding: '20px 24px', width: '100%', display: 'flex', flexDirection: 'row', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <StoryImage slide={slide} />

        <div style={{ flex: 1, minWidth: 220 }}>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: '#f5c518', marginBottom: 10 }}>{slide.title}</h3>
          <p style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: 14, fontWeight: 600 }}>
            {slide.text}
          </p>
          <div style={{
            background: 'rgba(108,92,231,0.25)', border: '1.5px solid rgba(108,92,231,0.5)',
            borderRadius: 10, padding: '8px 14px', fontSize: 14, fontWeight: 800, color: '#a29bfe', marginBottom: 14,
          }}>
            ✨ {slide.highlight} ✨
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Mascot mood="happy" size={40} />
            <div className="speech-bubble">{slide.mascotSpeech}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 600 }}>
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={current === 0}
          style={{ opacity: current === 0 ? 0.4 : 1 }}>
          ← Back
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          {storySlides.map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%', transition: 'all 0.3s',
              background: i === current ? '#f5c518' : 'rgba(255,255,255,0.25)',
              transform: i === current ? 'scale(1.3)' : 'scale(1)',
            }} />
          ))}
        </div>
        <button className="btn btn-gold btn-sm" onClick={goNext}>
          {current < total - 1 ? 'Next →' : 'Start Simulating! →'}
        </button>
      </div>
    </div>
  );
};

export default StoryPhase;
