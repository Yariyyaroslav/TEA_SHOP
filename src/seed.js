require('dotenv').config();
const mongoose = require('mongoose');
const Tea = require('./models/Tea');
const teas = [
  { name: 'Ассам Голд', slug: 'assam-gold', category: 'Чёрный чай', description: 'Насыщенный индийский чай с медовыми нотами.', price: 590, featured: true },
  { name: 'Молочный улун', slug: 'milk-oolong', category: 'Улун', description: 'Мягкий сливочный аромат и долгое послевкусие.', price: 790, featured: true },
  { name: 'Сенча Церемония', slug: 'sencha-ceremony', category: 'Зелёный чай', description: 'Свежий японский чай с травянистой лёгкостью.', price: 690, featured: true },
  { name: 'Ройбуш Ваниль', slug: 'rooibos-vanilla', category: 'Травяной чай', description: 'Без кофеина, с тёплой ванильной сладостью.', price: 490 }
];
(async () => { await mongoose.connect(process.env.MONGODB_URI); await Tea.deleteMany({}); await Tea.insertMany(teas); console.log('Demo teas inserted'); await mongoose.disconnect(); })().catch(error => { console.error(error); process.exit(1); });
