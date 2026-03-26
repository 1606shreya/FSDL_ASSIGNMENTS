import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
    genericName1: { type: String, required: true, trim: true },
    genericName2: { type: String, required: true, trim: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    description: { type: String, required: true }
}, { timestamps: true });

// Ensure unique pairs regardless of order
interactionSchema.index({ genericName1: 1, genericName2: 1 }, { unique: true });

const DrugInteraction = mongoose.model('DrugInteraction', interactionSchema);
export default DrugInteraction;
