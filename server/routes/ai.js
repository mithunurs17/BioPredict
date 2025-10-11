import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import auth from '../middleware/auth.js';

const router = express.Router();

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Existing chat endpoint
router.post('/chat', async (req, res) => {
  console.log('Chat endpoint hit! Request body:', req.body);
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid request format:', req.body);
      return res.status(400).json({ error: 'Invalid request format. Expected an array of messages.' });
    }

    const completion = await openai.createChatCompletion({
      model: "openai/gpt-oss-20b:free",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
    });

    let responseText = completion.data.choices[0].message.content;
    
    // Post-process the response to remove asterisks and improve formatting
    responseText = responseText
      .replace(/\*\s*/g, '') // Remove asterisks and spaces after them
      .replace(/^\s*[\*\-]\s*/gm, '• ') // Convert remaining bullet points to clean bullets
      .replace(/\n\s*\n/g, '\n\n') // Clean up extra line breaks
      .trim();
    
    console.log('Sending response:', { response: responseText });
    res.json({ response: responseText });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ message: 'Error processing chat request', error: error.message });
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

export default router; 