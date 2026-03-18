const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

console.log("Loaded API Key starts with:", (process.env.GEMINI_API_KEY || "MISSING").substring(0, 4));
async function testAI() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    console.log("AI Response Success:", response.text());
  } catch (error) {
    console.error("AI Response Error:", error);
  }
}

testAI();
