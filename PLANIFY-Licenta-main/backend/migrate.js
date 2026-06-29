// Script de migrare date din PostgreSQL (Neon) in MongoDB Atlas
// Ruleaza o singura data cu: node backend/migrate.js

require('dotenv').config();
const { Pool } = require('pg');
const mongoose = require('mongoose');

const User        = require('./models/User');
const Salon       = require('./models/Salon');
const Appointment = require('./models/Appointment');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  console.log('🔄 Conectare la MongoDB...');

  // Conectare identica cu db.js
  await new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGODB_URI)
      .then(resolve)
      .catch(reject);
  });

  console.log('✅ Conectat la MongoDB!');

  // Citim datele din PostgreSQL
  console.log('🔄 Citire date din PostgreSQL...');
  const users        = (await pool.query('SELECT * FROM users')).rows;
  const salons       = (await pool.query('SELECT * FROM salons')).rows;
  const services     = (await pool.query('SELECT * FROM services')).rows;
  const appointments = (await pool.query('SELECT * FROM appointments')).rows;

  // Stergem colectiile existente din MongoDB
  await User.deleteMany({});
  await Salon.deleteMany({});
  await Appointment.deleteMany({});
  console.log('🗑️  Colectii curatate');

  // Migram utilizatorii
  const userMap = {};
  for (const u of users) {
    const newUser = await User.create({
      fullName:     u.full_name,
      email:        u.email,
      phone:        u.phone || '',
      passwordHash: u.password_hash,
      role:         u.role
    });
    userMap[u.id] = newUser._id;
  }
  console.log(`✅ ${users.length} utilizatori migrati`);

  // Migram saloanele cu serviciile embedded
  const salonMap   = {};
  const serviceMap = {};

  for (const s of salons) {
    const salonServices = services
      .filter(sv => sv.salon_id === s.id)
      .map(sv => ({ name: sv.name, price: sv.price, duration: sv.duration, category: sv.category || '' }));

    const newSalon = await Salon.create({
      ownerId:  userMap[s.owner_id],
      name:     s.name,
      address:  s.address || '',
      category: s.category || '',
      services: salonServices
    });

    salonMap[s.id] = newSalon._id;

    const oldServices = services.filter(sv => sv.salon_id === s.id);
    oldServices.forEach((sv, idx) => {
      serviceMap[sv.id] = newSalon.services[idx]._id;
    });
  }
  console.log(`✅ ${salons.length} saloane migrate (cu servicii embedded)`);

  // Migram programarile
  for (const a of appointments) {
    await Appointment.create({
      clientId:        userMap[a.client_id],
      salonId:         salonMap[a.salon_id],
      serviceId:       serviceMap[a.service_id],
      appointmentDate: a.appointment_date,
      status:          a.status || 'activa'
    });
  }
  console.log(`✅ ${appointments.length} programari migrate`);

  console.log('🎉 Migrare completa!');
  await mongoose.disconnect();
  await pool.end();
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Eroare la migrare:', err.message);
  process.exit(1);
});
