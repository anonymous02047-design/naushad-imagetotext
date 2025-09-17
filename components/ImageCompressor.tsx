'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Download, 
  FileImage, 
  Settings, 
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageCompressorProps {
  className?: string
}

interface CompressedImage {
  original: File
  compressed: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
  dataUrl: string
}

export default function ImageCompressor({ className }: ImageCompressorProps) {
  const [images, setImages] = useState<CompressedImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState({
    quality: 0.85,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'jpeg'
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files')
      return
    }

    compressImages(imageFiles)
  }

  const compressImages = async (files: File[]) => {
    setIsProcessing(true)
    try {
      const compressedImages: CompressedImage[] = []

      for (const file of files) {
        const compressed = await compressImage(file)
        if (compressed) {
          compressedImages.push(compressed)
        }
      }

      setImages(prev => [...prev, ...compressedImages])
      toast.success(`${compressedImages.length} image(s) compressed successfully`)
    } catch (error) {
      console.error('Error compressing images:', error)
      toast.error('Failed to compress images. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const compressImage = (file: File): Promise<CompressedImage | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions with better scaling
        let { width, height } = img
        const originalWidth = width
        const originalHeight = height
        
        if (width > settings.maxWidth || height > settings.maxHeight) {
          const aspectRatio = width / height
          
          if (width > height) {
            width = Math.min(width, settings.maxWidth)
            height = width / aspectRatio
          } else {
            height = Math.min(height, settings.maxHeight)
            width = height * aspectRatio
          }
        }

        // Use higher resolution for better quality
        const scale = Math.min(2, Math.max(1, settings.quality * 2))
        canvas.width = width * scale
        canvas.height = height * scale

        // Enable better image rendering
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Draw with better quality
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Scale back down for final output
        const finalCanvas = document.createElement('canvas')
        const finalCtx = finalCanvas.getContext('2d')!
        finalCanvas.width = width
        finalCanvas.height = height
        
        finalCtx.imageSmoothingEnabled = true
        finalCtx.imageSmoothingQuality = 'high'
        finalCtx.drawImage(canvas, 0, 0, width, height)
        
        // Choose format based on content and quality
        const outputFormat = settings.format === 'jpeg' ? 'image/jpeg' : 'image/png'
        const finalQuality = Math.max(0.7, settings.quality) // Ensure minimum quality
        
        const dataUrl = finalCanvas.toDataURL(outputFormat, finalQuality)
        
        // Convert data URL to blob
        const byteString = atob(dataUrl.split(',')[1])
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        
        const compressedFile = new File([ab], file.name.replace(/\.[^/.]+$/, `.${settings.format}`), {
          type: mimeString
        })

        const compressionRatio = ((file.size - compressedFile.size) / file.size) * 100

        resolve({
          original: file,
          compressed: compressedFile,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          compressionRatio,
          dataUrl
        })
      }

      img.onerror = () => {
        toast.error(`Failed to load image: ${file.name}`)
        resolve(null)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a')
    link.href = image.dataUrl
    link.download = image.compressed.name
    link.click()
    toast.success('Image downloaded')
  }

  const downloadAllImages = () => {
    images.forEach((image, index) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = image.dataUrl
        link.download = image.compressed.name
        link.click()
      }, index * 100)
    })
    toast.success('All images downloaded')
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    toast.success('Image removed')
  }

  const clearAll = () => {
    setImages([])
    toast.success('All images cleared')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0)
  const totalCompressedSize = images.reduce((sum, img) => sum + img.compressedSize, 0)
  const totalSavings = totalOriginalSize - totalCompressedSize
  const totalSavingsPercent = totalOriginalSize > 0 ? (totalSavings / totalOriginalSize) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card ${className}`}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
        <Zap className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
        Image Compressor
      </h2>

      <div className="space-y-6">
        {/* Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Images
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Click to upload images or drag and drop
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Supports JPG, PNG, GIF, WebP
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Quality Presets */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quality Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSettings(prev => ({ ...prev, quality: 0.95 }))}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                settings.quality >= 0.95 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              High Quality
            </button>
            <button
              onClick={() => setSettings(prev => ({ ...prev, quality: 0.85 }))}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                settings.quality >= 0.8 && settings.quality < 0.95 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Balanced
            </button>
            <button
              onClick={() => setSettings(prev => ({ ...prev, quality: 0.7 }))}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                settings.quality >= 0.6 && settings.quality < 0.8 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Compressed
            </button>
            <button
              onClick={() => setSettings(prev => ({ ...prev, quality: 0.5 }))}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                settings.quality < 0.6 ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Maximum Compression
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quality
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={settings.quality}
              onChange={(e) => setSettings(prev => ({ ...prev, quality: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{Math.round(settings.quality * 100)}%</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Output Format
            </label>
            <select
              value={settings.format}
              onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value }))}
              className="input-field"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Width
            </label>
            <input
              type="number"
              min="100"
              max="4000"
              value={settings.maxWidth}
              onChange={(e) => setSettings(prev => ({ ...prev, maxWidth: Number(e.target.value) }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Height
            </label>
            <input
              type="number"
              min="100"
              max="4000"
              value={settings.maxHeight}
              onChange={(e) => setSettings(prev => ({ ...prev, maxHeight: Number(e.target.value) }))}
              className="input-field"
            />
          </div>
        </div>

        {/* Statistics */}
        {images.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Compression Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatFileSize(totalOriginalSize)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Original Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatFileSize(totalCompressedSize)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Compressed Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {totalSavingsPercent.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Space Saved</div>
              </div>
            </div>
          </div>
        )}

        {/* Images Preview */}
        {images.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Compressed Images ({images.length})
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={downloadAllImages}
                  className="btn-secondary flex items-center space-x-1 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All</span>
                </button>
                <button
                  onClick={clearAll}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={image.dataUrl}
                      alt={`Compressed ${image.original.name}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {image.compressed.name}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>Original: {formatFileSize(image.originalSize)}</span>
                        <span>Compressed: {formatFileSize(image.compressedSize)}</span>
                        <span className="text-green-600 font-medium">
                          {image.compressionRatio.toFixed(1)}% smaller
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadImage(image)}
                        className="btn-primary flex items-center space-x-1 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary-600" />
            <p className="text-gray-600 dark:text-gray-400">Compressing images...</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
