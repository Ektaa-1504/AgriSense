const mongoose = require('mongoose');

const kvkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameLocal: { type: String },
  address: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String },
  phone: { type: String },
  email: { type: String },
  services: [String],
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  officerName: { type: String },
  officerDesignation: { type: String },
  verified: { type: Boolean, default: true }
}, { timestamps: true });

// Index for proximity searches
kvkSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

const KVK = mongoose.model('KVK', kvkSchema);

module.exports = { KVK };
