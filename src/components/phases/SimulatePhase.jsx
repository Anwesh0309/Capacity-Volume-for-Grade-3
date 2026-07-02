import React, { useState, useEffect } from 'react';
import PourFillStation from '../simulations/PourFillStation.jsx';
import ReadScaleStation from '../simulations/ReadScaleStation.jsx';
import CapacitySliderStation from '../simulations/CapacitySliderStation.jsx';
import SpotErrorStation from '../simulations/SpotErrorStation.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { simulateStationIntro } from '../../utils/narration.js';

const TABS = [
  { id: 0, label: 'Pour & Fill',    icon: '💧', letter: 'A' },
  { id: 1, label: 'Read Scale',     icon: '📏', letter: 'B' },
  { id: 2, label: 'Slider',         icon: '🎚️', letter: 'C' },
  { id: 3, label: 'Spot Error',     icon: '🔍', letter: 'D' },
];

const SimulatePhase = ({ audioEnabled, currentStation, stationsComplete, onAdvance, onComplete, onFinish }) => {
  const [active, setActive] = useState(currentStation);

  useEffect(() => {
    stopNarration();
    if (audioEnabled) narrate(simulateStationIntro(active));
    return () => stopNarration();
  }, [active, audioEnabled]);

  const handleTabChange = (idx) => {
    stopNarration();
    setActive(idx);
  };

  const handleStationComplete = () => {
    onComplete(active);
    if (active < 3) {
      setTimeout(() => {
        setActive(a => a + 1);
        onAdvance();
      }, 500);
    }
  };

  const renderStation = () => {
    switch (active) {
      case 0: return <PourFillStation onComplete={handleStationComplete} />;
      case 1: return <ReadScaleStation onComplete={handleStationComplete} />;
      case 2: return <CapacitySliderStation onComplete={handleStationComplete} />;
      case 3: return <SpotErrorStation onComplete={handleStationComplete} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 680, margin: '0 auto', gap: 12, height: '100%', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f5c518' }}>🧪 Simulate</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Explore and discover — no wrong answers!</p>
      </div>

      {/* Tabs */}
      <div className="sim-tabs" style={{ justifyContent: 'center' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`sim-tab ${active === tab.id ? 'active' : ''} ${stationsComplete[tab.id] ? 'done' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <span style={{ fontWeight: 900 }}>{tab.letter}</span>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {stationsComplete[tab.id] && <span style={{ fontSize: 11 }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Station content */}
      <div className="card-solid" style={{ width: '100%', padding: '20px 24px', minHeight: 280 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#a29bfe', marginBottom: 12 }}>
          {TABS[active].icon} {TABS[active].label}
        </div>
        {renderStation()}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', width: '100%' }}>
        <button className="btn btn-outline btn-sm" onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0}
          style={{ opacity: active === 0 ? 0.4 : 1 }}>
          ← Previous Station
        </button>

        {active < 3 ? (
          stationsComplete[active] && (
            <button className="btn btn-purple btn-sm" onClick={() => setActive(a => Math.min(3, a + 1))}>
              Next Station →
            </button>
          )
        ) : (
          stationsComplete[active] && (
            <button className="btn btn-gold btn-sm" onClick={onFinish}>
              🎮 Start Playing! →
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default SimulatePhase;
