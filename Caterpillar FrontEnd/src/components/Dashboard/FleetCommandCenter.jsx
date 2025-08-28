// src/components/Dashboard/FleetCommandCenter.jsx
import React, { useState, useEffect } from 'react';
// import MapView from './MapView';
import KPICards from './KPICards';
import LiveAssetList from './LiveAssetList';
import ConstructionMap from './ConstructionMap';
import apiService from '../../services/api';
import '../../styles/FleetCommandCenter.css';

const FleetCommandCenter = ({ onAssetSelect }) => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    checkBackendStatus();
    // Check backend status every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    try {
      await apiService.healthCheck();
      setBackendStatus('connected');
      setLastCheck(new Date().toLocaleTimeString());
    } catch (error) {
      setBackendStatus('disconnected');
      setLastCheck(new Date().toLocaleTimeString());
    }
  };

  const getStatusStyles = () => {
    if (backendStatus === 'connected') {
      return {
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb'
      };
    } else {
      return {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb'
      };
    }
  };

  return (
    <div className="dashboard dashboard-flex" style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start' }}>
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Backend Status Banner */}
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          ...getStatusStyles(),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Backend Status:</strong> {
              backendStatus === 'connected' ? '✅ Connected - Real-time data active' :
              backendStatus === 'disconnected' ? '❌ Disconnected - Using sample data' :
              '⏳ Checking...'
            }
            {lastCheck && <span style={{ marginLeft: '1rem', fontSize: '0.9rem' }}>Last check: {lastCheck}</span>}
          </div>
          <button 
            onClick={checkBackendStatus}
            style={{
              padding: '0.5rem 1rem',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Check Status
          </button>
        </div>

        <LiveAssetList onAssetSelect={onAssetSelect} />
        <KPICards />
      </div>
      {/* Map is minimized by default, only shows as a floating button/modal */}
      <ConstructionMap onAssetSelect={onAssetSelect} />
    </div>
  );
};

export default FleetCommandCenter;