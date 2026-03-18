const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
  try {
    // Note: listModels might not be available in all SDK versions or might require specific auth
    // But we can try to hit the models endpoint directly if needed.
    // However, usually we can just try another model name.
    
    // Let's try gemini-1.5-pro
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("test");
    const response = await result.response;
    console.log("Success with gemini-1.5-pro:", response.text());
  } catch (error) {
    console.error("Error with gemini-1.5-pro:", error.message);
  }
}

listModels();
