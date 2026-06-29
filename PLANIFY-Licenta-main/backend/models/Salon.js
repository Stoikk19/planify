const mongoose = require('mongoose');

// Serviciile sunt embedded direct în salon (fără tabel separat!)
const ServiceSchema = new mongoose.Schema({
  name:     { type: String, default: '' },
  price:    { type: Number, required: true },
  duration: { type: Number, default: 30 },
  category: { type: String, default: '' }
});

const SalonSchema = new mongoose.Schema({
  ownerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     { type: String, default: '' },
  address:  { type: String, default: '' },
  category: { type: String, default: '' },
  services: [ServiceSchema]   // lista de servicii înglobată direct în document
}, { timestamps: true });

module.exports = mongoose.model('Salon', SalonSchema);
