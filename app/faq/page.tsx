import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FAQ - Naushad ImageToText | Frequently Asked Questions',
  description: 'Find answers to common questions about our OCR services, text extraction features, and how to use Naushad ImageToText effectively.',
  keywords: ['FAQ', 'questions', 'help', 'OCR', 'text extraction', 'support'],
}

export default function FAQPage() {
  const faqs = [
    {
      question: "How accurate is the OCR technology?",
      answer: "Our OCR technology achieves 99.9% accuracy on clear, high-quality images. The accuracy depends on image quality, text clarity, and language complexity."
    },
    {
      question: "What file formats are supported?",
      answer: "We support JPG, PNG, GIF, BMP, WebP, TIFF for images, and PDF for documents. Each file is limited to 10MB for optimal performance."
    },
    {
      question: "How many languages are supported?",
      answer: "We support over 100 languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Hindi, and many more."
    },
    {
      question: "Is there a file size limit?",
      answer: "Yes, individual files are limited to 10MB for optimal performance. For larger files, we recommend compressing them before upload."
    },
    {
      question: "Can I process multiple images at once?",
      answer: "Yes! Our batch processing feature allows you to upload and process multiple images simultaneously, saving you time and effort."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. All processing is done client-side in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security."
    },
    {
      question: "Do you offer API access?",
      answer: "Yes, we provide API access for enterprise customers. Contact us at admin@naushadecom.in for more information about our API services."
    },
    {
      question: "What if the OCR doesn't work well?",
      answer: "Try improving image quality, ensuring good contrast, and using our image preprocessing features. For best results, use clear, high-resolution images with good lighting."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked <span className="text-primary-600 dark:text-primary-400">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about our OCR services and how to get the best results.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Still have questions?
              </h3>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                Can't find the answer you're looking for? We're here to help!
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