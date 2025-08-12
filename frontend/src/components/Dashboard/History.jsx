import React, { useEffect, useState } from 'react';
import './History.css';
import { apiBaseUrl } from '../../config';

export default function History({ serialNumber, onClose }) {
  const [rows, setRows] = useState([]);
  
  const fetchHistory = () => {
    fetch(`${apiBaseUrl}/api/sensor/history?serial_number=${serialNumber}`)
      .then(res => res.json())
      .then(setRows)
      .catch(error => console.error('Error fetching history:', error));
  };
  
  useEffect(() => {
    fetchHistory();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, [serialNumber]);
  return (
    <div className="history-modal">
      <div className="history-content">
        <div className="history-header">
          <h3>History for {serialNumber}</h3>
          <div className="history-actions">
            <button className="refresh-btn" onClick={fetchHistory}>Refresh</button>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Time</th><th>Temp</th><th>Humidity</th><th>Moisture</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.timestamp}</td>
                <td>{r.temperature}</td>
                <td>{r.humidity}</td>
                <td>{r.moisture}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 