import React, { useState, useEffect } from 'react';
import insightsData from '../data/specialInsights.json';
import '../styles/SpecialInsight.css';

const SpecialInsight = () => {
  const [insights, setInsights] = useState([]);
  const [filteredInsights, setFilteredInsights] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');

  useEffect(() => {
    setInsights(insightsData.specialInsights);
    setFilteredInsights(insightsData.specialInsights);
  }, []);

  useEffect(() => {
    let filtered = insights.filter(insight => {
      const matchesSearch = 
        insight.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUrgency = urgencyFilter === 'all' || insight.urgency === urgencyFilter;
      const matchesDevice = deviceFilter === 'all' || insight.device === deviceFilter;
      
      return matchesSearch && matchesUrgency && matchesDevice;
    });

    // Sort by urgency (High first, then Medium, then Low)
    filtered.sort((a, b) => {
      const urgencyOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });

    setFilteredInsights(filtered);
  }, [searchTerm, urgencyFilter, deviceFilter, insights]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High':
        return '#ff4757';
      case 'Medium':
        return '#ffa502';
      case 'Low':
        return '#2ed573';
      default:
        return '#747d8c';
    }
  };

  const getDeviceIcon = (device) => {
    const deviceIcons = {
      'Excavators': '🚜',
      'Cranes': '🏗️',
      'Bulldozers': '🚜',
      'Wheel Loaders': '🚛',
      'Dump Trucks': '🚛',
      'Compactors': '🚜'
    };
    return deviceIcons[device] || '🔧';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="special-insight">
      <div className="page-header">
        <h1>Special Insights</h1>
        <p>Market intelligence and demand insights based on latest news and industry developments</p>
      </div>

      <div className="controls-section">
        <div className="search-control">
          <input
            type="text"
            placeholder="Search insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-control">
            <label htmlFor="urgency-filter">Urgency:</label>
            <select
              id="urgency-filter"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Urgencies</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          <div className="filter-control">
            <label htmlFor="device-filter">Device:</label>
            <select
              id="device-filter"
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Devices</option>
              <option value="Excavators">Excavators</option>
              <option value="Cranes">Cranes</option>
              <option value="Bulldozers">Bulldozers</option>
              <option value="Wheel Loaders">Wheel Loaders</option>
              <option value="Dump Trucks">Dump Trucks</option>
              <option value="Compactors">Compactors</option>
            </select>
          </div>
        </div>
      </div>

      <div className="insights-grid">
        {filteredInsights.map((insight) => (
          <div key={insight.id} className="insight-card">
            <div className="card-header">
              <div className="device-info">
                <span className="device-icon">{getDeviceIcon(insight.device)}</span>
                <h3 className="device-name">{insight.device}</h3>
              </div>
              <span 
                className="urgency-badge"
                style={{ backgroundColor: getUrgencyColor(insight.urgency) }}
              >
                {insight.urgency}
              </span>
            </div>
            
            <div className="card-content">
              <div className="location-section">
                <h4>📍 Location</h4>
                <p className="location">{insight.location}</p>
              </div>
              
              <div className="timeline-section">
                <h4>⏰ Timeline</h4>
                <p className="timeline">{insight.timeline}</p>
              </div>
              
              <div className="description-section">
                <h4>📋 Description</h4>
                <p className="description">{insight.description}</p>
              </div>
              
              <div className="demand-section">
                <h4>📊 Estimated Demand</h4>
                <p className="demand">{insight.estimatedDemand} units</p>
              </div>
              
              <div className="source-section">
                <h4>📰 Source</h4>
                <a 
                  href={insight.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  Read Full Article →
                </a>
                <span className="news-date">{formatDate(insight.newsDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <div className="no-results">
          <p>No insights found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SpecialInsight;
