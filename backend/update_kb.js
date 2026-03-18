const fs = require('fs');
const path = 'd:/e-drive/major_project/chatbot_dataset/skin_knowledge_base.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

const newTopics = [
    {
        "problem": "Skin Type Determination",
        "description": "Understanding if your skin is oily, dry, combination, sensitive, or normal.",
        "symptoms": ["Oily: Shiny, large pores", "Dry: Flaky, tight feeling", "Combination: Oily T-zone, dry cheeks", "Sensitive: Redness, easily irritated"],
        "medical_solutions": ["Consult a dermatologist for a professional analysis"],
        "natural_remedies": ["The 'Watch and Wait' test (Wash face, wait 1 hour, observe)"],
        "lifestyle_tips": ["Use products tailored to your specific type", "Skin type can change with age, weather, and hormones"],
        "recommended_ingredients": ["Oily: Niacinamide", "Dry: Hyaluronic Acid", "Sensitive: Centella Asiatica"]
    },
    {
        "problem": "Basic Skincare Routine",
        "description": "The fundamental steps for healthy skin maintenance.",
        "symptoms": ["Dullness", "Congestion", "Dehydration if neglected"],
        "medical_solutions": ["None (this is maintenance)"],
        "natural_remedies": ["Consistent AM/PM cleansing", "Daily hydration"],
        "lifestyle_tips": ["Order: Cleanse -> Treat (Serum) -> Moisturize -> SPF (AM)", "Wait for products to absorb before layering"],
        "recommended_ingredients": ["Gentle Cleanser", "Moisturizer", "Broad-spectrum SPF"]
    },
    {
        "problem": "Anti-Aging (Fine Lines/Wrinkles)",
        "description": "Natural changes in the skin over time, including loss of elasticity and volume.",
        "symptoms": ["Fine lines around eyes/mouth", "Loss of firmness", "Sun spots"],
        "medical_solutions": ["Retinoids (Tretinoin)", "Peptides", "Botox/Fillers (professional only)", "Chemical peels"],
        "natural_remedies": ["Bakuchiol (natural retinol alternative)", "Green tea antioxidants"],
        "lifestyle_tips": ["Wear SPF daily to prevent UV damage", "Stay hydrated", "Avoid smoking"],
        "recommended_ingredients": ["Retinol", "Peptides", "Vitamin C", "Hyaluronic Acid"]
    },
    {
        "problem": "Hyperpigmentation (General)",
        "description": "Darkened areas of skin caused by excess melanin production.",
        "symptoms": ["Dark spots (sun spots)", "Post-inflammatory hyperpigmentation (after acne)", "Uneven skin tone"],
        "medical_solutions": ["Hydroquinone", "Kojic acid", "Alpha Arbutin", "Chemical peels"],
        "natural_remedies": ["Licorice root extract", "Vitamin C", "Niacinamide"],
        "lifestyle_tips": ["Wear SPF every single day to prevent spots from darkening", "Avoid picking at acne"],
        "recommended_ingredients": ["Vitamin C", "Alpha Arbutin", "Tranexamic Acid", "Niacidamide", "Azelaic Acid"]
    }
];

data.push(...newTopics);
fs.writeFileSync(path, JSON.stringify(data, null, 4));
console.log('Knowledge base updated with general topics.');
