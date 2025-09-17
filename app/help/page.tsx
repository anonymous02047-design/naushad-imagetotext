import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Help Center - Naushad ImageToText | Support & Documentation',
  description: 'Get help with Naushad ImageToText. Find tutorials, troubleshooting guides, and support resources.',
  keywords: ['help', 'support', 'documentation', 'tutorials', 'troubleshooting'],
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Help <span className="text-primary-600 dark:text-primary-400">Center</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get the help you need to make the most of our OCR and text extraction services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Getting Started
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Upload your image or PDF file</li>
                <li>• Select the appropriate language</li>
                <li>• Adjust OCR settings if needed</li>
                <li>• Click "Extract Text" to process</li>
                <li>• Copy or download the results</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Best Practices
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Use high-quality, clear images</li>
                <li>• Ensure good contrast and lighting</li>
                <li>• Avoid blurry or rotated text</li>
                <li>• Use supported file formats</li>
                <li>• Keep file sizes under 10MB</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Troubleshooting
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Check file format compatibility</li>
                <li>• Verify file size limits</li>
                <li>• Try different OCR settings</li>
                <li>• Use image preprocessing features</li>
                <li>• Contact support if issues persist</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Support
              </h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p>Email: <a href="mailto:admin@naushadecom.in" className="text-primary-600 dark:text-primary-400 hover:underline">admin@naushadecom.in</a></p>
                <p>Phone: <a href="tel:+917209752686" className="text-primary-600 dark:text-primary-400 hover:underline">+91 7209752686</a></p>
                <p>Response time: Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}