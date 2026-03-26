const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');

// List all destinations
router.get('/', async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.render('destinations/list', { destinations });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Destination details
router.get('/:id', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).send('Destination not found');
        res.render('destinations/details', { destination });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
