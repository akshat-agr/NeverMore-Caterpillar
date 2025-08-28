// src/components/AssetDetail/DigitalTwinView.jsx
import React from 'react';
import GaugeMeter from './GaugeMeter';
import OperationalChart from './OperationalChart';
import ActivityLog from './ActivityLog';
import '../../styles/DigitalTwinView.css';

const DigitalTwinView = ({ asset }) => {
  // Generate random realistic values for construction equipment
  const generateRandomValue = (min, max, decimals = 0) => {
    const value = Math.random() * (max - min) + min;
    return decimals === 0 ? Math.floor(value) : parseFloat(value.toFixed(decimals));
  };

  const equipmentData = {
    name: asset?.name || 'CAT 320 Excavator',
    id: asset?.id || 'EXC-320-2024-001',
    model: 'CAT 320',
    year: '2024',
    serialNumber: 'CAT320-2024-001234',
    location: 'Site A - North Zone',
    operator: 'Mike Johnson',
    lastMaintenance: 'Dec 10, 2024',
    nextMaintenance: 'Jan 15, 2025',
    totalHours: generateRandomValue(1200, 1800),
    fuelLevel: generateRandomValue(15, 95),
    engineTemp: generateRandomValue(75, 110, 1),
    oilPressure: generateRandomValue(40, 65, 1),
    hydraulicPressure: generateRandomValue(2000, 3500),
    batteryVoltage: generateRandomValue(12.2, 14.8, 1),
    coolantLevel: generateRandomValue(60, 95),
    airFilter: generateRandomValue(20, 90),
    tirePressure: generateRandomValue(25, 35, 1),
    runtimeHours: generateRandomValue(4.5, 12.0, 1),
    idleHours: generateRandomValue(1.0, 3.5, 1),
    fuelConsumption: generateRandomValue(8.5, 15.2, 1),
    efficiency: generateRandomValue(78, 94, 1)
  };

  return (
    <div className="digital-twin">
      <div className="asset-header">
        <div className="asset-info">
          <h1 className="asset-title">{equipmentData.name}</h1>
          <div className="asset-details">
            <span className="asset-id">ID: {equipmentData.id}</span>
            <span className="asset-model">Model: {equipmentData.model}</span>
            <span className="asset-year">Year: {equipmentData.year}</span>
            <span className="asset-serial">S/N: {equipmentData.serialNumber}</span>
          </div>
        </div>
        <div className="asset-status-container">
          <div className="asset-status active">Active</div>
          <div className="asset-location">{equipmentData.location}</div>
          <div className="asset-operator">Operator: {equipmentData.operator}</div>
        </div>
      </div>
      
      <div className="maintenance-info">
        <div className="maintenance-card">
          <h4>Maintenance Status</h4>
          <div className="maintenance-details">
            <span>Last: {equipmentData.lastMaintenance}</span>
            <span>Next: {equipmentData.nextMaintenance}</span>
            <span>Total Hours: {equipmentData.totalHours}h</span>
          </div>
        </div>
      </div>
      
      <div className="gauges-container">
        <div className="gauge-card">
          <div className="gauge-title">Fuel Level</div>
          <GaugeMeter title="Fuel Level" value={equipmentData.fuelLevel} unit="%" />
        </div>
        <div className="gauge-card">
          <div className="gauge-title">Engine Temperature</div>
          <GaugeMeter title="Engine Temp" value={equipmentData.engineTemp} unit="°C" />
        </div>
        <div className="gauge-card">
          <div className="gauge-title">Oil Pressure</div>
          <GaugeMeter title="Oil Pressure" value={equipmentData.oilPressure} unit="PSI" />
        </div>
        <div className="gauge-card">
          <div className="gauge-title">Hydraulic Pressure</div>
          <GaugeMeter title="Hydraulic" value={equipmentData.hydraulicPressure} unit="PSI" />
        </div>
        <div className="gauge-card">
          <div className="gauge-title">Battery Voltage</div>
          <GaugeMeter title="Battery" value={equipmentData.batteryVoltage} unit="V" />
        </div>
        <div className="gauge-card">
          <div className="gauge-title">Coolant Level</div>
          <GaugeMeter title="Coolant" value={equipmentData.coolantLevel} unit="%" />
        </div>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Operational Metrics</h4>
          <div className="metric-row">
            <span>Runtime Today:</span>
            <span className="metric-value">{equipmentData.runtimeHours}h</span>
          </div>
          <div className="metric-row">
            <span>Idle Time:</span>
            <span className="metric-value">{equipmentData.idleHours}h</span>
          </div>
          <div className="metric-row">
            <span>Fuel Consumption:</span>
            <span className="metric-value">{equipmentData.fuelConsumption} L/h</span>
          </div>
          <div className="metric-row">
            <span>Efficiency:</span>
            <span className="metric-value">{equipmentData.efficiency}%</span>
          </div>
        </div>
        
        <div className="metric-card">
          <h4>System Health</h4>
          <div className="metric-row">
            <span>Air Filter:</span>
            <span className="metric-value">{equipmentData.airFilter}%</span>
          </div>
          <div className="metric-row">
            <span>Tire Pressure:</span>
            <span className="metric-value">{equipmentData.tirePressure} PSI</span>
          </div>
          <div className="metric-row">
            <span>Overall Health:</span>
            <span className="metric-value health-good">Good</span>
          </div>
        </div>
      </div>
      
      <OperationalChart />
      
      <ActivityLog />
    </div>
  );
};

export default DigitalTwinView;