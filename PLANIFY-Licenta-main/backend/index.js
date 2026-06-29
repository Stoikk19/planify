const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('./db'); // Conectare la MongoDB

const User        = require('./models/User');
const Salon       = require('./models/Salon');
const Appointment = require('./models/Appointment');

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const app = express();
app.use(cors());
app.use(express.json());

// ===================== AUTENTIFICARE =====================

// REGISTER
app.post('/register', async (req, res) => {
  try {
    const { fullName, phone, email, password, role } = req.body;
    const salt         = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ fullName, phone, email, passwordHash, role: role || 'client' });
    res.json({ id: user._id, full_name: user.fullName, role: user.role });
  } catch (err) {
    res.status(500).json({ eroare: err.message });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ eroare: 'Email invalid' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ eroare: 'Parola invalida' });

    res.json({ user: { id: user._id, name: user.fullName, role: user.role } });
  } catch (err) {
    res.status(500).json({ eroare: err.message });
  }
});

// ===================== SALOANE =====================

// Cautare generala (bara de search de pe Home)
app.get('/search', async (req, res) => {
  try {
    const { query, city } = req.query;
    const filter = {};

    if (query) {
      filter.$or = [
        { name:     { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ];
    }
    if (city) {
      filter.address = { $regex: city, $options: 'i' };
    }

    const salons = await Salon.find(filter);
    res.json(salons.map(s => ({ ...s.toObject(), id: s._id })));
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Saloane dupa categorie
app.get('/salons/categorie/:numeCategorie', async (req, res) => {
  try {
    const salons = await Salon.find({ category: req.params.numeCategorie });
    res.json(salons.map(s => ({ ...s.toObject(), id: s._id })));
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Verifica daca owner-ul are salon
app.get('/my-salon/:ownerId', async (req, res) => {
  try {
    const salon = await Salon.findOne({ ownerId: req.params.ownerId });
    if (!salon) return res.json(null);
    res.json({ ...salon.toObject(), id: salon._id });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Creeaza salon
app.post('/salons', async (req, res) => {
  try {
    const { ownerId, name, address, category } = req.body;
    const salon = await Salon.create({ ownerId, name, address, category, services: [] });
    res.json({ ...salon.toObject(), id: salon._id });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Detalii salon + serviciile lui
app.get('/salons/:id', async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ eroare: 'Salon negasit' });

    res.json({
      info:     { ...salon.toObject(), id: salon._id },
      services: salon.services.map(s => ({ ...s.toObject(), id: s._id }))
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ===================== SERVICII =====================

// Adauga serviciu la salon (embedded)
app.post('/services', async (req, res) => {
  try {
    const { name, price, duration, category, salonId } = req.body;
    const salon = await Salon.findById(salonId);

    salon.services.push({ name, price, duration, category });
    await salon.save();

    const newService = salon.services[salon.services.length - 1];
    res.json({ ...newService.toObject(), id: newService._id });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Toate serviciile pentru admin (cu numele salonului)
app.get('/services-admin', async (req, res) => {
  try {
    const salons = await Salon.find({});
    const allServices = [];

    salons.forEach(salon => {
      salon.services.forEach(service => {
        allServices.push({
          id:         service._id,
          name:       service.name,
          price:      service.price,
          duration:   service.duration,
          salon_name: salon.name
        });
      });
    });

    res.json(allServices);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Sterge serviciu (admin)
app.delete('/services/:id', async (req, res) => {
  try {
    await Salon.updateOne(
      { 'services._id': req.params.id },
      { $pull: { services: { _id: req.params.id } } }
    );
    res.json('Serviciu sters!');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ===================== PROGRAMARI =====================

// Toate programarile unui client
app.get('/appointments/client/:clientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ clientId: req.params.clientId })
      .populate('salonId', 'name services');

    const result = appointments.map(app => {
      const salon   = app.salonId;
      const service = salon?.services?.id(app.serviceId);
      return {
        id:               app._id,
        appointment_date: app.appointmentDate,
        status:           app.status,
        service_name:     service?.name  || 'Serviciu sters',
        price:            service?.price || 0,
        salon_name:       salon?.name    || 'Salon sters'
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Anuleaza o programare
app.put('/appointments/cancel/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'anulata' });
    res.json({ mesaj: 'Programare anulata cu succes!' });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Salveaza o programare noua
app.post('/appointments', async (req, res) => {
  try {
    const { clientId, salonId, serviceId, date } = req.body;
    const appointment = await Appointment.create({
      clientId,
      salonId,
      serviceId,
      appointmentDate: date,
      status: 'activa'
    });
    res.json({ ...appointment.toObject(), id: appointment._id });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Toate programarile primite la salonul unui proprietar
app.get('/salon-appointments/:ownerId', async (req, res) => {
  try {
    const salon = await Salon.findOne({ ownerId: req.params.ownerId });
    if (!salon) return res.json([]);

    const appointments = await Appointment.find({ salonId: salon._id })
      .populate('clientId', 'fullName phone');

    const result = appointments.map(app => {
      const service = salon.services.id(app.serviceId);
      return {
        id:               app._id,
        appointment_date: app.appointmentDate,
        status:           app.status,
        service_name:     service?.name         || 'Serviciu sters',
        client_name:      app.clientId?.fullName || 'Client sters',
        client_phone:     app.clientId?.phone    || ''
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Proprietarul accepta sau refuza o programare
app.put('/appointments/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await Appointment.findByIdAndUpdate(req.params.id, { status });
    res.json({ mesaj: `Programarea a fost ${status}!` });
  } catch (err) {
    res.status(500).json(err.message);
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server pornit pe portul ${PORT}`));
