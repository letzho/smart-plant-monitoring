import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../../config';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [serial, setSerial] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${apiBaseUrl}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, serial_number: serial }),
    });
    if (res.ok) {
      navigate('/login');
    } else {
      setError('Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register for Smart Plant Monitor</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username}
          onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} />
        <input type="text" placeholder="Serial Number" value={serial}
          onChange={e => setSerial(e.target.value)} />
        <button type="submit">Register</button>
        {error && <div className="error">{error}</div>}
      </form>
      <div className="disclaimer">
        The email address provided during registration will be used solely for Open House 2025 updates and notifications. This information will not be used for advertising or marketing purposes.
      </div>
      <p>Already have an account? <a href="#" onClick={e => { e.preventDefault(); navigate('/login'); }}>Sign in</a></p>
    </div>
  );
} 