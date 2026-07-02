import React from 'react';
import { getLitres, getMlRemainder } from '../../utils/unitConversion.js';

const CompoundUnitReadout = ({ totalMl = 0, label = '', highlight = false, size = 'md' }) => {
  const l = getLitres(totalMl);
  const ml = getMlRemainder(totalMl);
  const fontSize = size === 'lg' ? 32 : size === 'sm' ? 18 : 24;
  const unitSize = fontSize * 0.55;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 6,
      background: highlight ? 'rgba(245,197,24,0.15)' : 'rgba(255,255,255,0.07)',
      border: highlight ? '2px solid #f5c518' : '1.5px solid rgba(255,255,255,0.15)',
      borderRadius: 12, padding: '8px 16px',
    }}>
      {label && <span style={{ fontSize: 12, color: '#aaa', marginRight: 6, fontWeight: 700 }}>{label}</span>}
      {l > 0 && (
        <>
          <span style={{ fontSize, fontWeight: 900, color: '#f5c518', fontFamily: 'Nunito,sans-serif' }}>{l}</span>
          <span style={{ fontSize: unitSize, color: '#a29bfe', fontWeight: 700 }}>l</span>
        </>
      )}
      {ml > 0 && (
        <>
          <span style={{ fontSize, fontWeight: 900, color: '#4ecdc4', fontFamily: 'Nunito,sans-serif' }}>{ml}</span>
          <span style={{ fontSize: unitSize, color: '#a29bfe', fontWeight: 700 }}>ml</span>
        </>
      )}
      {totalMl === 0 && (
        <span style={{ fontSize, fontWeight: 900, color: '#888' }}>0 ml</span>
      )}
    </div>
  );
};

export default CompoundUnitReadout;
