import React from 'react';

const MOODS = {
  idle:        { emoji: '🐻', bg: '#a29bfe', anim: '' },
  curious:     { emoji: '🐻', bg: '#6c5ce7', anim: 'anim-float' },
  happy:       { emoji: '😊', bg: '#00b894', anim: 'anim-bounceIn' },
  thinking:    { emoji: '🤔', bg: '#fdcb6e', anim: '' },
  celebrating: { emoji: '🎉', bg: '#e17055', anim: 'anim-celebrate' },
};

const Mascot = ({ mood = 'idle', size = 44, style = {} }) => {
  const { emoji, bg, anim } = MOODS[mood] || MOODS.idle;
  return (
    <div
      className={anim}
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.5,
        flexShrink: 0,
        boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
        ...style,
      }}
    >
      {emoji}
    </div>
  );
};

export default Mascot;
