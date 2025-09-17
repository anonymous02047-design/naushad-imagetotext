import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Tutorials - Naushad ImageToText | Learning Resources',
  description: 'Learn how to use Naushad ImageToText effectively with our comprehensive tutorials and guides.',
  keywords: ['tutorials', 'guides', 'learning', 'how to', 'OCR', 'text extraction'],
}

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Tutorials & <span className="text-primary-600 dark:text-primary-400">Guides</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Learn how to get the best results from our OCR and text extraction services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Getting Started Guide
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Learn the basics of using our OCR service, from uploading files to extracting text.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Beginner • 5 min read
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Image Quality Tips
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Discover how to prepare your images for the best OCR accuracy and results.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Intermediate • 8 min read
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Batch Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Learn how to efficiently process multiple documents and images at once.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Intermediate • 10 min read
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Advanced OCR Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Master the advanced settings to fine-tune OCR performance for your specific needs.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Advanced • 12 min read
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                PDF Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Learn how to extract text from PDF documents effectively and efficiently.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Intermediate • 7 min read
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Translation Features
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Discover how to translate extracted text into multiple languages.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Beginner • 6 min read
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Need More Help?
              </h3>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <a 
                href="mailto:admin@naushadecom.in"
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}