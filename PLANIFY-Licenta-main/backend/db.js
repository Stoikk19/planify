const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config({ path: '../.env' });

// Forteaza DNS-ul Google ca sa rezolve adresele MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectat la MongoDB Atlas!'))
  .catch(err => console.error('❌ Eroare conectare MongoDB:', err));

module.exports = mongoose;
