import React, { useEffect, useState } from 'react';
import './Recommendation.css';
import { apiBaseUrl } from '../../config';

export default function Recommendation({ temperature, humidity, moisture, onClose }) {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temperature, humidity, moisture }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('Frontend received data:', data);
        console.log('Recommendations:', data.recommendations);
        setRecommendation(data.recommendations || 'No recommendation yet.');
      })
      .catch((error) => {
        console.error('Frontend error:', error);
        setRecommendation('Failed to get recommendation.');
      })
      .finally(() => setLoading(false));
  }, [temperature, humidity, moisture]);
  return (
    <div className="recommendation-modal">
      <div className="recommendation-content">
        <button className="close-btn" onClick={onClose}>Close</button>
        <h3>AI Recommendation</h3>
        <div className="recommendation-text">
          {loading
            ? 'Loading recommendation...'
            : (
              <div>
                {console.log('Rendering recommendation:', recommendation)}
                {recommendation
                  .split('\n')
                  .map((line, idx) => {
                    const trimmedLine = line.trim();
                    console.log(`Line ${idx}: "${trimmedLine}"`);
                    if (trimmedLine.startsWith('Based on current readings:')) {
                      return <div key={idx} style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#2c3e50', backgroundColor: '#f0f8ff', padding: '0.5rem', borderRadius: '4px' }}>{trimmedLine}</div>;
                    } else if (trimmedLine.startsWith('-')) {
                      return <div key={idx} style={{ marginLeft: '1rem', marginBottom: '0.5rem' }}>• {trimmedLine.replace(/^-/, '').trim()}</div>;
                    } else if (trimmedLine) {
                      return <div key={idx}>{trimmedLine}</div>;
                    }
                    return null;
                  })}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
} 