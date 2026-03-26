import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true, default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    availableMedicines: [{
        medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
        stock: { type: Number, default: 0 }
    }]
}, { timestamps: true });

// Index for geospatial queries
pharmacySchema.index({ location: '2dsphere' });

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);
export default Pharmacy;
