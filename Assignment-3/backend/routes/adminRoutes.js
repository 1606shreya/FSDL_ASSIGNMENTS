import express from 'express';
import { addMedicine, getAuditLogs, getMedicines, deleteMedicine } from '../controllers/adminController.js';

const router = express.Router();

// Middleware placeholder for admin auth

router.route('/medicines')
    .get(getMedicines)
    .post(addMedicine);

router.route('/medicines/:id')
    .delete(deleteMedicine);

router.get('/audit-logs', getAuditLogs);

export default router;
