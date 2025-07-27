const express = require('express');
const app = express();
const projectsRouter = require('./src/projects');
const authRoutes = require("./src/auth")
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes); // <-- Tambah ini
app.use('/img', express.static('src/img'));


app.use('/projects', projectsRouter);

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
