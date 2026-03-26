import Pharmacy from '../models/Pharmacy.js';
import PharmacyInventory from '../models/PharmacyInventory.js';

// @desc    Get nearby pharmacies with available medicine stock
// @route   GET /api/pharmacy/nearby
// @access  Public
export const getNearbyPharmacies = async (req, res) => {
    try {
        const { lat, lng, medicineId, maxDistance = 5000 } = req.query; // maxDistance in meters

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        const nearbyPharmacies = await Pharmacy.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        }).populate('availableMedicines.medicineId', 'brandName genericName price');

        // Filter by stock if medicineId is provided
        if (medicineId) {
            const pharmaciesWithStock = nearbyPharmacies.filter(pharmacy => {
                const med = pharmacy.availableMedicines.find(m => m.medicineId._id.toString() === medicineId);
                return med && med.stock > 0;
            });
            return res.json(pharmaciesWithStock);
        }

        res.json(nearbyPharmacies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search pharmacies by medicine name (partial match), sort by quantity
// @route   GET /api/pharmacy/search
// @access  Public
export const searchPharmaciesByMedicine = async (req, res) => {
    try {
        const { medicine, location } = req.query;

        let query = {};

        if (medicine) {
            query.generic_name = { $regex: medicine, $options: 'i' };
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Fetch pharmacies that have the medicine, sorted by quantity descending
        const pharmacies = await PharmacyInventory.find(query).sort({ quantity: -1 });

        res.json(pharmacies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching nearby pharmacies', error: error.message });
    }
};
