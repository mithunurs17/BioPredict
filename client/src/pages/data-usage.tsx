import React from 'react';
import { withTextToSpeech } from '@/components/TextToSpeech';

function DataUsagePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Data Usage</h1>
      <p className="mb-4">
        This is a placeholder data usage page for the BioPredict application.
      </p>
      <p>
        We are transparent about how we collect, use, and protect your data.
      </p>
    </div>
  );
}

export default withTextToSpeech(DataUsagePage, () => 
  'This data usage page provides clear information about how BioPredict collects, processes, and protects your personal health data. We prioritize transparency and responsible data management.'
);
