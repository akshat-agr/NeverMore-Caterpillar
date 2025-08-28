// src/components/AssetDetail/GaugeMeter.jsx
import React from 'react';

const GaugeMeter = ({ title, value, unit, min = 0, max = 100 }) => {
  // Calculate rotation for needle based on value range
  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = (normalizedValue - min) / (max - min);
  const rotation = percentage * 180 - 90;
  
  // Determine gauge color based on value
  const getGaugeColor = (val) => {
    if (val <= 25) return '#ff4444'; // Red for low values
    if (val <= 50) return '#ffaa00'; // Orange for medium-low
    if (val <= 75) return '#ffcd11'; // Yellow for medium
    return '#00cc44'; // Green for high values
  };
  
  // Special handling for different units
  const getGaugeColorByUnit = (val, unit) => {
    switch(unit) {
      case '°C':
        if (val <= 80) return '#00cc44';
        if (val <= 95) return '#ffcd11';
        return '#ff4444';
      case 'PSI':
        if (val <= 2000) return '#ff4444';
        if (val <= 3000) return '#ffcd11';
        return '#00cc44';
      case 'V':
        if (val <= 12.5) return '#ff4444';
        if (val <= 13.5) return '#ffcd11';
        return '#00cc44';
      default:
        return getGaugeColor(val);
    }
  };
  
  const gaugeColor = getGaugeColorByUnit(value, unit);
  
  return (
    <div className="gauge-meter">
      <svg width="150" height="150" viewBox="0 0 150 150">
        {/* Gauge background */}
        <circle cx="75" cy="75" r="70" fill="none" stroke="#2d2d2d" strokeWidth="12" />
        
        {/* Value arc */}
        <circle 
          cx="75" cy="75" r="70" 
          fill="none" 
          stroke={gaugeColor} 
          strokeWidth="12" 
          strokeDasharray="440" 
          strokeDashoffset={440 - (percentage * 440)} 
          transform="rotate(-90 75 75)"
          strokeLinecap="round"
        />
        
        {/* Needle */}
        <line 
          x1="75" y1="75" x2="75" y2="25" 
          stroke="#2d2d2d" 
          strokeWidth="3" 
          transform={`rotate(${rotation} 75 75)`}
          strokeLinecap="round"
        />
        
        {/* Center circle */}
        <circle cx="75" cy="75" r="12" fill="#2d2d2d" />
        <circle cx="75" cy="75" r="8" fill="#ffcd11" />
      </svg>
      
      <div className="gauge-value">
        {value}
        <span className="gauge-unit">{unit}</span>
      </div>
      
      {/* Range indicators */}
      <div className="gauge-range">
        <span className="range-min">{min}</span>
        <span className="range-max">{max}</span>
      </div>
    </div>
  );
};

export default GaugeMeter;