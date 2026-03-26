import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/generic_medicine')
    .then(async () => {
        const count = await mongoose.connection.db.collection('medicines').countDocuments();
        console.log(`Total medicines in database: ${count}`);
        const sample = await mongoose.connection.db.collection('medicines').findOne();
        console.log(`Sample Medicine Document:\n`, sample);
        process.exit(0);
    })
    .catch(err => {
        console.error("Error connecting to DB:", err);
        process.exit(1);
    });
