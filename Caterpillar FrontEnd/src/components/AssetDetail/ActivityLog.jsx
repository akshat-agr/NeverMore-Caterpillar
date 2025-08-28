// src/components/AssetDetail/ActivityLog.jsx
import React from 'react';
import '../../styles/ActivityLog.css';

const ActivityLog = () => {
  const logData = [
    { action: 'Equipment Checked Out', user: 'John Doe', date: 'Dec 15, 2024, 08:00 AM', type: 'checkout', status: 'completed' },
    { action: 'Pre-Start Inspection Completed', user: 'Mike Johnson', date: 'Dec 15, 2024, 07:45 AM', type: 'inspection', status: 'completed' },
    { action: 'Fuel Refill - 150L Diesel', user: 'Sarah Wilson', date: 'Dec 14, 2024, 06:30 PM', type: 'fuel', status: 'completed' },
    { action: 'Routine Maintenance Scheduled', user: 'Maintenance Team', date: 'Dec 14, 2024, 04:00 PM', type: 'maintenance', status: 'scheduled' },
    { action: 'Equipment Returned', user: 'Alex Chen', date: 'Dec 14, 2024, 05:15 PM', type: 'return', status: 'completed' },
    { action: 'Safety Check Passed', user: 'Safety Inspector', date: 'Dec 14, 2024, 02:00 PM', type: 'safety', status: 'completed' },
    { action: 'GPS Tracking Activated', user: 'System Admin', date: 'Dec 14, 2024, 01:30 PM', type: 'system', status: 'completed' },
    { action: 'Operator Training Completed', user: 'Training Dept', date: 'Dec 13, 2024, 11:00 AM', type: 'training', status: 'completed' },
    { action: 'Equipment Checked Out', user: 'David Brown', date: 'Dec 13, 2024, 09:00 AM', type: 'checkout', status: 'completed' },
    { action: 'Oil Change & Filter Replacement', user: 'Mechanic Team', date: 'Dec 12, 2024, 03:00 PM', type: 'maintenance', status: 'completed' },
    { action: 'Tire Pressure Check', user: 'Ground Crew', date: 'Dec 12, 2024, 10:00 AM', type: 'inspection', status: 'completed' },
    { action: 'Equipment Returned', user: 'Lisa Garcia', date: 'Dec 11, 2024, 07:00 PM', type: 'return', status: 'completed' },
    { action: 'Emergency Stop Test', user: 'Safety Team', date: 'Dec 11, 2024, 02:30 PM', type: 'safety', status: 'completed' },
    { action: 'Hydraulic System Check', user: 'Technician', date: 'Dec 10, 2024, 04:00 PM', type: 'inspection', status: 'completed' },
    { action: 'Equipment Checked Out', user: 'Robert Lee', date: 'Dec 10, 2024, 08:30 AM', type: 'checkout', status: 'completed' }
  ];

  const getStatusIcon = (type) => {
    switch(type) {
      case 'checkout': return '→';
      case 'return': return '←';
      case 'inspection': return '✓';
      case 'maintenance': return '🔧';
      case 'fuel': return '⛽';
      case 'safety': return '🛡️';
      case 'system': return '⚡';
      case 'training': return '📚';
      default: return '•';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'scheduled': return 'status-scheduled';
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  };

  return (
    <div className="activity-log">
      <h3 className="log-title">Activity Log</h3>
      <div className="log-summary">
        <span className="summary-item">Total Activities: {logData.length}</span>
        <span className="summary-item">Last 7 Days: {logData.filter(log => {
          const logDate = new Date(log.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return logDate >= weekAgo;
        }).length}</span>
      </div>
      
      <div className="activity-timeline">
        {logData.map((log, index) => (
          <div key={index} className={`log-entry ${getStatusColor(log.status)}`}>
            <div className="log-icon">{getStatusIcon(log.type)}</div>
            <div className="log-content">
              <div className="log-action">{log.action}</div>
              <div className="log-user">by {log.user}</div>
              <div className="log-date">{log.date}</div>
            </div>
            <div className={`log-status ${getStatusColor(log.status)}`}>
              {log.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;