'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Heart, Code } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  // Version information
  const version = "0.1.0"
  const buildDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
  const buildTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })

  const footerLinks = {
    product: [
      { name: 'Image to Text', href: '/' },
      { name: 'PDF to Text', href: '/' },
      { name: 'Batch Processing', href: '/' },
      { name: 'QR Code Generator', href: '/qr-generator' },
      { name: 'URL Shortener', href: '/url-shortener' }
    ],
    resources: [
      { name: 'Help Center', href: '/help' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Blog', href: '/blog' },
      { name: 'FAQ', href: '/faq' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Accessibility', href: '/about#accessibility' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Contact Support', href: '/contact' },
      { name: 'FAQ', href: '/faq' }
    ]
  }

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Naushad ImageToText</h3>
                  <p className="text-sm text-gray-400">Advanced OCR Solutions</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Professional-grade OCR and PDF processing tools built with cutting-edge technology. 
                Extract text from images and documents with high accuracy and speed.
              </p>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-primary-400" />
                <a href="mailto:naushadalamprivate@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  naushadalamprivate@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-primary-400" />
                <a href="tel:+917209752686" className="text-gray-300 hover:text-white transition-colors">
                  +91 7209752686
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">India</span>
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© {currentYear} Naushad ImageToText. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>by</span>
                <span className="text-primary-400 font-medium">Naushad Alam</span>
              </div>
            </div>

          </div>

          {/* Technology Stack & Version */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-col items-center space-y-2 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span>Built with Next.js, TypeScript, Tesseract.js, and Tailwind CSS</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Version:</span>
                  <span className="text-primary-400 font-medium">v{version}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Build:</span>
                  <span className="text-primary-400 font-medium">Auto-Detect System</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Features:</span>
                  <span className="text-primary-400 font-medium">19+ Document Types</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Updated:</span>
                  <span className="text-primary-400 font-medium">{buildDate} {buildTime}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
