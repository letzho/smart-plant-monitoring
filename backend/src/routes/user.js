const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../services/databaseService');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, serial_number } = req.body;
  console.log('Register attempt:', { username, password, serial_number });
  if (!username || !password || !serial_number) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      'INSERT INTO users (username, password_hash, serial_number) VALUES ($1, $2, $3)',
      [username, hash, serial_number]
    );
    res.json({ success: true });
  } catch (e) {
    console.error('Register error:', e);
    res.status(400).json({ error: 'User exists or invalid' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
  if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid' });
  const user = result.rows[0];
  if (!(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET);
  res.json({ token, serial_number: user.serial_number, is_admin: user.is_admin });
});

module.exports = router; 