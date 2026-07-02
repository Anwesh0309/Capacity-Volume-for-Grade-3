import React, { useEffect, useState } from 'react';

const FeedbackOverlay = ({ isCorrect, message, explanation, visible }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(visible);
    if (visible) {
      const t = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(t);
    }

  }, [visible]);

  if (!show) return null;

  return (
    <div className="feedback-overlay">
      <div className={`feedback-popup ${isCorrect ? 'correct' : 'incorrect'}`}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{isCorrect ? '🎉' : '🥺'}</div>
        <div style={{ fontSize: 24, fontWeight: 900 }}>{isCorrect ? 'Correct! 🎊' : 'Not quite!'}</div>
        {explanation && (
          <div style={{ fontSize: 13, marginTop: 8, opacity: 0.95, lineHeight: 1.4, fontWeight: 600 }}>{explanation}</div>
        )}
      </div>
    </div>
  );
};

export default FeedbackOverlay;
