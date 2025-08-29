// src/QRScanner/QRScanner.jsx
import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan }) => {
  useEffect(() => {
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      onScan(decodedText);
    };

    const qrCodeErrorCallback = (errorMessage) => {
      console.error(errorMessage);
    };

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    const scanner = new Html5QrcodeScanner('qr-scanner-container', config);
    scanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);

    return () => {
      scanner.clear();
    };
  }, [onScan]);

  return <div id="qr-scanner-container" style={{ width: '100%', height: '100%' }} />;
};

export default QRScanner;
