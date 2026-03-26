const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    bookingDate: { type: Date, default: Date.now },
    travelDate: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 }
});

module.exports = mongoose.model('Booking', bookingSchema);
