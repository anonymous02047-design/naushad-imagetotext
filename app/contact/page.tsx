import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contact Us - Naushad ImageToText | Get in Touch',
  description: 'Contact Naushad ImageToText for support, questions, or feedback. Reach out to our team via email, phone, or contact form.',
  keywords: ['contact', 'support', 'help', 'Naushad Alam', 'email', 'phone'],
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Get in <span className="text-primary-600 dark:text-primary-400">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions about our OCR services? Need technical support? Want to provide feedback? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Contact Information
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                <a 
                  href="mailto:admin@naushadecom.in" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  admin@naushadecom.in
                </a>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
                <a 
                  href="tel:+917209752686" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  +91 7209752686
                </a>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
                <p className="text-gray-600 dark:text-gray-300">India</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
                <p className="text-gray-600 dark:text-gray-300">Within 24 hours</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Send us a Message
            </h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                For the best support experience, please email us directly at{' '}
                <a href="mailto:admin@naushadecom.in" className="text-primary-600 dark:text-primary-400 hover:underline">
                  admin@naushadecom.in
                </a>
                {' '}or call us at{' '}
                <a href="tel:+917209752686" className="text-primary-600 dark:text-primary-400 hover:underline">
                  +91 7209752686
                </a>
                .
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Quick Support
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  For immediate assistance, please call us during business hours. 
                  For technical issues or feature requests, email is the preferred method 
                  as it allows us to provide detailed responses and track your request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}