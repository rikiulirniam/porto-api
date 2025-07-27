require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET = process.env.API_JWT



module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // ambil token setelah "Bearer"

  if (!token) return res.status(401).json({ error: 'Unauthenticated' });

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch(err) {
    console.log(err)
    return res.status(403).json({ error: 'Token tidak valid' });
  }
};
