const mongoose = require('mongoose');
const Tea = require('../models/Tea');
const Order = require('../models/Order');
const { sendOrderToTelegram } = require('../services/telegram');
const {
  validateCustomer,
  validateOrderItems,
  buildOrderItems,
  calculateTotals
} = require('../utils/orderValidation');

function buildOrderNumber() {
  return `TS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

exports.listTeas = async (req, res, next) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const categories = await Tea.distinct('category');

    let teasQuery = Tea.find();
    if (category) {
      teasQuery = teasQuery.where('category').equals(category);
    }

    const teas = await teasQuery.sort({ createdAt: -1 }).lean();

    res.json({ teas, categories });
  } catch (error) {
    next(error);
  }
};

exports.getTeaBySlug = async (req, res, next) => {
  try {
    const tea = await Tea.findOne({ slug: req.params.slug }).lean();
    if (!tea) {
      return res.status(404).json({ message: 'Товар не знайдено' });
    }

    return res.json({ tea });
  } catch (error) {
    next(error);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { customer, items } = req.body;
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        message: 'Некоректний JSON у тілі запиту.',
        errors: { request: 'Передайте тіло запиту у форматі JSON.' }
      });
    }

    if (!customer || typeof customer !== 'object') {
      return res.status(400).json({
        message: 'Блок customer обовʼязковий.',
        errors: { customer: 'Передайте дані клієнта в полі customer.' }
      });
    }

    const customerValidation = validateCustomer(customer);
    const itemsValidation = validateOrderItems(items);
    const errors = { ...customerValidation.errors, ...itemsValidation.errors };
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        message: 'Перевірте дані замовлення.',
        errors
      });
    }

    const hasInvalidTeaId = itemsValidation.items.some(item => !mongoose.Types.ObjectId.isValid(item.teaId));
    if (hasInvalidTeaId) {
      return res.status(422).json({
        message: 'Перевірте дані замовлення.',
        errors: { items: 'Один або декілька товарів мають некоректний ідентифікатор.' }
      });
    }

    const quantityByTeaId = itemsValidation.items.reduce((accumulator, item) => {
      const previousQuantity = accumulator.get(item.teaId) || 0;
      accumulator.set(item.teaId, previousQuantity + item.quantity);
      return accumulator;
    }, new Map());

    const overflowItem = Array.from(quantityByTeaId.values()).find(quantity => quantity > 99);
    if (overflowItem) {
      return res.status(422).json({
        message: 'Перевірте дані замовлення.',
        errors: { items: 'Кількість одного товару не може перевищувати 99 одиниць.' }
      });
    }

    const uniqueTeaIds = Array.from(quantityByTeaId.keys());
    const teas = await Tea.find({ _id: { $in: uniqueTeaIds } }).lean();
    if (teas.length !== uniqueTeaIds.length) {
      return res.status(422).json({
        message: 'Перевірте дані замовлення.',
        errors: { items: 'Деякі товари з кошика більше недоступні. Оновіть кошик.' }
      });
    }

    const teaMap = new Map(teas.map(tea => [String(tea._id), tea]));
    const normalizedItems = uniqueTeaIds.map(teaId => ({
      teaId,
      quantity: quantityByTeaId.get(teaId)
    }));
    const orderItems = buildOrderItems(normalizedItems, teaMap);
    const { subtotal, total } = calculateTotals(orderItems);

    const order = await Order.create({
      orderNumber: buildOrderNumber(),
      items: orderItems,
      customer: customerValidation.value,
      subtotal,
      total,
      currency: 'UAH'
    });

    try {
      await sendOrderToTelegram(order);
    } catch (telegramError) {
      console.error('Telegram notification failed:', telegramError.message);
    }

    return res.status(201).json({
      message: 'Замовлення успішно створено',
      order: {
        id: String(order._id),
        orderNumber: order.orderNumber,
        total: order.total,
        currency: order.currency,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
