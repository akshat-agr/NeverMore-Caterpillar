import React, { useEffect, useState } from 'react';
import './AssetLibrary.css';

const AssetLibrary = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual backend API endpoint
    fetch('/api/assets')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch assets');
        return res.json();
      })
      .then(data => {
        setAssets(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="asset-library-container">
      <h2 className="asset-library-title">Asset Library</h2>
      {loading && <div className="asset-library-loading">Loading assets...</div>}
      {error && <div className="asset-library-error">{error}</div>}
      {!loading && !error && (
        <table className="asset-library-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Location</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>{asset.name}</td>
                <td>{asset.type}</td>
                <td>{asset.status}</td>
                <td>{asset.location}</td>
                <td>{asset.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssetLibrary;
