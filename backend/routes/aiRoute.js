import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ override: true }); // Ensure latest keys are fetched securely

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Server AI configuration missing" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Setup strict behavioral prompt constraints natively inside the model definition.
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: "You are an assistant for the app 'HireHelper'. You help users manage tasks efficiently and navigate the app. The app has a Sidebar with the following tabs: 1) 'Feed' (view all tasks), 2) 'My Tasks' (view tasks you accepted), 3) 'Requests' (view requests from others), 4) 'My Requests' (view requests you sent), 5) 'Add Task' (create a new task), 6) 'Settings' (change profile details, avatar, name, and password). Keep your answers short, highly practical, and brief. Do NOT use markdown, asterisks (*), or bold text. Use plain dashes (-) for bullet points and separate them with newlines."
        });

        const prompt = `The user asks: "${message}"`;
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        return res.status(200).json({ message: aiResponse });

    } catch (error) {
        console.error("AI Assistant Error:", error);
        return res.status(500).json({ error: "Failed to generate AI response" });
    }
});

export default router;
