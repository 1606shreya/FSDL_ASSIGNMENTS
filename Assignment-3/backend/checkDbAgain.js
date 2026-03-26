import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicine from './models/Medicine.js';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/generic_medicine')
    .then(async () => {
        const meds = await Medicine.find({ brandName: /Crocin/i }).limit(5);
        console.log("Medicines found for 'Crocin':", meds.map(m => m.brandName));
        process.exit(0);
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
