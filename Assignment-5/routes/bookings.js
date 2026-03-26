const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// Handle booking submission
router.post('/', async (req, res) => {
    try {
        const { userName, email, phone, destinationId, travelDate, guests } = req.body;
        
        const newBooking = new Booking({
            userName,
            email,
            phone,
            destination: destinationId,
            travelDate: new Date(travelDate),
            guests: parseInt(guests)
        });

        await newBooking.save();
        res.render('bookings/confirmation', { booking: newBooking });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
