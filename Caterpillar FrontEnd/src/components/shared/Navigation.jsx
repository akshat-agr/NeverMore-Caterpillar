// src/components/Shared/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Navigation.css';
import cat_img from '../../assets/Cat_logo.png';

const Navigation = () => {
  const location = useLocation();
  const menuItems = [
    { id: 'dashboard', label: 'Live Assets' },
    { id: 'assets', label: 'Overview' },
    { id: 'demand', label: 'Demand Forecasting' },
    { id: 'insights', label: 'Special Insight' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <nav className="navigation navbar">
      <div className="nav-logo">
        <Link to="/dashboard">
          <img src={cat_img} alt="Cat Logo" className="nav-logo-img" />
        </Link>
      </div>
      <div className="nav-menu nav-menu-horizontal">
        {menuItems.map(item => (
          <Link
            key={item.id}
            to={`/${item.id}`}
            className={`nav-item${location.pathname === `/${item.id}` ? ' active' : ''}`}
            title={item.label}
          >
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;