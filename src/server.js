require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const teaRoutes = require('./routes/teaRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({ secret: process.env.SESSION_SECRET || 'tea-shop-secret', resave: false, saveUninitialized: true, cookie: { maxAge: 86400000 } }));
app.use((req, res, next) => { res.locals.cartCount = (req.session.cart || []).reduce((n, item) => n + item.quantity, 0); next(); });
app.use('/', teaRoutes);
app.use('/', orderRoutes);
app.use((err, req, res, next) => { console.error(err); res.status(500).render('error', { title: 'Ошибка', message: 'Что-то пошло не так. Попробуйте ещё раз.' }); });

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(process.env.PORT || 3000, () => console.log(`Tea shop: http://localhost:${process.env.PORT || 3000}`));
}
start().catch(error => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
