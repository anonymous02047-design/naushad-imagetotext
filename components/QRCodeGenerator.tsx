'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  QrCode, 
  Download, 
  Copy, 
  RefreshCw, 
  Settings, 
  Palette, 
  Eye, 
  EyeOff,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Wifi,
  Calendar,
  Link,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import QRCodeLib from 'qrcode'
import toast from 'react-hot-toast'

interface QRCodeGeneratorProps {
  className?: string
}

interface QRCodeData {
  id: string
  type: string
  content: string
  timestamp: Date
  size: number
  color: string
  backgroundColor: string
}

const QR_TYPES = [
  { id: 'text', name: 'Plain Text', icon: FileText, placeholder: 'Enter any text...' },
  { id: 'url', name: 'Website URL', icon: Link, placeholder: 'https://example.com' },
  { id: 'email', name: 'Email', icon: Mail, placeholder: 'user@example.com' },
  { id: 'phone', name: 'Phone Number', icon: Phone, placeholder: '+1234567890' },
  { id: 'sms', name: 'SMS', icon: Smartphone, placeholder: '+1234567890:Your message here' },
  { id: 'wifi', name: 'WiFi', icon: Wifi, placeholder: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
  { id: 'location', name: 'Location', icon: MapPin, placeholder: 'Latitude,Longitude' },
  { id: 'event', name: 'Calendar Event', icon: Calendar, placeholder: 'Event Title|Date|Time|Location' }
]

const PRESET_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' }
]

export default function QRCodeGenerator({ className = '' }: QRCodeGeneratorProps) {
  const [qrType, setQrType] = useState('text')
  const [content, setContent] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [size, setSize] = useState(256)
  const [color, setColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [margin, setMargin] = useState(4)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [qrHistory, setQrHistory] = useState<QRCodeData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('qr-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setQrHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })))
      } catch (error) {
        console.error('Error loading QR history:', error)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('qr-history', JSON.stringify(qrHistory))
  }, [qrHistory])

  const generateQRCode = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to generate QR code')
      return
    }

    setIsGenerating(true)
    
    try {
      const options = {
        width: size,
        margin: margin,
        color: {
          dark: color,
          light: backgroundColor
        },
        errorCorrectionLevel: errorCorrectionLevel
      }

      const qrDataURL = await QRCodeLib.toDataURL(content, options)
      setQrCodeUrl(qrDataURL)

      // Add to history
      const newQR: QRCodeData = {
        id: Date.now().toString(),
        type: qrType,
        content: content,
        timestamp: new Date(),
        size: size,
        color: color,
        backgroundColor: backgroundColor
      }
      setQrHistory(prev => [newQR, ...prev.slice(0, 19)]) // Keep last 20

      toast.success('QR code generated successfully!')
    } catch (error) {
      console.error('QR generation error:', error)
      toast.error('Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) {
      toast.error('No QR code to download')
      return
    }

    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `qrcode-${Date.now()}.png`
    link.click()
    toast.success('QR code downloaded!')
  }

  const copyQRCode = async () => {
    if (!qrCodeUrl) {
      toast.error('No QR code to copy')
      return
    }

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      toast.success('QR code copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy QR code')
    }
  }

  const clearAll = () => {
    setContent('')
    setQrCodeUrl('')
    setQrHistory([])
    toast.success('All data cleared!')
  }

  const loadFromHistory = (item: QRCodeData) => {
    setQrType(item.type)
    setContent(item.content)
    setSize(item.size)
    setColor(item.color)
    setBackgroundColor(item.backgroundColor)
    generateQRCode()
  }

  const removeFromHistory = (id: string) => {
    setQrHistory(prev => prev.filter(item => item.id !== id))
    toast.success('Removed from history')
  }

  const getPlaceholder = () => {
    return QR_TYPES.find(type => type.id === qrType)?.placeholder || 'Enter content...'
  }

  const getTypeIcon = () => {
    const type = QR_TYPES.find(t => t.id === qrType)
    return type ? type.icon : FileText
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <QrCode className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          Advanced QR Code Generator
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="Advanced settings"
          >
            {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={clearAll}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* QR Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            QR Code Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QR_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setQrType(type.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                    qrType === type.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{type.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
            />
            <div className="absolute top-2 right-2">
              {(() => {
                const Icon = getTypeIcon()
                return <Icon className="w-4 h-4 text-gray-400" />
              })()}
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {content.length} characters
          </div>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size: {size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 slider"
                />
              </div>

              {/* Error Correction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Error Correction Level
                </label>
                <select
                  value={errorCorrectionLevel}
                  onChange={(e) => setErrorCorrectionLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="input-field"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>

              {/* Margin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Margin: {margin}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 slider"
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Palette className="w-4 h-4 inline mr-1" />
                Colors
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Foreground</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <div className="flex flex-wrap gap-1">
                      {PRESET_COLORS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => setColor(preset.value)}
                          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                          style={{ backgroundColor: preset.value }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Background</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setBackgroundColor('#FFFFFF')}
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 bg-white hover:scale-110 transition-transform"
                        title="White"
                      />
                      <button
                        onClick={() => setBackgroundColor('#000000')}
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 bg-black hover:scale-110 transition-transform"
                        title="Black"
                      />
                      <button
                        onClick={() => setBackgroundColor('#F3F4F6')}
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 hover:scale-110 transition-transform"
                        title="Light Gray"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateQRCode}
          disabled={isGenerating || !content.trim()}
          className="w-full btn-primary flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating QR Code...
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </>
          )}
        </button>

        {/* QR Code Display */}
        {qrCodeUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-4"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600 inline-block">
              <img
                src={qrCodeUrl}
                alt="Generated QR Code"
                className="max-w-full h-auto"
                style={{ maxWidth: '300px' }}
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={downloadQRCode}
                className="btn-secondary flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={copyQRCode}
                className="btn-secondary flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </button>
            </div>
          </motion.div>
        )}

        {/* History */}
        {qrHistory.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent QR Codes ({qrHistory.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto custom-scrollbar">
              {qrHistory.map((item) => {
                const type = QR_TYPES.find(t => t.id === item.type)
                const Icon = type?.icon || FileText
                return (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {type?.name || 'Unknown'}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromHistory(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {item.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {item.timestamp.toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => loadFromHistory(item)}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Load
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-2">QR Code Features:</p>
            <ul className="space-y-1 text-xs">
              <li>• Support for 8 different QR code types</li>
              <li>• Customizable colors and size</li>
              <li>• Error correction levels</li>
              <li>• Download and copy options</li>
              <li>• Generation history</li>
              <li>• Advanced customization options</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
