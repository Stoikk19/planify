require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function reset() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectat!');
  const hash = await bcrypt.hash('stoica123', 10);
  const result = await mongoose.connection.collection('users').updateOne(
    { email: 'gerge_st03@yahoo.com' },
    { $set: { passwordHash: hash } }
  );
  console.log('Actualizat:', result.modifiedCount, 'document(e)');
  await mongoose.disconnect();
}

reset().catch(console.error);
