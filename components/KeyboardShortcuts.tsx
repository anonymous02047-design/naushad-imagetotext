'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'

const SHORTCUTS_LIST = [
  { key: 'Ctrl + U', description: 'Upload image' },
  { key: 'Ctrl + Shift + C', description: 'Copy text to clipboard' },
  { key: 'Ctrl + D', description: 'Download text' },
  { key: 'Ctrl + S', description: 'Take screenshot' },
  { key: 'Ctrl + R', description: 'Clear all data' },
  { key: 'Ctrl + H', description: 'Show this help' },
  { key: 'Esc', description: 'Close dialogs' },
  { key: 'Tab', description: 'Navigate between elements' },
  { key: 'Enter', description: 'Activate focused element' },
  { key: 'Space', description: 'Toggle checkboxes/buttons' },
]

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        title="Keyboard shortcuts (Ctrl + H)"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Keyboard className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="space-y-3">
                  {SHORTCUTS_LIST.map((shortcut, index) => (
                    <motion.div
                      key={shortcut.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-mono rounded border border-gray-300 dark:border-gray-500">
                        {shortcut.key}
                      </kbd>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> These shortcuts work globally when the app is focused. 
                    Use them to speed up your workflow!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
