import React from 'react';
import { withTextToSpeech } from '@/components/TextToSpeech';

function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">
        This is a placeholder terms of service page for the BioPredict application.
      </p>
      <p>
        By using our application, you agree to these preliminary terms of service.
      </p>
    </div>
  );
}

export default withTextToSpeech(TermsOfServicePage, () => 
  'This terms of service page outlines the guidelines and agreements for using the BioPredict application. By accessing our platform, you agree to these terms which protect both our users and our service.'
);
