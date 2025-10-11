import { Request, Response } from "express";
import OpenAI from "openai";

// Initialize OpenAI client with OpenRouter
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "BioPredict",
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
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: 'system',
          content: 'You are a helpful medical assistant. IMPORTANT: Format your responses using clean numbered lists (1. 2. 3.) and bullet points without asterisks (*). Never use asterisks (*) in your responses. Use proper spacing between sections. Make your responses look professional and aesthetic. Keep responses concise and informative.'
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    console.log('Received response from OpenRouter:', JSON.stringify(completion, null, 2));

    if (!completion.choices || !completion.choices[0]?.message?.content) {
      console.error('Invalid response format:', completion);
      throw new Error('Invalid response format from OpenRouter');
    }

    let responseText = completion.choices[0].message.content;
    
    // Post-process the response to remove asterisks and improve formatting
    responseText = responseText
      .replace(/\*\s*/g, '') // Remove asterisks and spaces after them
      .replace(/^\s*[\*\-]\s*/gm, '• ') // Convert remaining bullet points to clean bullets
      .replace(/\n\s*\n/g, '\n\n') // Clean up extra line breaks
      .trim();
    
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