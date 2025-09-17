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
  Speaker,
  BookOpen,
  Mic,
  Scroll,
  Pin,
  Sun,
  Moon,
  Zap,
  Maximize,
  Minimize,
  Hand,
  Clock,
  Shield,
  Brain,
  Palette,
  Volume1,
  ChevronDown,
  ChevronUp,
  Square,
  Circle,
  Triangle
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
  
  // Visual Accessibility
  hideImages: boolean
  bigCursor: boolean
  screenReader: boolean
  reducedMotion: boolean
  focusIndicators: boolean
  soundEffects: boolean
  
  // Additional Accessibility Features
  dyslexiaFriendly: boolean
  colorBlindSupport: boolean
  readingGuide: boolean
  textToSpeech: boolean
  autoScroll: boolean
  stickyHeaders: boolean
  readingMode: boolean
  darkMode: boolean
  highContrastText: boolean
  largeButtons: boolean
  simplifiedLayout: boolean
  voiceCommands: boolean
  gestureNavigation: boolean
  timeOutWarning: boolean
  errorPrevention: boolean
  cognitiveLoad: boolean
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
    
    // Visual Accessibility
    hideImages: false,
    bigCursor: false,
    screenReader: false,
    reducedMotion: false,
    focusIndicators: true,
    soundEffects: false,
    
    // Additional Features
    dyslexiaFriendly: false,
    colorBlindSupport: false,
    readingGuide: false,
    textToSpeech: false,
    autoScroll: false,
    stickyHeaders: false,
    readingMode: false,
    darkMode: false,
    highContrastText: false,
    largeButtons: false,
    simplifiedLayout: false,
    voiceCommands: false,
    gestureNavigation: false,
    timeOutWarning: false,
    errorPrevention: false,
    cognitiveLoad: false
  })

  const applyAccessibilitySettings = useCallback(() => {
    const root = document.documentElement
    
    // Color Contrast
    root.style.setProperty('--contrast-level', settings.contrast === 'high' ? '1.5' : settings.contrast === 'extra-high' ? '2' : '1')
    root.style.setProperty('--highlight-links', settings.highlightLinks ? 'underline' : 'none')
    root.style.setProperty('--invert-colors', settings.invertColors ? '1' : '0')
    root.style.setProperty('--saturation', settings.saturation === 'low' ? '0.5' : settings.saturation === 'high' ? '1.5' : '1')
    
    // Text Size
    const fontSizeMap = { small: '14px', medium: '16px', large: '18px', 'extra-large': '20px' }
    root.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize])
    
    // Text Spacing
    const spacingMap = { normal: '1', wide: '1.5', 'extra-wide': '2' }
    root.style.setProperty('--text-spacing', spacingMap[settings.textSpacing])
    root.style.setProperty('--line-height', spacingMap[settings.lineHeight])
    
    // Visual Accessibility
    root.style.setProperty('--hide-images', settings.hideImages ? 'none' : 'block')
    root.style.setProperty('--big-cursor', settings.bigCursor ? 'pointer' : 'default')
    root.style.setProperty('--reduced-motion', settings.reducedMotion ? 'reduce' : 'auto')
    root.style.setProperty('--focus-indicators', settings.focusIndicators ? '2px solid #3b82f6' : 'none')
    root.style.setProperty('--sound-effects', settings.soundEffects ? '1' : '0')
    
    // Additional Features
    root.style.setProperty('--dyslexia-friendly', settings.dyslexiaFriendly ? '1' : '0')
    root.style.setProperty('--color-blind-support', settings.colorBlindSupport ? '1' : '0')
    root.style.setProperty('--reading-guide', settings.readingGuide ? '1' : '0')
    root.style.setProperty('--text-to-speech', settings.textToSpeech ? '1' : '0')
    root.style.setProperty('--auto-scroll', settings.autoScroll ? '1' : '0')
    root.style.setProperty('--sticky-headers', settings.stickyHeaders ? '1' : '0')
    root.style.setProperty('--reading-mode', settings.readingMode ? '1' : '0')
    root.style.setProperty('--dark-mode', settings.darkMode ? '1' : '0')
    root.style.setProperty('--high-contrast-text', settings.highContrastText ? '1' : '0')
    root.style.setProperty('--large-buttons', settings.largeButtons ? '1' : '0')
    root.style.setProperty('--simplified-layout', settings.simplifiedLayout ? '1' : '0')
    root.style.setProperty('--voice-commands', settings.voiceCommands ? '1' : '0')
    root.style.setProperty('--gesture-navigation', settings.gestureNavigation ? '1' : '0')
    root.style.setProperty('--timeout-warning', settings.timeOutWarning ? '1' : '0')
    root.style.setProperty('--error-prevention', settings.errorPrevention ? '1' : '0')
    root.style.setProperty('--cognitive-load', settings.cognitiveLoad ? '1' : '0')
    
    // Apply classes to body
    document.body.className = document.body.className.replace(/accessibility-\w+/g, '').trim()
    
    if (settings.contrast !== 'normal') document.body.classList.add(`accessibility-contrast-${settings.contrast}`)
    if (settings.highlightLinks) document.body.classList.add('accessibility-highlight-links')
    if (settings.invertColors) document.body.classList.add('accessibility-invert-colors')
    if (settings.saturation !== 'normal') document.body.classList.add(`accessibility-saturation-${settings.saturation}`)
    if (settings.fontSize !== 'medium') document.body.classList.add(`accessibility-font-${settings.fontSize}`)
    if (settings.textSpacing !== 'normal') document.body.classList.add(`accessibility-spacing-${settings.textSpacing}`)
    if (settings.lineHeight !== 'normal') document.body.classList.add(`accessibility-line-height-${settings.lineHeight}`)
    if (settings.hideImages) document.body.classList.add('accessibility-hide-images')
    if (settings.bigCursor) document.body.classList.add('accessibility-big-cursor')
    if (settings.screenReader) document.body.classList.add('accessibility-screen-reader')
    if (settings.reducedMotion) document.body.classList.add('accessibility-reduced-motion')
    if (!settings.focusIndicators) document.body.classList.add('accessibility-no-focus')
    if (settings.soundEffects) document.body.classList.add('accessibility-sound-effects')
    if (settings.dyslexiaFriendly) document.body.classList.add('accessibility-dyslexia-friendly')
    if (settings.colorBlindSupport) document.body.classList.add('accessibility-color-blind-support')
    if (settings.readingGuide) document.body.classList.add('accessibility-reading-guide')
    if (settings.textToSpeech) document.body.classList.add('accessibility-text-to-speech')
    if (settings.autoScroll) document.body.classList.add('accessibility-auto-scroll')
    if (settings.stickyHeaders) document.body.classList.add('accessibility-sticky-headers')
    if (settings.readingMode) document.body.classList.add('accessibility-reading-mode')
    if (settings.darkMode) document.body.classList.add('accessibility-dark-mode')
    if (settings.highContrastText) document.body.classList.add('accessibility-high-contrast-text')
    if (settings.largeButtons) document.body.classList.add('accessibility-large-buttons')
    if (settings.simplifiedLayout) document.body.classList.add('accessibility-simplified-layout')
    if (settings.voiceCommands) document.body.classList.add('accessibility-voice-commands')
    if (settings.gestureNavigation) document.body.classList.add('accessibility-gesture-navigation')
    if (settings.timeOutWarning) document.body.classList.add('accessibility-timeout-warning')
    if (settings.errorPrevention) document.body.classList.add('accessibility-error-prevention')
    if (settings.cognitiveLoad) document.body.classList.add('accessibility-cognitive-load')
  }, [settings])

  useEffect(() => {
    applyAccessibilitySettings()
  }, [applyAccessibilitySettings])

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
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
      soundEffects: false,
      dyslexiaFriendly: false,
      colorBlindSupport: false,
      readingGuide: false,
      textToSpeech: false,
      autoScroll: false,
      stickyHeaders: false,
      readingMode: false,
      darkMode: false,
      highContrastText: false,
      largeButtons: false,
      simplifiedLayout: false,
      voiceCommands: false,
      gestureNavigation: false,
      timeOutWarning: false,
      errorPrevention: false,
      cognitiveLoad: false
    })
  }

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const AccessibilityButton = ({ 
    icon: Icon, 
    label, 
    isActive, 
    onClick, 
    description 
  }: { 
    icon: any, 
    label: string, 
    isActive: boolean, 
    onClick: () => void,
    description?: string
  }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
        isActive 
          ? 'bg-blue-50 border-blue-500 text-blue-700' 
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
      }`}
      title={description || label}
      aria-label={description || label}
    >
      <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
      <span className="text-xs font-medium text-center leading-tight">{label}</span>
    </button>
  )

  return (
    <>
      {/* Accessibility Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Open accessibility tools"
        title="Accessibility Tools"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Accessibility Tools</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetSettings}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close accessibility panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-8">
                  
                  {/* Color Contrast Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Contrast className="w-5 h-5 mr-2" />
                      Color Contrast
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      <AccessibilityButton
                        icon={Square}
                        label="High Contrast"
                        isActive={settings.contrast === 'high'}
                        onClick={() => updateSetting('contrast', settings.contrast === 'high' ? 'normal' : 'high')}
                        description="Increase color contrast for better visibility"
                      />
                      <AccessibilityButton
                        icon={Circle}
                        label="Normal Contrast"
                        isActive={settings.contrast === 'normal'}
                        onClick={() => updateSetting('contrast', 'normal')}
                        description="Standard color contrast"
                      />
                      <AccessibilityButton
                        icon={Link}
                        label="Highlight Links"
                        isActive={settings.highlightLinks}
                        onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                        description="Highlight all links with underlines"
                      />
                      <AccessibilityButton
                        icon={Triangle}
                        label="Invert"
                        isActive={settings.invertColors}
                        onClick={() => updateSetting('invertColors', !settings.invertColors)}
                        description="Invert colors for better contrast"
                      />
                      <AccessibilityButton
                        icon={Palette}
                        label="Saturation"
                        isActive={settings.saturation !== 'normal'}
                        onClick={() => updateSetting('saturation', settings.saturation === 'normal' ? 'low' : 'normal')}
                        description="Adjust color saturation"
                      />
                    </div>
                  </div>

                  {/* Text Size Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Type className="w-5 h-5 mr-2" />
                      Text Size
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      <AccessibilityButton
                        icon={Plus}
                        label="A+ (Font Size Increase)"
                        isActive={settings.fontSize === 'large' || settings.fontSize === 'extra-large'}
                        onClick={() => updateSetting('fontSize', settings.fontSize === 'extra-large' ? 'large' : 'extra-large')}
                        description="Increase font size"
                      />
                      <AccessibilityButton
                        icon={Minus}
                        label="A- (Font Size Decrease)"
                        isActive={settings.fontSize === 'small'}
                        onClick={() => updateSetting('fontSize', 'small')}
                        description="Decrease font size"
                      />
                      <AccessibilityButton
                        icon={Type}
                        label="A (Normal Font)"
                        isActive={settings.fontSize === 'medium'}
                        onClick={() => updateSetting('fontSize', 'medium')}
                        description="Normal font size"
                      />
                      <AccessibilityButton
                        icon={AlignLeft}
                        label="Text Spacing"
                        isActive={settings.textSpacing !== 'normal'}
                        onClick={() => updateSetting('textSpacing', settings.textSpacing === 'normal' ? 'wide' : 'normal')}
                        description="Adjust text spacing"
                      />
                      <AccessibilityButton
                        icon={AlignCenter}
                        label="Line Height"
                        isActive={settings.lineHeight !== 'normal'}
                        onClick={() => updateSetting('lineHeight', settings.lineHeight === 'normal' ? 'wide' : 'normal')}
                        description="Adjust line height"
                      />
                    </div>
                  </div>

                  {/* Others Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Others
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      <AccessibilityButton
                        icon={ImageOff}
                        label="Hide Images"
                        isActive={settings.hideImages}
                        onClick={() => updateSetting('hideImages', !settings.hideImages)}
                        description="Hide all images to reduce distractions"
                      />
                      <AccessibilityButton
                        icon={MousePointer2}
                        label="Big Cursor"
                        isActive={settings.bigCursor}
                        onClick={() => updateSetting('bigCursor', !settings.bigCursor)}
                        description="Enlarge cursor for better visibility"
                      />
                      <AccessibilityButton
                        icon={Speaker}
                        label="Screen Reader"
                        isActive={settings.screenReader}
                        onClick={() => updateSetting('screenReader', !settings.screenReader)}
                        description="Enable screen reader support"
                      />
                      <AccessibilityButton
                        icon={Eye}
                        label="Focus Indicators"
                        isActive={settings.focusIndicators}
                        onClick={() => updateSetting('focusIndicators', !settings.focusIndicators)}
                        description="Show focus indicators"
                      />
                      <AccessibilityButton
                        icon={Volume2}
                        label="Sound Effects"
                        isActive={settings.soundEffects}
                        onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
                        description="Enable sound effects"
                      />
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Advanced Options
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      <AccessibilityButton
                        icon={BookOpen}
                        label="Reading Mode"
                        isActive={settings.readingMode}
                        onClick={() => updateSetting('readingMode', !settings.readingMode)}
                        description="Optimize layout for reading"
                      />
                      <AccessibilityButton
                        icon={Mic}
                        label="Text to Speech"
                        isActive={settings.textToSpeech}
                        onClick={() => updateSetting('textToSpeech', !settings.textToSpeech)}
                        description="Convert text to speech"
                      />
                      <AccessibilityButton
                        icon={Moon}
                        label="Dark Mode"
                        isActive={settings.darkMode}
                        onClick={() => updateSetting('darkMode', !settings.darkMode)}
                        description="Switch to dark theme"
                      />
                      <AccessibilityButton
                        icon={Zap}
                        label="Reduced Motion"
                        isActive={settings.reducedMotion}
                        onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                        description="Reduce animations and motion"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
