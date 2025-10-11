const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
const auth = require('../middleware/auth');

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Existing chat endpoint
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.createChatCompletion({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "system",
          content: "You are a helpful medical assistant. IMPORTANT: Format your responses using clean numbered lists (1. 2. 3.) and bullet points without asterisks (*). Never use asterisks (*) in your responses. Use proper spacing between sections. Make your responses look professional and aesthetic. Keep responses concise and informative."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    let responseText = completion.data.choices[0].message.content;
    
    // Post-process the response to remove asterisks and improve formatting
    responseText = responseText
      .replace(/\*\s*/g, '') // Remove asterisks and spaces after them
      .replace(/^\s*[\*\-]\s*/gm, '• ') // Convert remaining bullet points to clean bullets
      .replace(/\n\s*\n/g, '\n\n') // Clean up extra line breaks
      .trim();
    
    res.json({ response: responseText });
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
      model: "openai/gpt-oss-20b:free",
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