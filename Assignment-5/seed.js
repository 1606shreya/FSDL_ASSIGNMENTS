const mongoose = require('mongoose');
const Destination = require('./models/destination');
require('dotenv').config();

const destinations = [
    {
        name: 'Maldives Paradise',
        description: 'Enjoy the crystal clear waters and white sandy beaches of the Maldives. A perfect tropical getaway.',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
        category: 'Beach',
        duration: '5 Days / 4 Nights',
        featured: true
    },
    {
        name: 'Swiss Alps Adventure',
        description: 'Breathtaking views and exciting ski trails in the heart of the Swiss Alps.',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        category: 'Mountain',
        duration: '7 Days / 6 Nights',
        featured: true
    },
    {
        name: 'Tokyo City Lights',
        description: 'Experience the unique blend of tradition and high-tech futurism in Japan\'s bustling capital.',
        price: 900,
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
        category: 'City',
        duration: '4 Days / 3 Nights',
        featured: true
    },
    {
        name: 'Amazon Rainforest Trek',
        description: 'Immerse yourself in nature with a guided trek through the world\'s largest tropical rainforest.',
        price: 800,
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
        category: 'Adventure',
        duration: '6 Days / 5 Nights',
        featured: false
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB for seeding...');
        await Destination.deleteMany({});
        await Destination.insertMany(destinations);
        console.log('Database seeded successfully!');
        process.exit();
    })
    .catch(err => {
        console.error('Error seeding database:', err);
        process.exit(1);
    });
