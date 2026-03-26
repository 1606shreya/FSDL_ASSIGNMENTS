import express from 'express';
import { searchMedicine } from '../controllers/medicineController.js';
import { calculateRisk } from '../utils/riskEngine.js';

const router = express.Router();

router.post('/search', searchMedicine);

router.post('/risk/calculate', async (req, res) => {
    try {
        const { genericName, medicalProfile } = req.body;
        const result = await calculateRisk(genericName, medicalProfile);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
