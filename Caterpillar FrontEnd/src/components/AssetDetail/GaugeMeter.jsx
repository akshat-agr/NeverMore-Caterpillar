// src/components/AssetDetail/GaugeMeter.jsx
import React from 'react';

const GaugeMeter = ({ title, value, unit }) => {
  // Calculate rotation for needle (assuming 0-100 range)
  const rotation = (value / 100) * 180 - 90;
  
  return (
    <div className="gauge-card">
      <div className="gauge-title">{title}</div>
      <div className="gauge-meter">
        <svg width="150" height="150" viewBox="0 0 150 150">
          {/* Gauge background */}
          <circle cx="75" cy="75" r="70" fill="none" stroke="#f0f0f0" strokeWidth="10" />
          {/* Value arc */}
          <circle cx="75" cy="75" r="70" fill="none" stroke="#ffcd11" strokeWidth="10" 
            strokeDasharray="440" strokeDashoffset={440 - (value/100)*440} 
            transform="rotate(-90 75 75)" />
          {/* Needle */}
          <line x1="75" y1="75" x2="75" y2="25" stroke="#2d2d2d" strokeWidth="2" 
            transform={`rotate(${rotation} 75 75)`} />
          {/* Center circle */}
          <circle cx="75" cy="75" r="10" fill="#2d2d2d" />
        </svg>
        <div className="gauge-value">
          {value}
          <span className="gauge-unit">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default GaugeMeter;