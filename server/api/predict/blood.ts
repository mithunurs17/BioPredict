import { spawn } from 'child_process';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

interface PredictionError extends Error {
  message: string;
  stack?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Received prediction request:', JSON.stringify(req.body, null, 2));

  try {
    // Validate required fields
    const requiredFields = ['BMI', 'Chol', 'TG', 'HDL', 'LDL', 'Cr', 'BUN'];
    const missingFields = requiredFields.filter(field => !(field in req.body));
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        error: 'Missing required fields',
        details: `The following fields are required: ${missingFields.join(', ')}`
      });
    }

    // Get the path to the Python script
    const scriptPath = path.join(process.cwd(), 'server', 'ml_training', 'predict_diabetes.py');
    console.log('Python script path:', scriptPath);

    // Verify Python script exists
    if (!fs.existsSync(scriptPath)) {
      console.error('Python script not found at:', scriptPath);
      return res.status(500).json({ 
        error: 'Prediction service unavailable',
        details: 'Python script not found'
      });
    }

    // Create a promise to handle the Python process
    const predictionPromise = new Promise((resolve, reject) => {
      // Spawn Python process
      const pythonProcess = spawn('python', [scriptPath]);
      console.log('Python process spawned');

      let result = '';
      let error = '';

      // Set a timeout for the Python process
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Python process timed out after 30 seconds'));
      }, 30000);

      // Collect data from Python script
      pythonProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        console.log('Python stdout:', chunk);
        result += chunk;
      });

      pythonProcess.stderr.on('data', (data) => {
        const chunk = data.toString();
        console.error('Python stderr:', chunk);
        error += chunk;
      });

      // Handle process completion
      pythonProcess.on('close', (code) => {
        clearTimeout(timeout);
        console.log('Python process closed with code:', code);
        
        if (code !== 0) {
          console.error('Python process failed with error:', error);
          reject(new Error(`Python script failed: ${error}`));
          return;
        }

        try {
          // Try to parse the last line of output as JSON
          const lines = result.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          console.log('Attempting to parse JSON from:', lastLine);
          
          const predictionResult = JSON.parse(lastLine);
          console.log('Prediction result:', JSON.stringify(predictionResult, null, 2));
          
          // Format the response to match the expected structure
          const formattedResult = {
            riskLevel: predictionResult.riskLevel,
            riskValue: predictionResult.riskValue,
            factors: predictionResult.factors,
            recommendation: predictionResult.recommendation,
            potentialDiseases: predictionResult.potentialDiseases,
            biomarkerIssues: predictionResult.biomarkerIssues
          };
          
          resolve(formattedResult);
        } catch (parseError) {
          console.error('Failed to parse prediction result:', parseError);
          console.error('Raw result:', result);
          reject(new Error(`Failed to parse prediction result: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`));
        }
      });

      // Handle process errors
      pythonProcess.on('error', (processError) => {
        clearTimeout(timeout);
        console.error('Python process error:', processError);
        reject(new Error(`Failed to start Python process: ${processError.message}`));
      });

      // Send data to Python script
      try {
        const inputData = JSON.stringify(req.body);
        console.log('Sending to Python:', inputData);
        pythonProcess.stdin.write(inputData);
        pythonProcess.stdin.end();
      } catch (writeError) {
        clearTimeout(timeout);
        console.error('Error writing to Python process:', writeError);
        reject(new Error(`Failed to write to Python process: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`));
      }
    });

    // Wait for the prediction result
    const predictionResult = await predictionPromise;
    console.log('Sending response:', JSON.stringify(predictionResult, null, 2));
    return res.status(200).json(predictionResult);

  } catch (error) {
    console.error('API error:', error);
    const predictionError = error as PredictionError;
    return res.status(500).json({ 
      error: 'Prediction failed',
      details: predictionError.message,
      stack: process.env.NODE_ENV === 'development' ? predictionError.stack : undefined
    });
  }
} 