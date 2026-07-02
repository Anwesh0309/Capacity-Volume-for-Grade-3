import React from 'react';

const GraduatedCylinder = ({ fillMl = 0, maxMl = 2000, markingStepMl = 100, missing = false, width = 140, height = 220 }) => {
  const fillPercent = Math.min(fillMl / maxMl, 1);
  const markings = [];
  for (let m = 0; m <= maxMl; m += markingStepMl) markings.push(m);

  const cylX = 30, cylY = 10, cylW = 80, cylH = 190;
  const liquidY = cylY + cylH - fillPercent * cylH;
  const liquidH = fillPercent * cylH;

  return (
    <svg viewBox={`0 0 ${width + 20} ${height + 20}`} style={{ width: '100%', maxWidth: width + 20, overflow: 'visible' }}>
      {/* Cylinder background */}
      <rect x={cylX} y={cylY} width={cylW} height={cylH} rx={6}
        fill="rgba(255,255,255,0.05)" stroke="#6c5ce7" strokeWidth={2.5} />

      {/* Liquid fill */}
      {liquidH > 0 && (
        <rect x={cylX + 2} y={liquidY} width={cylW - 4} height={liquidH}
          fill={missing ? 'rgba(255,249,196,0.5)' : 'rgba(78,205,196,0.75)'}
          rx={4}
          style={{ transition: 'height 0.6s ease, y 0.6s ease' }} />
      )}

      {/* Graduation marks + labels */}
      {markings.map((m) => {
        const y = cylY + cylH - (m / maxMl) * cylH;
        const isMajor = m % (markingStepMl * 5) === 0;
        return (
          <g key={m}>
            <line x1={cylX} y1={y} x2={cylX - (isMajor ? 12 : 6)} y2={y}
              stroke={isMajor ? '#a29bfe' : '#6c5ce7'} strokeWidth={isMajor ? 1.5 : 1} />
            {isMajor && (
              <text x={cylX - 14} y={y + 4} textAnchor="end" fontSize={9} fill="#ccc" fontFamily="Nunito,sans-serif" fontWeight="700">
                {m >= 1000 ? `${m/1000}l` : `${m}`}
              </text>
            )}
          </g>
        );
      })}

      {/* "ml" scale label on right side */}
      <text x={cylX + cylW + 4} y={cylY + cylH / 2} textAnchor="start" fontSize={8}
        fill="#888" fontFamily="Nunito,sans-serif" transform={`rotate(-90, ${cylX + cylW + 10}, ${cylY + cylH / 2})`}>ml</text>

      {/* Missing / question mark indicator */}
      {missing && (
        <text x={cylX + cylW / 2} y={liquidY - 10} textAnchor="middle" fontSize={22} fontWeight="bold" fill="#f5c518">?</text>
      )}

      {/* Top cap */}
      <rect x={cylX} y={cylY} width={cylW} height={6} rx={3} fill="rgba(108,92,231,0.4)" />
    </svg>
  );
};

export default GraduatedCylinder;
