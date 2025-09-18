import express from 'express';
import { generateText, genAI} from '../utility/gemini.js';

async function fetchAIResponse(req, res) {
  const prompt = req.body.prompt;
  const response = await generateText(prompt);
  res.json({response});
}

export default fetchAIResponse;