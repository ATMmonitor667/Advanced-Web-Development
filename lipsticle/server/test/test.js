import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateText(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
}


const geminiPrompt = `create a leetcode problem about linked list and provide solution with explanation, and also give it a difficulty level,
the problem should be straight out of leetcode and also return your answer in json two chunks, one chunk should be the problem statement with difficulty level and the other should have the
the hyper link to the problem, solution code and explanation of the solution, all in a single json object`;

async function testGemini() {
  try {
    const response = await generateText(geminiPrompt);
    console.log("Gemini Response:", response);
  } catch (error) {
    console.error("Error generating text:", error);
  }
};

testGemini();