// auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();
const SECRET = process.env.API_JWT

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password, token } = req.body;
  if (!username || !password || !token)
    return res.status(400).json({ error: 'Username dan password wajib diisi' });
  if(token !== process.env.API_TOKEN){
    return res.status(403).json({
        message : "Token tidak valid"
    })
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hashedPassword);
    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Username sudah digunakan' });
    }
    console.log(err)
    res.status(500).json({ error: 'Terjadi kesalahan saat registrasi' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user)
    return res.status(401).json({ error: 'Username tidak ditemukan' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({ error: 'Password salah' });
  console.log('JWT_SECRET:', process.env.API_JWT);

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: '1h'
  });

  res.json({ token });
});

module.exports = router;
