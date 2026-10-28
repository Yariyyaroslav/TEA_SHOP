const Tea = require('../models/Tea');
const Order = require('../models/Order');
const { sendOrderToTelegram } = require('../services/telegram');

function cartItems(req) { return req.session.cart || []; }

exports.add = async (req, res, next) => {
  try {
    const tea = await Tea.findById(req.params.id).lean();
    if (!tea) return res.status(404).send('Товар не найден');
    const cart = cartItems(req);
    const existing = cart.find(item => item.teaId === String(tea._id));
    if (existing) existing.quantity += 1;
    else cart.push({ teaId: String(tea._id), name: tea.name, price: tea.price, image: tea.image, quantity: 1 });
    req.session.cart = cart;
    res.redirect(req.get('referer') || '/catalog');
  } catch (error) { next(error); }
};

exports.remove = (req, res) => {
  req.session.cart = cartItems(req).filter(item => item.teaId !== req.params.id);
  res.redirect('/cart');
};

exports.view = (req, res) => {
  const items = cartItems(req);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('cart', { title: 'Корзина', items, total });
};

exports.checkout = (req, res) => {
  const items = cartItems(req);
  if (!items.length) return res.redirect('/cart');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('checkout', { title: 'Оформление заказа', items, total, error: null });
};

exports.createOrder = async (req, res, next) => {
  try {
    const items = cartItems(req);
    if (!items.length) return res.redirect('/cart');
    const { name, phone, address, comment } = req.body;
    if (!name?.trim() || !phone?.trim()) {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return res.status(422).render('checkout', { title: 'Оформление заказа', items, total, error: 'Укажите имя и телефон.' });
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      items: items.map(item => ({ tea: item.teaId, name: item.name, price: item.price, quantity: item.quantity })),
      customer: { name: name.trim(), phone: phone.trim(), address: address?.trim(), comment: comment?.trim() }, total
    });
    await sendOrderToTelegram(order);
    req.session.cart = [];
    res.render('success', { title: 'Заказ принят', order });
  } catch (error) { next(error); }
};
