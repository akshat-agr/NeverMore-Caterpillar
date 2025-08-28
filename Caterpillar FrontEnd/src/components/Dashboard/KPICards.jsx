// src/components/Dashboard/KPICards.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import '../../styles/KPICards.css';

const KPICards = () => {
  const [kpiData, setKpiData] = useState([
    { title: 'Total Assets Rented', value: 0, icon: '🚜' },
    { title: 'Utilization Rate', value: '0%', icon: '📊' },
    { title: 'Overdue Assets', value: 0, icon: '⚠️' },
    { title: 'Critical Alerts', value: 0, icon: '🔴' },
  ]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    fetchKPIData();
  }, []);

  const fetchKPIData = async () => {
    try {
      setLoading(true);
      
      // First check if backend is available
      try {
        await apiService.healthCheck();
        setBackendStatus('connected');
      } catch (healthErr) {
        setBackendStatus('disconnected');
        // Use sample data immediately if backend is down
        setKpiData([
          { title: 'Total Assets Rented', value: 47, icon: '🚜' },
          { title: 'Utilization Rate', value: '85%', icon: '📊' },
          { title: 'Overdue Assets', value: 3, icon: '⚠️' },
          { title: 'Critical Alerts', value: 2, icon: '🔴' },
        ]);
        setLoading(false);
        return;
      }

      // Backend is available, fetch real data
      const [equipmentData, statusData, rentalData] = await Promise.all([
        apiService.getEquipment(),
        apiService.getEquipmentStatus(),
        apiService.getRentals()
      ]);

      // Calculate KPIs
      const totalAssets = equipmentData.length;
      const activeAssets = statusData.filter(s => s.live_stat === 'engine').length;
      const utilizationRate = totalAssets > 0 ? Math.round((activeAssets / totalAssets) * 100) : 0;
      
      // Calculate overdue assets
      const today = new Date();
      const overdueAssets = rentalData.filter(rental => {
        if (!rental.checkin) return false;
        const dueDate = new Date(rental.checkin);
        return dueDate < today;
      }).length;

      // Calculate critical alerts (maintenance + idle for extended periods)
      const criticalAlerts = statusData.filter(s => s.live_stat === 'maintenance').length;

      const newKpiData = [
        { title: 'Total Assets Rented', value: totalAssets, icon: '🚜' },
        { title: 'Utilization Rate', value: `${utilizationRate}%`, icon: '📊' },
        { title: 'Overdue Assets', value: overdueAssets, icon: '⚠️' },
        { title: 'Critical Alerts', value: criticalAlerts, icon: '🔴' },
      ];

      setKpiData(newKpiData);
    } catch (error) {
      setBackendStatus('error');
      // Fallback to sample data
      setKpiData([
        { title: 'Total Assets Rented', value: 47, icon: '🚜' },
        { title: 'Utilization Rate', value: '85%', icon: '📊' },
        { title: 'Overdue Assets', value: 3, icon: '⚠️' },
        { title: 'Critical Alerts', value: 2, icon: '🔴' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <div key={index} className="kpi-card loading">
            <div className="kpi-header">
              <div className="kpi-title">{kpi.title}</div>
              <div className="kpi-icon">{kpi.icon}</div>
            </div>
            <div className="kpi-value">...</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
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
                           backendStatus === 'disconnected' ? '#f5c6cb' : '#ffeaa7'}`,
        fontSize: '0.9rem'
      }}>
        <strong>KPI Data Source:</strong> {
          backendStatus === 'connected' ? '✅ Real-time from Backend' :
          backendStatus === 'disconnected' ? '❌ Sample Data (Backend Offline)' :
          '⚠️ Sample Data (Backend Error)'
        }
        <button 
          onClick={fetchKPIData} 
          style={{ 
            marginLeft: '1rem', 
            padding: '0.25rem 0.5rem', 
            background: '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '0.8rem'
          }}
        >
          Refresh
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