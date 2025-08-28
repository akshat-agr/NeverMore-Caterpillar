// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
import cat_logo from '../assets/Cat_logo.png';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <img src={cat_logo} alt="Caterpillar Logo" className="cat-logo" />
          <nav className="landing-nav">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Caterpillar Smart Rental Tool
            </h1>
            <p className="hero-subtitle">
              Revolutionizing construction equipment management with intelligent tracking, 
              real-time monitoring, and seamless rental operations.
            </p>
            <div className="hero-buttons">
              <Link to="/auth" className="btn-primary">
                Get Started
              </Link>
              <Link to="/auth" className="btn-secondary">
                Login
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="equipment-grid">
              <div className="equipment-item excavator">
                <div className="equipment-icon">EX</div>
                <span>Excavators</span>
              </div>
              <div className="equipment-item bulldozer">
                <div className="equipment-icon">BD</div>
                <span>Bulldozers</span>
              </div>
              <div className="equipment-item loader">
                <div className="equipment-icon">LD</div>
                <span>Loaders</span>
              </div>
              <div className="equipment-item crane">
                <div className="equipment-icon">CR</div>
                <span>Cranes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Smart Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">RT</div>
              <h3>Real-Time Monitoring</h3>
              <p>Track equipment location, fuel levels, and operational status in real-time</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">PM</div>
              <h3>Predictive Maintenance</h3>
              <p>AI-powered maintenance scheduling to prevent downtime and reduce costs</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">MM</div>
              <h3>Mobile Management</h3>
              <p>Manage your fleet from anywhere with our responsive mobile interface</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">AD</div>
              <h3>Analytics Dashboard</h3>
              <p>Comprehensive insights into equipment utilization and performance metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Caterpillar</h2>
              <p>
                For nearly 100 years, Caterpillar has been building the world's infrastructure 
                and, in partnership with our global dealer network, is driving positive and 
                sustainable change on every continent.
              </p>
              <p>
                Our Smart Rental Tool represents the next generation of construction equipment 
                management, combining decades of industry expertise with cutting-edge technology 
                to deliver unmatched efficiency and reliability.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Years of Excellence</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">190+</div>
                <div className="stat-label">Countries Served</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Equipment Models</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Equipment Management?</h2>
          <p>Join thousands of construction companies already using our smart solutions</p>
          <Link to="/auth" className="btn-primary btn-large">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <img src={cat_logo} alt="Caterpillar" className="footer-logo" />
              <p>Building a better world through innovation and sustainability.</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#docs">Documentation</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Caterpillar Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
