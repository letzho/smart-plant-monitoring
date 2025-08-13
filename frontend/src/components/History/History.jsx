import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';
import { apiBaseUrl } from '../../config';

export default function History({ user, onLogout }) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/sensor/history?serial_number=${user.serial_number}`);
        if (response.ok) {
          const data = await response.json();
          setHistoryData(data);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user.serial_number]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <div>
          <h2>Sensor History</h2>
          <div className="device-info">Device: <b>{user.serial_number}</b></div>
        </div>
        <div className="header-buttons">
          <button className="back-btn" onClick={handleBackToDashboard}>Back to Dashboard</button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading history...</div>
      ) : (
        <div className="history-content">
          {historyData.length === 0 ? (
            <div className="no-data">No sensor data available</div>
          ) : (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Temperature (°C)</th>
                    <th>Humidity (%)</th>
                    <th>Soil Moisture</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((record, index) => (
                    <tr key={index}>
                      <td>{new Date(record.timestamp).toLocaleString()}</td>
                      <td>{record.temperature}</td>
                      <td>{record.humidity}</td>
                      <td>{record.moisture}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 