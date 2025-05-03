import { Request, Response } from "express";
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const MODEL = 'claude-3-7-sonnet-20250219';

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format. Expected an array of messages.' });
    }
    
    // Prepare the message format for Anthropic
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Create system prompt for health advice
    const systemPrompt = `You are a health assistant focused on providing evidence-based advice on diet, 
    exercise, and lifestyle changes to improve health. You specialize in preventive health measures related
    to the diseases detected by BioPredict: diabetes, cardiovascular disease, oral cancer, kidney disease, 
    and neurodegenerative conditions.
    
    When providing advice:
    - Give practical, actionable suggestions
    - Focus on scientifically validated information
    - Personalize advice when possible based on user details
    - Explain how suggestions relate to biomarkers when relevant
    - Be clear about limitations of your advice
    - Do NOT provide specific medical diagnosis or treatment advice
    - Always encourage users to consult healthcare professionals for personal medical concerns
    
    Keep your responses friendly, clear, and concise.`;
    
    // Send request to Anthropic
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 750,
      system: systemPrompt,
      messages: formattedMessages
    });
    
    // Extract and return the response
    const responseText = response.content[0].type === 'text' 
      ? response.content[0].text 
      : "I'm sorry, I couldn't process your request properly.";
      
    return res.status(200).json({
      response: responseText
    });
    
  } catch (error) {
    console.error('Error in AI chat:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}