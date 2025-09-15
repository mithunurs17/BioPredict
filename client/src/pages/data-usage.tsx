import React from 'react';
import { withTextToSpeech } from '@/components/TextToSpeech';

function DataUsagePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-white-900">BioPredict Data Usage & Transparency</h1>
      

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">1. Our Commitment to Your Data</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          At BioPredict, we are committed to being transparent about how we collect, use, and protect your data. Your trust is our top priority, especially when it comes to sensitive health information. This page explains our data usage practices and outlines our commitment to responsible data management.
        </p>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">2. Data We Collect and Why</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          We collect specific types of data to provide you with accurate and personalized health insights. We only collect what is necessary to deliver our service effectively.
        </p>
        <ul className="list-disc list-inside mb-4 text-blue-800 leading-relaxed pl-4">
          <li>
            <strong className="font-semibold text-pink-700">Health & Genetic Data:</strong> We collect information you provide, such as genetic markers, medical history, and lifestyle factors, to generate your health predictions. This data is **collected with your explicit consent** and is the core of our service.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Usage Data:</strong> We collect anonymized data on how you interact with our application (e.g., features used, time spent) to help us improve the user experience and service performance.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Account Information:</strong> This includes your email address and basic profile information used for account management and secure access.
          </li>
        </ul>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">3. How We Use Your Data</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          Your data is used to power our service and fulfill our mission of providing you with valuable health insights.
        </p>
        <ul className="list-disc list-inside mb-4 text-blue-800 leading-relaxed pl-4">
          <li>
            <strong className="font-semibold text-pink-700">Personalized Insights:</strong> We use your health and genetic data to generate personalized reports and health predictions.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Service Improvement:</strong> We analyze anonymized usage data to fix bugs, improve features, and develop new functionalities.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Communication:</strong> We use your contact information to communicate with you about your account and important service updates.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Research (with consent):</strong> We may use your genetic data for scientific research, but **only if you provide specific, separate consent for such use**. This data is always aggregated and de-identified to protect your privacy.
          </li>
        </ul>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">4. Your Data, Your Control</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          You have full control over your data.
        </p>
        <ul className="list-disc list-inside mb-4 text-blue-800 leading-relaxed pl-4">
          <li>
            <strong className="font-semibold text-pink-700">Access and Correction:</strong> You can access and update your personal information directly within your account settings.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Deletion:</strong> You have the right to request the deletion of your account and all associated data at any time.
          </li>
          <li>
            <strong className="font-semibold text-pink-700">Consent Management:</strong> You can manage and withdraw your consent for certain data uses, such as research, at any time.
          </li>
        </ul>
        
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">5. Data Security & Protection</h2>
        <p className="mb-4 text-blue-800 leading-relaxed">
          We take data security seriously. We use industry-standard security measures, including encryption and access controls, to protect your data from unauthorized access, loss, or misuse. Your sensitive health information is handled with the utmost care and is encrypted both in transit and at rest.
        </p>
        
      </div>

      
    </div>
  );
}

export default withTextToSpeech(DataUsagePage, () => 
  'This data usage page provides clear information about how BioPredict collects, processes, and protects your personal health data. We prioritize transparency and responsible data management.'
);