import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    brandName: { type: String, required: true, trim: true },
    genericName: { type: String, required: true, trim: true },
    strength: { type: String },
    form: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number }, // From "price" column (MRP)
    diseaseCategory: { type: String }, // From "disease_name"
    prescriptionRequired: { type: Boolean, default: false },
    manufacturer: { type: String },
    origin: { type: String },
    description: { type: String }, // From "drug_content"
    contraindications: [{ type: String }],
    allergies: [{ type: String }],
    chronicDiseaseWarnings: [{ type: String }]
}, { timestamps: true });

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
