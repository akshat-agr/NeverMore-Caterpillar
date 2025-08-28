// src/components/AssetDetail/ActivityLog.jsx
import React from 'react';
import '../../styles/ActivityLog.css';

const ActivityLog = () => {
  const logData = [
    { action: 'Checked out by John Doe', date: 'Aug 28, 2025, 08:00 AM' },
    { action: 'Scheduled Maintenance Due', date: 'Sep 02, 2025' },
    { action: 'Checked in by Jane Smith', date: 'Aug 27, 2025, 06:00 PM' },
    { action: 'Routine Inspection Completed', date: 'Aug 25, 2025, 10:30 AM' },
    { action: 'Checked out by Mike Johnson', date: 'Aug 24, 2025, 09:15 AM' },
  ];

  return (
    <div className="activity-log">
      <h3 className="log-title">Activity Log</h3>
      <ul className="activity-list"></ul>
      {logData.map((log, index) => (
        <div key={index} className="log-entry">
          <div className="log-dot"></div>
          <div className="log-content">
            <div className="log-action">{log.action}</div>
            <div className="log-date">{log.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityLog;