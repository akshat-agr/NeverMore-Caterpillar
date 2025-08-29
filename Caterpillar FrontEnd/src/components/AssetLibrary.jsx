import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import ButterflyLoader from './shared/ButterflyLoader';
import './AssetLibrary.css';

const AssetLibrary = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [rentalData, setRentalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [equipmentCounts, setEquipmentCounts] = useState({});

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [equipment, status, rentals] = await Promise.all([
        apiService.getEquipment(),
        apiService.getEquipmentStatus(),
        apiService.getRentals()
      ]);

      setEquipmentData(equipment);
      setStatusData(status);
      setRentalData(rentals);

      // Calculate equipment counts by type
      const counts = {};
      equipment.forEach(eq => {
        const type = eq.type;
        if (!counts[type]) {
          counts[type] = { total: 0, idle: 0, engine: 0, maintenance: 0, rented: 0 };
        }
        counts[type].total++;
        
        // Get status
        const eqStatus = status.find(s => s.eq_id === eq.eq_id);
        if (eqStatus) {
          counts[type][eqStatus.live_stat]++;
        }
        
        // Check if rented
        const isRented = rentals.some(r => r.eq_id === eq.eq_id);
        if (isRented) {
          counts[type].rented++;
        }
      });

      setEquipmentCounts(counts);
      setLoading(false);
    } catch (err) {
      setError(`Failed to load equipment data: ${err.message}`);
      setLoading(false);
    }
  };

  const getEquipmentByType = (type) => {
    return equipmentData.filter(eq => eq.type === type).map(eq => {
      const status = statusData.find(s => s.eq_id === eq.eq_id);
      const rental = rentalData.find(r => r.eq_id === eq.eq_id);
      
      // Calculate age
      const manufacturedDate = new Date(eq.manufactured_date);
      const today = new Date();
      const ageInYears = today.getFullYear() - manufacturedDate.getFullYear();
      
      return {
        id: eq.eq_id,
        type: eq.type,
        age: ageInYears,
        status: status?.live_stat || 'idle',
        isRented: !!rental,
        condition: eq.condition
      };
    });
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'engine': return 'status-active';
      case 'idle': return 'status-idle';
      case 'maintenance': return 'status-error';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'engine': return 'Active';
      case 'idle': return 'Idle';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="asset-library-container">
        <h2 className="asset-library-title">Asset Library</h2>
        <ButterflyLoader text="Loading equipment data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="asset-library-container">
        <h2 className="asset-library-title">Asset Library</h2>
        <div className="asset-library-error">{error}</div>
      </div>
    );
  }

  if (selectedType) {
    const equipmentList = getEquipmentByType(selectedType);
    const counts = equipmentCounts[selectedType];
    
    return (
      <div className="asset-library-container">
        <div className="asset-library-header">
          <button 
            onClick={() => setSelectedType(null)}
            className="back-button"
          >
            ← Back to Equipment Types
          </button>
          <h2 className="asset-library-title">{selectedType} Equipment</h2>
        </div>
        
        <div className="equipment-summary">
          <div className="summary-card">
            <h3>Total {selectedType}s</h3>
            <span className="summary-number">{counts.total}</span>
          </div>
          <div className="summary-card">
            <h3>Active</h3>
            <span className="summary-number status-active">{counts.engine}</span>
          </div>
          <div className="summary-card">
            <h3>Idle</h3>
            <span className="summary-number status-idle">{counts.idle}</span>
          </div>
          <div className="summary-card">
            <h3>In Maintenance</h3>
            <span className="summary-number status-error">{counts.maintenance}</span>
          </div>
          <div className="summary-card">
            <h3>Rented</h3>
            <span className="summary-number">{counts.rented}</span>
          </div>
        </div>

        <div className="equipment-details">
          <h3>Equipment Details</h3>
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Equipment ID</th>
                <th>Age (Years)</th>
                <th>Status</th>
                <th>Rental Status</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.map(equipment => (
                <tr key={equipment.id}>
                  <td><strong>{equipment.id}</strong></td>
                  <td>{equipment.age}</td>
                  <td>
                    <span className={`status-indicator ${getStatusClass(equipment.status)}`}></span>
                    {getStatusText(equipment.status)}
                  </td>
                  <td>
                    <span className={equipment.isRented ? 'rental-status rented' : 'rental-status available'}>
                      {equipment.isRented ? 'Rented' : 'Available'}
                    </span>
                  </td>
                  <td>{equipment.condition || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="asset-library-container">
      <h2 className="asset-library-title">Asset Library</h2>
      
      <div className="equipment-types-grid">
        {Object.entries(equipmentCounts).map(([type, counts]) => (
          <div 
            key={type} 
            className="equipment-type-card"
            onClick={() => setSelectedType(type)}
          >
            <h3 className="equipment-type-title">{type}</h3>
            <div className="equipment-count">{counts.total}</div>
            <div className="equipment-status-breakdown">
              <div className="status-item">
                <span className="status-dot status-active"></span>
                <span>{counts.engine} Active</span>
              </div>
              <div className="status-item">
                <span className="status-dot status-idle"></span>
                <span>{counts.idle} Idle</span>
              </div>
              <div className="status-item">
                <span className="status-dot status-error"></span>
                <span>{counts.maintenance} Maintenance</span>
              </div>
            </div>
            <div className="equipment-rental-status">
              <span className="rental-count">{counts.rented} Rented</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetLibrary;
