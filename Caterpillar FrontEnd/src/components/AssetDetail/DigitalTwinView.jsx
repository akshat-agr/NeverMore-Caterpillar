// src/components/AssetDetail/DigitalTwinView.jsx
import React from 'react';
import GaugeMeter from './GaugeMeter';
import OperationalChart from './OperationalChart';
import ActivityLog from './ActivityLog';
import '../../styles/DigitalTwinView.css';

const DigitalTwinView = ({ asset }) => {
  return (
    <div className="digital-twin">
      <div className="asset-header">
        <h1 className="asset-title">{asset.name} - {asset.id}</h1>
        <div className="asset-status">Active</div>
      </div>
      
      <div className="gauges-container">
        <div className="gauge-card">
          <div className="gauge-title">Fuel Level</div>
          <GaugeMeter title="Fuel Level" value={75} unit="%" />
        </div>
        <div className="gauge-card">
          <div className="gauge-title">Engine Temp</div>
          <GaugeMeter title="Engine Temp" value={88} unit="°C" />
        </div>
        <div className="gauge-card">
          <div className="gauge-title">Runtime Hours</div>
          <GaugeMeter title="Runtime Hours" value={6.2} unit="h" />
        </div>
      </div>
      
      <OperationalChart />
      
      <ActivityLog />
    </div>
  );
};

export default DigitalTwinView;