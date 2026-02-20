import React from "react";

export const TermAndConditions = () => {
  return (
    <div className="max-w-4xl mt-20 mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <p className="mb-4">
        Welcome to <strong>TechnoHub</strong>! We are a free online platform dedicated to teaching coding and technology to learners around the world. By using our website, you agree to comply with the following terms and conditions. Please read them carefully.
      </p>

      <h2 className="text-2xl font-semibold mb-3">1. Use of Our Platform</h2>
      <p className="mb-4">
        TechnoHub provides educational content for free. You may use our resources for personal, non-commercial purposes. You agree not to misuse the platform or attempt to access content or accounts you are not authorized to access.
      </p>

      <h2 className="text-2xl font-semibold mb-3">2. Intellectual Property</h2>
      <p className="mb-4">
        All content on TechnoHub, including tutorials, articles, and graphics, is owned by TechnoHub or licensed to us. You may not reproduce, distribute, or create derivative works from our content without explicit permission.
      </p>

      <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
      <p className="mb-4">
        You agree to use our platform responsibly. This includes:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Not engaging in illegal or harmful activities.</li>
        <li>Respecting other users and their privacy.</li>
        <li>Not attempting to hack or disrupt the website.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">4. Disclaimer</h2>
      <p className="mb-4">
        While we strive to provide accurate and up-to-date information, TechnoHub is provided "as is." We do not guarantee that the content is error-free or suitable for your specific needs. Use the information at your own risk.
      </p>

      <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
      <p className="mb-4">
        TechnoHub is not liable for any direct, indirect, or incidental damages resulting from your use of our platform, including loss of data or inability to access content.
      </p>

      <h2 className="text-2xl font-semibold mb-3">6. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms and Conditions from time to time. Continued use of the platform constitutes acceptance of any changes. Please check this page periodically for updates.
      </p>

      <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
      <p>
        If you have questions about these terms, you can contact us at <strong>support@technohub.com</strong>.
      </p>

      <p className="mt-6 text-sm text-gray-500">
        © {new Date().getFullYear()} TechnoHub. All rights reserved.
      </p>
    </div>
  );
};
