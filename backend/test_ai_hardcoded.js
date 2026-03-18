const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDdje_dTCCqTMuEqkvMcaX4uThZ-2BcF7E");

async function testAI() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    console.log("AI Response Success:", response.text());
  } catch (error) {
    console.error("AI Response Error:", error);
  }
}

testAI();
