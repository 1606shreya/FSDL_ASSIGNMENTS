const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, enum: ['Beach', 'Mountain', 'City', 'Adventure'], default: 'Beach' },
    duration: { type: String, required: true }, // e.g., "5 Days"
    featured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Destination', destinationSchema);
