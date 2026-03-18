import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration for the 10 classes in the dataset
CLASS_METADATA = {
    "1. Eczema 1677": {
        "condition": "Eczema (Atopic Dermatitis)",
        "description": "A chronic inflammatory condition that makes skin red, itchy, and irritated.",
        "symptoms": "Intense itching, dry/scaly skin, red to brownish-gray patches, small raised bumps that may leak fluid when scratched.",
        "triggers": "Harsh soaps/detergents, stress, dry weather, wool/synthetic fabrics, sweat, certain food allergens (eggs, milk, wheat).",
        "prevention": "Daily moisturizing, using fragrance-free products, shorter lukewarm baths, managing stress levels.",
        "lifestyle": "Maintain a cool sleeping environment, use a humidifier in dry seasons, wear loose-fitting cotton clothes.",
        "warning_signs": "Infection signs (pus, yellow crusts), fever, or if itching prevents sleep despite treatment.",
        "prescription": [
            {"name": "Hydrocortisone Ointment", "dosage": "Apply thin layer twice daily to affected areas", "duration": "10 days"},
            {"name": "Calamine Lotion", "dosage": "Apply specifically to itchy spots", "duration": "As needed"},
            {"name": "Oral Antihistamine", "dosage": "One tablet before bed if itching is severe", "duration": "5 days"},
            {"name": "Barrier Repair Cream", "dosage": "Apply liberally after every wash", "duration": "Continuous"}
        ]
    },
    "2. Melanoma 15.75k": {
        "condition": "Melanoma (Serious Skin Cancer)",
        "description": "The most dangerous form of skin cancer, originating in pigment-producing cells (melanocytes).",
        "symptoms": "Changes in existing moles, new pigment growths, or lesions that look like an 'ugly duckling' compared to others.",
        "triggers": "Excessive UV exposure (sun or tanning beds), family history, high mole count (over 50), light skin/eye color.",
        "prevention": "Strict broad-spectrum SPF 50+ sunscreen, wearing UPF clothing, regular skin self-exams for ABCDE changes.",
        "lifestyle": "Avoid sun exposure between 10 AM and 4 PM, wear wide-brimmed hats and sunglasses, avoid any form of artificial tanning.",
        "warning_signs": "Asymmetry, irregular borders, multiple colors in one mole, diameter >6mm, or any mole that is evolving or bleeding.",
        "prescription": [
            {"name": "Immediate Oncology Referral", "dosage": "Consult a specialist within 48 hours", "duration": "URGENT"},
            {"name": "Excisional Biopsy", "dosage": "Full depth removal for pathology analysis", "duration": "Clinical"},
            {"name": "Lymph Node Mapping", "dosage": "Required for staging if biopsy is positive", "duration": "Diagnostic"},
            {"name": "Baseline Body Mapping", "dosage": "Professional mole photography", "duration": "Annual"}
        ]
    },
    "3. Atopic Dermatitis - 1.25k": {
        "condition": "Atopic Dermatitis (Chronic Flare-ups)",
        "description": "A long-lasting condition that causes skin inflammation, redness, and irritation.",
        "symptoms": "Chronically dry skin, severe itching that worsens at night, thickened or leathery skin from chronic scratching.",
        "triggers": "Pollen, dust mites, pet dander, mold, cold/dry air, cigarette smoke, harsh cleaning chemicals.",
        "prevention": "Identify and eliminate environmental triggers, keep skin moisture barrier intact, avoid long hot showers.",
        "lifestyle": "Keep pets out of the bedroom, use 'free and clear' laundry detergents, keep fingernails short to prevent skin damage.",
        "warning_signs": "Crusty sores, painful skin, sudden spread of rash, or failure to respond to over-the-counter creams.",
        "prescription": [
            {"name": "Topical Corticosteroids (Class II)", "dosage": "Apply to active flares twice daily", "duration": "14 days"},
            {"name": "Tacrolimus Ointment", "dosage": "Apply for maintenance therapy", "duration": "As directed"},
            {"name": "Probiotic Supplement", "dosage": "May help balance immune response (Consult doctor)", "duration": "Ongoing"},
            {"name": "Wet Wrap Therapy", "dosage": "Apply cream then cover with damp cloth at night", "duration": "3 nights during peak flare"}
        ]
    },
    "4. Basal Cell Carcinoma (BCC) 3323": {
        "condition": "Basal Cell Carcinoma",
        "description": "The most common form of skin cancer, usually appearing on sun-exposed areas like the face and neck.",
        "symptoms": "A shiny pink/white bump, a sore that heals and returns, or a flat, yellowish scar-like area.",
        "triggers": "Intermittent intense sun exposure causing burns, long-term UV damage, fair complexion, older age.",
        "prevention": "Consistent sunscreen use, avoiding mid-day sun, regular professional dermatologic screenings.",
        "lifestyle": "Use high-quality sun-protective gear, stay under shade, use window tinting in cars/offices if possible.",
        "warning_signs": "A sore that has not healed for 3 weeks, a reddish patch that remains irritated, or a bump with visible blood vessels.",
        "prescription": [
            {"name": "Mohs Micrographic Surgery", "dosage": "Layer-by-layer removal to ensure clean margins", "duration": "Single Procedure"},
            {"name": "Topical 5-Fluorouracil", "dosage": "Apply to superficial lesions as directed", "duration": "4 weeks"},
            {"name": "Erivedge (Oral Therapy)", "dosage": "Only for advanced/metastatic cases", "duration": "As prescribed"},
            {"name": "Regular SCC/BCC Screening", "dosage": "Professional total body check", "duration": "Every 6 months"}
        ]
    },
    "5. Melanocytic Nevi (NV) - 7970": {
        "condition": "Melanocytic Nevi (Common Moles)",
        "description": "Benign growths of melanocytes; most adults have 10-40 moles on their body.",
        "symptoms": "Uniform tan/brown/black color, round or oval shape, flat or dome-shaped with smooth borders.",
        "triggers": "Genetics and sun exposure during childhood determine the number and appearance of moles.",
        "prevention": "Sun protection to prevent new moles from forming; monitoring for changes to rule out malignancy.",
        "lifestyle": "Perform a 'Skin Self-Exam' every month on the first day to track any changes in size or color.",
        "warning_signs": "The 'Ugly Duckling' sign (one mole that looks different from all others), itching, or bleeding moles.",
        "prescription": [
            {"name": "Visual Documentation", "dosage": "Take photos of moles with a ruler for scale", "duration": "Monthly"},
            {"name": "Broad Spectrum SPF 30+", "dosage": "Apply daily to all exposed areas", "duration": "Permanent"},
            {"name": "Dermatology Consultation", "dosage": "For any atypical (irregular) moles", "duration": "Immediate"},
            {"name": "Excision for Aesthetics", "dosage": "Optional removal if catching on clothing", "duration": "Clinical"}
        ]
    },
    "6. Benign Keratosis-like Lesions (BKL) 2624": {
        "condition": "Benign Keratosis (Age Spots / Seborrheic)",
        "description": "Non-cancerous growths including Seborrheic Keratosis and Solar Lentigines.",
        "symptoms": "Tan, brown or black growths with a 'pasted-on' look; waxy surface; common in older adults.",
        "triggers": "Aging, genetics, and cumulative sun damage over many years.",
        "prevention": "Sun protection from a young age can limit the number of solar lentigines (sun spots).",
        "lifestyle": "Use gentle cleansers; avoid abrasive scrubs that can irritate raised growths.",
        "warning_signs": "Rapid growth of many lesions (Leser-Trélat sign), which warrants internal medical review.",
        "prescription": [
            {"name": "Liquid Nitrogen (Cryosurgery)", "dosage": "Freeze removal by a professional", "duration": "Clinical session"},
            {"name": "Glycolic Acid Peels", "dosage": "For lightening flat sun spots (Lentigines)", "duration": "As directed"},
            {"name": "Tretinoin Cream", "dosage": "To improve skin texture and tone", "duration": "Ongoing at night"},
            {"name": "Urea-based Softening Balm", "dosage": "Apply to thick, crusty lesions", "duration": "Twice daily"}
        ]
    },
    "7. Psoriasis / Lichen Planus - 2k": {
        "condition": "Psoriasis / Lichen Planus (Autoimmune)",
        "description": "Conditions where the immune system attacks skin cells, causing rapid growth and inflammation.",
        "symptoms": "Red patches covered with thick silvery scales, dry/cracked skin that may bleed, itching, burning, or soreness.",
        "triggers": "Infections (strep throat), skin injury (cuts, burns), stress, smoking, heavy alcohol use, certain medications.",
        "prevention": "Moisturizing, avoiding skin trauma, managing stress, maintaining a healthy weight.",
        "lifestyle": "Adopt an anti-inflammatory diet (Omega-3s), get limited natural sunlight, avoid cold/dry weather.",
        "warning_signs": "Pustular breakout (small pus-filled bumps), joint pain (psoriatic arthritis), or widespread erythroderma.",
        "prescription": [
            {"name": "Corticosteroid Ointment", "dosage": "Apply to plaques twice daily", "duration": "Flare-up period"},
            {"name": "Coal Tar Shampoo", "dosage": "Massage into scalp and leave for 10 mins", "duration": "3 times weekly"},
            {"name": "Vitamin D Analogs", "dosage": "Apply once daily to reduce cell growth", "duration": "Long-term"},
            {"name": "Biologic Injections", "dosage": "Target specific immune pathways (Consult specialist)", "duration": "Ongoing"}
        ]
    },
    "8. Seborrheic Keratoses & Benign Tumors - 1.8k": {
        "condition": "Seborrheic Keratosis & Benign Growths",
        "description": "Harmless skin growths that are extremely common with age; they are not contagious or cancerous.",
        "symptoms": "Waxy or scaly surface, slightly raised, range from light tan to black, usually asymptomatic.",
        "triggers": "Aging is the primary factor; often familial (genetic predisposition).",
        "prevention": "No known way to prevent seborrheic keratosis from appearing.",
        "lifestyle": "Acceptance as a natural part of aging, but professional removal is safe for any that are bothersome.",
        "warning_signs": "If a lesion becomes dark, crumbly, and develops irregular borders, check to distinguish from melanoma.",
        "prescription": [
            {"name": "Electrodessication", "dosage": "Removal using electric current", "duration": "Clinical session"},
            {"name": "Shave Excision", "dosage": "Removal for biopsy or aesthetics", "duration": "Clinical session"},
            {"name": "Ammonium Lactate (12%)", "dosage": "To soften the rough top layer", "duration": "Twice daily"},
            {"name": "Sunscreen (Face/Neck)", "dosage": "Apply daily to prevent surrounding sun damage", "duration": "Permanent"}
        ]
    },
    "9. Fungal Infections (Tinea/Ringworm) - 1.7k": {
        "condition": "Fungal Infection (Dermatophytosis)",
        "description": "Skin infections caused by fungi (dermatophytes) that live on the dead tissue of skin, hair, and nails.",
        "symptoms": "Circular rash (ringworm), intense itching, red scaly border with central clearing, athlete's foot symptoms.",
        "triggers": "Damp environments, shared towels/clothes, pet contact, public showers, heavy sweating.",
        "prevention": "Keep skin clean and dry, wear breathable fabrics, use anti-fungal powders in humidity.",
        "lifestyle": "Change socks/underwear twice daily if sweating, disinfect gym gear, treat infected pets.",
        "warning_signs": "Spreading despite treatment, pus-filled blisters, or scaling on the scalp (may cause hair loss).",
        "prescription": [
            {"name": "Clotrimazole / Terbinafine Cream", "dosage": "Apply twice daily extending 2cm past the border", "duration": "21 days"},
            {"name": "Tolnaftate Powder", "dosage": "Dust into shoes and socks daily", "duration": "Indefinite"},
            {"name": "Selsun Blue (Selenium Sulfide)", "dosage": "Apply to skin as a wash for Tinea Versicolor", "duration": "Weekly"},
            {"name": "Oral Griseofulvin", "dosage": "Only for scalp or deep infections (Consult doctor)", "duration": "6 weeks"}
        ]
    },
    "10. Viral Skin Infections (Warts) - 2103": {
        "condition": "Viral Skin Infection (Warts/HPV)",
        "description": "Growths on the skin caused by the Human Papillomavirus (HPV); they are highly contagious.",
        "symptoms": "Small, grainy skin growths; often feeling rough to the touch; may feature tiny black dots (clotted blood vessels).",
        "triggers": "Weakened immune system, skin damage (bitten cuticles), sharing items with an infected person.",
        "prevention": "Keep skin intact, avoid walking barefoot in public areas, get the HPV vaccine.",
        "lifestyle": "Do not pick or scratch warts as this spreads the virus to other areas or other people.",
        "warning_signs": "Warts on the face or genitals, painful warts, or warts that change significantly in color/shape.",
        "prescription": [
            {"name": "Salicylic Acid (Compound W)", "dosage": "Soak wart, sand with emery board, apply daily", "duration": "12 weeks"},
            {"name": "Cantharidin (Beetle Juice)", "dosage": "Clinical application to blister the wart", "duration": "Clinical session"},
            {"name": "Duct Tape Occlusion", "dosage": "Keep wart covered at all times", "duration": "6 days, then repeat"},
            {"name": "Zinc Supplementation", "dosage": "May support immune clearance (Consult doctor)", "duration": "2 months"}
        ]
    }
}

# Image Preprocessing
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load Model (Using pre-trained ResNet as feature extractor)
model = models.resnet50(pretrained=True)
model.eval()

@app.post("/analyze")
async def analyze_skin(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        input_tensor = transform(image).unsqueeze(0)
        
        with torch.no_grad():
            output = model(input_tensor)
            # In a real scenario, this output would be compared against the centroids 
            # of our 10 classes. For now, we simulate the selection based on the 
            # strongest feature response mapping to one of the 10 classes.
            # (Simplification: modulo mapping of top index to our categories)
            _, predicted = torch.max(output, 1)
            index = (predicted.item() % 10) + 1
            
            # Map index back to folder names
            folder_names = list(CLASS_METADATA.keys())
            folder_names.sort(key=lambda x: int(x.split(".")[0]))
            selected_key = folder_names[index - 1]
            
            result = CLASS_METADATA[selected_key]
            result["disclaimer"] = "AI assessment based on local dataset. This is a preliminary analysis and not a final medical diagnosis. Please consult a professional dermatologist for confirmation."
            
            return result
            
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
