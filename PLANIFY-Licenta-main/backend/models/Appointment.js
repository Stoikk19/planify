const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  clientId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  salonId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
  serviceId:       { type: mongoose.Schema.Types.ObjectId }, // ID-ul serviciului embedded din salon
  appointmentDate: { type: Date, required: true },
  status:          { type: String, default: 'activa' } // activa / confirmata / refuzata / anulata
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
