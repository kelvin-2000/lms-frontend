export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 mb-6">
              LMS Platform (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
              is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our website and services. Please read
              this privacy policy carefully. If you do not agree with the terms
              of this privacy policy, please do not access the site.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Personal Information
            </h3>
            <p className="text-gray-700 mb-3">
              We may collect personal information that you voluntarily provide
              to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
              <li>Register for an account</li>
              <li>Enroll in courses</li>
              <li>Participate in mentorship programs</li>
              <li>Apply for job opportunities</li>
              <li>Contact us with inquiries or feedback</li>
            </ul>
            <p className="text-gray-700 mb-3">This information may include:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
              <li>Name, email address, and contact details</li>
              <li>
                Profile information, including educational background and
                professional experience
              </li>
              <li>Payment and billing information</li>
              <li>Course progress and completion data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Automatically Collected Information
            </h3>
            <p className="text-gray-700 mb-3">
              When you visit our website, we automatically collect certain
              information about your device, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-6">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referral sources</li>
              <li>Device information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-6">
              <li>Create and manage your account</li>
              <li>Provide and maintain our services</li>
              <li>Process payments and transactions</li>
              <li>Track your progress in courses</li>
              <li>
                Communicate with you about your account, courses, or services
              </li>
              <li>
                Send promotional emails about new courses, special features, or
                other products we think you might find interesting
              </li>
              <li>Respond to your inquiries and support requests</li>
              <li>Analyze usage patterns to improve our services</li>
              <li>Ensure compliance with our terms of service</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 mb-6">
              We use cookies and similar tracking technologies to track activity
              on our platform and store certain information. Cookies are files
              with a small amount of data which may include an anonymous unique
              identifier. You can instruct your browser to refuse all cookies or
              to indicate when a cookie is being sent. However, if you do not
              accept cookies, you may not be able to use some portions of our
              platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 mb-3">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-3">
              <li>
                <span className="font-semibold">Service Providers:</span>{' '}
                Third-party vendors who help us provide services, such as
                payment processing, data analysis, email delivery, and hosting
                services
              </li>
              <li>
                <span className="font-semibold">Business Partners:</span> We may
                share your information with our business partners to offer you
                certain products, services, or promotions
              </li>
              <li>
                <span className="font-semibold">Legal Requirements:</span> If
                required by law or in response to legal processes, such as a
                court order or subpoena
              </li>
            </ul>
            <p className="text-gray-700 mb-6">
              We do not sell your personal information to third parties.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 mb-6">
              We have implemented appropriate technical and organizational
              security measures to protect the security of your personal
              information. However, please be aware that no method of
              transmission over the internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Your Data Protection Rights
            </h2>
            <p className="text-gray-700 mb-3">
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-3">
              <li>The right to access your personal data</li>
              <li>The right to rectify inaccurate or incomplete data</li>
              <li>The right to erasure of your data</li>
              <li>The right to restrict processing of your data</li>
              <li>The right to data portability</li>
              <li>The right to object to the processing of your data</li>
            </ul>
            <p className="text-gray-700 mb-6">
              To exercise these rights, please contact us at
              privacy@lmsplatform.com.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-gray-700 mb-6">
              Our platform is not intended for individuals under the age of 16.
              We do not knowingly collect personal information from children
              under 16. If you become aware that a child has provided us with
              personal information, please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 mb-6">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;Last updated&quot; date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 mb-3">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <div className="text-gray-700 p-4 bg-gray-50 rounded-lg">
              <p>
                <span className="font-semibold">Email:</span>{' '}
                privacy@lmsplatform.com
                <br />
                <span className="font-semibold">Address:</span> 123 Education
                Street, Suite 456, New York, NY 10001
                <br />
                <span className="font-semibold">Phone:</span> +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
