import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service - Naushad ImageToText | Usage Terms',
  description: 'Read our terms of service to understand the terms and conditions for using Naushad ImageToText services.',
  keywords: ['terms', 'service', 'conditions', 'usage', 'agreement'],
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of <span className="text-primary-600 dark:text-primary-400">Service</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Please read these terms carefully before using our OCR and text extraction services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                By using Naushad ImageToText, you agree to be bound by these terms and conditions. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Service Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Naushad ImageToText provides OCR (Optical Character Recognition) and text extraction services. 
                All processing is performed locally in your browser for maximum privacy and security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                User Responsibilities
              </h2>
              <ul className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
                <li>• Use the service only for lawful purposes</li>
                <li>• Respect intellectual property rights</li>
                <li>• Do not attempt to reverse engineer the service</li>
                <li>• Ensure you have rights to process uploaded content</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Service Availability
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                The service is provided "as is" without warranties of any kind.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Naushad ImageToText shall not be liable for any indirect, incidental, or consequential damages 
                arising from the use of our service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                For questions about these terms, please contact us at{' '}
                <a href="mailto:admin@naushadecom.in" className="text-primary-600 dark:text-primary-400 hover:underline">
                  admin@naushadecom.in
                </a>
              </p>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              Last updated: January 2024
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}