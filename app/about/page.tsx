import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About Us - Naushad ImageToText | Advanced OCR Solutions',
  description: 'Learn about Naushad ImageToText, our mission to provide advanced OCR and PDF processing solutions. Meet our team and discover our commitment to innovation.',
  keywords: ['about', 'OCR', 'text extraction', 'Naushad Alam', 'team', 'mission'],
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-primary-600 dark:text-primary-400">Naushad ImageToText</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are passionate about making text extraction from images and documents accessible, 
            accurate, and efficient for everyone. Our advanced OCR technology helps individuals 
            and businesses transform their workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              To democratize access to advanced OCR technology by providing powerful, 
              user-friendly tools that help people extract text from images and documents 
              with unprecedented accuracy and speed.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We believe that everyone should have access to professional-grade text extraction 
              capabilities, regardless of their technical expertise or budget constraints.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">100+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Languages Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">Free</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Basic Usage</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Meet Our Team
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">NA</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Naushad Alam</h3>
                  <p className="text-lg text-primary-600 dark:text-primary-400 mb-4">Founder & Lead Developer</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    A passionate developer with expertise in web technologies, OCR systems, and user experience design. 
                    Naushad is dedicated to creating innovative solutions that make technology accessible to everyone.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                      <span className="text-gray-600 dark:text-gray-300">📧</span>
                      <a href="mailto:admin@naushadecom.in" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        admin@naushadecom.in
                      </a>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                      <span className="text-gray-600 dark:text-gray-300">📱</span>
                      <a href="tel:+917209752686" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        +91 7209752686
                      </a>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                      <span className="text-gray-600 dark:text-gray-300">📍</span>
                      <span className="text-gray-600 dark:text-gray-300">India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We strive for the highest quality in everything we do, from code to customer service.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We continuously explore new technologies and methods to improve our solutions.
              </p>
            </div>
            
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Built with Modern Technology
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Our platform is built using cutting-edge technologies to ensure the best performance, 
            security, and user experience.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {['Next.js', 'TypeScript', 'Tesseract.js', 'Tailwind CSS'].map((tech, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{tech}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility Section */}
        <div id="accessibility" className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Accessibility & Inclusivity
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            We are committed to making our tools accessible to everyone, regardless of their abilities or the devices they use.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♿</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Screen Reader Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our interface is designed with proper ARIA labels and semantic HTML for screen reader compatibility.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⌨️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Keyboard Navigation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All features can be accessed using keyboard shortcuts and tab navigation for users who cannot use a mouse.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Mobile Responsive</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fully responsive design that works seamlessly across all devices and screen sizes.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">High Contrast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dark and light themes with sufficient color contrast ratios for better visibility.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Scalable Text</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Text and interface elements scale properly with browser zoom settings and user preferences.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Multi-language</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Support for multiple languages and right-to-left text direction for global accessibility.
              </p>
            </div>
          </div>
          
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Accessibility Commitment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We follow WCAG 2.1 AA guidelines and continuously work to improve the accessibility of our platform. 
              If you encounter any accessibility barriers, please let us know so we can address them.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>WCAG 2.1 AA Compliant</span>
              <span>•</span>
              <span>Keyboard Accessible</span>
              <span>•</span>
              <span>Screen Reader Friendly</span>
              <span>•</span>
              <span>High Contrast Support</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}