import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PharmacyInventory from '../models/PharmacyInventory.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

connectDB();

const importData = async () => {
    try {
        await PharmacyInventory.deleteMany(); // Clear existing inventory

        const inventoryData = JSON.parse(
            fs.readFileSync(`${__dirname}/../data/pharmacy_inventory.json`, 'utf-8')
        );

        await PharmacyInventory.insertMany(inventoryData);

        console.log('Pharmacy Inventory Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // Implement destroy if needed later
    console.log('Destroy not implemented yet');
    process.exit();
} else {
    importData();
}
