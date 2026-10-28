require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const hasFrontendBuild = fs.existsSync(path.join(frontendDistPath, 'index.html'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'Маршрут API не знайдено' });
    }
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Фронтенд не зібрано. Запустіть `npm run dev` або `npm run build`.'
    });
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith('/api')) {
    return res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
  return res.status(500).send('Внутрішня помилка сервера');
});

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Tea shop API: http://localhost:${port}`);
  });
}

start().catch(error => {
  console.error('MongoDB connection failed:', error.message);
  process.exit(1);
});
