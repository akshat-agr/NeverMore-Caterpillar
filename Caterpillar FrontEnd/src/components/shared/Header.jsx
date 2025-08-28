// src/components/Shared/Header.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Header.css';

const Header = ({ onScan }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname === '/asset-detail';
  const getTitle = () => {
    switch(location.pathname) {
      case '/': return 'Fleet Command Center';
      case '/asset-detail': return 'Digital Twin View';
      case '/analytics': return 'Analytics';
      case '/assets': return 'Asset Library';
      case '/rentals': return 'Rental Management';
      case '/maintenance': return 'Maintenance';
      case '/reports': return 'Reports';
      case '/settings': return 'Settings';
      default: return 'Caterpillar Smart Rental';
    }
  };

  return (
    <div className="header">
      <div className="logo">
        {showBack && (
          <button className="back-btn" onClick={() => navigate('/')}>←</button>
        )}
        <h1 className="dashboard-title">Caterpillar <span>SmartRent</span></h1>
      </div>
      <div>
        <h2 className="section-title">{getTitle()}</h2>
      </div>
      <div>
        <button className="primary-btn" onClick={onScan}>
          Scan QR Code
        </button>
      </div>
    </div>
  );
};

export default Header;