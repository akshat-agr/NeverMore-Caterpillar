// src/components/Dashboard/ConstructionMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/ConstructionMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for construction equipment
const createEquipmentIcon = (type, status) => {
  const iconColor = status === 'active' ? 'green' : status === 'idle' ? 'orange' : 'red';
  
  return L.divIcon({
    className: 'custom-equipment-icon',
    html: `<div style="
      background-color: ${iconColor};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: bold;
    ">${type === 'excavator' ? 'E' : type === 'bulldozer' ? 'B' : type === 'loader' ? 'L' : 'C'}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const ConstructionMap = ({ onAssetSelect }) => {
  const [equipment, setEquipment] = useState([]);
  const [constructionSites, setConstructionSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch equipment data from backend
    fetch('/api/equipment')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch equipment');
        return res.json();
      })
      .then(data => {
        setEquipment(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch construction sites from backend
    fetch('/api/sites')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch sites');
        return res.json();
      })
      .then(data => setConstructionSites(data))
      .catch(err => setError(err.message));
  }, []);

  // Handle map click to select a site
  const handleMapClick = (e) => {
    // In a real app, you would check which site was clicked
    console.log('Map clicked at:', e.latlng);
  };

  // Handle marker click to select equipment
  const handleMarkerClick = (equipment) => {
    if (onAssetSelect) {
      onAssetSelect(equipment);
    }
  };
  const [expanded, setExpanded] = useState(false);
  
  const handleExpand = () => setExpanded(true);
  const handleClose = () => setExpanded(false);
  
  return (
    <div className="construction-map-container">
      {/* Minimized map view: only show button when not expanded */}
      {!expanded && (
        <div className="minimized-map" onClick={handleExpand} title="Click to expand">
          <span>Construction Map</span>
        </div>
      )}

      {/* Modal expanded map view: show full map inside modal */}
      {expanded && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClose}>Close</button>
            <div className="full-map">
              {loading && <div style={{ color: '#ffcd11', fontWeight: 600, padding: '1rem' }}>Loading map data...</div>}
              {error && <div style={{ color: '#ef4444', fontWeight: 600, padding: '1rem' }}>{error}</div>}
              {!loading && !error && (
                <MapContainer
                  center={[51.5074, -0.1278]}
                  zoom={15}
                  style={{ height: '400px', width: '100%' }}
                  onClick={handleMapClick}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* Draw construction sites as polygons */}
                  {constructionSites.map(site => (
                    <Polygon
                      key={site.id}
                      positions={site.bounds}
                      pathOptions={{
                        color: selectedSite === site.id ? '#ffcd11' : '#3388ff',
                        fillColor: selectedSite === site.id ? '#ffcd11' : '#3388ff',
                        fillOpacity: 0.2,
                        weight: 2
                      }}
                      eventHandlers={{
                        click: () => setSelectedSite(site.id)
                      }}
                    >
                      <Popup>
                        <div>
                          <h3>{site.name}</h3>
                          <p>Progress: {site.progress}%</p>
                          <p>Site Manager: {site.manager}</p>
                          <p>Deadline: {site.deadline}</p>
                        </div>
                      </Popup>
                    </Polygon>
                  ))}
                  {/* Add equipment markers */}
                  {equipment.map(item => (
                    <Marker
                      key={item.id}
                      position={item.position}
                      icon={createEquipmentIcon(item.type, item.status)}
                      eventHandlers={{
                        click: () => handleMarkerClick(item)
                      }}
                    >
                      <Popup>
                        <div>
                          <h3>{item.name}</h3>
                          <p><strong>ID:</strong> {item.id}</p>
                          <p><strong>Status:</strong> <span className={`status-${item.status}`}>{item.status}</span></p>
                          <p><strong>Site:</strong> {item.site}</p>
                          <p><strong>Last Update:</strong> {new Date(item.lastUpdate).toLocaleTimeString()}</p>
                          {item.usage && (
                            <p><strong>Usage:</strong> {item.usage.hours} hrs, {item.usage.cycles} cycles</p>
                          )}
                          {item.fuelLevel && (
                            <p><strong>Fuel Level:</strong> {item.fuelLevel}%</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
              <div className="map-controls">
                <button className="control-btn" title="Zoom In">+</button>
                <button className="control-btn" title="Zoom Out">-</button>
                <button className="control-btn" title="Current Location">📍</button>
                <button 
                  className="control-btn" 
                  title="Filter Equipment"
                  onClick={() => console.log('Open equipment filter')}
                >
                  🔧
                </button>
              </div>
              <div className="map-legend">
                <h4>Equipment Status</h4>
                <div className="legend-item">
                  <div className="status-dot active"></div>
                  <span>Active</span>
                </div>
                <div className="legend-item">
                  <div className="status-dot idle"></div>
                  <span>Idle</span>
                </div>
                <div className="legend-item">
                  <div className="status-dot error"></div>
                  <span>Error/Maintenance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstructionMap;