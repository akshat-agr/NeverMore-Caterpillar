// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/shared/Header';
import Navigation from './components/shared/Navigation';
import FleetCommandCenter from './components/Dashboard/FleetCommandCenter';
import DigitalTwinView from './components/AssetDetail/DigitalTwinView';
import QRModal from './components/CheckInOut/QRModal';
import Analytics from './pages/Analytics';
import AssetLibrary from './pages/AssetLibrary';
import RentalManagement from './pages/RentalManagement';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import AuthLanding from './pages/AuthLanding';
import apiService from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [backendStatus, setBackendStatus] = useState('unknown');

  const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY; // Replace with your Clerk key

  useEffect(() => {
    // Test backend connection on app start
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      await apiService.healthCheck();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setCurrentView('asset-detail');
  };

  const handleBackToDashboard = () => {
    setSelectedAsset(null);
    setCurrentView('dashboard');
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <ClerkProvider publishableKey={clerkFrontendApi} >
      <Router>
        <SignedOut>
          <AuthLanding />
        </SignedOut>
        <SignedIn>
          <div className="app">
            {/* Backend Connection Alert */}
            {backendStatus === 'disconnected' && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '0.75rem',
                textAlign: 'center',
                borderBottom: '1px solid #f5c6cb',
                fontSize: '0.9rem'
              }}>
                ⚠️ <strong>Backend Connection Issue:</strong> The dashboard is using sample data. 
                Please ensure the backend server is running on port 5000. 
                <button 
                  onClick={testBackendConnection}
                  style={{
                    marginLeft: '1rem',
                    padding: '0.25rem 0.5rem',
                    background: '#721c24',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Retry Connection
                </button>
              </div>
            )}

            <Navigation />
            <div className="main-content">
              <Header />
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem' }}>
                <UserButton afterSignOutUrl="/" />
              </div>
              <Routes>
                <Route path="/" element={<FleetCommandCenter onAssetSelect={handleAssetSelect} />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/assets" element={<AssetLibrary />} />
                <Route path="/rentals" element={<RentalManagement />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/asset-detail" element={selectedAsset ? <DigitalTwinView asset={selectedAsset} /> : null} />
              </Routes>
              {showModal && <QRModal onClose={closeModal} />}
            </div>
          </div>
        </SignedIn>
      </Router>
    </ClerkProvider>
  );
}

export default App;