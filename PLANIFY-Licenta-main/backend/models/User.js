const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName:     { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  phone:        { type: String, default: '' },
  passwordHash: { type: String, required: true },
  role:         { type: String, default: 'client' } // client / owner / admin
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
