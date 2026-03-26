import mongoose from 'mongoose';

const pharmacyInventorySchema = new mongoose.Schema(
    {
        pharmacy_name: {
            type: String,
            required: true,
            trim: true,
        },
        generic_name: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const PharmacyInventory = mongoose.model('PharmacyInventory', pharmacyInventorySchema);

export default PharmacyInventory;
