import React from 'react';
import { withTextToSpeech } from '@/components/TextToSpeech';

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-white-900">Contact BioPredict</h1>
      <p className="text-center text-blue-800 mb-12">
        We are here to help. Please feel free to reach out to us with any questions, feedback, or support requests.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-pink-600">General Inquiries</h2>
          <p className="mb-4 text-blue-800">
            For general questions about our services, partnerships, or press inquiries, please send us an email.
          </p>
          <a href="mailto:info@biopredict.com" className="text-blue-600 hover:underline font-semibold">
            info@biopredict.com
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-pink-600">Technical Support</h2>
          <p className="mb-4 text-blue-800">
            If you are experiencing a technical issue with the application or need help with your account, please contact our support team.
          </p>
          <a href="mailto:support@biopredict.com" className="text-blue-600 hover:underline font-semibold">
            support@biopredict.com
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-pink-600">Privacy & Data Questions</h2>
          <p className="mb-4 text-blue-800">
            For concerns regarding your data, privacy policy, or data usage, our data protection officer is available to assist you.
          </p>
          <a href="mailto:privacy@biopredict.com" className="text-blue-600 hover:underline font-semibold">
            privacy@biopredict.com
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-pink-600">Mailing Address</h2>
          <p className="mb-4 text-blue-800">
            If you prefer to contact us by mail, you can send correspondence to our corporate office.
          </p>
          <address className="not-italic text-blue-800">
            BioPredict <br />
            Bengaluru<br />
            INDIA
          </address>
        </div>
      </div>
      
    </div>
  );
}

export default withTextToSpeech(ContactPage, () => 
  'Welcome to the contact page for BioPredict. We value your feedback, questions, and support requests. Our team is dedicated to providing you with the best possible assistance.'
);