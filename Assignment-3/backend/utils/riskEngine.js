import DrugInteraction from '../models/DrugInteraction.js';
import Medicine from '../models/Medicine.js';

const crossReactivity = {
    'penicillin': ['amoxicillin', 'ampicillin', 'piperacillin', 'ticarcillin', 'penicillin', 'augmentin'],
    'sulfa': ['sulfamethoxazole', 'sulfadiazine', 'sulfasalazine'],
    'nsaid': ['ibuprofen', 'naproxen', 'diclofenac', 'celecoxib', 'aspirin', 'indomethacin', 'ketorolac', 'meloxicam'],
    'aspirin': ['ibuprofen', 'naproxen', 'diclofenac', 'celecoxib', 'nsaid', 'salicylate'],
    'cephalosporin': ['cephalexin', 'cefaclor', 'cefuroxime', 'ceftriaxone', 'cefepime']
};

export const calculateRisk = async (genericName, medicalProfile) => {
    let riskLevel = 'Low';
    let explanations = [];

    if (!medicalProfile) {
        return { riskLevel, explanations };
    }

    const { allergies = [], chronicDiseases = [], currentMedications = [] } = medicalProfile;

    // 1. Check Allergies
    let hasAllergy = false;
    let crossReactedAllergen = '';

    for (const allergy of allergies) {
        const lowerAllergy = allergy.toLowerCase();
        
        if (genericName.toLowerCase().includes(lowerAllergy)) {
            hasAllergy = true;
            crossReactedAllergen = allergy;
            break;
        }

        for (const [family, meds] of Object.entries(crossReactivity)) {
            if (lowerAllergy.includes(family) || family.includes(lowerAllergy)) {
                if (meds.some(med => genericName.toLowerCase().includes(med))) {
                    hasAllergy = true;
                    crossReactedAllergen = allergy;
                    break;
                }
            }
        }
        if (hasAllergy) break;
    }

    if (hasAllergy) {
        riskLevel = 'High';
        explanations.push(`Patient has an allergy to ${crossReactedAllergen}, which cross-reacts with or matches ${genericName}.`);
    }

    // 2. Check Chronic Diseases
    if (chronicDiseases.length > 0) {
        const medDocs = await Medicine.find({ genericName: new RegExp(genericName, 'i') });
        if (medDocs.length > 0) {
            // Find a doc with warnings
            const medWithWarnings = medDocs.find(med => med.chronicDiseaseWarnings && med.chronicDiseaseWarnings.length > 0);
            if (medWithWarnings) {
                 const warnings = medWithWarnings.chronicDiseaseWarnings.map(w => w.toLowerCase());
                 const matchingDiseases = chronicDiseases.filter(d => warnings.some(w => w.includes(d.toLowerCase()) || d.toLowerCase().includes(w)));
                 
                 if (matchingDiseases.length > 0) {
                     if (riskLevel !== 'High') riskLevel = 'Medium';
                     explanations.push(`Use with caution due to patient's chronic conditions: ${matchingDiseases.join(', ')}.`);
                 }
            }
        }
    }

    // 3. Check Drug Interactions
    if (currentMedications.length > 0) {
        const interactions = await DrugInteraction.find({
            $or: [
                { genericName1: genericName, genericName2: { $in: currentMedications } },
                { genericName1: { $in: currentMedications }, genericName2: genericName }
            ]
        });

        interactions.forEach(interaction => {
            explanations.push(`Interaction with ${interaction.genericName1 === genericName ? interaction.genericName2 : interaction.genericName1}: ${interaction.description}`);
            if (interaction.severity === 'High') {
                riskLevel = 'High';
            } else if (interaction.severity === 'Medium' && riskLevel !== 'High') {
                riskLevel = 'Medium';
            }
        });
    }

    return { riskLevel, explanations };
};

export const calculateSavings = (brandedPrice, genericPrice) => {
    if (!brandedPrice || !genericPrice || genericPrice >= brandedPrice) return 0;
    return brandedPrice - genericPrice;
};
