import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); // root .env

async function test() {
    console.log("Using API Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash"
        });
        const result = await model.generateContent("The user asks: Hello");
        console.log("Success:", result.response.text());
    } catch (err) {
        console.error("SDK Error details:", err);
    }
}
test();
