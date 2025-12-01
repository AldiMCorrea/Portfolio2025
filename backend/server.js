const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let knowledgeBase = '';

async function loadKnowledgeBase() {
  try {
    const filePath = path.join(__dirname, '../src/locales/en.json');
    knowledgeBase = await fs.readFile(filePath, 'utf-8');
    console.log('Knowledge base loaded successfully.');
  } catch (error) {
    console.error('Error loading knowledge base:', error);
  }
}

loadKnowledgeBase();

app.use(cors());
app.use(express.json());

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received contact form submission:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Message:', message);

  // For now, we'll just send a success response
  res.status(200).json({ message: 'Message received successfully!' });
});

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  console.log('Received question:', question);

  if (!knowledgeBase) {
    return res.status(500).json({ error: 'Knowledge base not loaded.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Based on the following text, answer the question "${question}".\n\nText:\n${knowledgeBase}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();
    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error with Generative AI:', error);
    res.status(500).json({ error: 'Failed to generate answer.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

