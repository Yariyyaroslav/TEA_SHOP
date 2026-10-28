require('dotenv').config();
const mongoose = require('mongoose');
const Tea = require('./models/Tea');

const teas = [
  {
    name: 'Ассам Голд',
    slug: 'assam-gold',
    category: 'Чорний чай',
    description: 'Насичений індійський чай із медовими нотами та оксамитовим післясмаком.',
    price: 590,
    featured: true
  },
  {
    name: 'Молочний улун',
    slug: 'milk-oolong',
    category: 'Улун',
    description: 'Мʼякий вершковий аромат, багатий смак і довгий теплий післясмак.',
    price: 790,
    featured: true
  },
  {
    name: 'Сенча Церемонія',
    slug: 'sencha-ceremony',
    category: 'Зелений чай',
    description: 'Свіжий японський чай із травʼянистою легкістю та приємною терпкістю.',
    price: 690,
    featured: true
  },
  {
    name: 'Ройбуш Ваніль',
    slug: 'rooibos-vanilla',
    category: 'Травʼяний чай',
    description: 'Без кофеїну, із природною солодкістю та ніжними нотами ванілі.',
    price: 490
  }
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Tea.deleteMany({});
  await Tea.insertMany(teas);
  console.log('Демо-чаї додано');
  await mongoose.disconnect();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
