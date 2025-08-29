import React, { useState, useEffect } from 'react';
import demandData from '../data/demandForecast.json';
import '../styles/DemandForecasting.css';

const DemandForecasting = () => {
  const [demandForecasts, setDemandForecasts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deviceType');

  useEffect(() => {
    setDemandForecasts(demandData.demandForecasts);
    setFilteredData(demandData.demandForecasts);
  }, []);

  useEffect(() => {
    let filtered = demandForecasts.filter(item =>
      item.deviceType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort the filtered data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deviceType':
          return a.deviceType.localeCompare(b.deviceType);
        case 'forecastedDemand':
          return b.forecastedDemand - a.forecastedDemand;
        case 'shortage':
          return b.shortage - a.shortage;
        case 'trend':
          return a.trend.localeCompare(b.trend);
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  }, [searchTerm, sortBy, demandForecasts]);

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing':
        return '#ff6b6b';
      case 'high':
        return '#ff4757';
      case 'stable':
        return '#2ed573';
      default:
        return '#747d8c';
    }
  };

  const getShortageColor = (shortage) => {
    if (shortage > 10) return '#ff4757';
    if (shortage > 5) return '#ffa502';
    return '#2ed573';
  };

  return (
    <div className="demand-forecasting">
      <div className="page-header">
        <h1>Demand Forecasting</h1>
        <p>Forecasted demand numbers per device type for {demandForecasts[0]?.month || 'December 2024'}</p>
      </div>

      <div className="controls-section">
        <div className="search-control">
          <input
            type="text"
            placeholder="Search device types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-control">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="deviceType">Device Type</option>
            <option value="forecastedDemand">Forecasted Demand</option>
            <option value="shortage">Shortage</option>
            <option value="trend">Trend</option>
          </select>
        </div>
      </div>

      <div className="forecast-grid">
        {filteredData.map((forecast, index) => (
          <div key={index} className="forecast-card">
            <div className="card-header">
              <h3 className="device-type">{forecast.deviceType}</h3>
              <span 
                className="trend-badge"
                style={{ backgroundColor: getTrendColor(forecast.trend) }}
              >
                {forecast.trend}
              </span>
            </div>
            
            <div className="card-content">
              <div className="metric-row">
                <div className="metric">
                  <span className="metric-label">Forecasted Demand:</span>
                  <span className="metric-value demand">{forecast.forecastedDemand}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Current Inventory:</span>
                  <span className="metric-value inventory">{forecast.currentInventory}</span>
                </div>
              </div>
              
              <div className="shortage-section">
                <div className="metric">
                  <span className="metric-label">Shortage:</span>
                  <span 
                    className="metric-value shortage"
                    style={{ color: getShortageColor(forecast.shortage) }}
                  >
                    {forecast.shortage}
                  </span>
                </div>
                
                {forecast.shortage > 0 && (
                  <div className="shortage-warning">
                    ⚠️ {forecast.shortage > 10 ? 'Critical shortage' : 'Moderate shortage'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="no-results">
          <p>No device types found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DemandForecasting;
