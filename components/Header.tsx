'use client'

import { motion } from 'framer-motion'
import { Github, Settings, HelpCircle, Home } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import KeyboardShortcuts from './KeyboardShortcuts'
import AccessibilityPanel from './AccessibilityPanel'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Naushad ImageToText</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Advanced OCR & PDF Converter</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">ImageToText</h1>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-1 sm:space-x-2"
          >
            <Link href="/" className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200" title="Home" aria-label="Go to home page">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <ThemeToggle />
            <AccessibilityPanel />
            <KeyboardShortcuts />
            <button className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200" title="Help" aria-label="Get help">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200" title="Settings" aria-label="Open settings">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200" title="GitHub" aria-label="View on GitHub">
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
