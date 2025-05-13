import React from 'react';
import { withTextToSpeech } from '@/components/TextToSpeech';

function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        This is a placeholder privacy policy page for the BioPredict application.
      </p>
      <p>
        We are committed to protecting your personal information and ensuring 
        the privacy and security of your data.
      </p>
    </div>
  );
}

export default withTextToSpeech(PrivacyPolicyPage, () => 
  'This privacy policy page explains how BioPredict protects and manages your personal information. We are committed to transparency and ensuring the security of your data while providing personalized health insights.'
);
