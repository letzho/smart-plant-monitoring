import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../../config';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${apiBaseUrl}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      onLogin(data);
      navigate('/dashboard'); // Add this line to redirect to dashboard
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to Smart Plant Monitor</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username}
          onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </form>
      <p>
        New to Smart Plant Monitor?{' '}
        <a href="#" onClick={e => { e.preventDefault(); navigate('/register'); }}>
          Sign up
        </a>
      </p>
    </div>
  );
} 