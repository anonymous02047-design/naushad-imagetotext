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
  Settings,
  Link,
  RotateCcw,
  Plus,
  Minus,
  AlignLeft,
  AlignCenter,
  Image,
  ImageOff,
  MousePointer2,
  Speaker
} from 'lucide-react'

interface AccessibilitySettings {
  // Color Contrast
  contrast: 'normal' | 'high' | 'extra-high'
  highlightLinks: boolean
  invertColors: boolean
  saturation: 'normal' | 'low' | 'high'
  
  // Text Size
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  textSpacing: 'normal' | 'wide' | 'extra-wide'
  lineHeight: 'normal' | 'wide' | 'extra-wide'
  
  // Others
  hideImages: boolean
  bigCursor: boolean
  screenReader: boolean
  reducedMotion: boolean
  focusIndicators: boolean
  soundEffects: boolean
}

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    // Color Contrast
    contrast: 'normal',
    highlightLinks: false,
    invertColors: false,
    saturation: 'normal',
    
    // Text Size
    fontSize: 'medium',
    textSpacing: 'normal',
    lineHeight: 'normal',
    
    // Others
    hideImages: false,
    bigCursor: false,
    screenReader: false,
    reducedMotion: false,
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
    
    // Font size
    const fontSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    }
    document.body.style.setProperty('font-size', fontSizeMap[newSettings.fontSize], 'important')

    // Text spacing
    const textSpacingMap = {
      'normal': '0px',
      'wide': '0.1em',
      'extra-wide': '0.2em'
    }
    document.body.style.setProperty('letter-spacing', textSpacingMap[newSettings.textSpacing], 'important')

    // Line height
    const lineHeightMap = {
      'normal': '1.5',
      'wide': '1.8',
      'extra-wide': '2.2'
    }
    document.body.style.setProperty('line-height', lineHeightMap[newSettings.lineHeight], 'important')

    // Contrast modes
    root.classList.remove('high-contrast', 'extra-high-contrast')
    if (newSettings.contrast === 'high') {
      root.classList.add('high-contrast')
    } else if (newSettings.contrast === 'extra-high') {
      root.classList.add('extra-high-contrast')
    }

    // Color inversion
    if (newSettings.invertColors) {
      root.classList.add('invert-colors')
    } else {
      root.classList.remove('invert-colors')
    }

    // Saturation
    root.classList.remove('low-saturation', 'high-saturation')
    if (newSettings.saturation === 'low') {
      root.classList.add('low-saturation')
    } else if (newSettings.saturation === 'high') {
      root.classList.add('high-saturation')
    }

    // Link highlighting
    if (newSettings.highlightLinks) {
      root.classList.add('highlight-links')
    } else {
      root.classList.remove('highlight-links')
    }

    // Hide images
    if (newSettings.hideImages) {
      root.classList.add('hide-images')
    } else {
      root.classList.remove('hide-images')
    }

    // Big cursor
    if (newSettings.bigCursor) {
      root.classList.add('big-cursor')
    } else {
      root.classList.remove('big-cursor')
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden mx-2 sm:mx-4"
              role="dialog"
              aria-labelledby="accessibility-title"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
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

              <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Reset Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setSettings({
                          contrast: 'normal',
                          highlightLinks: false,
                          invertColors: false,
                          saturation: 'normal',
                          fontSize: 'medium',
                          textSpacing: 'normal',
                          lineHeight: 'normal',
                          hideImages: false,
                          bigCursor: false,
                          screenReader: false,
                          reducedMotion: false,
                          focusIndicators: true,
                          soundEffects: false
                        })
                        announceToScreenReader('All accessibility settings reset')
                        playSound('click')
                      }}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Reset all settings"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Color Contrast Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Contrast className="w-5 h-5 mr-2 text-primary-600" />
                      Color Contrast
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* High Contrast */}
                      <button
                        onClick={() => {
                          updateSetting('contrast', 'high')
                          announceToScreenReader('High contrast enabled')
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.contrast === 'high'
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="w-6 h-6 mb-2 flex items-center justify-center">
                          <div className="w-4 h-4 bg-gray-800 border-2 border-gray-800"></div>
                        </div>
                        <span className="text-xs font-medium">High Contrast</span>
                      </button>

                      {/* Normal Contrast */}
                      <button
                        onClick={() => {
                          updateSetting('contrast', 'normal')
                          announceToScreenReader('Normal contrast enabled')
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.contrast === 'normal'
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="w-6 h-6 mb-2 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-gray-600"></div>
                        </div>
                        <span className="text-xs font-medium">Normal Contrast</span>
                      </button>

                      {/* Highlight Links */}
                      <button
                        onClick={() => {
                          updateSetting('highlightLinks', !settings.highlightLinks)
                          announceToScreenReader(`Link highlighting ${!settings.highlightLinks ? 'enabled' : 'disabled'}`)
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.highlightLinks
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Link className="w-6 h-6 mb-2" />
                        <span className="text-xs font-medium">Highlight Links</span>
                      </button>

                      {/* Invert Colors */}
                      <button
                        onClick={() => {
                          updateSetting('invertColors', !settings.invertColors)
                          announceToScreenReader(`Color inversion ${!settings.invertColors ? 'enabled' : 'disabled'}`)
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.invertColors
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="w-6 h-6 mb-2 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-black to-white"></div>
                        </div>
                        <span className="text-xs font-medium">Invert</span>
                      </button>

                      {/* Saturation */}
                      <button
                        onClick={() => {
                          const nextSaturation = settings.saturation === 'normal' ? 'low' : settings.saturation === 'low' ? 'high' : 'normal'
                          updateSetting('saturation', nextSaturation)
                          announceToScreenReader(`Saturation set to ${nextSaturation}`)
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.saturation !== 'normal'
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="w-6 h-6 mb-2 flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium">Saturation</span>
                      </button>
                    </div>
                  </div>

                  {/* Text Size Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Type className="w-5 h-5 mr-2 text-primary-600" />
                      Text Size
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* Font Size Increase */}
                      <button
                        onClick={() => {
                          const sizes = ['small', 'medium', 'large', 'extra-large'] as const
                          const currentIndex = sizes.indexOf(settings.fontSize)
                          const nextIndex = Math.min(currentIndex + 1, sizes.length - 1)
                          updateSetting('fontSize', sizes[nextIndex])
                          announceToScreenReader(`Font size increased to ${sizes[nextIndex]}`)
                          playSound('click')
                        }}
                        className="p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex flex-col items-center"
                      >
                        <div className="w-6 h-6 mb-2 flex items-center justify-center">
                          <span className="text-lg font-bold">A</span>
                          <Plus className="w-3 h-3 ml-1" />
                        </div>
                        <span className="text-xs font-medium">Font Size Increase</span>
                      </button>

                      {/* Font Size Decrease */}
                      <button
                        onClick={() => {
                          const sizes = ['small', 'medium', 'large', 'extra-large'] as const
                          const currentIndex = sizes.indexOf(settings.fontSize)
                          const nextIndex = Math.max(currentIndex - 1, 0)
                          updateSetting('fontSize', sizes[nextIndex])
                          announceToScreenReader(`Font size decreased to ${sizes[nextIndex]}`)
                          playSound('click')
                        }}
                        className="p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex flex-col items-center"
                      >
                        <div className="w-6 h-6 mb-2 flex items-center justify-center">
                          <span className="text-lg font-bold">A</span>
                          <Minus className="w-3 h-3 ml-1" />
                        </div>
                        <span className="text-xs font-medium">Font Size Decrease</span>
                      </button>

                      {/* Normal Font */}
                      <button
                        onClick={() => {
                          updateSetting('fontSize', 'medium')
                          announceToScreenReader('Font size reset to normal')
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.fontSize === 'medium'
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="w-6 h-6 mb-2 flex items-center justify-center">
                          <span className="text-lg font-bold">A</span>
                        </div>
                        <span className="text-xs font-medium">Normal Font</span>
                      </button>

                      {/* Text Spacing */}
                      <button
                        onClick={() => {
                          const spacings = ['normal', 'wide', 'extra-wide'] as const
                          const currentIndex = spacings.indexOf(settings.textSpacing)
                          const nextIndex = (currentIndex + 1) % spacings.length
                          updateSetting('textSpacing', spacings[nextIndex])
                          announceToScreenReader(`Text spacing set to ${spacings[nextIndex]}`)
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.textSpacing !== 'normal'
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="w-6 h-6 mb-2 flex items-center justify-center">
                          <AlignLeft className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium">Text Spacing</span>
                      </button>

                      {/* Line Height */}
                      <button
                        onClick={() => {
                          const heights = ['normal', 'wide', 'extra-wide'] as const
                          const currentIndex = heights.indexOf(settings.lineHeight)
                          const nextIndex = (currentIndex + 1) % heights.length
                          updateSetting('lineHeight', heights[nextIndex])
                          announceToScreenReader(`Line height set to ${heights[nextIndex]}`)
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.lineHeight !== 'normal'
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="w-6 h-6 mb-2 flex items-center justify-center">
                          <AlignCenter className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium">Line Height</span>
                      </button>
                    </div>
                  </div>

                  {/* Others Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-primary-600" />
                      Others
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Hide Images */}
                      <button
                        onClick={() => {
                          updateSetting('hideImages', !settings.hideImages)
                          announceToScreenReader(`Images ${!settings.hideImages ? 'hidden' : 'shown'}`)
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.hideImages
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {settings.hideImages ? <ImageOff className="w-6 h-6 mb-2" /> : <Image className="w-6 h-6 mb-2" />}
                        <span className="text-xs font-medium">Hide Images</span>
                      </button>

                      {/* Big Cursor */}
                      <button
                        onClick={() => {
                          updateSetting('bigCursor', !settings.bigCursor)
                          announceToScreenReader(`Big cursor ${!settings.bigCursor ? 'enabled' : 'disabled'}`)
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.bigCursor
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <MousePointer2 className="w-6 h-6 mb-2" />
                        <span className="text-xs font-medium">Big Cursor</span>
                      </button>

                      {/* Screen Reader */}
                      <button
                        onClick={() => {
                          updateSetting('screenReader', !settings.screenReader)
                          announceToScreenReader(`Screen reader support ${!settings.screenReader ? 'enabled' : 'disabled'}`)
                          playSound('click')
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                          settings.screenReader
                            ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Speaker className="w-6 h-6 mb-2" />
                        <span className="text-xs font-medium">Screen Reader</span>
                      </button>
                    </div>
                  </div>

                  {/* Close Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        announceToScreenReader('Accessibility panel closed')
                        playSound('click')
                      }}
                      className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
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
