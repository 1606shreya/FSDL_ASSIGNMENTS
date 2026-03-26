import mongoose from 'mongoose';
import fs from 'fs';
import csvParser from 'csv-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Medicine from '../models/Medicine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const BATCH_SIZE = 1000;
const CSV_FILE_PATH = 'C:/Users/Admin/Downloads/medicines (1).csv'; // Use the raw file

const cleanData = (row) => {
    try {
        // 1. Clean Disease Name (remove " (count)")
        let diseaseCategory = row.disease_name ? row.disease_name.replace(/\(\d+\)/g, '').trim() : "Not Available";

        // 2. Clean Final Price
        let finalPriceStr = row.final_price ? row.final_price.replace(/₹/g, '').replace(/MRP/g, '').replace(/Error/g, '0').trim() : "0";
        let finalPrice = parseFloat(finalPriceStr);
        if (isNaN(finalPrice)) finalPrice = 0;

        // 3. Extract and Clean Original Price
        let originalPrice = finalPrice;
        if (row.price) {
             const match = row.price.match(/MRP\s*₹\s*([\d,\.]+)/);
             if (match && match[1]) {
                 originalPrice = parseFloat(match[1].replace(/,/g, ''));
             } else {
                 let priceStr = row.price.replace(/,/g, '').trim();
                 let temp = parseFloat(priceStr);
                 if (!isNaN(temp)) originalPrice = temp;
             }
        }
        if (isNaN(originalPrice)) originalPrice = finalPrice;

        // 4. Clean Drug Variant (strength/form mapping)
        let variant = row.drug_varient ? row.drug_varient.replace(/\*/g, '').trim() : "Not Available";
        let strength = "";
        let form = variant;
        
        // Very basic attempt to separate strength and form from Variant, generic name or brand name.
        if (row.generic_name) {
            let match = row.generic_name.match(/(\d+\s*(mg|mcg|ml|g|%))/i);
            if (match) strength = match[1];
        }

        // 5. Clean Manufacturer
        let manufacturer = row.drug_manufacturer ? row.drug_manufacturer.replace(/\*\s*Mkt:\s*/, '').trim() : "Not Available";

        // 6. Clean Manufacturer Origin
        let origin = row.drug_manufacturer_origin ? row.drug_manufacturer_origin.replace(/\*\s*Country of Origin:\s*/, '').replace(/NA/g, 'Not available').trim() : "Not Available";
        // Title case origin
        origin = origin.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');


        // 7. Clean Drug Content (Description)
        let description = row.drug_content ? row.drug_content.replace(/INTRODUCTION ABOUT /g, '').trim() : "Not Available";

        // 8. Clean Generic Name
        let genericName = row.generic_name ? row.generic_name.replace(/Generic Name\s*/, '').trim() : "Not Available";

        // 9. Standardize Prescription Required
        let rxRequired = false;
        if (row.prescription_required) {
            rxRequired = row.prescription_required.includes('Rx required') || row.prescription_required.includes('Yes');
        }

        return {
            brandName: row.med_name || "Unknown",
            genericName: genericName,
            strength: strength,
            form: form,
            price: finalPrice,
            originalPrice: originalPrice,
            diseaseCategory: diseaseCategory,
            prescriptionRequired: rxRequired,
            manufacturer: manufacturer,
            origin: origin,
            description: description,
        };
    } catch (error) {
        console.error("Error cleaning row:", row, error);
        return null;
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedMedicines = async () => {
    await connectDB();
    console.log(`Starting to seed data from ${CSV_FILE_PATH}...`);

    let count = 0;
    let batch = [];

    // Optional: clear existing medicines before seeding
    await Medicine.deleteMany({});
    console.log("Cleared existing medicines.");

    return new Promise((resolve, reject) => {
        fs.createReadStream(CSV_FILE_PATH)
            .pipe(csvParser())
            .on('data', async (row) => {
                const cleanedData = cleanData(row);
                if (cleanedData) {
                    batch.push(cleanedData);
                    count++;
                }

                if (batch.length >= BATCH_SIZE) {
                    const currentBatch = [...batch];
                    batch = []; // Clear immediately to prevent memory issues

                    // Pause stream while inserting to prevent memory overload
                    // But inside standard csv-parser, handling pause/resume with async operations within the 'data' event 
                    // is tricky. For 23k rows, batching like this might be okay in memory if we don't await immediately, 
                    // or we collect all and then chunk, but a safer pattern for large files:
                }
            })
            .on('end', async () => {
                // Insert any remaining in the final batch
                if (batch.length > 0) {
                     // handled below
                }
            })
            .on('error', (error) => {
                console.error("Stream error:", error);
                reject(error);
            });
    });
};

/* Better stream handling approach for memory */
const seedBetter = async () => {
     await connectDB();
     console.log(`Starting to seed data from ${CSV_FILE_PATH}...`);
 
     // Optional: clear existing medicines before seeding
     await Medicine.deleteMany({});
     console.log("Cleared existing medicines.");
     
     let batch = [];
     let totalInserted = 0;

     const readStream = fs.createReadStream(CSV_FILE_PATH).pipe(csvParser());

     for await (const row of readStream) {
         const cleanedData = cleanData(row);
         if (cleanedData) {
             batch.push(cleanedData);
         }

         if (batch.length >= BATCH_SIZE) {
             try {
                await Medicine.insertMany(batch, { ordered: false });
                totalInserted += batch.length;
                console.log(`Inserted ${totalInserted} records...`);
                batch = []; 
             } catch(err) {
                 console.error("Batch insert error:", err.message); // ordered: false will log errors but continue
                 batch = [];
             }
         }
     }

     if (batch.length > 0) {
        try {
            await Medicine.insertMany(batch, { ordered: false });
            totalInserted += batch.length;
            console.log(`Inserted ${totalInserted} records...`);
         } catch(err) {
             console.error("Final batch insert error:", err.message);
         }
     }

     console.log(`Seeding complete. Inserted ${totalInserted} total records.`);
     process.exit();
}


seedBetter().catch((err) => {
    console.error("Seeding failed", err);
    process.exit(1);
});
