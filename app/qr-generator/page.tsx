'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import { QrCode, Smartphone, Palette, Download, Zap, Shield, Globe } from 'lucide-react'

export default function QRGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Advanced <span className="text-primary-600 dark:text-primary-400">QR Code</span> Generator
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Create professional QR codes for any purpose. Support for URLs, emails, WiFi, locations, 
              and more with advanced customization options.
            </motion.p>
          </div>

          {/* Main QR Generator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <QRCodeGenerator />
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Why Choose Our QR Generator?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Multiple QR Types</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate QR codes for URLs, emails, phone numbers, WiFi, locations, calendar events, and plain text.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Full Customization</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Customize colors, size, error correction level, and margins to match your brand or design needs.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Export Options</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Download high-quality PNG images or copy QR codes directly to your clipboard for instant use.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Fast Generation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate QR codes instantly with our optimized algorithms and real-time preview.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Privacy First</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All QR code generation happens locally in your browser. No data is sent to external servers.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Universal Compatibility</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Generated QR codes work with all standard QR code readers and mobile devices worldwide.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* QR Code Types Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Supported QR Code Types
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <Smartphone className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Website URLs</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create QR codes that open websites directly in mobile browsers.
                </p>
              </div>

              <div className="card text-center">
                <Smartphone className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Email Addresses</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Generate QR codes that open email clients with pre-filled addresses.
                </p>
              </div>

              <div className="card text-center">
                <Smartphone className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Phone Numbers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create QR codes that initiate phone calls when scanned.
                </p>
              </div>

              <div className="card text-center">
                <Smartphone className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">WiFi Networks</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Generate QR codes that automatically connect devices to WiFi networks.
                </p>
              </div>

              <div className="card text-center">
                <Smartphone className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">SMS Messages</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create QR codes that open SMS with pre-filled phone numbers and messages.
                </p>
              </div>

              <div className="card text-center">
                <Smartphone className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">GPS Locations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Generate QR codes that open maps with specific coordinates.
                </p>
              </div>

              <div className="card text-center">
                <Smartphone className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Calendar Events</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create QR codes that add events to calendar applications.
                </p>
              </div>

              <div className="card text-center">
                <Smartphone className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Plain Text</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Generate QR codes containing any text content for easy sharing.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Use Cases Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Perfect For
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Business & Marketing</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Business cards with contact information</li>
                  <li>• Restaurant menus and ordering systems</li>
                  <li>• Product packaging and labels</li>
                  <li>• Event tickets and invitations</li>
                  <li>• Social media profile links</li>
                  <li>• App store download links</li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Personal & Educational</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• WiFi network sharing</li>
                  <li>• Contact information exchange</li>
                  <li>• Educational materials and resources</li>
                  <li>• Event locations and directions</li>
                  <li>• Personal websites and portfolios</li>
                  <li>• Emergency contact information</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
