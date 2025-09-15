const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
const auth = require('../middleware/auth');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Existing chat endpoint
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful medical assistant that provides information about diseases and health conditions based on biomarker analysis. Keep responses concise and informative."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    res.json({ response: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ message: 'Error processing chat request' });
  }
});

// New health insights endpoint
router.post('/analyze-health', auth, async (req, res) => {
  try {
    const { analysisData } = req.body;

    // Prepare the prompt for the AI
    const prompt = `Analyze the following biomarker analysis data and provide personalized health insights and recommendations. 
    Focus on patterns, trends, and potential health implications. Format the response as a JSON array of insights, where each insight has:
    - insight: string (the recommendation or observation)
    - type: "positive", "warning", or "neutral"
    - icon: "activity", "brain", or "trending"
    
    Analysis Data: ${JSON.stringify(analysisData)}
    
    Provide 3-5 most relevant insights.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a medical AI assistant that analyzes biomarker data and provides personalized health insights. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const response = completion.data.choices[0].message.content;
    const insights = JSON.parse(response);

    res.json({ insights });
  } catch (error) {
    console.error('Error in analyze-health endpoint:', error);
    res.status(500).json({ message: 'Error analyzing health data' });
  }
});

module.exports = router; 