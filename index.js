const express = require('express');
const app = express();
const projectsRouter = require('./src/projects');
const authRoutes = require("./src/auth")
const cors = require("cors")
const jwt = require('jsonwebtoken');


require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://rikiulir.site", "https://www.rikiulir.site"], // Izinkan permintaan dari frontend Vite
    methods: ["GET", "POST", "PUT", "DELETE"], // Izinkan metode HTTP yang dibutuhkan
    allowedHeaders: ["Content-Type", "Authorization"], // Headers yang diizinkan
    credentials: true, // Jika kamu butuh mengirim cookie lintas origin
  })
);

app.use('/auth', authRoutes); // <-- Tambah ini
app.use('/img', express.static('src/img'));
app.get('/api/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token tidak ada' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.API_JWT );
    res.json({ message: 'Token valid', user: payload });
  } catch(err) {
    console.log(err)
    res.status(401).json({ message: 'Token tidak valid' });
  }
});
app.use('/projects', projectsRouter);

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
