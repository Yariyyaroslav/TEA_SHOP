const mongoose = require('mongoose');
const Tea = require('../models/Tea');
const Order = require('../models/Order');
const { sendOrderToTelegram } = require('../services/telegram');

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

    if (!customer?.name?.trim() || !customer?.phone?.trim()) {
      return res.status(422).json({ message: 'Вкажіть імʼя та телефон.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(422).json({ message: 'Кошик порожній.' });
    }

    const normalizedItems = items
      .map(item => ({
        teaId: item.teaId,
        quantity: Number(item.quantity)
      }))
      .filter(item => mongoose.Types.ObjectId.isValid(item.teaId) && Number.isFinite(item.quantity) && item.quantity > 0);

    if (!normalizedItems.length) {
      return res.status(422).json({ message: 'Дані товарів некоректні.' });
    }

    const teas = await Tea.find({ _id: { $in: normalizedItems.map(item => item.teaId) } }).lean();
    const teaMap = new Map(teas.map(tea => [String(tea._id), tea]));

    const orderItems = normalizedItems
      .map(item => {
        const tea = teaMap.get(String(item.teaId));
        if (!tea) {
          return null;
        }

        return {
          tea: tea._id,
          name: tea.name,
          price: tea.price,
          quantity: item.quantity
        };
      })
      .filter(Boolean);

    if (!orderItems.length) {
      return res.status(404).json({ message: 'Товари не знайдені.' });
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      items: orderItems,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address?.trim(),
        comment: customer.comment?.trim()
      },
      total
    });

    await sendOrderToTelegram(order);

    return res.status(201).json({
      message: 'Замовлення успішно створено',
      order: {
        id: String(order._id),
        total: order.total,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
