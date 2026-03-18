const fs = require('fs');
const path = './chatbot_dataset/skin_knowledge_base.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

const consolidatedTopics = [
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
        "recommended_ingredients": ["Vitamin C", "Alpha Arbutin", "Tranexamic Acid", "Niacinamide", "Azelaic Acid"]
    },
    {
        "problem": "Skincare for Boys/Men",
        "description": "Tailored skincare routines for thicker, oilier male skin and shaving concerns.",
        "symptoms": ["Ingrown hairs (shaving)", "Excess oiliness", "Rough texture", "Clogged pores"],
        "medical_solutions": ["Salicylic acid for ingrown hairs", "Niacinamide for oil control", "Glycolic acid for texture"],
        "natural_remedies": ["Witch hazel aftershave", "Aloe vera for shaving burns", "Charcoal masks"],
        "lifestyle_tips": ["Change razors frequently", "Wash face after gym/sweating", "Don't skip moisturizer if you have oily skin"],
        "recommended_ingredients": ["Salicylic Acid", "Niacinamide", "Witch Hazel", "Glycerin"]
    },
    {
        "problem": "Skincare Diet & Nutrition",
        "description": "How internal nutrition affects external skin health and glow.",
        "symptoms": ["Dullness", "Inflammation", "Sallow complexion", "Frequent breakouts"],
        "medical_solutions": ["Vitamin A/E/C supplements (consult doctor)", "Omega-3 fatty acids", "Zinc for healing"],
        "natural_remedies": ["Leafy greens for antioxidants", "Fatty fish (salmon)", "Walnuts", "Green tea"],
        "lifestyle_tips": ["Drink 2-3 liters of water daily", "Reduce sugar and high-glycemic foods", "Limit dairy if acne-prone"],
        "recommended_ingredients": ["Antioxidants", "Zinc", "Omega-3s", "Water"]
    },
    {
        "problem": "Ingredient Layering (Vitamin C & Retinol)",
        "description": "Expert advice on combining potent actives for maximum results without irritation.",
        "symptoms": ["Redness/irritation from mixing", "Peeling", "Sensitized skin"],
        "medical_solutions": ["Hydrocortisone for irritation if barrier is broken", "Barrier repair creams"],
        "natural_remedies": ["Aloe vera soothing", "Honey masks"],
        "lifestyle_tips": ["Vitamin C in the AM (for protection)", "Retinol in the PM (for repair)", "Never mix them directly; use at different times of day"],
        "recommended_ingredients": ["Vitamin C", "Retinol", "Ceramides", "Sunscreen"]
    },
    {
        "problem": "Large Pores & Congestion",
        "description": "Techniques to minimize the appearance of pores and keep them clear.",
        "symptoms": ["Visible 'holes' on nose/cheeks", "Frequent blackheads", "Shiny skin"],
        "medical_solutions": ["Professional chemical peels", "Topical retinoids", "Niacinamide serums"],
        "natural_remedies": ["Clay masks (Kaolin/Bentonite)", "Ice rollers to temporarily tighten"],
        "lifestyle_tips": ["Double cleanse in the PM", "Avoid heavy oils", "Exfoliate 2-3 times weekly"],
        "recommended_ingredients": ["Salicylic Acid", "Niacinamide", "BHA", "Clay"]
    },
    {
        "problem": "Damaged Skin Barrier Repair",
        "description": "Healing your skin's protective layer after over-exfoliation or harsh products.",
        "symptoms": ["Stinging/burning when applying basic products", "Tightness", "Persistent redness", "Sudden breakouts"],
        "medical_solutions": ["Prescription Ceramides", "Low-potency steroid (brief usage only)"],
        "natural_remedies": ["Oatmeal compresses", "Pure Petrolatum (Slugging)", "Coconut oil (if not acne-prone)"],
        "lifestyle_tips": ["Stop ALL actives (No Vitamin C, Retinol, Acids)", "Use only gentle cleansers", "Moisturize multiple times a day"],
        "recommended_ingredients": ["Ceramides", "Panthenol", "Squalane", "Petrolatum"]
    },
    {
        "problem": "Hormonal Acne Management",
        "description": "Treating breakouts caused by hormonal fluctuations (period, stress, puberty).",
        "symptoms": ["Deep, painful 'blind' pimples", "Breakouts mainly along jawline/chin", "Cyclical pattern"],
        "medical_solutions": ["Spironolactone (prescription)", "Hormonal birth control", "Topical retinoids", "Benzoyl peroxide"],
        "natural_remedies": ["Spearmint tea (consult doctor)", "Zinc supplements", "Tea tree oil"],
        "lifestyle_tips": ["Manage stress", "Get 8 hours of sleep", "Maintain consistent routine even when skin is clear"],
        "recommended_ingredients": ["Adapalene", "Azelaic Acid", "Benzoyl Peroxide"]
    },
    {
        "problem": "Chemical vs Physical Exfoliation",
        "description": "Choosing between acids (AHA/BHA) and manual scrubs for skin smoothing.",
        "symptoms": ["Dullness", "Rough texture", "Clogged pores"],
        "medical_solutions": ["AHA (Glycolic/Lactic) for surface", "BHA (Salicylic) for pores"],
        "natural_remedies": ["Sugar scrubs (body only)", "Oatmeal scrub (gentle)"],
        "lifestyle_tips": ["Don't use both on the same day", "Limit physical scrubs to once a week", "Always wear SPF after chemical acids"],
        "recommended_ingredients": ["Glycolic Acid", "Salicylic Acid", "Jojoba Beads"]
    },
    {
        "problem": "Pregnancy Skin Safety",
        "description": "Which skincare products are safe and which to avoid during pregnancy.",
        "symptoms": ["Pregnancy mask (Melasma)", "Sensitivity", "Hormonal acne"],
        "medical_solutions": ["SAFE: Azelaic Acid, Glycolic Acid (low %)", "UNSAFE: Retinoids, Hydroquinone, High-dose Salicylic Acid"],
        "natural_remedies": ["Aloe vera", "Vitamin C", "Rosehip oil"],
        "lifestyle_tips": ["Always consult your OB-GYN before starting new actives", "Prioritize mineral sunscreens"],
        "recommended_ingredients": ["Azelaic Acid", "Vitamin C", "Mineral SPF", "Bakuchiol"]
    },
    {
        "problem": "Dark Under-eye Circles",
        "description": "Treating darkness, puffiness, and fine lines under the eyes.",
        "symptoms": ["Blue/purple tint", "Puffiness", "Hollow appearance"],
        "medical_solutions": ["Caffeine-infused creams", "Vitamin K", "Hyaluronic Acid fillers (professional)"],
        "natural_remedies": ["Cold cucumber slices", "Green tea bags", "Adequate sleep"],
        "lifestyle_tips": ["Sleep with an extra pillow for drainage", "Reduce salt intake", "Use sunscreen around eyes"],
        "recommended_ingredients": ["Caffeine", "Vitamin K", "Retinol (eye-safe)", "Peptides"]
    },
    {
        "problem": "Maskne & Friction Breakouts",
        "description": "Preventing and treating acne caused by masks or tight clothing.",
        "symptoms": ["Bumps in the mask area", "Redness from friction", "Irritation"],
        "medical_solutions": ["Zinc oxide barrier cream", "Gentle BHA wash"],
        "natural_remedies": ["Tea tree mist", "Silk mask liners"],
        "lifestyle_tips": ["Wash cloth masks after every use", "Avoid makeup under masks", "Rinse face with water after removing mask"],
        "recommended_ingredients": ["Zinc Oxide", "Salicylic Acid", "Niacinamide"]
    },
    {
        "problem": "Double Cleansing Method",
        "description": "A two-step cleansing process using oil and then water-based cleansers.",
        "symptoms": ["Residual makeup", "Congested pores", "Sunscreen build-up"],
        "medical_solutions": ["None (cleansing technique)"],
        "natural_remedies": ["Using pure Jojoba or Squalane oil"],
        "lifestyle_tips": ["1st Step: Oil cleanser on dry skin", "2nd Step: Water cleanser on wet skin", "Essential for water-resistant SPF/makeup"],
        "recommended_ingredients": ["Cleansing Oil", "Micellar Water", "Foaming Cleanser"]
    },
    {
        "problem": "Chemical Burn Recovery",
        "description": "Emergency steps for skin burned by over-using acids or harsh ingredients.",
        "symptoms": ["Intense redness", "Oozing or weeping skin", "Scabbing", "Extreme pain/burning"],
        "medical_solutions": ["Silver sulfadiazine cream (doctor prescribed)", "Hydrocortisone", "Oral antibiotics if infected"],
        "natural_remedies": ["Cold milk compresses", "Pure Aloe Vera (no alcohol)", "Sterile water rinse"],
        "lifestyle_tips": ["SEE A DOCTOR IMMEDIATELY for severe burns", "Do not apply anything 'fragranced'", "Keep skin moist with Petrolatum"],
        "recommended_ingredients": ["Petrolatum", "Allantoin", "Colloidal Oatmeal"]
    },
    {
        "problem": "Skincare Result Timeline",
        "description": "Understanding how long it takes to see real change from products.",
        "symptoms": ["Impatience", "Frustration with slow results"],
        "medical_solutions": ["None (biological process)"],
        "natural_remedies": ["Consistency and patience"],
        "lifestyle_tips": ["Cleanser: Immediate", "Moisturizer: 24h", "Acne: 4-6 weeks", "Dark spots: 3 months", "Anti-aging: 6 months+"],
        "recommended_ingredients": ["Consistency"]
    },
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

// Deduplicate by problem name just in case
const existingProblems = new Set(data.map(d => d.problem.toLowerCase()));
const uniqueNewTopics = consolidatedTopics.filter(t => !existingProblems.has(t.problem.toLowerCase()));

data.push(...uniqueNewTopics);
fs.writeFileSync(path, JSON.stringify(data, null, 4));
console.log(`Knowledge base finalized. Added ${uniqueNewTopics.length} new topics. Total entries: ${data.length}`);
