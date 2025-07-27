const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const router = express.Router();
const auth = require('./middleware/authMiddleware');

// router.use(auth);

// Konfigurasi penyimpanan file gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/img/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Ambil semua proyek
router.get('/', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects').all();
  res.json(projects);
});

// Ambil proyek berdasarkan ID
router.get('/:id',auth, (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// Tambah proyek baru dengan upload gambar
router.post('/',auth,  upload.single('image'), (req, res) => {
  const { name, description, tech } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !description || !tech) {
    return res.status(400).json({ error: 'some column is required' });
  }

  const stmt = db.prepare(`
    INSERT INTO projects (name, description, tech, image)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(name, description, tech, image);
  const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);

  res.status(201).json(newProject);
});

// Update proyek
router.put('/:id',auth,  upload.single('image'), (req, res) => {
  const { name, description, tech } = req.body;
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const image = req.file ? req.file.filename : project.image;

  const stmt = db.prepare(`
    UPDATE projects SET name = ?, description = ?, tech = ?, image = ?
    WHERE id = ?
  `);
  stmt.run(name || project.name, description || project.description, tech || project.tech, image, req.params.id);

  const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json(updatedProject);
});

// Hapus proyek
router.delete('/:id',auth,  (req, res) => {
  const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
  const result = stmt.run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});

module.exports = router;
