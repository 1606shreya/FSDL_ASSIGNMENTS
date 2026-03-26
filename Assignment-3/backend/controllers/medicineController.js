import Medicine from '../models/Medicine.js';
import AuditLog from '../models/AuditLog.js';
import { calculateRisk, calculateSavings } from '../utils/riskEngine.js';

// @desc    Search for generic medicine by branded name
// @route   POST /api/medicine/search
// @access  Public
export const searchMedicine = async (req, res) => {
    try {
        const { brandName, medicalProfile, userId } = req.body;

        if (!brandName) {
            return res.status(400).json({ message: 'Brand name is required' });
        }

        // Find the branded medicine first to get its generic equivalent
        let brandedMedicine = await Medicine.findOne({ brandName: new RegExp(`^${brandName}$`, 'i') });

        // If exact match not found, try a partial match
        if (!brandedMedicine) {
            brandedMedicine = await Medicine.findOne({ brandName: new RegExp(brandName, 'i') });
        }

        if (!brandedMedicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        // Find generic equivalents
        const genericMedicines = await Medicine.find({
            genericName: brandedMedicine.genericName,
            brandName: { $ne: brandedMedicine.brandName } // Exclude the searched brand
        }).sort({ price: 1 }); // Cheapest first

        if (genericMedicines.length === 0) {
            return res.status(404).json({ message: 'No generic equivalents found', brandedMedicine });
        }

        const recommendedGeneric = genericMedicines[0];

        // Calculate Risk
        const { riskLevel, explanations } = await calculateRisk(recommendedGeneric.genericName, medicalProfile);

        // Calculate Savings
        const savings = calculateSavings(brandedMedicine.price, recommendedGeneric.price);

        // Log the search
        await AuditLog.create({
            userId: userId || null,
            searchedBrand: brandedMedicine.brandName,
            recommendedGeneric: recommendedGeneric.brandName,
            riskLevel,
            savingsAmount: savings
        });

        res.json({
            original: brandedMedicine,
            recommended: recommendedGeneric,
            alternatives: genericMedicines.slice(1), // Other options
            riskAnalysis: {
                level: riskLevel,
                explanations
            },
            savings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
