'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Link, 
  Copy, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  BarChart3, 
  Calendar,
  Clock,
  Trash2,
  CheckCircle,
  AlertCircle,
  QrCode,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'
import QRCodeLib from 'qrcode'
import toast from 'react-hot-toast'

interface URLShortenerProps {
  className?: string
}

interface ShortenedURL {
  id: string
  originalUrl: string
  shortUrl: string
  customAlias?: string
  clicks: number
  createdAt: Date
  lastAccessed?: Date
  qrCode?: string
}

export default function URLShortener({ className = '' }: URLShortenerProps) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [isShortening, setIsShortening] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [urlHistory, setUrlHistory] = useState<ShortenedURL[]>([])
  const [selectedUrl, setSelectedUrl] = useState<ShortenedURL | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('url-shortener-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setUrlHistory(parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          lastAccessed: item.lastAccessed ? new Date(item.lastAccessed) : undefined
        })))
      } catch (error) {
        console.error('Error loading URL history:', error)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('url-shortener-history', JSON.stringify(urlHistory))
  }, [urlHistory])

  // Generate short URL
  const generateShortUrl = (url: string, alias?: string): string => {
    const baseUrl = window.location.origin
    const shortId = alias || Math.random().toString(36).substring(2, 8)
    return `${baseUrl}/redirect?id=${shortId}`
  }

  // Validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Shorten URL
  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast.error('Please enter a URL to shorten')
      return
    }

    if (!isValidUrl(originalUrl)) {
      toast.error('Please enter a valid URL (include http:// or https://)')
      return
    }

    setIsShortening(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const shortUrl = generateShortUrl(originalUrl, customAlias || undefined)
      setShortenedUrl(shortUrl)

      // Generate QR code for the shortened URL
      let qrCodeData = ''
      try {
        qrCodeData = await QRCodeLib.toDataURL(shortUrl, {
          width: 128,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
      } catch (error) {
        console.error('Error generating QR code:', error)
      }

      // Add to history
      const newShortUrl: ShortenedURL = {
        id: Date.now().toString(),
        originalUrl: originalUrl,
        shortUrl: shortUrl,
        customAlias: customAlias || undefined,
        clicks: 0,
        createdAt: new Date(),
        qrCode: qrCodeData
      }
      
      setUrlHistory(prev => [newShortUrl, ...prev.slice(0, 49)]) // Keep last 50
      setSelectedUrl(newShortUrl)
      
      toast.success('URL shortened successfully!')
    } catch (error) {
      console.error('URL shortening error:', error)
      toast.error('Failed to shorten URL. Please try again.')
    } finally {
      setIsShortening(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('URL copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy URL')
    }
  }

  // Download QR code
  const downloadQRCode = async () => {
    if (!selectedUrl) return
    
    try {
      // Generate actual QR code image
      const qrDataURL = await QRCodeLib.toDataURL(selectedUrl.shortUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      // Create download link
      const link = document.createElement('a')
      link.href = qrDataURL
      link.download = `qr-code-${selectedUrl.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('QR code downloaded as PNG!')
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code')
    }
  }

  // Clear all data
  const clearAll = () => {
    setOriginalUrl('')
    setCustomAlias('')
    setShortenedUrl('')
    setSelectedUrl(null)
    setUrlHistory([])
    toast.success('All data cleared!')
  }

  // Remove from history
  const removeFromHistory = (id: string) => {
    setUrlHistory(prev => prev.filter(item => item.id !== id))
    if (selectedUrl?.id === id) {
      setSelectedUrl(null)
    }
    toast.success('URL removed from history')
  }

  // Simulate click tracking
  const simulateClick = (url: ShortenedURL) => {
    setUrlHistory(prev => prev.map(item => 
      item.id === url.id 
        ? { ...item, clicks: item.clicks + 1, lastAccessed: new Date() }
        : item
    ))
    toast.success('Click simulated!')
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
          <Link className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          URL Shortener
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="Advanced options"
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
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter URL to Shorten
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Link className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Options
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Alias (Optional)
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {window.location.origin}/s/
                </span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="my-custom-link"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty for auto-generated short code
              </p>
            </div>
          </motion.div>
        )}

        {/* Shorten Button */}
        <button
          onClick={shortenUrl}
          disabled={isShortening || !originalUrl.trim()}
          className="w-full btn-primary flex items-center justify-center"
        >
          {isShortening ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Shortening URL...
            </>
          ) : (
            <>
              <Link className="w-4 h-4 mr-2" />
              Shorten URL
            </>
          )}
        </button>

        {/* Shortened URL Display */}
        {shortenedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Shortened URL
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(shortenedUrl)}
                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(shortenedUrl, '_blank')}
                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    title="Open URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-gray-800 dark:text-gray-200 font-mono text-sm break-all">
                {shortenedUrl}
              </div>
            </div>
            
            {/* QR Code Preview */}
            {selectedUrl?.qrCode && (
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <img 
                    src={selectedUrl.qrCode} 
                    alt="QR Code" 
                    className="w-32 h-32"
                  />
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                    QR Code for your shortened URL
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => copyToClipboard(shortenedUrl)}
                className="btn-secondary flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </button>
              <button
                onClick={downloadQRCode}
                className="btn-secondary flex items-center"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Download QR
              </button>
              <button
                onClick={() => setShowAnalytics(true)}
                className="btn-secondary flex items-center"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
            </div>
          </motion.div>
        )}

        {/* URL History */}
        {urlHistory.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent URLs ({urlHistory.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {urlHistory.map((url) => (
                <div key={url.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {url.shortUrl}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {url.clicks} clicks
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => simulateClick(url)}
                        className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        title="Simulate click"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromHistory(url.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {url.originalUrl}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {url.createdAt.toLocaleDateString()}
                    </div>
                    {url.lastAccessed && (
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {url.lastAccessed.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        {showAnalytics && selectedUrl && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  URL Analytics
                </h3>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short URL</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono break-all">
                    {selectedUrl.shortUrl}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Original URL</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                    {selectedUrl.originalUrl}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {selectedUrl.clicks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {selectedUrl.createdAt.toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-2">URL Shortener Features:</p>
            <ul className="space-y-1 text-xs">
              <li>• Shorten any valid URL</li>
              <li>• Custom alias support</li>
              <li>• Click tracking and analytics</li>
              <li>• QR code generation</li>
              <li>• URL history management</li>
              <li>• Copy and share options</li>
            </ul>
            <p className="mt-2 text-xs">
              <strong>Note:</strong> This is a demonstration URL shortener. 
              For production use, integrate with a real URL shortening service.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
