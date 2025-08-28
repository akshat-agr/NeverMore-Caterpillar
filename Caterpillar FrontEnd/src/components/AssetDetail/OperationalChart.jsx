// src/components/AssetDetail/OperationalChart.jsx
import React from 'react';
import '../../styles/OperationalChart.css';

const OperationalChart = () => {
  // Generate realistic operational data for the last 7 days
  const generateOperationalData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        operational: Math.floor(Math.random() * 8) + 4, // 4-12 hours
        idle: Math.floor(Math.random() * 3) + 1, // 1-4 hours
        maintenance: Math.floor(Math.random() * 2), // 0-2 hours
        fuelConsumption: (Math.random() * 8 + 8).toFixed(1) // 8-16 L/h
      });
    }
    
    return data;
  };

  const chartData = generateOperationalData();
  const maxHours = Math.max(...chartData.map(d => d.operational + d.idle + d.maintenance));

  return (
    <div className="chart-container">
      <h3 className="chart-title">Operational Hours vs. Idle Hours (Last 7 Days)</h3>
      
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color operational"></span>
          <span>Operational</span>
        </div>
        <div className="legend-item">
          <span className="legend-color idle"></span>
          <span>Idle</span>
        </div>
        <div className="legend-item">
          <span className="legend-color maintenance"></span>
          <span>Maintenance</span>
        </div>
      </div>
      
      <div className="chart-content">
        <div className="chart-bars">
          {chartData.map((day, index) => (
            <div key={index} className="chart-bar-group">
              <div className="bar-label">{day.date}</div>
              <div className="bars-container">
                <div 
                  className="bar operational" 
                  style={{ height: `${(day.operational / maxHours) * 120}px` }}
                  title={`Operational: ${day.operational}h`}
                ></div>
                <div 
                  className="bar idle" 
                  style={{ height: `${(day.idle / maxHours) * 120}px` }}
                  title={`Idle: ${day.idle}h`}
                ></div>
                <div 
                  className="bar maintenance" 
                  style={{ height: `${(day.maintenance / maxHours) * 120}px` }}
                  title={`Maintenance: ${day.maintenance}h`}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="chart-summary">
          <div className="summary-card">
            <h4>Weekly Summary</h4>
            <div className="summary-row">
              <span>Total Operational:</span>
              <span className="summary-value">
                {chartData.reduce((sum, day) => sum + day.operational, 0)}h
              </span>
            </div>
            <div className="summary-row">
              <span>Total Idle:</span>
              <span className="summary-value">
                {chartData.reduce((sum, day) => sum + day.idle, 0)}h
              </span>
            </div>
            <div className="summary-row">
              <span>Avg Fuel Consumption:</span>
              <span className="summary-value">
                {(chartData.reduce((sum, day) => sum + parseFloat(day.fuelConsumption), 0) / chartData.length).toFixed(1)} L/h
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalChart;