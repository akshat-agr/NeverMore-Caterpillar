// src/components/Dashboard/KPICards.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import ButterflyLoader from '../shared/ButterflyLoader';
import '../../styles/KPICards.css';

const KPICards = () => {
  const [kpiData, setKpiData] = useState([
    { title: 'Total Assets', value: 0, icon: '��' },
    { title: 'In Maintenance', value: 0, icon: '🔴' },
  ]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchKPIData();
  }, []);

  const fetchKPIData = async () => {
    try {
      if (!loading) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [equipmentData, statusData] = await Promise.all([
        apiService.getEquipment(),
        apiService.getEquipmentStatus(),
      ]);

      // Simple, logical KPI calculations
      const totalAssets = equipmentData.length;
      
      // Critical alerts = equipment in maintenance
      const criticalAlerts = statusData.filter(s => s.live_stat === 'maintenance').length;

      // Data validation - ensure numbers make sense
      const validatedCriticalAlerts = Math.min(criticalAlerts, totalAssets); // Can't have more in maintenance than total

      // Debug logging
      console.log('KPI Debug Data:', {
        totalAssets,
        criticalAlerts: validatedCriticalAlerts,
        equipmentDataLength: equipmentData.length,
        statusDataLength: statusData.length,
        activeRentals: statusData.filter(s => s.live_stat === 'maintenance').length,
      });

      const newKpiData = [
        { title: 'Total Assets', value: totalAssets, icon: '🚜' },
        { title: 'In Maintenance', value: validatedCriticalAlerts, icon: '🔴' },
      ];

      setKpiData(newKpiData);
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      // Fallback to sample data
      setKpiData([
        { title: 'Total Assets', value: 47, icon: '🚜' },
        { title: 'In Maintenance', value: 2, icon: '🔴' },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="kpi-container">
        <ButterflyLoader text="Loading KPI data..." />
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        marginBottom: '1rem', 
        display: 'flex', 
        justifyContent: 'flex-end' 
      }}>
        <button 
          onClick={fetchKPIData} 
          disabled={refreshing}
          style={{ 
            padding: '0.5rem 1rem', 
            background: refreshing ? '#95a5a6' : '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            cursor: refreshing ? 'not-allowed' : 'pointer'
          }}
        >
          {refreshing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ButterflyLoader size={16} showText={false} />
              Refreshing...
            </div>
          ) : (
            'Refresh'
          )}
        </button>
      </div>

      <div className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-title">{kpi.title}</div>
              <div className="kpi-icon">{kpi.icon}</div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPICards;
  