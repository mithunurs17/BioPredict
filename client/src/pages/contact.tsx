import React from 'react';
import { withTextToSpeech } from '@/components/TextToSpeech';

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">
        This is a placeholder contact page for the BioPredict application.
      </p>
      <p>
        We welcome your feedback and inquiries.
      </p>
    </div>
  );
}

export default withTextToSpeech(ContactPage, () => 
  'Welcome to the contact page for BioPredict. We value your feedback, questions, and support requests. Our team is dedicated to providing you with the best possible assistance.'
);
