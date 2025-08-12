import React, { useEffect, useState } from 'react';
import './History.css';
import { apiBaseUrl } from '../../config';

export default function History({ serialNumber, onClose }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/sensor/history?serial_number=${serialNumber}`)
      .then(res => res.json())
      .then(setRows);
  }, [serialNumber]);
  return (
    <div className="history-modal">
      <div className="history-content">
        <button className="close-btn" onClick={onClose}>Close</button>
        <h3>History for {serialNumber}</h3>
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