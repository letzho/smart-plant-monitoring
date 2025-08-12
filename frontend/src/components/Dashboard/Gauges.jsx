import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Gauges({ temperature, humidity, moisture }) {
  return (
    <div className="gauges" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ width: 180, margin: '0 auto' }}>
        <CircularProgressbar
          value={temperature}
          minValue={0}
          maxValue={50}
          text={`${temperature}°C`}
          styles={buildStyles({
            pathColor: '#3498ff',
            textColor: '#222',
            trailColor: '#e0e7ff',
          })}
        />
        <div style={{ textAlign: 'center', marginTop: 8 }}>Temperature</div>
      </div>
      <div style={{ width: 180, margin: '0 auto' }}>
        <CircularProgressbar
          value={humidity}
          minValue={0}
          maxValue={100}
          text={`${humidity}%`}
          styles={buildStyles({
            pathColor: '#00b894',
            textColor: '#222',
            trailColor: '#e0e7ff',
          })}
        />
        <div style={{ textAlign: 'center', marginTop: 8 }}>Humidity</div>
      </div>
      <div style={{ width: 180, margin: '0 auto' }}>
        <CircularProgressbar
          value={moisture}
          minValue={0}
          maxValue={100}
          text={`${moisture}`}
          styles={buildStyles({
            pathColor: '#a29bfe',
            textColor: '#222',
            trailColor: '#e0e7ff',
          })}
        />
        <div style={{ textAlign: 'center', marginTop: 8 }}>Soil Moisture</div>
      </div>
    </div>
  );
} 