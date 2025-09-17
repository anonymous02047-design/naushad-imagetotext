'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Accessibility, 
  X, 
  Type, 
  Contrast, 
  Volume2, 
  Eye,
  MousePointer2,
  Settings,
  Square,
  Triangle,
  Link,
  Palette,
  RotateCcw,
  ImageOff,
  Zap,
  Sun,
  Volume1,
  Headphones,
  Mic,
  BookOpen,
  Scroll,
  Focus,
  Target,
  Shield,
  Clock,
  Brain,
  Hand,
  Maximize,
  Layout,
  Monitor,
  ZoomIn,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Pin,
  Keyboard
} from 'lucide-react'

interface AccessibilitySettings {
  contrast: 'normal' | 'high' | 'extra-high'
  highlightLinks: boolean
  invertColors: boolean
  fontSize: 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'
  hideImages: boolean
  bigCursor: boolean
  reducedMotion: boolean
  darkMode: boolean
  highContrastText: boolean
  colorBlindSupport: boolean
  dyslexiaFriendly: boolean
  textToSpeech: boolean
  soundEffects: boolean
  audioDescriptions: boolean
  volumeControl: boolean
  voiceCommands: boolean
  keyboardNavigation: boolean
  focusIndicators: boolean
  skipLinks: boolean
  tabOrder: boolean
  arrowKeys: boolean
  readingGuide: boolean
  lineSpacing: 'tight' | 'normal' | 'loose'
  readingMode: boolean
  autoScroll: boolean
  stickyHeaders: boolean
  largeButtons: boolean
  simplifiedLayout: boolean
  touchFriendly: boolean
  hoverEffects: boolean
  timeoutWarning: boolean
  errorPrevention: boolean
  cognitiveLoad: boolean
  memoryAids: boolean
  attentionSupport: boolean
  oneHandedMode: boolean
  switchControl: boolean
  voiceControl: boolean
  eyeTracking: boolean
  headTracking: boolean
  customCSS: boolean
  screenReader: boolean
  magnification: boolean
  colorFilters: boolean
  motionSensitivity: boolean
  seizurePrevention: boolean
}

