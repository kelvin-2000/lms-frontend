export default function TermsOfServicePage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Terms of Service
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
              Welcome to LMS Platform. These Terms of Service govern your use of
              our website, products, and services. By using our platform, you
              agree to these terms in full. If you disagree with any part of
              these terms, you must not use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Definitions
            </h2>
            <p className="text-gray-700 mb-6">
              <strong>&quot;Service&quot;</strong> refers to the LMS Platform
              website, its courses, mentorship programs, events, and job board
              services.
              <br className="mb-2" />
              <strong>&quot;User&quot;</strong> refers to any individual who
              accesses or uses the Service, including students, instructors,
              mentors, and event organizers.
              <br className="mb-2" />
              <strong>&quot;Content&quot;</strong> refers to all materials
              uploaded, shared, or created on the Service, including but not
              limited to courses, videos, text, graphics, and comments.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. User Accounts
            </h2>
            <p className="text-gray-700 mb-6">
              When creating an account, you must provide accurate information
              and keep it up to date. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities
              that occur under your account. We reserve the right to suspend or
              terminate accounts that violate our terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. User Conduct
            </h2>
            <p className="text-gray-700 mb-2">
              Users of our platform must not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-6">
              <li>Violate any applicable laws or regulations</li>
              <li>
                Impersonate others or misrepresent their affiliation with any
                person or entity
              </li>
              <li>
                Post or share content that is harmful, offensive, or
                discriminatory
              </li>
              <li>Use the platform to send unsolicited marketing messages</li>
              <li>
                Attempt to bypass or reverse-engineer any aspect of the platform
              </li>
              <li>
                Engage in any activity that interferes with or disrupts the
                functioning of the Service
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Intellectual Property Rights
            </h2>
            <p className="text-gray-700 mb-3">
              The Service and its original content, features, and functionality
              are owned by LMS Platform and are protected by international
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 mb-6">
              Users retain ownership of the content they create, upload, or
              share on the platform. By sharing content, you grant us a
              non-exclusive, worldwide, royalty-free license to use, store,
              display, and distribute that content in connection with providing
              the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Course Enrollment and Payments
            </h2>
            <p className="text-gray-700 mb-6">
              Course enrollment is subject to availability and payment of
              applicable fees. All payments are processed securely through
              third-party payment processors. Fees for courses and services are
              non-refundable unless otherwise specified.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-6">
              To the maximum extent permitted by law, LMS Platform shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use,
              goodwill, or other intangible losses resulting from your use of
              our Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Indemnification
            </h2>
            <p className="text-gray-700 mb-6">
              You agree to defend, indemnify, and hold harmless LMS Platform and
              its employees, contractors, and affiliates from and against any
              claims, liabilities, damages, losses, and expenses arising out of
              or in any way connected with your use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Governing Law
            </h2>
            <p className="text-gray-700 mb-6">
              These Terms shall be governed by and construed in accordance with
              the laws of the United States, without regard to its conflict of
              law provisions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these terms at any time. We will
              provide notice of significant changes by updating the &quot;Last
              updated&quot; date at the top of this page. Your continued use of
              the Service after such modifications constitutes your acceptance
              of the revised terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Contact Information
            </h2>
            <p className="text-gray-700">
              If you have any questions about these Terms, please contact us at
              legal@lmsplatform.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
