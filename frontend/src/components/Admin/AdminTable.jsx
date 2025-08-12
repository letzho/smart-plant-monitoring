import React, { useEffect, useState } from 'react';
import './AdminTable.css';

export default function AdminTable() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/admin/all')
      .then(res => res.json())
      .then(setRows);
  }, []);
  return (
    <div>
      <h2>Admin: All Plant Monitors</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th><th>Serial</th><th>Temp</th><th>Humidity</th><th>Moisture</th><th>Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.username}</td>
              <td>{r.serial_number}</td>
              <td>{r.temperature}</td>
              <td>{r.humidity}</td>
              <td>{r.moisture}</td>
              <td>{r.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 