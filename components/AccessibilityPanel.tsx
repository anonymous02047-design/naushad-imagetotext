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
  Plus,
  Minus,
  Square,
  Circle,
  Triangle,
  Link,
  Palette
} from 'lucide-react'

interface AccessibilitySettings {
  // Essential settings only
  contrast: 'normal' | 'high'
  highlightLinks: boolean
  invertColors: boolean
  fontSize: 'small' | 'medium' | 'large'
  hideImages: boolean
  bigCursor: boolean
  reducedMotion: boolean
}

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    contrast: 'normal',
    highlightLinks: false,
    invertColors: false,
    fontSize: 'medium',
    hideImages: false,
    bigCursor: false,
    reducedMotion: false
  })

  const applyAccessibilitySettings = useCallback(() => {
    const root = document.documentElement
    
    // Apply CSS variables
    root.style.setProperty('--contrast-level', settings.contrast === 'high' ? '1.5' : '1')
    root.style.setProperty('--highlight-links', settings.highlightLinks ? 'underline' : 'none')
    root.style.setProperty('--invert-colors', settings.invertColors ? '1' : '0')
    
    const fontSizeMap = { small: '14px', medium: '16px', large: '18px' }
    root.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize])
    
    // Apply classes to body
    document.body.className = document.body.className.replace(/accessibility-\w+/g, '').trim()
    
    if (settings.contrast !== 'normal') document.body.classList.add(`accessibility-contrast-${settings.contrast}`)
    if (settings.highlightLinks) document.body.classList.add('accessibility-highlight-links')
    if (settings.invertColors) document.body.classList.add('accessibility-invert-colors')
    if (settings.fontSize !== 'medium') document.body.classList.add(`accessibility-font-${settings.fontSize}`)
    if (settings.hideImages) document.body.classList.add('accessibility-hide-images')
    if (settings.bigCursor) document.body.classList.add('accessibility-big-cursor')
    if (settings.reducedMotion) document.body.classList.add('accessibility-reduced-motion')
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
      fontSize: 'medium',
      hideImages: false,
      bigCursor: false,
      reducedMotion: false
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
      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 min-h-[80px] accessibility-button ${
        isActive 
          ? 'bg-blue-50 border-blue-500 text-blue-700' 
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
      }`}
      title={description || label}
      aria-label={description || label}
    >
      <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
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
        <Accessibility className="w-5 h-5" />
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
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden accessibility-panel"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Accessibility Tools</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetSettings}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset
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
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  
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
                        label="Normal"
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
                    </div>
                  </div>

                  {/* Text Size Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Type className="w-5 h-5 mr-2" />
                      Text Size
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <AccessibilityButton
                        icon={Minus}
                        label="Small"
                        isActive={settings.fontSize === 'small'}
                        onClick={() => updateSetting('fontSize', 'small')}
                        description="Smaller font size"
                      />
                      <AccessibilityButton
                        icon={Type}
                        label="Medium"
                        isActive={settings.fontSize === 'medium'}
                        onClick={() => updateSetting('fontSize', 'medium')}
                        description="Normal font size"
                      />
                      <AccessibilityButton
                        icon={Plus}
                        label="Large"
                        isActive={settings.fontSize === 'large'}
                        onClick={() => updateSetting('fontSize', 'large')}
                        description="Larger font size"
                      />
                    </div>
                  </div>

                  {/* Visual Options Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Visual Options
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <AccessibilityButton
                        icon={Eye}
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
                        icon={Volume2}
                        label="Reduce Motion"
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