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
  Palette,
  RotateCcw,
  ImageOff,
  Zap,
  Sun,
  Moon,
  VolumeX,
  Volume1,
  Headphones,
  Mic,
  MicOff,
  Play,
  Pause,
  BookOpen,
  Scroll,
  Focus,
  Target,
  Shield,
  AlertTriangle,
  Clock,
  Brain,
  Hand,
  EyeOff,
  Maximize,
  Minimize,
  Grid3X3,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Battery,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share,
  Download,
  Upload,
  Save,
  Trash2,
  Edit,
  Copy,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Users,
  Home,
  Building,
  Car,
  Plane,
  Train,
  Bus,
  Bike,
  Navigation,
  Compass,
  Globe,
  Bluetooth,
  Camera,
  Video,
  Music,
  Speaker,
  Repeat,
  Shuffle,
  Bookmark,
  Flag,
  Tag,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  RefreshCw,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Scale,
  Crop,
  Scissors,
  Eraser,
  Pen,
  Pencil,
  Highlighter,
  Paintbrush,
  Droplets,
  Layers,
  FileImage,
  FileText,
  File,
  Folder,
  FolderOpen,
  Archive,
  Database,
  Server,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sunrise,
  Sunset,
  Thermometer,
  Droplet,
  Wind,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  Barcode,
  CreditCard,
  Wallet,
  Banknote,
  Coins,
  Receipt,
  ShoppingCart,
  ShoppingBag,
  Package,
  Truck,
  Box,
  Container,
  Warehouse,
  Store,
  Map,
  MapPinned,
  Route,
  Milestone,
  Crosshair,
  Lightbulb,
  Snowflake,
  Umbrella,
  Tornado,
  Mountain,
  Trees,
  Leaf,
  Flower,
  TreePine,
  TreeDeciduous,
  Wheat,
  Carrot,
  Apple,
  Banana,
  Cherry,
  Grape,
  Pin,
  Keyboard
} from 'lucide-react'

interface AccessibilitySettings {
  // Visual Settings
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
  
  // Audio Settings
  textToSpeech: boolean
  soundEffects: boolean
  audioDescriptions: boolean
  volumeControl: boolean
  voiceCommands: boolean
  
  // Navigation Settings
  keyboardNavigation: boolean
  focusIndicators: boolean
  skipLinks: boolean
  tabOrder: boolean
  arrowKeys: boolean
  
  // Reading Settings
  readingGuide: boolean
  lineSpacing: 'tight' | 'normal' | 'loose'
  wordSpacing: 'tight' | 'normal' | 'loose'
  letterSpacing: 'tight' | 'normal' | 'loose'
  readingMode: boolean
  autoScroll: boolean
  stickyHeaders: boolean
  
  // Interaction Settings
  largeButtons: boolean
  simplifiedLayout: boolean
  gestureNavigation: boolean
  touchFriendly: boolean
  hoverEffects: boolean
  
  // Cognitive Settings
  timeoutWarning: boolean
  errorPrevention: boolean
  cognitiveLoad: boolean
  memoryAids: boolean
  attentionSupport: boolean
  
  // Motor Settings
  oneHandedMode: boolean
  switchControl: boolean
  voiceControl: boolean
  eyeTracking: boolean
  headTracking: boolean
  
  // Advanced Settings
  customCSS: boolean
  browserExtensions: boolean
  assistiveTechnology: boolean
  screenReader: boolean
  magnification: boolean
  colorFilters: boolean
  motionSensitivity: boolean
  seizurePrevention: boolean
}

