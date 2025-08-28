// src/components/CheckInOut/QRModal.jsx
import React from 'react';
import '../../styles/QRModal.css';

const QRModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="qr-modal">
        <div className="modal-header">
          <h2 className="modal-title">Scan Asset QR Code</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="scanner-placeholder">
          <div className="scanner-text">Camera Feed Placeholder</div>
        </div>
        
        <div className="modal-actions">
          <button className="primary-btn">Check-out Asset</button>
          <button className="secondary-btn">Check-in Asset</button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;