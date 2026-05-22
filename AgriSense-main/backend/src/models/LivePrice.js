const mongoose = require('mongoose');

const livePriceSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  cropLocal: { type: String },
  market: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  unit: { type: String, default: 'Quintal' },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  modalPrice: { type: Number, required: true },
  previousPrice: { type: Number },
  changePercent: { type: Number },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  priceDate: { type: String, required: true }, // Format: YYYY-MM-DD
  isLive: { type: Boolean, default: false }, // True if fetched from official API
  dataSource: { type: String, default: 'Agmarknet' }
}, { timestamps: true });

// Index for fast lookups by location and crop
livePriceSchema.index({ state: 1, district: 1, crop: 1 });

const LivePrice = mongoose.model('LivePrice', livePriceSchema);

module.exports = { LivePrice };
