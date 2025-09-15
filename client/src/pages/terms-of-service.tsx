import React from 'react';
import { withTextToSpeech } from '@/components/TextToSpeech';

function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-white-900">BioPredict Terms of Service</h1>
     

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">1. Acceptance of Terms</h2>
        <p className="mb-4 text-indigo-800 leading-relaxed">
          Welcome to BioPredict! By accessing or using our application and its services, you agree to be bound by these **Terms of Service** ("Terms"). These Terms constitute a legally binding agreement between you and BioPredict. If you do not agree with any part of these Terms, you may not use our services.
        </p>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">2. Use of the Service</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          The BioPredict application provides personalized health insights and predictions based on user-provided data. You agree to use the service only for its intended purpose and in a manner that complies with all applicable laws and regulations. You are responsible for all activity that occurs under your account.
        </p>
        <ul className="list-disc list-inside mb-4 text-blue-800 leading-relaxed pl-4">
          <li>
            <strong className="font-semibold text-pink-700">Accuracy of Information:</strong> You agree to provide accurate, complete, and current information when using our services, particularly when submitting health and genetic data.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Prohibited Conduct:</strong> You are prohibited from using the service for any illegal or unauthorized purpose, including but not limited to, transmitting harmful code, infringing on intellectual property rights, or harassing other users.
          </li>
        </ul>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">3. Intellectual Property Rights</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          All content, features, and functionality of the BioPredict application, including but not limited to text, graphics, logos, and software, are the exclusive property of BioPredict and are protected by copyright, trademark, and other intellectual property laws. Your use of the service does not grant you any ownership rights to this content.
        </p>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">4. Disclaimer of Warranties</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          The BioPredict application is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or completeness of the health insights provided. The information from BioPredict should not be considered a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider for any medical concerns.
        </p>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">5. Limitation of Liability</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          To the fullest extent permitted by law, BioPredict and its affiliates will not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
        </p>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">6. Termination</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          We may suspend or terminate your access to the service at our sole discretion, without prior notice, for any reason, including but not limited to a breach of these Terms.
        </p>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">7. Changes to Terms</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page. Your continued use of the service after such changes constitutes your acceptance of the new Terms.
        </p>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">8. Governing Law</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction Here], without regard to its conflict of law provisions.
        </p>
        
      </div>

      
    </div>
  );
}

export default withTextToSpeech(TermsOfServicePage, () => 
  'This terms of service page outlines the guidelines and agreements for using the BioPredict application. By accessing our platform, you agree to these terms which protect both our users and our service.'
);