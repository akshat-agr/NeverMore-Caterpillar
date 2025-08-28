// src/components/Dashboard/LiveAssetList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import '../../styles/LiveAssetList.css';

const LiveAssetList = ({ onAssetSelect }) => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if backend is available
      try {
        await apiService.healthCheck();
        setBackendStatus('connected');
      } catch (healthErr) {
        setBackendStatus('disconnected');
        // Use sample data immediately if backend is down
        setAssets(getSampleData());
        setLoading(false);
        return;
      }

      // Backend is available, fetch real data
      const [equipmentData, statusData, rentalData] = await Promise.all([
        apiService.getEquipment(),
        apiService.getEquipmentStatus(),
        apiService.getRentals()
      ]);

      // Combine data to create comprehensive asset information
      const combinedAssets = equipmentData.map(equipment => {
        const status = statusData.find(s => s.eq_id === equipment.eq_id);
        const rental = rentalData.find(r => r.eq_id === equipment.eq_id);
        
        return {
          id: equipment.eq_id,
          name: equipment.type,
          status: status?.live_stat || 'idle',
          site: rental?.site_id || 'Unknown',
          returnDate: rental?.checkin ? new Date(rental.checkin).toISOString().split('T')[0] : 'N/A',
          coordinates: status ? { lat: status.latitude, lng: status.longitude } : null,
          condition: equipment.condition,
          lastMaintenance: equipment.last_maintenance_date
        };
      });

      setAssets(combinedAssets);
      
    } catch (err) {
      setError(`Failed to load assets: ${err.message}`);
      setBackendStatus('error');
      // Fallback to sample data if API fails
      setAssets(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => [
    { id: 'CAT-789', name: 'Excavator 350', status: 'engine', site: 'Construction Site A', returnDate: '2025-09-05' },
    { id: 'CAT-456', name: 'Bulldozer D6', status: 'idle', site: 'Mining Operation B', returnDate: '2025-09-02' },
    { id: 'CAT-123', name: 'Loader 521', status: 'engine', site: 'Construction Site C', returnDate: '2025-09-10' },
    { id: 'CAT-987', name: 'Crane 210', status: 'maintenance', site: 'Depot', returnDate: '2025-09-15' },
    { id: 'CAT-654', name: 'Excavator 380', status: 'engine', site: 'Construction Site A', returnDate: '2025-09-08' },
    { id: 'CAT-321', name: 'Bulldozer D7', status: 'idle', site: 'Mining Operation B', returnDate: '2025-09-03' },
  ];

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

  // Helper to check if asset is overdue
  const isOverdue = (returnDate) => {
    if (returnDate === 'N/A') return false;
    const today = new Date();
    const due = new Date(returnDate);
    return due < today;
  };

  // Helper to check anomaly (idle/maintenance for >2 days)
  const isAnomaly = (status, returnDate) => {
    if (status === 'idle' || status === 'maintenance') {
      if (returnDate === 'N/A') return false;
      const today = new Date();
      const due = new Date(returnDate);
      // If return date is more than 2 days away, flag as anomaly
      return (due - today) / (1000*60*60*24) > 2;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="asset-list">
        <h2>Live Asset List</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-spinner">Loading assets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="asset-list">
      <h2>Live Asset List</h2>
      
      {/* Backend Status Indicator */}
      <div style={{ 
        marginBottom: '1rem', 
        padding: '0.5rem 1rem', 
        borderRadius: '4px',
        backgroundColor: backendStatus === 'connected' ? '#d4edda' : 
                       backendStatus === 'disconnected' ? '#f8d7da' : '#fff3cd',
        color: backendStatus === 'connected' ? '#155724' : 
               backendStatus === 'disconnected' ? '#721c24' : '#856404',
        border: `1px solid ${backendStatus === 'connected' ? '#c3e6cb' : 
                           backendStatus === 'disconnected' ? '#f5c6cb' : '#ffeaa7'}`
      }}>
        <strong>Backend Status:</strong> {
          backendStatus === 'connected' ? '✅ Connected - Using Real Data' :
          backendStatus === 'disconnected' ? '❌ Disconnected - Using Sample Data' :
          '⚠️ Error - Using Sample Data'
        }
      </div>

      {error && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.5rem 1rem', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Total Assets: {assets.length}</span>
        <button onClick={fetchAssets} style={{ padding: '0.5rem 1rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}>
          Refresh
        </button>
      </div>

      <table className="asset-table">
        <thead>
          <tr>
            <th>Equipment ID</th>
            <th>Status</th>
            <th>Current Site</th>
            <th>Return Date</th>
            <th>Alerts</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr
              key={asset.id}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (onAssetSelect) onAssetSelect(asset);
                navigate('/asset-detail');
              }}
            >
              <td>
                <strong>{asset.id}</strong>
                <div style={{ fontSize: '0.9rem', color: '#7a7a7a' }}>{asset.name}</div>
              </td>
              <td>
                <span className={`status-indicator ${getStatusClass(asset.status)}`}></span>
                {getStatusText(asset.status)}
              </td>
              <td>{asset.site}</td>
              <td>{asset.returnDate}</td>
              <td>
                {isOverdue(asset.returnDate) && (
                  <span className="alert-badge overdue">Overdue</span>
                )}
                {isAnomaly(asset.status, asset.returnDate) && (
                  <span className="alert-badge anomaly">Anomaly</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveAssetList;