import React from 'react';
import { withTextToSpeech } from '@/components/TextToSpeech';

function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-white-900">BioPredict Privacy Policy</h1>
      

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">1. Introduction</h2>
        
        <p className="mb-4 text-blue-800 leading-relaxed">
          At BioPredict, we are deeply committed to protecting your personal information and ensuring the privacy and security of your data. This Privacy Policy outlines how we collect, use, process, and disclose your information when you use our BioPredict application and services. We encourage you to read this policy carefully to understand our practices regarding your data.
        </p>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">2. Information We Collect</h2>
        
        <p className="mb-4 text-blue-800 leading-relaxed">
          We collect various types of information to provide and improve our services to you. This may include:
        </p>
        <ul className="list-disc list-inside mb-4 text-blue-800 leading-relaxed pl-4">
          <li>
            <strong className="font-semibold text-pink-700">Personal Identifiable Information (PII):</strong> Such as your name, email address, date of birth, and contact details, primarily collected during account registration.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Health and Genetic Information:</strong> Data related to your health status, genetic markers, medical history, and lifestyle factors. This sensitive information is collected with your explicit consent and is crucial for providing personalized health insights.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Usage Data:</strong> Information about how you access and use our services, including IP addresses, device information, browser type, and interaction patterns within the application.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience, analyze usage patterns, and manage authentication.
          </li>
        </ul>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">3. How We Use Your Information</h2>
        
        <p className="mb-4 text-blue-800 leading-relaxed">
          Your information is utilized for various purposes, including but not limited to:
        </p>
        <ul className="list-disc list-inside mb-4 text-blue-800 leading-relaxed pl-4">
          <li>Providing and personalizing our health prediction and insight services.</li>
          <li>Improving and developing new features and functionalities for BioPredict.</li>
          <li>Communicating with you about your account, updates, and relevant information.</li>
          <li>Conducting research and analysis to enhance our understanding of health and genetics (in an aggregated and anonymized format).</li>
          <li>Ensuring the security and integrity of our services and preventing fraudulent activities.</li>
          <li>Complying with legal obligations and regulatory requirements.</li>
          </ul>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">4. Data Sharing and Disclosure</h2>
        
        <p className="mb-4 text-blue-800 leading-relaxed">
          We do not sell your personal data. We may share your information in limited circumstances:
        </p>
        <ul className="list-disc list-inside mb-4 text-blue-800 leading-relaxed pl-4">
          <li>
            <strong className="font-semibold text-pink-700">With Your Consent:</strong> We will only share your sensitive health and genetic information with third parties when we have obtained your explicit consent.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Service Providers:</strong> We may engage trusted third-party service providers to perform functions on our behalf, such as data storage, analytics, and customer support. These providers are contractually bound to protect your data and only use it for the purposes we specify.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, your information may be transferred as part of the transaction, subject to appropriate privacy safeguards.
          </li>
        </ul>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">5. Data Security</h2>
        
        <p className="mb-4 text-blue-800 leading-relaxed">
          We implement robust technical and organizational security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, secure servers, and regular security audits. While we strive to use commercially acceptable means to protect your data, no method of transmission over the internet or method of electronic storage is 100% secure.
        </p>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">6. Your Rights</h2>
        
        <p className="mb-4 text-blue-800 leading-relaxed">
          You have certain rights regarding your personal data, including:
        </p>
        <ul className="list-disc list-inside mb-4 text-blue-800 leading-relaxed pl-4">
          <li>
            <strong className="font-semibold text-pink-700">Access:</strong> You have the right to request access to the personal data we hold about you.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Correction:</strong> You can request that we correct any inaccurate or incomplete data.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Deletion:</strong> You may request the deletion of your personal data, subject to certain legal exceptions.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Objection/Restriction:</strong> You have the right to object to or request the restriction of processing your data in certain circumstances.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Data Portability:</strong> You can request a copy of your data in a structured, commonly used, and machine-readable format.
          </li>
        </ul>
        <p className="mt-4 text-blue-800 leading-relaxed">
          To exercise any of these rights, please contact us using the details provided in the "Contact Us" section.
        </p>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">7. Changes to This Privacy Policy</h2>
        
        <p className="mb-4 text-blue-800 leading-relaxed">
          We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. We encourage you to review this Privacy Policy periodically for any changes.
        </p>
        
      </div>

      
    </div>
  );
}

export default withTextToSpeech(PrivacyPolicyPage, () => 
  'This privacy policy page explains how BioPredict protects and manages your personal information. We are committed to transparency and ensuring the security of your data while providing personalized health insights.'
);