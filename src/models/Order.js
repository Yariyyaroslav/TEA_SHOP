const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  tea: { type: mongoose.Schema.Types.ObjectId, ref: 'Tea', required: true },
  name: { type: String, required: true, trim: true, minlength: 1, maxlength: 150 },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, max: 99 },
  lineTotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: value => Array.isArray(value) && value.length > 0,
      message: 'Замовлення має містити хоча б одну позицію.'
    }
  },
  customer: {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+[1-9]\d{9,14}$/, 'Некоректний формат телефону.']
    },
    address: { type: String, required: true, trim: true, minlength: 5, maxlength: 250 },
    comment: { type: String, trim: true, maxlength: 500, default: '' }
  },
  subtotal: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, enum: ['UAH'], default: 'UAH' },
  status: {
    type: String,
    enum: ['new', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'new'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
