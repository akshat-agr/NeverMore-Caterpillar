// src/components/Shared/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Navigation.css';
import cat_img from '../../assets/Cat_logo.png';

const Navigation = () => {
  const location = useLocation();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'assets', label: 'Asset Library' },
    { id: 'rentals', label: 'Rental Management' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <nav className="navigation navbar">
      <div className="nav-logo">
        <img src={cat_img} alt="Cat Logo" className="nav-logo-img" />
      </div>
      <div className="nav-menu nav-menu-horizontal">
        {menuItems.map(item => (
          <Link
            key={item.id}
            to={item.id === 'dashboard' ? '/' : `/${item.id}`}
            className={`nav-item${location.pathname === (item.id === 'dashboard' ? '/' : `/${item.id}`) ? ' active' : ''}`}
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