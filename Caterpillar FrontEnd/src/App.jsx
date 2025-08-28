// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/shared/Header';
import Navigation from './components/shared/Navigation';
import FleetCommandCenter from './components/Dashboard/FleetCommandCenter';
import DigitalTwinView from './components/AssetDetail/DigitalTwinView';
import QRModal from './components/CheckInOut/QRModal';
import AssetLibrary from './pages/AssetLibrary';
import RentalManagement from './pages/RentalManagement';
import Settings from './pages/Settings';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import AuthLanding from './pages/AuthLanding';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

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
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <Router>
        <SignedOut>
          <AuthLanding />
        </SignedOut>
        <SignedIn>
          <div className="app">
            <Navigation />
            <div className="main-content">
              <Header />
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem' }}>
                <UserButton afterSignOutUrl="/" />
              </div>
              <Routes>
                <Route path="/" element={<FleetCommandCenter onAssetSelect={handleAssetSelect} />} />
                <Route path="/assets" element={<AssetLibrary />} />
                <Route path="/rentals" element={<RentalManagement />} />
                <Route path="/settings" element={<Settings />} />
                <Route
                  path="/asset-detail"
                  element={selectedAsset ? <DigitalTwinView asset={selectedAsset} /> : null}
                />
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
