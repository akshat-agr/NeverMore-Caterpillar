// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/shared/Header';
import Navigation from './components/shared/Navigation';
import FleetCommandCenter from './components/Dashboard/FleetCommandCenter';
import DigitalTwinView from './components/AssetDetail/DigitalTwinView';
import QRModal from './components/CheckInOut/QRModal';
import AssetLibrary from './pages/AssetLibrary';
import RentalManagement from './pages/RentalManagement';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
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
        <Routes>
          {/* Landing page for unauthenticated users */}
          <Route path="/" element={
            <>
              <SignedOut>
                <LandingPage />
              </SignedOut>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
            </>
          } />
          
          {/* Auth route */}
          <Route path="/auth" element={<AuthLanding />} />
          
          {/* Protected routes - only accessible after login */}
          <Route path="/dashboard" element={
            <SignedIn>
              <div className="app">
                <Navigation />
                <div className="main-content">
                  <Header />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem' }}>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                  <FleetCommandCenter onAssetSelect={handleAssetSelect} />
                </div>
              </div>
            </SignedIn>
          } />
          
          <Route path="/assets" element={
            <SignedIn>
              <div className="app">
                <Navigation />
                <div className="main-content">
                  <Header />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem' }}>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                  <AssetLibrary />
                </div>
              </div>
            </SignedIn>
          } />
          
          <Route path="/rentals" element={
            <SignedIn>
              <div className="app">
                <Navigation />
                <div className="main-content">
                  <Header />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem' }}>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                  <RentalManagement />
                </div>
              </div>
            </SignedIn>
          } />
          
          <Route path="/settings" element={
            <SignedIn>
              <div className="app">
                <Navigation />
                <div className="main-content">
                  <Header />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem' }}>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                  <Settings />
                </div>
              </div>
            </SignedIn>
          } />
          
          <Route path="/asset-detail" element={
            <SignedIn>
              <div className="app">
                <Navigation />
                <div className="main-content">
                  <Header />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem' }}>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                  {selectedAsset ? <DigitalTwinView asset={selectedAsset} /> : null}
                </div>
              </div>
            </SignedIn>
          } />
        </Routes>
        
        {/* QR Modal - available in all authenticated views */}
        {showModal && <QRModal onClose={closeModal} />}
      </Router>
    </ClerkProvider>
  );
}

export default App;
