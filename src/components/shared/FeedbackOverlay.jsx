import React, { useEffect, useState } from 'react';

const FeedbackOverlay = ({ isCorrect, message, explanation, visible }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div className="feedback-overlay">
      <div className={`feedback-popup ${isCorrect ? 'correct' : 'incorrect'}`}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>{isCorrect ? '✅' : '❌'}</div>
        <div style={{ fontSize: 18, fontWeight: 900 }}>{message}</div>
        {explanation && (
          <div style={{ fontSize: 13, marginTop: 6, opacity: 0.9, maxWidth: 280 }}>{explanation}</div>
        )}
      </div>
    </div>
  );
};

export default FeedbackOverlay;
