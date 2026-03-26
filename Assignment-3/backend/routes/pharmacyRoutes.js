import express from 'express';
import { getNearbyPharmacies, searchPharmaciesByMedicine } from '../controllers/pharmacyController.js';

const router = express.Router();

router.get('/nearby', getNearbyPharmacies);
router.get('/search', searchPharmaciesByMedicine);

export default router;
