const fs = require('fs');
const path = 'd:/e-drive/major_project/chatbot_dataset/skin_knowledge_base.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

const finalTopics = [
    {
        "problem": "Blackheads & Whiteheads (Comedones)",
        "description": "Non-inflammatory acne caused by pores clogged with oil and dead skin.",
        "symptoms": ["Small black dots (opened pores)", "Small white bumps (closed pores)", "Rough skin texture on nose and chin"],
        "medical_solutions": ["Salicylic acid washes", "Adapalene gel (Retinoid)", "Extraction by a professional"],
        "natural_remedies": ["Tea tree oil", "Charcoal strips (use sparingly)", "Steam (to loosen before cleansing)"],
        "lifestyle_tips": ["Use non-comedogenic (pore-clogging) makeup", "Do not squeeze them (can cause scarring)", "Double cleanse in the evening"],
        "recommended_ingredients": ["Salicylic Acid", "Retinol", "Sulfur", "Niacinamide"]
    },
    {
        "problem": "Sunscreen Guide (by Skin Type)",
        "description": "Choosing the right UV protection based on your skin's unique needs.",
        "symptoms": ["Oily: Greasiness from heavy SPFs", "Dry: Tightness from alcohol-based SPFs", "Sensitive: Irritation from chemical filters"],
        "medical_solutions": ["Mineral SPF (Zinc Oxide/Titanium Dioxide) for sensitive skin", "Gel-based SPF for oily skin", "Cream-based SPF for dry skin"],
        "natural_remedies": ["Seeking shade", "Wearing UPF clothing"],
        "lifestyle_tips": ["Reapply every 2 hours", "Use 2 finger lengths for the face", "Wear SPF even when it is cloudy"],
        "recommended_ingredients": ["Zinc Oxide", "Avobenzone", "Tinosorb S/M"]
    },
    {
        "problem": "Red Bumps & Facial Redness",
        "description": "A general guide for identifying and soothing common facial redness.",
        "symptoms": ["Flushed cheeks", "Small red bumps", "Burning sensation", "Visible blood vessels"],
        "medical_solutions": ["Azelaic acid", "Topical Metronidazole (for rosacea)", "Niacinamide serums"],
        "natural_remedies": ["Cool water rinse", "Green tea compresses", "Aloe vera"],
        "lifestyle_tips": ["Identify triggers (spicy food, heat, alcohol)", "Avoid harsh physical scrubs", "Use lukewarm water only"],
        "recommended_ingredients": ["Centella Asiatica (Cica)", "Ceramides", "Azelaic Acid", "Artemisia"]
    }
];

data.push(...finalTopics);
fs.writeFileSync(path, JSON.stringify(data, null, 4));
console.log('Knowledge base finalized with all user requested topics.');
