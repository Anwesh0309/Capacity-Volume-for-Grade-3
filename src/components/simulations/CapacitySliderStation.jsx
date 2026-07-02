import React, { useState } from 'react';
import { formatMl, getLitres, getMlRemainder } from '../../utils/unitConversion.js';

const CapacitySliderStation = ({ onComplete }) => {
  const [mlComponent, setMlComponent] = useState(500);
  const baseLitres = 1;
  const totalMl = baseLitres * 1000 + mlComponent;
  const needsRegroup = mlComponent >= 1000;
  const displayL = getLitres(totalMl);
  const displayMl = getMlRemainder(totalMl);

  const handleChange = (e) => {
    setMlComponent(Number(e.target.value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#a29bfe', marginBottom: 4 }}>
          🎚️ Capacity Slider
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
          Drag the slider — watch the regrouping update live!
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 12, color: '#aaa', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          BASE + SLIDER
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Base</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f5c518' }}>{baseLitres} l</div>
          </div>
          <div style={{ fontSize: 24, color: '#888' }}>+</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#888' }}>Slider ml</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#4ecdc4' }}>{mlComponent} ml</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 8px' }}>
        <div style={{ fontSize: 13, color: '#ccc', marginBottom: 6, fontWeight: 700 }}>
          Millilitres: {mlComponent} ml
        </div>
        <input type="range" className="capacity-slider"
          min={0} max={1999} step={50}
          value={mlComponent} onChange={handleChange}
        />
      </div>

      {needsRegroup ? (
        <div className="regroup-banner">
          <div style={{ fontSize: 15, fontWeight: 900, color: '#f5c518' }}>
            ⚠️ {mlComponent} ml — regroup needed!
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>
            ml → l: {mlComponent} ÷ 1000 = <strong>{Math.floor(mlComponent/1000)}</strong> remainder <strong>{mlComponent % 1000}</strong>
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#4ecdc4', marginTop: 4 }}>
            {baseLitres} l + {mlComponent} ml = {displayL} l {displayMl > 0 ? `${displayMl} ml` : ''}
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(78,205,196,0.1)', border: '1.5px solid rgba(78,205,196,0.4)',
          borderRadius: 12, padding: '12px 16px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Volume</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>
            {displayL > 0 ? `${displayL} l ` : ''}{displayMl > 0 ? `${displayMl} ml` : '0 ml'}
          </div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>= {totalMl} ml</div>
        </div>
      )}

      <div className="hint-box">
        💡 Try dragging the slider past 1000 ml to see <strong>regrouping</strong> happen!
      </div>

      {mlComponent >= 1000 && (
        <button className="btn btn-gold btn-sm" style={{ alignSelf: 'center' }} onClick={() => onComplete && onComplete()}>
          ✅ I understand regrouping!
        </button>
      )}
    </div>
  );
};

export default CapacitySliderStation;