const initialSettings: AccessibilitySettings = {
  contrast: 'normal',
  highlightLinks: false,
  invertColors: false,
  fontSize: 'medium',
  hideImages: false,
  bigCursor: false,
  reducedMotion: false,
  darkMode: false,
  highContrastText: false,
  colorBlindSupport: false,
  dyslexiaFriendly: false,
  textToSpeech: false,
  soundEffects: false,
  audioDescriptions: false,
  volumeControl: false,
  voiceCommands: false,
  keyboardNavigation: false,
  focusIndicators: false,
  skipLinks: false,
  tabOrder: false,
  arrowKeys: false,
  readingGuide: false,
  lineSpacing: 'normal',
  readingMode: false,
  autoScroll: false,
  stickyHeaders: false,
  largeButtons: false,
  simplifiedLayout: false,
  touchFriendly: false,
  hoverEffects: true,
  timeoutWarning: false,
  errorPrevention: false,
  cognitiveLoad: false,
  memoryAids: false,
  attentionSupport: false,
  oneHandedMode: false,
  switchControl: false,
  voiceControl: false,
  eyeTracking: false,
  headTracking: false,
  customCSS: false,
  screenReader: false,
  magnification: false,
  colorFilters: false,
  motionSensitivity: false,
  seizurePrevention: false
}

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(initialSettings)

  const applyAccessibilitySettings = useCallback(() => {
    const body = document.body
    body.className = body.className.replace(/accessibility-\w+/g, '').trim()
    
    if (settings.contrast === 'high') {
      body.classList.add('accessibility-contrast-high')
    } else if (settings.contrast === 'extra-high') {
      body.classList.add('accessibility-contrast-extra-high')
    }
    
    if (settings.highlightLinks) body.classList.add('accessibility-highlight-links')
    if (settings.invertColors) body.classList.add('accessibility-invert-colors')
    if (settings.fontSize !== 'medium') body.classList.add(`accessibility-font-${settings.fontSize}`)
    if (settings.hideImages) body.classList.add('accessibility-hide-images')
    if (settings.bigCursor) body.classList.add('accessibility-big-cursor')
    if (settings.reducedMotion) body.classList.add('accessibility-reduced-motion')
    if (settings.darkMode) body.classList.add('accessibility-dark-mode')
    if (settings.highContrastText) body.classList.add('accessibility-high-contrast-text')
    if (settings.colorBlindSupport) body.classList.add('accessibility-color-blind-support')
    if (settings.dyslexiaFriendly) body.classList.add('accessibility-dyslexia-friendly')
    if (settings.readingGuide) body.classList.add('accessibility-reading-guide')
    if (settings.readingMode) body.classList.add('accessibility-reading-mode')
    if (settings.autoScroll) body.classList.add('accessibility-auto-scroll')
    if (settings.stickyHeaders) body.classList.add('accessibility-sticky-headers')
    if (settings.largeButtons) body.classList.add('accessibility-large-buttons')
    if (settings.simplifiedLayout) body.classList.add('accessibility-simplified-layout')
    if (settings.touchFriendly) body.classList.add('accessibility-touch-friendly')
    if (!settings.hoverEffects) body.classList.add('accessibility-no-hover')
    if (settings.timeoutWarning) body.classList.add('accessibility-timeout-warning')
    if (settings.errorPrevention) body.classList.add('accessibility-error-prevention')
    if (settings.cognitiveLoad) body.classList.add('accessibility-cognitive-load')
    if (settings.memoryAids) body.classList.add('accessibility-memory-aids')
    if (settings.attentionSupport) body.classList.add('accessibility-attention-support')
    if (settings.oneHandedMode) body.classList.add('accessibility-one-handed')
    if (settings.switchControl) body.classList.add('accessibility-switch-control')
    if (settings.voiceControl) body.classList.add('accessibility-voice-control')
    if (settings.eyeTracking) body.classList.add('accessibility-eye-tracking')
    if (settings.headTracking) body.classList.add('accessibility-head-tracking')
    if (settings.magnification) body.classList.add('accessibility-magnification')
    if (settings.colorFilters) body.classList.add('accessibility-color-filters')
    if (settings.motionSensitivity) body.classList.add('accessibility-motion-sensitivity')
    if (settings.seizurePrevention) body.classList.add('accessibility-seizure-prevention')
    
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings')
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings({ ...initialSettings, ...parsedSettings })
      } catch (error) {
        console.error('Error parsing saved accessibility settings:', error)
      }
    }
  }, [])

  useEffect(() => {
    applyAccessibilitySettings()
  }, [applyAccessibilitySettings])

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(initialSettings)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const accessibilityOptions = [
    { key: 'contrast', label: 'High Contrast', icon: Contrast, type: 'select', options: ['normal', 'high', 'extra-high'] },
    { key: 'highlightLinks', label: 'Highlight Links', icon: Link, type: 'toggle' },
    { key: 'invertColors', label: 'Invert Colors', icon: Triangle, type: 'toggle' },
    { key: 'fontSize', label: 'Font Size', icon: Type, type: 'select', options: ['xs', 'small', 'medium', 'large', 'xl', 'xxl'] },
    { key: 'hideImages', label: 'Hide Images', icon: ImageOff, type: 'toggle' },
    { key: 'bigCursor', label: 'Big Cursor', icon: MousePointer2, type: 'toggle' },
    { key: 'reducedMotion', label: 'Reduce Motion', icon: Zap, type: 'toggle' },
    { key: 'darkMode', label: 'Dark Mode', icon: Sun, type: 'toggle' },
    { key: 'highContrastText', label: 'High Contrast Text', icon: Eye, type: 'toggle' },
    { key: 'colorBlindSupport', label: 'Color Blind', icon: Palette, type: 'toggle' },
    { key: 'dyslexiaFriendly', label: 'Dyslexia', icon: BookOpen, type: 'toggle' },
    { key: 'textToSpeech', label: 'Text to Speech', icon: Volume2, type: 'toggle' },
    { key: 'soundEffects', label: 'Sound Effects', icon: Volume1, type: 'toggle' },
    { key: 'audioDescriptions', label: 'Audio Descriptions', icon: Headphones, type: 'toggle' },
    { key: 'volumeControl', label: 'Volume Control', icon: Volume1, type: 'toggle' },
    { key: 'voiceCommands', label: 'Voice Commands', icon: Mic, type: 'toggle' },
    { key: 'keyboardNavigation', label: 'Keyboard Nav', icon: Keyboard, type: 'toggle' },
    { key: 'focusIndicators', label: 'Focus Indicators', icon: Focus, type: 'toggle' },
    { key: 'skipLinks', label: 'Skip Links', icon: ArrowUp, type: 'toggle' },
    { key: 'tabOrder', label: 'Tab Order', icon: ArrowRight, type: 'toggle' },
    { key: 'arrowKeys', label: 'Arrow Keys', icon: ArrowLeft, type: 'toggle' },
    { key: 'readingGuide', label: 'Reading Guide', icon: Scroll, type: 'toggle' },
    { key: 'lineSpacing', label: 'Line Spacing', icon: Type, type: 'select', options: ['tight', 'normal', 'loose'] },
    { key: 'readingMode', label: 'Reading Mode', icon: BookOpen, type: 'toggle' },
    { key: 'autoScroll', label: 'Auto Scroll', icon: ArrowDown, type: 'toggle' },
    { key: 'stickyHeaders', label: 'Sticky Headers', icon: Pin, type: 'toggle' },
    { key: 'largeButtons', label: 'Large Buttons', icon: Maximize, type: 'toggle' },
    { key: 'simplifiedLayout', label: 'Simple Layout', icon: Layout, type: 'toggle' },
    { key: 'touchFriendly', label: 'Touch Friendly', icon: Hand, type: 'toggle' },
    { key: 'hoverEffects', label: 'Hover Effects', icon: MousePointer2, type: 'toggle' },
    { key: 'timeoutWarning', label: 'Timeout Warning', icon: Clock, type: 'toggle' },
    { key: 'errorPrevention', label: 'Error Prevention', icon: Shield, type: 'toggle' },
    { key: 'cognitiveLoad', label: 'Reduce Load', icon: Brain, type: 'toggle' },
    { key: 'memoryAids', label: 'Memory Aids', icon: Target, type: 'toggle' },
    { key: 'attentionSupport', label: 'Attention Support', icon: Target, type: 'toggle' },
    { key: 'oneHandedMode', label: 'One Handed', icon: Hand, type: 'toggle' },
    { key: 'switchControl', label: 'Switch Control', icon: Target, type: 'toggle' },
    { key: 'voiceControl', label: 'Voice Control', icon: Mic, type: 'toggle' },
    { key: 'eyeTracking', label: 'Eye Tracking', icon: Eye, type: 'toggle' },
    { key: 'headTracking', label: 'Head Tracking', icon: Hand, type: 'toggle' },
    { key: 'customCSS', label: 'Custom CSS', icon: Settings, type: 'toggle' },
    { key: 'screenReader', label: 'Screen Reader', icon: Monitor, type: 'toggle' },
    { key: 'magnification', label: 'Magnification', icon: ZoomIn, type: 'toggle' },
    { key: 'colorFilters', label: 'Color Filters', icon: Palette, type: 'toggle' },
    { key: 'motionSensitivity', label: 'Motion Sensitivity', icon: Zap, type: 'toggle' },
    { key: 'seizurePrevention', label: 'Seizure Prevention', icon: Shield, type: 'toggle' }
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Open accessibility tools"
        title="Accessibility Tools"
      >
        <Accessibility className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end p-2"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="bg-white rounded-l-xl shadow-2xl w-full max-w-md h-full overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Accessibility</h2>
                  <p className="text-xs text-gray-500">{accessibilityOptions.length} Options Available</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetSettings}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Reset all settings"
                    title="Reset"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close accessibility panel"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
                <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>{accessibilityOptions.length} Accessibility Options</strong> - Scroll to see all options
                  </p>
                </div>
                <div className="space-y-2">
                  {accessibilityOptions.map((option, index) => (
                    <div key={option.key} className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                      option.type === 'toggle' && settings[option.key as keyof AccessibilitySettings] 
                        ? 'bg-blue-50 border border-blue-200' 
                        : ''
                    }`}>
                      <div className="flex items-center space-x-2 flex-1">
                        <option.icon className={`w-4 h-4 ${
                          option.type === 'toggle' && settings[option.key as keyof AccessibilitySettings]
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          option.type === 'toggle' && settings[option.key as keyof AccessibilitySettings]
                            ? 'text-blue-700'
                            : 'text-gray-700'
                        }`}>{option.label}</span>
                        {option.type === 'toggle' && settings[option.key as keyof AccessibilitySettings] && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">ON</span>
                        )}
                      </div>
                      
                      {option.type === 'toggle' ? (
                        <button
                          onClick={() => updateSetting(option.key as keyof AccessibilitySettings, !settings[option.key as keyof AccessibilitySettings])}
                          className={`w-8 h-4 rounded-full transition-colors ${
                            settings[option.key as keyof AccessibilitySettings] 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                            settings[option.key as keyof AccessibilitySettings] 
                              ? 'transform translate-x-4' 
                              : 'transform translate-x-0.5'
                          }`} />
                        </button>
                      ) : (
                        <select
                          value={settings[option.key as keyof AccessibilitySettings] as string}
                          onChange={(e) => updateSetting(option.key as keyof AccessibilitySettings, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          {option.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Done
                  </button>
                  <button
                    onClick={resetSettings}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
