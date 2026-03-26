import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    medicalProfile: {
        age: { type: Number },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
        bloodGroup: { type: String },
        allergies: [{ type: String }],
        chronicDiseases: [{ type: String }],
        currentMedications: [{ type: String }],
        conditions: {
            diabetes: { type: Boolean, default: false },
            hypertension: { type: Boolean, default: false },
            asthma: { type: Boolean, default: false },
            thyroid: { type: Boolean, default: false }
        },
        emergencyContact: { type: String }
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
