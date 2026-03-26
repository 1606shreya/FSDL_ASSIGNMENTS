const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');

router.get('/', async (req, res) => {
    try {
        const featuredDestinations = await Destination.find({ featured: true }).limit(3);
        res.render('index', { featured: featuredDestinations });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
