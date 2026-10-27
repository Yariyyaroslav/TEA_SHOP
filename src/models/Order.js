const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    tea: { type: mongoose.Schema.Types.ObjectId, ref: 'Tea', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, min: 1 }
  }],
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: String,
    comment: String
  },
  total: { type: Number, required: true },
  status: { type: String, default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
