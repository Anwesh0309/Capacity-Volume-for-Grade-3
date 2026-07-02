import React, { useState } from 'react';

const EXAMPLES = [
  {
    title: "2 l 800 ml + 1 l 500 ml",
    steps: [
      { text: "Step 1: 800 ml + 500 ml = 1300 ml", isError: false },
      { text: "Step 2: 1300 ml = 1 l 300 ml", isError: false },
      { text: "Step 3: 2 l + 1 l + 1 l 300 ml = 3 l 300 ml", isError: true, correction: "Step 3: 2 l + 1 l + 1 l = 4 l, plus 300 ml = 4 l 300 ml ✅" },
    ],
  },
  {
    title: "3 l 200 ml − 1 l 650 ml",
    steps: [
      { text: "Step 1: 200 ml < 650 ml, regroup needed", isError: false },
      { text: "Step 2: 3 l 200 ml = 2 l 200 ml (regroup error!)", isError: true, correction: "Step 2: 3 l 200 ml = 2 l 1200 ml (borrow 1 l = 1000 ml) ✅" },
      { text: "Step 3: 2 l 200 ml − 1 l 650 ml = 1 l 550 ml", isError: false },
    ],
  },
  {
    title: "5 l − 2 l 750 ml",
    steps: [
      { text: "Step 1: 5 l = 5000 ml", isError: false },
      { text: "Step 2: 5000 − 2750 = 2150 ml", isError: true, correction: "Step 2: 5000 − 2750 = 2250 ml ✅" },
      { text: "Step 3: Answer = 2 l 150 ml", isError: false },
    ],
  },
];

const SpotErrorStation = ({ onComplete }) => {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const example = EXAMPLES[exampleIdx];

  const handleTap = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setAttempts(a => a + 1);
    if (example.steps[idx].isError) {
      // Correct tap
      setTimeout(() => {
        if (exampleIdx < EXAMPLES.length - 1) {
          setExampleIdx(e => e + 1);
          setSelected(null);
          setAttempts(0);
        } else {
          onComplete && onComplete();
        }
      }, 1500);
    } else {
      // Wrong tap
      setTimeout(() => setSelected(null), 1000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
        🔍 Tap the step with the <strong>error</strong>! ({exampleIdx + 1}/{EXAMPLES.length})
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 16px', marginBottom: 4 }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: '#f5c518', marginBottom: 10 }}>
          {example.title}
        </div>
        {example.steps.map((step, i) => {
          const isSelected = selected === i;
          const isCorrect = isSelected && step.isError;
          const isWrong = isSelected && !step.isError;
          return (
            <div key={i}
              onClick={() => handleTap(i)}
              className={isWrong ? 'anim-shake' : ''}
              style={{
                padding: '10px 14px', borderRadius: 10, marginBottom: 6,
                background: isCorrect ? 'rgba(74,222,128,0.2)' : isWrong ? 'rgba(255,107,107,0.2)' : 'rgba(255,255,255,0.06)',
                border: isCorrect ? '2px solid #4ade80' : isWrong ? '2px solid #ff6b6b' : '1.5px solid rgba(255,255,255,0.12)',
                cursor: 'pointer', transition: 'all 0.2s', fontSize: 14, fontWeight: 700,
                color: isCorrect ? '#4ade80' : isWrong ? '#ff6b6b' : 'white',
              }}>
              {step.text}
              {isCorrect && <div style={{ fontSize: 12, color: '#4ade80', marginTop: 6 }}>✅ {step.correction}</div>}
              {isWrong && <div style={{ fontSize: 12, color: '#ff6b6b', marginTop: 4 }}>Look again — check each calculation step!</div>}
            </div>
          );
        })}
      </div>

      {attempts > 1 && selected === null && (
        <div className="hint-box">
          💡 Hint: Check the arithmetic carefully in each step!
        </div>
      )}
    </div>
  );
};

export default SpotErrorStation;
