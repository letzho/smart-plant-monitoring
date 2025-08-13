import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import './Dashboard.css';
import Recommendation from './Recommendation.jsx';
import { apiBaseUrl } from '../../config';

export default function Dashboard({ user, onLogout, showRec, setShowRec }) {
  const [data, setData] = useState({ temperature: 0, humidity: 0, moisture: 0, timestamp: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      fetch(`${apiBaseUrl}/api/sensor/latest?serial_number=${user.serial_number}`)
        .then(res => res.json())
        .then(d => {
          console.log('Received sensor data:', d);
          // Ensure values are numbers
          const processedData = {
            temperature: parseFloat(d.temperature) || 0,
            humidity: parseFloat(d.humidity) || 0,
            moisture: parseFloat(d.moisture) || 0,
            timestamp: d.timestamp
          };
          console.log('Processed data:', processedData);
          setData(processedData);
        })
        .catch(error => {
          console.error('Error fetching sensor data:', error);
        });
    };
    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000); // Poll every 10 minutes (600,000 ms)
    return () => clearInterval(interval);
  }, [user.serial_number]);

  const handleViewHistory = () => {
    navigate('/history');
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h2>Smart Plant Monitor</h2>
          <div className="device-info">Device: <b>{user.serial_number}</b></div>
        </div>
        <button className="logout-btn1" onClick={onLogout}>Logout</button>
      </div>
      <div className="dashboard-gauges">
        <div className="gauge-card">
          <GaugeChart 
            id="temp-gauge" 
            nrOfLevels={20} 
            percent={Math.min(data.temperature / 50, 1)} 
            colors={["#ff4d4f", "#1890ff"]} 
            arcWidth={0.3} 
            textColor="#222" 
            formatTextValue={() => `${data.temperature}°C`} 
          />
          <div className="gauge-label temp">{data.temperature}°C</div>
          <div className="gauge-desc">Temperature</div>
        </div>
        <div className="gauge-card">
          <GaugeChart 
            id="hum-gauge" 
            nrOfLevels={20} 
            percent={Math.min(data.humidity / 100, 1)} 
            colors={["#b2f7ef", "#00b894"]} 
            arcWidth={0.3} 
            textColor="#222" 
            formatTextValue={() => `${data.humidity}%`} 
          />
          <div className="gauge-label hum">{data.humidity}%</div>
          <div className="gauge-desc">Humidity</div>
        </div>
        <div className="gauge-card">
          <GaugeChart 
            id="moist-gauge" 
            nrOfLevels={20} 
            percent={Math.min(data.moisture / 100, 1)} 
            colors={["#e0c3fc", "#6c47ff"]} 
            arcWidth={0.3} 
            textColor="#222" 
            formatTextValue={() => `${data.moisture}%`} 
          />
          <div className="gauge-label moist">{data.moisture}%</div>
          <div className="gauge-desc">Soil Moisture</div>
        </div>
      </div>
      <div className="dashboard-footer">
        <div>Last update: {data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : '—'}</div>
      </div>
      <div className="dashboard-actions">
        <button className="history-btn" onClick={handleViewHistory}>View History</button>
        <button className="rec-btn" onClick={() => setShowRec(true)}>Recommendations</button>
      </div>
      {showRec && (
        <Recommendation
          temperature={data.temperature}
          humidity={data.humidity}
          moisture={data.moisture}
          onClose={() => setShowRec(false)}
        />
      )}
    </div>
  );
} 