// src/components/Dashboard/FleetCommandCenter.jsx
import React, { useState } from 'react';
import LiveAssetList from './LiveAssetList';
import KPICards from './KPICards';
import '../../styles/FleetCommandCenter.css';

const FleetCommandCenter = ({ onAssetSelect }) => {
  const [selectedView, setSelectedView] = useState('overview');

  const renderView = () => {
    switch (selectedView) {
      case 'assets':
        return <LiveAssetList onAssetSelect={onAssetSelect} />;
      default:
        return (
          <div className="overview-container">
            <KPICards />
          </div>
        );
    }
  };

  return (
    <div className="fleet-command-center">
      <div className="dashboard-header">
        <h1>Fleet Command Center</h1>
        <div className="view-tabs">
          <button
            className={`tab ${selectedView === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedView('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${selectedView === 'assets' ? 'active' : ''}`}
            onClick={() => setSelectedView('assets')}
          >
            Live Assets
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {renderView()}
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Caterpillar Fleet Management</h4>
            <p>Powered by advanced IoT and real-time monitoring</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={() => setSelectedView('overview')}>Dashboard</button></li>
              <li><button onClick={() => setSelectedView('assets')}>Asset Library</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>System Status</h4>
            <div className="status-indicators">
              <span className="status-dot online"></span>
              <span>All Systems Operational</span>
            </div>
            <div className="status-indicators">
              <span className="status-dot sync"></span>
              <span>Real-time Sync Active</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Caterpillar Inc. All rights reserved. | Fleet Management System v2.0</p>
        </div>
      </footer>
    </div>
  );
};

export default FleetCommandCenter;