const initialSettings: AccessibilitySettings = {
  // Visual Settings
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
  
  // Audio Settings
  textToSpeech: false,
  soundEffects: false,
  audioDescriptions: false,
  volumeControl: false,
  voiceCommands: false,
  
  // Navigation Settings
  keyboardNavigation: false,
  focusIndicators: false,
  skipLinks: false,
  tabOrder: false,
  arrowKeys: false,
  
  // Reading Settings
  readingGuide: false,
  lineSpacing: 'normal',
  wordSpacing: 'normal',
  letterSpacing: 'normal',
  readingMode: false,
  autoScroll: false,
  stickyHeaders: false,
  
  // Interaction Settings
  largeButtons: false,
  simplifiedLayout: false,
  gestureNavigation: false,
  touchFriendly: false,
  hoverEffects: true,
  
  // Cognitive Settings
  timeoutWarning: false,
  errorPrevention: false,
  cognitiveLoad: false,
  memoryAids: false,
  attentionSupport: false,
  
  // Motor Settings
  oneHandedMode: false,
  switchControl: false,
  voiceControl: false,
  eyeTracking: false,
  headTracking: false,
  
  // Advanced Settings
  customCSS: false,
  browserExtensions: false,
  assistiveTechnology: false,
  screenReader: false,
  magnification: false,
  colorFilters: false,
  motionSensitivity: false,
  seizurePrevention: false
}

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(initialSettings)
  const [activeCategory, setActiveCategory] = useState<string>('visual')

  const applyAccessibilitySettings = useCallback(() => {
    const root = document.documentElement
    const body = document.body
    
    // Reset all classes
    body.className = body.className.replace(/accessibility-\w+/g, '').trim()
    
    // Visual Settings
    if (settings.contrast === 'high') {
      root.style.setProperty('--contrast-level', '1.5')
      body.classList.add('accessibility-contrast-high')
    } else if (settings.contrast === 'extra-high') {
      root.style.setProperty('--contrast-level', '2')
      body.classList.add('accessibility-contrast-extra-high')
    } else {
      root.style.setProperty('--contrast-level', '1')
    }
    
    if (settings.highlightLinks) {
      body.classList.add('accessibility-highlight-links')
    }
    
    if (settings.invertColors) {
      body.classList.add('accessibility-invert-colors')
    }
    
    const fontSizeMap = { 
      xs: '12px', 
      small: '14px', 
      medium: '16px', 
      large: '18px', 
      xl: '20px', 
      xxl: '24px' 
    }
    root.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize])
    
    if (settings.fontSize !== 'medium') {
      body.classList.add(`accessibility-font-${settings.fontSize}`)
    }
    
    if (settings.hideImages) {
      body.classList.add('accessibility-hide-images')
    }
    
    if (settings.bigCursor) {
      body.classList.add('accessibility-big-cursor')
    }
    
    if (settings.reducedMotion) {
      body.classList.add('accessibility-reduced-motion')
    }
    
    if (settings.darkMode) {
      body.classList.add('accessibility-dark-mode')
    }
    
    if (settings.highContrastText) {
      body.classList.add('accessibility-high-contrast-text')
    }
    
    if (settings.colorBlindSupport) {
      body.classList.add('accessibility-color-blind-support')
    }
    
    if (settings.dyslexiaFriendly) {
      body.classList.add('accessibility-dyslexia-friendly')
    }
    
    // Reading Settings
    const lineSpacingMap = { tight: '1.2', normal: '1.5', loose: '2' }
    const wordSpacingMap = { tight: '0.1em', normal: '0.2em', loose: '0.3em' }
    const letterSpacingMap = { tight: '0.05em', normal: '0.1em', loose: '0.15em' }
    
    root.style.setProperty('--line-height', lineSpacingMap[settings.lineSpacing])
    root.style.setProperty('--word-spacing', wordSpacingMap[settings.wordSpacing])
    root.style.setProperty('--letter-spacing', letterSpacingMap[settings.letterSpacing])
    
    if (settings.readingGuide) {
      body.classList.add('accessibility-reading-guide')
    }
    
    if (settings.readingMode) {
      body.classList.add('accessibility-reading-mode')
    }
    
    if (settings.autoScroll) {
      body.classList.add('accessibility-auto-scroll')
    }
    
    if (settings.stickyHeaders) {
      body.classList.add('accessibility-sticky-headers')
    }
    
    // Interaction Settings
    if (settings.largeButtons) {
      body.classList.add('accessibility-large-buttons')
    }
    
    if (settings.simplifiedLayout) {
      body.classList.add('accessibility-simplified-layout')
    }
    
    if (settings.touchFriendly) {
      body.classList.add('accessibility-touch-friendly')
    }
    
    if (!settings.hoverEffects) {
      body.classList.add('accessibility-no-hover')
    }
    
    // Cognitive Settings
    if (settings.timeoutWarning) {
      body.classList.add('accessibility-timeout-warning')
    }
    
    if (settings.errorPrevention) {
      body.classList.add('accessibility-error-prevention')
    }
    
    if (settings.cognitiveLoad) {
      body.classList.add('accessibility-cognitive-load')
    }
    
    if (settings.memoryAids) {
      body.classList.add('accessibility-memory-aids')
    }
    
    if (settings.attentionSupport) {
      body.classList.add('accessibility-attention-support')
    }
    
    // Motor Settings
    if (settings.oneHandedMode) {
      body.classList.add('accessibility-one-handed')
    }
    
    if (settings.switchControl) {
      body.classList.add('accessibility-switch-control')
    }
    
    if (settings.voiceControl) {
      body.classList.add('accessibility-voice-control')
    }
    
    if (settings.eyeTracking) {
      body.classList.add('accessibility-eye-tracking')
    }
    
    if (settings.headTracking) {
      body.classList.add('accessibility-head-tracking')
    }
    
    // Advanced Settings
    if (settings.magnification) {
      body.classList.add('accessibility-magnification')
    }
    
    if (settings.colorFilters) {
      body.classList.add('accessibility-color-filters')
    }
    
    if (settings.motionSensitivity) {
      body.classList.add('accessibility-motion-sensitivity')
    }
    
    if (settings.seizurePrevention) {
      body.classList.add('accessibility-seizure-prevention')
    }
    
    // Save to localStorage
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

  const categories = [
    { id: 'visual', name: 'Visual', icon: Eye, color: 'text-blue-600' },
    { id: 'audio', name: 'Audio', icon: Volume2, color: 'text-green-600' },
    { id: 'navigation', name: 'Navigation', icon: Navigation, color: 'text-purple-600' },
    { id: 'reading', name: 'Reading', icon: BookOpen, color: 'text-orange-600' },
    { id: 'interaction', name: 'Interaction', icon: Hand, color: 'text-pink-600' },
    { id: 'cognitive', name: 'Cognitive', icon: Brain, color: 'text-indigo-600' },
    { id: 'motor', name: 'Motor', icon: Target, color: 'text-red-600' },
    { id: 'advanced', name: 'Advanced', icon: Settings, color: 'text-gray-600' }
  ]

  const AccessibilityButton = ({ 
    icon: Icon, 
    label, 
    isActive, 
    onClick, 
    description,
    category = 'visual'
  }: { 
    icon: any, 
    label: string, 
    isActive: boolean, 
    onClick: () => void,
    description?: string,
    category?: string
  }) => (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 min-h-[60px] sm:min-h-[80px] accessibility-button ${
        isActive 
          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' 
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
      }`}
      title={description || label}
      aria-label={description || label}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
      <span className="text-xs font-medium text-center leading-tight px-1">{label}</span>
    </motion.button>
  )

  const renderVisualSettings = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Color & Contrast</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={Contrast}
            label="High Contrast"
            isActive={settings.contrast === 'high'}
            onClick={() => updateSetting('contrast', settings.contrast === 'high' ? 'normal' : 'high')}
            description="Increase color contrast for better visibility"
          />
          <AccessibilityButton
            icon={Square}
            label="Extra High"
            isActive={settings.contrast === 'extra-high'}
            onClick={() => updateSetting('contrast', settings.contrast === 'extra-high' ? 'normal' : 'extra-high')}
            description="Maximum color contrast"
          />
          <AccessibilityButton
            icon={Link}
            label="Highlight Links"
            isActive={settings.highlightLinks}
            onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
            description="Underline all links"
          />
          <AccessibilityButton
            icon={Triangle}
            label="Invert Colors"
            isActive={settings.invertColors}
            onClick={() => updateSetting('invertColors', !settings.invertColors)}
            description="Invert screen colors"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Text Size</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={Minus}
            label="XS"
            isActive={settings.fontSize === 'xs'}
            onClick={() => updateSetting('fontSize', 'xs')}
            description="Extra small text"
          />
          <AccessibilityButton
            icon={Type}
            label="Small"
            isActive={settings.fontSize === 'small'}
            onClick={() => updateSetting('fontSize', 'small')}
            description="Small text"
          />
          <AccessibilityButton
            icon={Circle}
            label="Medium"
            isActive={settings.fontSize === 'medium'}
            onClick={() => updateSetting('fontSize', 'medium')}
            description="Normal text size"
          />
          <AccessibilityButton
            icon={Plus}
            label="Large"
            isActive={settings.fontSize === 'large'}
            onClick={() => updateSetting('fontSize', 'large')}
            description="Large text"
          />
          <AccessibilityButton
            icon={Maximize}
            label="XL"
            isActive={settings.fontSize === 'xl'}
            onClick={() => updateSetting('fontSize', 'xl')}
            description="Extra large text"
          />
          <AccessibilityButton
            icon={ZoomIn}
            label="XXL"
            isActive={settings.fontSize === 'xxl'}
            onClick={() => updateSetting('fontSize', 'xxl')}
            description="Maximum text size"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Visual Options</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={ImageOff}
            label="Hide Images"
            isActive={settings.hideImages}
            onClick={() => updateSetting('hideImages', !settings.hideImages)}
            description="Hide all images"
          />
          <AccessibilityButton
            icon={MousePointer2}
            label="Big Cursor"
            isActive={settings.bigCursor}
            onClick={() => updateSetting('bigCursor', !settings.bigCursor)}
            description="Enlarge cursor"
          />
          <AccessibilityButton
            icon={Zap}
            label="Reduce Motion"
            isActive={settings.reducedMotion}
            onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
            description="Reduce animations"
          />
          <AccessibilityButton
            icon={Sun}
            label="Dark Mode"
            isActive={settings.darkMode}
            onClick={() => updateSetting('darkMode', !settings.darkMode)}
            description="Enable dark mode"
          />
          <AccessibilityButton
            icon={Eye}
            label="High Contrast Text"
            isActive={settings.highContrastText}
            onClick={() => updateSetting('highContrastText', !settings.highContrastText)}
            description="High contrast text"
          />
          <AccessibilityButton
            icon={Palette}
            label="Color Blind"
            isActive={settings.colorBlindSupport}
            onClick={() => updateSetting('colorBlindSupport', !settings.colorBlindSupport)}
            description="Color blind support"
          />
          <AccessibilityButton
            icon={BookOpen}
            label="Dyslexia"
            isActive={settings.dyslexiaFriendly}
            onClick={() => updateSetting('dyslexiaFriendly', !settings.dyslexiaFriendly)}
            description="Dyslexia friendly fonts"
          />
        </div>
      </div>
    </div>
  )

  const renderAudioSettings = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Audio Features</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={Volume2}
            label="Text to Speech"
            isActive={settings.textToSpeech}
            onClick={() => updateSetting('textToSpeech', !settings.textToSpeech)}
            description="Read text aloud"
          />
          <AccessibilityButton
            icon={Speaker}
            label="Sound Effects"
            isActive={settings.soundEffects}
            onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
            description="Enable sound effects"
          />
          <AccessibilityButton
            icon={Headphones}
            label="Audio Descriptions"
            isActive={settings.audioDescriptions}
            onClick={() => updateSetting('audioDescriptions', !settings.audioDescriptions)}
            description="Audio descriptions for images"
          />
          <AccessibilityButton
            icon={Volume1}
            label="Volume Control"
            isActive={settings.volumeControl}
            onClick={() => updateSetting('volumeControl', !settings.volumeControl)}
            description="Volume control options"
          />
          <AccessibilityButton
            icon={Mic}
            label="Voice Commands"
            isActive={settings.voiceCommands}
            onClick={() => updateSetting('voiceCommands', !settings.voiceCommands)}
            description="Voice command support"
          />
        </div>
      </div>
    </div>
  )

  const renderNavigationSettings = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Navigation Options</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={Keyboard}
            label="Keyboard Nav"
            isActive={settings.keyboardNavigation}
            onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
            description="Keyboard navigation"
          />
          <AccessibilityButton
            icon={Focus}
            label="Focus Indicators"
            isActive={settings.focusIndicators}
            onClick={() => updateSetting('focusIndicators', !settings.focusIndicators)}
            description="Enhanced focus indicators"
          />
          <AccessibilityButton
            icon={ArrowUp}
            label="Skip Links"
            isActive={settings.skipLinks}
            onClick={() => updateSetting('skipLinks', !settings.skipLinks)}
            description="Skip to content links"
          />
          <AccessibilityButton
            icon={ArrowRight}
            label="Tab Order"
            isActive={settings.tabOrder}
            onClick={() => updateSetting('tabOrder', !settings.tabOrder)}
            description="Logical tab order"
          />
          <AccessibilityButton
            icon={ArrowLeft}
            label="Arrow Keys"
            isActive={settings.arrowKeys}
            onClick={() => updateSetting('arrowKeys', !settings.arrowKeys)}
            description="Arrow key navigation"
          />
        </div>
      </div>
    </div>
  )

  const renderReadingSettings = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Reading Options</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={Scroll}
            label="Reading Guide"
            isActive={settings.readingGuide}
            onClick={() => updateSetting('readingGuide', !settings.readingGuide)}
            description="Reading guide line"
          />
          <AccessibilityButton
            icon={BookOpen}
            label="Reading Mode"
            isActive={settings.readingMode}
            onClick={() => updateSetting('readingMode', !settings.readingMode)}
            description="Distraction-free reading"
          />
          <AccessibilityButton
            icon={ArrowDown}
            label="Auto Scroll"
            isActive={settings.autoScroll}
            onClick={() => updateSetting('autoScroll', !settings.autoScroll)}
            description="Automatic scrolling"
          />
          <AccessibilityButton
            icon={Pin}
            label="Sticky Headers"
            isActive={settings.stickyHeaders}
            onClick={() => updateSetting('stickyHeaders', !settings.stickyHeaders)}
            description="Sticky section headers"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Text Spacing</h4>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={Minus}
            label="Tight"
            isActive={settings.lineSpacing === 'tight'}
            onClick={() => updateSetting('lineSpacing', 'tight')}
            description="Tight line spacing"
          />
          <AccessibilityButton
            icon={Type}
            label="Normal"
            isActive={settings.lineSpacing === 'normal'}
            onClick={() => updateSetting('lineSpacing', 'normal')}
            description="Normal line spacing"
          />
          <AccessibilityButton
            icon={Plus}
            label="Loose"
            isActive={settings.lineSpacing === 'loose'}
            onClick={() => updateSetting('lineSpacing', 'loose')}
            description="Loose line spacing"
          />
        </div>
      </div>
    </div>
  )

  const renderInteractionSettings = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Interaction Options</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={Maximize}
            label="Large Buttons"
            isActive={settings.largeButtons}
            onClick={() => updateSetting('largeButtons', !settings.largeButtons)}
            description="Larger button sizes"
          />
          <AccessibilityButton
            icon={Layout}
            label="Simple Layout"
            isActive={settings.simplifiedLayout}
            onClick={() => updateSetting('simplifiedLayout', !settings.simplifiedLayout)}
            description="Simplified interface"
          />
          <AccessibilityButton
            icon={Hand}
            label="Touch Friendly"
            isActive={settings.touchFriendly}
            onClick={() => updateSetting('touchFriendly', !settings.touchFriendly)}
            description="Touch-friendly interface"
          />
          <AccessibilityButton
            icon={MousePointer2}
            label="No Hover"
            isActive={!settings.hoverEffects}
            onClick={() => updateSetting('hoverEffects', settings.hoverEffects)}
            description="Disable hover effects"
          />
        </div>
      </div>
    </div>
  )

  const renderCognitiveSettings = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Cognitive Support</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={Clock}
            label="Timeout Warning"
            isActive={settings.timeoutWarning}
            onClick={() => updateSetting('timeoutWarning', !settings.timeoutWarning)}
            description="Session timeout warnings"
          />
          <AccessibilityButton
            icon={Shield}
            label="Error Prevention"
            isActive={settings.errorPrevention}
            onClick={() => updateSetting('errorPrevention', !settings.errorPrevention)}
            description="Prevent common errors"
          />
          <AccessibilityButton
            icon={Brain}
            label="Reduce Load"
            isActive={settings.cognitiveLoad}
            onClick={() => updateSetting('cognitiveLoad', !settings.cognitiveLoad)}
            description="Reduce cognitive load"
          />
          <AccessibilityButton
            icon={Bookmark}
            label="Memory Aids"
            isActive={settings.memoryAids}
            onClick={() => updateSetting('memoryAids', !settings.memoryAids)}
            description="Memory assistance tools"
          />
          <AccessibilityButton
            icon={Target}
            label="Attention Support"
            isActive={settings.attentionSupport}
            onClick={() => updateSetting('attentionSupport', !settings.attentionSupport)}
            description="Attention support features"
          />
        </div>
      </div>
    </div>
  )

  const renderMotorSettings = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Motor Support</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={Hand}
            label="One Handed"
            isActive={settings.oneHandedMode}
            onClick={() => updateSetting('oneHandedMode', !settings.oneHandedMode)}
            description="One-handed operation"
          />
          <AccessibilityButton
            icon={Target}
            label="Switch Control"
            isActive={settings.switchControl}
            onClick={() => updateSetting('switchControl', !settings.switchControl)}
            description="Switch control support"
          />
          <AccessibilityButton
            icon={Mic}
            label="Voice Control"
            isActive={settings.voiceControl}
            onClick={() => updateSetting('voiceControl', !settings.voiceControl)}
            description="Voice control interface"
          />
          <AccessibilityButton
            icon={Eye}
            label="Eye Tracking"
            isActive={settings.eyeTracking}
            onClick={() => updateSetting('eyeTracking', !settings.eyeTracking)}
            description="Eye tracking support"
          />
          <AccessibilityButton
            icon={User}
            label="Head Tracking"
            isActive={settings.headTracking}
            onClick={() => updateSetting('headTracking', !settings.headTracking)}
            description="Head tracking support"
          />
        </div>
      </div>
    </div>
  )

  const renderAdvancedSettings = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Advanced Options</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <AccessibilityButton
            icon={Settings}
            label="Custom CSS"
            isActive={settings.customCSS}
            onClick={() => updateSetting('customCSS', !settings.customCSS)}
            description="Custom CSS support"
          />
          <AccessibilityButton
            icon={Monitor}
            label="Screen Reader"
            isActive={settings.screenReader}
            onClick={() => updateSetting('screenReader', !settings.screenReader)}
            description="Screen reader support"
          />
          <AccessibilityButton
            icon={ZoomIn}
            label="Magnification"
            isActive={settings.magnification}
            onClick={() => updateSetting('magnification', !settings.magnification)}
            description="Screen magnification"
          />
          <AccessibilityButton
            icon={Palette}
            label="Color Filters"
            isActive={settings.colorFilters}
            onClick={() => updateSetting('colorFilters', !settings.colorFilters)}
            description="Color filtering options"
          />
          <AccessibilityButton
            icon={Zap}
            label="Motion Sensitivity"
            isActive={settings.motionSensitivity}
            onClick={() => updateSetting('motionSensitivity', !settings.motionSensitivity)}
            description="Reduce motion sensitivity"
          />
          <AccessibilityButton
            icon={Shield}
            label="Seizure Prevention"
            isActive={settings.seizurePrevention}
            onClick={() => updateSetting('seizurePrevention', !settings.seizurePrevention)}
            description="Prevent seizure triggers"
          />
        </div>
      </div>
    </div>
  )

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'visual': return renderVisualSettings()
      case 'audio': return renderAudioSettings()
      case 'navigation': return renderNavigationSettings()
      case 'reading': return renderReadingSettings()
      case 'interaction': return renderInteractionSettings()
      case 'cognitive': return renderCognitiveSettings()
      case 'motor': return renderMotorSettings()
      case 'advanced': return renderAdvancedSettings()
      default: return renderVisualSettings()
    }
  }

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
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Accessibility Tools</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetSettings}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    aria-label="Reset all settings"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                    <span className="hidden sm:inline">Reset</span>
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

              {/* Category Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center space-x-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeCategory === category.id
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      <category.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${category.color}`} />
                      <span className="hidden sm:inline">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
                {renderCategoryContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
