import { Request, Response } from "express";
import OpenAI from "openai";

// Initialize OpenAI client with OpenRouter
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "DiseaseDetect",
  },
});

export async function handleChatMessage(req: Request, res: Response) {
  console.log('Received chat request:', {
    body: req.body,
    headers: req.headers
  });

  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid request format:', req.body);
      return res.status(400).json({ error: 'Invalid request format. Expected an array of messages.' });
    }

    console.log('Sending request to OpenRouter with messages:', JSON.stringify(messages, null, 2));

    // Send request to OpenRouter
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 1000
    });
    
    console.log('Received response from OpenRouter:', JSON.stringify(completion, null, 2));

    if (!completion.choices || !completion.choices[0]?.message?.content) {
      console.error('Invalid response format:', completion);
      throw new Error('Invalid response format from OpenRouter');
    }

    const responseText = completion.choices[0].message.content;
    console.log('Sending response to client:', responseText);
    
    return res.status(200).json({
      response: responseText
    });
    
  } catch (error) {
    console.error('Error in AI chat:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Check if it's an API error
    if (error instanceof OpenAI.APIError) {
      console.error('API Error details:', {
        status: error.status,
        code: error.code,
        type: error.type,
        message: error.message
      });
    }

    return res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}