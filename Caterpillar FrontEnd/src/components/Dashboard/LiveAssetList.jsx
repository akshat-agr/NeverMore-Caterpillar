// src/components/Dashboard/LiveAssetList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import '../../styles/LiveAssetList.css';

const ITEMS_PER_PAGE = 20;

const LiveAssetList = ({ onAssetSelect }) => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      const [equipmentData, statusData, rentalData, sitesData] = await Promise.all([
        apiService.getEquipment(),
        apiService.getEquipmentStatus(),
        apiService.getRentals(),
        apiService.getSites()
      ]);

      const combinedAssets = equipmentData.map(equipment => {
        const status = statusData.find(s => s.eq_id === equipment.eq_id);
        const rental = rentalData.find(r => r.eq_id === equipment.eq_id);
        const site = sitesData.find(s => s.site_id === rental?.site_id);
        
        return {
          id: equipment.eq_id,
          siteId: rental?.site_id || null,
          siteType: site?.site_type || null,
          region: site?.region || null,
          checkinDate: rental?.checkin ? new Date(rental.checkin).toISOString().split('T')[0] : null,
          checkoutDate: rental?.checkout ? new Date(rental.checkout).toISOString().split('T')[0] : null,
          status: status?.live_stat || 'idle',
          engineHoursPerDay: rental?.engine_hours_day || null,
          operatingDaysPerMonth: rental?.operating_days_month || null
        };
      }).filter(asset => asset.siteId !== null); // Only show equipment assigned to sites

      setAssets(combinedAssets);
      setCurrentPage(1); // reset to first page when reloading
      
    } catch (err) {
      setError(`Failed to load assets: ${err.message}`);
      setAssets(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => [
    { 
      id: 'CAT-789', 
      siteId: 'SITE-001',
      siteType: 'Construction',
      region: 'North Region',
      checkinDate: '2025-09-05',
      checkoutDate: '2025-01-15',
      status: 'engine',
      engineHoursPerDay: '8.5',
      operatingDaysPerMonth: '22'
    },
    { 
      id: 'CAT-456', 
      siteId: 'SITE-002',
      siteType: 'Mining',
      region: 'South Region',
      checkinDate: '2025-09-02',
      checkoutDate: '2025-01-10',
      status: 'idle',
      engineHoursPerDay: '10.0',
      operatingDaysPerMonth: '25'
    },
    { 
      id: 'CAT-123', 
      siteId: 'SITE-003',
      siteType: 'Construction',
      region: 'East Region',
      checkinDate: '2025-09-10',
      checkoutDate: '2025-01-20',
      status: 'engine',
      engineHoursPerDay: '7.5',
      operatingDaysPerMonth: '20'
    },
    { 
      id: 'CAT-987', 
      siteId: 'SITE-004',
      siteType: 'Depot',
      region: 'Central Region',
      checkinDate: '2025-09-15',
      checkoutDate: '2025-01-05',
      status: 'maintenance',
      engineHoursPerDay: '6.0',
      operatingDaysPerMonth: '18'
    },
    { 
      id: 'CAT-654', 
      siteId: 'SITE-001',
      siteType: 'Construction',
      region: 'North Region',
      checkinDate: '2025-09-08',
      checkoutDate: '2025-01-18',
      status: 'engine',
      engineHoursPerDay: '9.0',
      operatingDaysPerMonth: '24'
    },
    { 
      id: 'CAT-321', 
      siteId: 'SITE-002',
      siteType: 'Mining',
      region: 'South Region',
      checkinDate: '2025-09-03',
      checkoutDate: '2025-01-12',
      status: 'idle',
      engineHoursPerDay: '8.0',
      operatingDaysPerMonth: '22'
    }
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

  // Pagination logic
  const totalPages = Math.ceil(assets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAssets = assets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

if (loading) {
  return (
    <div className="asset-list">
      <h2>Live Asset List</h2>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div className="butterfly-loader">
          <svg
            width="120"
            height="120"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Wing */}
            <path
              d="M100,100 C40,20 10,90 60,120 C20,160 60,180 90,140 Z"
              fill="yellow"
              stroke="black"
              strokeWidth="3"
              className="wing left-wing"
            />
            {/* Right Wing */}
            <path
              d="M100,100 C160,20 190,90 140,120 C180,160 140,180 110,140 Z"
              fill="yellow"
              stroke="black"
              strokeWidth="3"
              className="wing right-wing"
            />
            {/* Butterfly body */}
            <rect x="95" y="90" width="10" height="40" rx="5" fill="black" />
            <circle cx="100" cy="80" r="8" fill="black" />
            {/* Antennae */}
            <path d="M100 80 C90 60, 70 50, 60 40" stroke="black" strokeWidth="2" fill="none"/>
            <path d="M100 80 C110 60, 130 50, 140 40" stroke="black" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#444" }}>
          Loading assets...
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="asset-list">
      <h2>Live Asset List</h2>

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

      <div style={{ 
        marginBottom: '1rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <span>Assets Assigned to Sites: {assets.length}</span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={fetchAssets} 
            className="refresh-btn"
          >
            🔄 Refresh
          </button>

          {currentPage > 1 && (
            <button 
              onClick={goToPrevPage} 
              className="pagination-btn prev-btn"
            >
              ← Previous
            </button>
          )}

          {currentPage < totalPages && (
            <button 
              onClick={goToNextPage} 
              className="pagination-btn next-btn"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      <div style={{ 
        marginBottom: '1rem', 
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        Page {currentPage} of {totalPages}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="asset-table">
          <thead>
            <tr>
              <th>Equipment ID</th>
              <th>Site ID</th>
              <th>Site Type</th>
              <th>Region</th>
              <th>Check-in Date</th>
              <th>Checkout Date</th>
              <th>Status</th>
              <th>Engine Hours/Day</th>
              <th>Operating Days/Month</th>
            </tr>
          </thead>
          <tbody>
            {currentAssets.map(asset => (
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
                </td>
                <td>
                  <strong>{asset.siteId}</strong>
                </td>
                <td>{asset.siteType}</td>
                <td>{asset.region}</td>
                <td>{asset.checkinDate}</td>
                <td>{asset.checkoutDate}</td>
                 <td>
                <span className="status-wrapper">
                  <span className={`status-indicator ${getStatusClass(asset.status)}`}></span>
                  {getStatusText(asset.status)}
                </span>
              </td>

                <td>{asset.engineHoursPerDay}</td>
                <td>{asset.operatingDaysPerMonth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveAssetList;
