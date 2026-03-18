const fs = require('fs');
const path = './chatbot_dataset/skin_knowledge_base.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

const coreConditions = [
    {
        "problem": "Eczema (Atopic Dermatitis)",
        "description": "A chronic inflammatory condition that makes skin red, itchy, and irritated.",
        "symptoms": ["Intense itching", "Dry/scaly skin", "Red to brownish-gray patches", "Small raised bumps"],
        "medical_solutions": ["Hydrocortisone Ointment", "Barrier Repair Cream", "Oral Antihistamines"],
        "natural_remedies": ["Oatmeal baths", "Coconut oil", "Cool compresses"],
        "lifestyle_tips": ["Moisturize after every wash", "Avoid wool/synthetic fabrics", "Use fragrance-free products"],
        "recommended_ingredients": ["Ceramides", "Colloidal Oatmeal", "Hydrocortisone"]
    },
    {
        "problem": "Melanoma (Serious Skin Cancer)",
        "description": "The most dangerous form of skin cancer, originating in pigment-producing cells.",
        "symptoms": ["Changes in existing moles", "New pigment growths", "Asymmetrical lesions", "Irregular borders"],
        "medical_solutions": ["Immediate Oncology Referral", "Excisional Biopsy", "Wide Local Excision"],
        "natural_remedies": ["None (requires immediate medical intervention)"],
        "lifestyle_tips": ["Strict SPF 50+ usage", "Wear UPF clothing", "Avoid sun between 10 AM and 4 PM"],
        "recommended_ingredients": ["Zinc Oxide", "Titanium Dioxide", "SPF 50+"]
    },
    {
        "problem": "Atopic Dermatitis (Chronic Flare-ups)",
        "description": "A long-lasting condition that causes skin inflammation, redness, and irritation.",
        "symptoms": ["Chronically dry skin", "Severe itching at night", "Thickened or leathery skin"],
        "medical_solutions": ["Topical Corticosteroids", "Tacrolimus Ointment", "Crisaborole"],
        "natural_remedies": ["Humidifiers", "Cotton clothing", "Sunflower seed oil"],
        "lifestyle_tips": ["Identify environmental triggers", "Keep skin moisture barrier intact", "Keep fingernails short"],
        "recommended_ingredients": ["Ceramides", "Petrolatum", "Hyaluronic Acid"]
    },
    {
        "problem": "Basal Cell Carcinoma",
        "description": "The most common form of skin cancer, usually on sun-exposed areas.",
        "symptoms": ["Shiny pink/white bump", "Sore that heals and returns", "Flat, yellowish scar-like area"],
        "medical_solutions": ["Mohs Micrographic Surgery", "Topical 5-Fluorouracil", "Curettage and Electrodesiccation"],
        "natural_remedies": ["None (requires surgical/medical treatment)"],
        "lifestyle_tips": ["Regular professional screenings", "Wear wide-brimmed hats", "Avoid tanning beds"],
        "recommended_ingredients": ["Mineral Sunscreen", "Antioxidants"]
    },
    {
        "problem": "Melanocytic Nevi (Common Moles)",
        "description": "Benign growths of melanocytes; a natural part of skin development.",
        "symptoms": ["Uniform tan/brown/black color", "Round or oval shape", "Smooth borders"],
        "medical_solutions": ["Visual Documentation (Body Mapping)", "Excision for aesthetics (optional)"],
        "natural_remedies": ["Monitoring with photo journals"],
        "lifestyle_tips": ["Perform monthly 'Skin Self-Exams'", "Protect moles from sunburn", "Report changes in size or color"],
        "recommended_ingredients": ["SPF 30+", "Niacinamide"]
    },
    {
        "problem": "Benign Keratosis (Age Spots / Seborrheic)",
        "description": "Non-cancerous growths including Seborrheic Keratosis and Solar Lentigines.",
        "symptoms": ["Tan, brown or black growths", "Waxy surface", "Pasted-on appearance"],
        "medical_solutions": ["Cryotherapy (Liquid Nitrogen)", "Glycolic Acid Peels", "Tretinoin Cream"],
        "natural_remedies": ["Licorice root for lightening", "Vitamin C"],
        "lifestyle_tips": ["Avoid abrasive scrubs", "Accept as natural aging", "Wear sunscreen to prevent new spots"],
        "recommended_ingredients": ["Tretinoin", "Glycolic Acid", "Vitamin C"]
    },
    {
        "problem": "Psoriasis / Lichen Planus (Autoimmune)",
        "description": "Conditions where the immune system attacks skin cells, causing rapid growth.",
        "symptoms": ["Red patches with silvery scales", "Dry/cracked skin", "Itching or burning"],
        "medical_solutions": ["Corticosteroid Ointment", "Coal Tar Shampoo", "Vitamin D Analogs"],
        "natural_remedies": ["Omega-3 rich diet", "Aloe vera", "Epsom salt baths"],
        "lifestyle_tips": ["Avoid skin trauma (Koebner phenomenon)", "Manage stress", "Avoid cold/dry weather"],
        "recommended_ingredients": ["Salicylic Acid (for scales)", "Vitamin D3", "Coal Tar"]
    },
    {
        "problem": "Seborrheic Keratosis & Benign Growths",
        "description": "Harmless skin growths common with age; not contagious.",
        "symptoms": ["Waxy or scaly surface", "Slightly raised", "Light tan to black"],
        "medical_solutions": ["Electrodessication", "Shave Excision", "Ammonium Lactate"],
        "natural_remedies": ["Apple cider vinegar (mild softening)"],
        "lifestyle_tips": ["Accepted as benign", "Professional removal if bothersome"],
        "recommended_ingredients": ["Urea", "Ammonium Lactate"]
    },
    {
        "problem": "Fungal Infection (Dermatophytosis)",
        "description": "Skin infections caused by fungi (Ringworm/Athlete's Foot).",
        "symptoms": ["Circular rash (ringworm)", "Intense itching", "Red scaly border"],
        "medical_solutions": ["Clotrimazole", "Terbinafine Cream", "Ketoconazole"],
        "natural_remedies": ["Tea tree oil", "Garlic extract (topical)", "Vinegar soak"],
        "lifestyle_tips": ["Keep skin clean and dry", "Change socks twice daily", "Disinfect gym gear"],
        "recommended_ingredients": ["Terbinafine", "Clotrimazole", "Tolnaftate"]
    },
    {
        "problem": "Viral Skin Infection (Warts/HPV)",
        "description": "Growths on the skin caused by HPV; highly contagious.",
        "symptoms": ["Small, grainy growths", "Rough touch", "Tiny black dots"],
        "medical_solutions": ["Salicylic Acid (Compound W)", "Cryotherapy", "Cantharidin"],
        "natural_remedies": ["Duct tape occlusion", "Apple cider vinegar soak"],
        "lifestyle_tips": ["Do not pick or scratch", "Wear shoes in public lockers", "Get HPV vaccine"],
        "recommended_ingredients": ["Salicylic Acid", "Zinc Oxide"]
    }
];

// Deduplicate: remove any existing items with these exact problem names
const coreProblemNames = new Set(coreConditions.map(c => c.problem));
data = data.filter(item => !coreProblemNames.has(item.problem));

// Add the fresh core conditions to the start
data.unshift(...coreConditions);

fs.writeFileSync(path, JSON.stringify(data, null, 4));
console.log('Knowledge base finalized with exact matching core conditions.');
