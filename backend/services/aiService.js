const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeCrowdData = async (crowdData, goal) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
        You are an AI Crowd Intelligence System for StadiumFlow.
        Analyze the following real-time crowd occupancy/wait-time data (in minutes):
        ${JSON.stringify(crowdData, null, 2)}
        
        Task:
        1. Predict which areas will become critically crowded (wait > 15m) in the next 10 minutes.
        2. Based on the data, suggest the safest (lowest wait) path for a user with the goal: "${goal || 'General Exit'}".
        3. Provide technical reasoning for your suggestion.

        Return only JSON in this format:
        {
            "predictions": ["Area X", "Area Y"],
            "suggestion": "Detailed path suggestion",
            "reasoning": "Scientific reasoning",
            "riskLevel": "Low/Medium/High"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response (Gemini sometimes adds markdown blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return { error: "AI Service Unavailable", details: error.message };
    }
};

module.exports = { analyzeCrowdData };
