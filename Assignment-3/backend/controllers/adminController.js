import Medicine from '../models/Medicine.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Add a new medicine manually
// @route   POST /api/admin/medicines
// @access  Private/Admin
export const addMedicine = async (req, res) => {
    try {
        const newMedicine = new Medicine(req.body);
        const createdMedicine = await newMedicine.save();
        res.status(201).json(createdMedicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all audit logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
export const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find({}).sort({ createdAt: -1 }).populate('userId', 'name email');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Other CRUD operations (update, delete, getAllMedicines) can be added here
export const deleteMedicine = async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.json({ message: 'Medicine Removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find({});
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
