'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Accessibility, 
  X, 
  Type, 
  Contrast, 
  Volume2, 
  VolumeX,
  Eye,
  EyeOff,
  MousePointer,
  Keyboard,
  Settings
} from 'lucide-react'

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  contrast: 'normal' | 'high' | 'extra-high'
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  focusIndicators: boolean
  soundEffects: boolean
}

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    contrast: 'normal',
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    soundEffects: false
  })

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage and apply them
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
    applyAccessibilitySettings(settings)
  }, [settings])

  const applyAccessibilitySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement
    
    // Font size - apply to body instead of root to avoid conflicts
    const fontSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    }
    document.body.style.fontSize = fontSizeMap[newSettings.fontSize]

    // Contrast - remove all contrast classes first, then add the selected one
    root.classList.remove('high-contrast', 'extra-high-contrast')
    if (newSettings.contrast === 'high') {
      root.classList.add('high-contrast')
    } else if (newSettings.contrast === 'extra-high') {
      root.classList.add('extra-high-contrast')
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Focus indicators
    if (newSettings.focusIndicators) {
      root.classList.add('enhanced-focus')
    } else {
      root.classList.remove('enhanced-focus')
    }

    // Screen reader announcements - don't set on root, handle in component
    // This prevents conflicts with other components
  }

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const announceToScreenReader = (message: string) => {
    if (settings.screenReader) {
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'assertive')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      document.body.appendChild(announcement)
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement)
        }
      }, 1000)
    }
  }

  // ESC key handler
  const handleEscKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false)
      announceToScreenReader('Accessibility panel closed')
      playSound('click')
    }
  }, [isOpen])

  // Add/remove ESC key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleEscKey)
      // Restore body scroll
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscKey])

  const playSound = (type: 'success' | 'error' | 'click') => {
    if (settings.soundEffects) {
      // Simple sound effects using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      const frequencies = {
        success: 800,
        error: 400,
        click: 600
      }
      
      oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true)
          announceToScreenReader('Accessibility panel opened')
          playSound('click')
        }}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        title="Accessibility options"
        aria-label="Open accessibility panel"
      >
        <Accessibility className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false)
                announceToScreenReader('Accessibility panel closed')
                playSound('click')
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-hidden mx-4"
              role="dialog"
              aria-labelledby="accessibility-title"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 
                  id="accessibility-title"
                  className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"
                >
                  <Accessibility className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Accessibility Options
                </h2>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    announceToScreenReader('Accessibility panel closed')
                    playSound('click')
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Close accessibility panel"
                  title="Close (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
                <div className="space-y-4 sm:space-y-6">
                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Type className="w-4 h-4 inline mr-2" />
                      Font Size
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            updateSetting('fontSize', size)
                            announceToScreenReader(`Font size changed to ${size}`)
                            playSound('click')
                          }}
                          className={`p-2 sm:p-3 rounded-lg border transition-colors ${
                            settings.fontSize === size
                              ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                              : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                          aria-pressed={settings.fontSize === size}
                        >
                          <div className="text-center">
                            <div className="font-semibold capitalize text-xs sm:text-sm">{size}</div>
                            <div className="text-xs opacity-75">
                              {size === 'small' && '14px'}
                              {size === 'medium' && '16px'}
                              {size === 'large' && '18px'}
                              {size === 'extra-large' && '20px'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Contrast className="w-4 h-4 inline mr-2" />
                      Contrast Level
                    </label>
                    <div className="space-y-2">
                      {(['normal', 'high', 'extra-high'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            updateSetting('contrast', level)
                            announceToScreenReader(`Contrast changed to ${level}`)
                            playSound('click')
                          }}
                          className={`w-full p-2 sm:p-3 rounded-lg border transition-colors text-left ${
                            settings.contrast === level
                              ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                              : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                          aria-pressed={settings.contrast === level}
                        >
                          <div className="font-semibold capitalize text-sm">{level} Contrast</div>
                          <div className="text-xs opacity-75 mt-1">
                            {level === 'normal' && 'Standard contrast for comfortable reading'}
                            {level === 'high' && 'Enhanced contrast for better visibility'}
                            {level === 'extra-high' && 'Maximum contrast for accessibility'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Additional Options
                    </h3>
                    
                    {[
                      {
                        key: 'reducedMotion' as const,
                        label: 'Reduce Motion',
                        description: 'Minimize animations and transitions',
                        icon: settings.reducedMotion ? EyeOff : Eye
                      },
                      {
                        key: 'screenReader' as const,
                        label: 'Screen Reader Support',
                        description: 'Enhanced announcements for screen readers',
                        icon: Volume2
                      },
                      {
                        key: 'keyboardNavigation' as const,
                        label: 'Enhanced Keyboard Navigation',
                        description: 'Improved keyboard navigation support',
                        icon: Keyboard
                      },
                      {
                        key: 'focusIndicators' as const,
                        label: 'Enhanced Focus Indicators',
                        description: 'More visible focus indicators',
                        icon: MousePointer
                      },
                      {
                        key: 'soundEffects' as const,
                        label: 'Sound Effects',
                        description: 'Audio feedback for interactions',
                        icon: settings.soundEffects ? Volume2 : VolumeX
                      }
                    ].map((option) => (
                      <div key={option.key} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <option.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                              {option.label}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              {option.description}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            updateSetting(option.key, !settings[option.key])
                            announceToScreenReader(`${option.label} ${!settings[option.key] ? 'enabled' : 'disabled'}`)
                            playSound('click')
                          }}
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                            settings[option.key]
                              ? 'bg-primary-600'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          role="switch"
                          aria-checked={settings[option.key]}
                          aria-label={`Toggle ${option.label}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              settings[option.key] ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Accessibility Info */}
                  <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-2 text-sm sm:text-base">Accessibility Features:</p>
                      <ul className="space-y-1 text-xs sm:text-sm">
                        <li>• Adjustable font sizes for better readability</li>
                        <li>• High contrast modes for visual accessibility</li>
                        <li>• Reduced motion for users with vestibular disorders</li>
                        <li>• Enhanced keyboard navigation support</li>
                        <li>• Screen reader announcements</li>
                        <li>• Audio feedback for interactions</li>
                        <li>• WCAG 2.1 AA compliant design</li>
                      </ul>
                    </div>
                  </div>

                  {/* Close Button */}
                  <div className="flex justify-end pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        announceToScreenReader('Accessibility panel closed')
                        playSound('click')
                      }}
                      className="px-4 sm:px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                      aria-label="Close accessibility panel"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
