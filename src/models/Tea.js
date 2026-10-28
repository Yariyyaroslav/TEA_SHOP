const mongoose = require('mongoose');

const teaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, default: '/images/tea-placeholder.svg' },
  price: { type: Number, required: true, min: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Tea', teaSchema);
