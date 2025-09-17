import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy - Naushad ImageToText | Data Protection',
  description: 'Read our privacy policy to understand how we protect your data and ensure your privacy when using our OCR services.',
  keywords: ['privacy', 'data protection', 'security', 'policy'],
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy <span className="text-primary-600 dark:text-primary-400">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we protect your data and ensure your privacy.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Processing
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                All text extraction and OCR processing is performed entirely in your browser. 
                Your files are never uploaded to our servers, ensuring complete privacy and security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Information Collection
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We do not collect, store, or process your personal files or extracted text. 
                The only information we may collect is anonymous usage statistics to improve our service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Cookies and Tracking
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We use minimal cookies only for essential functionality like theme preferences. 
                We do not use tracking cookies or third-party analytics that compromise your privacy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Since all processing happens locally in your browser, your data never leaves your device. 
                This provides the highest level of security and privacy protection.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                If you have any questions about this privacy policy, please contact us at{' '}
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