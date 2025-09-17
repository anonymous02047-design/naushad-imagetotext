'use client'

import { useState, useRef, useCallback } from 'react'
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
  Crop,
  Maximize2,
  Palette,
  Zap,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Undo,
  Redo
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageEditorProps {
  className?: string
}

interface EditedImage {
  original: File
  edited: File
  originalSize: number
  editedSize: number
  dataUrl: string
  operations: string[]
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export default function ImageEditor({ className }: ImageEditorProps) {
  const [images, setImages] = useState<EditedImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentImage, setCurrentImage] = useState<EditedImage | null>(null)
  const [settings, setSettings] = useState({
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    cropArea: { x: 0, y: 0, width: 100, height: 100 } as CropArea,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sharpen: 0,
    colorMode: 'color' as 'color' | 'grayscale' | 'sepia' | 'invert',
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false
  })
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files')
      return
    }

    processImages(imageFiles)
  }

  const processImages = async (files: File[]) => {
    setIsProcessing(true)
    try {
      const processedImages: EditedImage[] = []

      for (const file of files) {
        const processed = await processImage(file)
        if (processed) {
          processedImages.push(processed)
        }
      }

      setImages(prev => [...prev, ...processedImages])
      if (processedImages.length > 0) {
        setCurrentImage(processedImages[0])
        addToHistory(processedImages[0].dataUrl)
      }
      toast.success(`${processedImages.length} image(s) processed successfully`)
    } catch (error) {
      console.error('Error processing images:', error)
      toast.error('Failed to process images. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const processImage = async (file: File): Promise<EditedImage | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = async () => {
        try {
          // Calculate dimensions
          let { width, height } = img
          
          // Apply resize
          if (settings.maintainAspectRatio) {
            const aspectRatio = width / height
            if (width > height) {
              width = settings.width
              height = width / aspectRatio
            } else {
              height = settings.height
              width = height * aspectRatio
            }
          } else {
            width = settings.width
            height = settings.height
          }

          canvas.width = width
          canvas.height = height

          // Apply transformations
          ctx.save()
          
          // Apply rotation
          if (settings.rotation !== 0) {
            ctx.translate(width / 2, height / 2)
            ctx.rotate((settings.rotation * Math.PI) / 180)
            ctx.translate(-width / 2, -height / 2)
          }

          // Apply flip
          if (settings.flipHorizontal || settings.flipVertical) {
            ctx.scale(
              settings.flipHorizontal ? -1 : 1,
              settings.flipVertical ? -1 : 1
            )
            if (settings.flipHorizontal) ctx.translate(-width, 0)
            if (settings.flipVertical) ctx.translate(0, -height)
          }

          // Draw image
          ctx.drawImage(img, 0, 0, width, height)
          ctx.restore()

          // Apply filters
          applyFilters(ctx, width, height)

          // Convert to data URL for preview
          const dataUrl = canvas.toDataURL('image/png', 1.0)
          
          // Convert canvas to blob for file creation
          const editedFile = await new Promise<File>((resolveFile) => {
            canvas.toBlob((blob) => {
              if (blob) {
                const editedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '_edited.png'), {
                  type: 'image/png'
                })
                resolveFile(editedFile)
              } else {
                // Fallback method
                const byteString = atob(dataUrl.split(',')[1])
                const ab = new ArrayBuffer(byteString.length)
                const ia = new Uint8Array(ab)
                
                for (let i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i)
                }
                
                const editedFile = new File([ab], file.name.replace(/\.[^/.]+$/, '_edited.png'), {
                  type: 'image/png'
                })
                resolveFile(editedFile)
              }
            }, 'image/png', 1.0)
          })

          const operations = []
          if (settings.width !== img.width || settings.height !== img.height) operations.push('Resize')
          if (settings.brightness !== 100) operations.push('Brightness')
          if (settings.contrast !== 100) operations.push('Contrast')
          if (settings.saturation !== 100) operations.push('Saturation')
          if (settings.hue !== 0) operations.push('Hue')
          if (settings.blur > 0) operations.push('Blur')
          if (settings.sharpen > 0) operations.push('Sharpen')
          if (settings.colorMode !== 'color') operations.push('Color Mode')
          if (settings.rotation !== 0) operations.push('Rotation')
          if (settings.flipHorizontal || settings.flipVertical) operations.push('Flip')

          resolve({
            original: file,
            edited: editedFile,
            originalSize: file.size,
            editedSize: editedFile.size,
            dataUrl,
            operations
          })
        } catch (error) {
          console.error('Error processing image:', error)
          resolve(null)
        }
      }

      img.onerror = () => {
        toast.error(`Failed to load image: ${file.name}`)
        resolve(null)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const applyFilters = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]

      // Apply brightness
      r = Math.min(255, Math.max(0, r * (settings.brightness / 100)))
      g = Math.min(255, Math.max(0, g * (settings.brightness / 100)))
      b = Math.min(255, Math.max(0, b * (settings.brightness / 100)))

      // Apply contrast
      const contrastFactor = (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast))
      r = Math.min(255, Math.max(0, contrastFactor * (r - 128) + 128))
      g = Math.min(255, Math.max(0, contrastFactor * (g - 128) + 128))
      b = Math.min(255, Math.max(0, contrastFactor * (b - 128) + 128))

      // Apply saturation
      if (settings.saturation !== 100) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b
        r = gray + (r - gray) * (settings.saturation / 100)
        g = gray + (g - gray) * (settings.saturation / 100)
        b = gray + (b - gray) * (settings.saturation / 100)
      }

      // Apply hue
      if (settings.hue !== 0) {
        const hsv = rgbToHsv(r, g, b)
        hsv.h = (hsv.h + settings.hue) % 360
        const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v)
        r = rgb.r
        g = rgb.g
        b = rgb.b
      }

      // Apply color mode
      switch (settings.colorMode) {
        case 'grayscale':
          const gray = 0.299 * r + 0.587 * g + 0.114 * b
          r = g = b = gray
          break
        case 'sepia':
          const sepiaR = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
          const sepiaG = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
          const sepiaB = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
          r = sepiaR
          g = sepiaG
          b = sepiaB
          break
        case 'invert':
          r = 255 - r
          g = 255 - g
          b = 255 - b
          break
      }

      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    let h = 0
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6
      else if (max === g) h = (b - r) / diff + 2
      else h = (r - g) / diff + 4
    }
    h = Math.round(h * 60)
    if (h < 0) h += 360

    const s = max === 0 ? 0 : diff / max
    const v = max

    return { h, s, v }
  }

  const hsvToRgb = (h: number, s: number, v: number) => {
    const c = v * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = v - c

    let r = 0, g = 0, b = 0

    if (h >= 0 && h < 60) { r = c; g = x; b = 0 }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0 }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    }
  }

  const addToHistory = (dataUrl: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(dataUrl)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      if (currentImage) {
        setCurrentImage({
          ...currentImage,
          dataUrl: history[historyIndex - 1]
        })
      }
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      if (currentImage) {
        setCurrentImage({
          ...currentImage,
          dataUrl: history[historyIndex + 1]
        })
      }
    }
  }

  const applyChanges = async () => {
    if (!currentImage) return

    setIsProcessing(true)
    try {
      const updated = await processImage(currentImage.original)
      if (updated) {
        setCurrentImage(updated)
        addToHistory(updated.dataUrl)
        toast.success('Changes applied successfully')
      }
    } catch (error) {
      console.error('Error applying changes:', error)
      toast.error('Failed to apply changes')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = (image: EditedImage) => {
    try {
      // Use the dataUrl directly which contains the edited image data
      const link = document.createElement('a')
      link.href = image.dataUrl
      link.download = image.edited.name
      link.click()
      toast.success('Edited image downloaded')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download image')
    }
  }

  const downloadEditedImage = async () => {
    if (!currentImage) return

    try {
      setIsProcessing(true)
      
      // Process the image to get the latest edited version
      const editedImage = await processImage(currentImage.original)
      if (editedImage) {
        // Create download link with the edited data
        const link = document.createElement('a')
        link.href = editedImage.dataUrl
        link.download = editedImage.edited.name
        link.click()
        toast.success('Edited image downloaded successfully')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download edited image')
    } finally {
      setIsProcessing(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    if (currentImage === images[index]) {
      setCurrentImage(images.length > 1 ? images[index === 0 ? 1 : 0] : null)
    }
    toast.success('Image removed')
  }

  const clearAll = () => {
    setImages([])
    setCurrentImage(null)
    setHistory([])
    setHistoryIndex(-1)
    toast.success('All images cleared')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card ${className}`}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
        <FileImage className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
        Advanced Image Editor
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

        {/* Image Preview and Controls */}
        {currentImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Preview
              </h3>
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <img
                  src={currentImage.dataUrl}
                  alt="Edited image"
                  className="w-full h-auto max-h-96 object-contain"
                />
                
                {/* History Controls */}
                <div className="absolute top-2 left-2 flex space-x-2">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Undo"
                  >
                    <Undo className="w-4 h-4" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Redo"
                  >
                    <Redo className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Editing Controls */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Edit Controls
              </h3>
              
              <div className="space-y-4">
                {/* Resize */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Maximize2 className="w-4 h-4 inline mr-1" />
                    Resize
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Width"
                      value={settings.width}
                      onChange={(e) => setSettings(prev => ({ ...prev, width: Number(e.target.value) }))}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Height"
                      value={settings.height}
                      onChange={(e) => setSettings(prev => ({ ...prev, height: Number(e.target.value) }))}
                      className="input-field"
                    />
                  </div>
                  <label className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={settings.maintainAspectRatio}
                      onChange={(e) => setSettings(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Maintain aspect ratio</span>
                  </label>
                </div>

                {/* Color Adjustments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Palette className="w-4 h-4 inline mr-1" />
                    Color Adjustments
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Brightness: {settings.brightness}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.brightness}
                        onChange={(e) => setSettings(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Contrast: {settings.contrast}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.contrast}
                        onChange={(e) => setSettings(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Saturation: {settings.saturation}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.saturation}
                        onChange={(e) => setSettings(prev => ({ ...prev, saturation: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Hue: {settings.hue}°</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={settings.hue}
                        onChange={(e) => setSettings(prev => ({ ...prev, hue: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Mode
                  </label>
                  <select
                    value={settings.colorMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, colorMode: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="color">Color</option>
                    <option value="grayscale">Black & White</option>
                    <option value="sepia">Sepia</option>
                    <option value="invert">Invert</option>
                  </select>
                </div>

                {/* Transformations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transformations
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Rotation: {settings.rotation}°</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={settings.rotation}
                        onChange={(e) => setSettings(prev => ({ ...prev, rotation: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.flipHorizontal}
                          onChange={(e) => setSettings(prev => ({ ...prev, flipHorizontal: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Flip Horizontal</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.flipVertical}
                          onChange={(e) => setSettings(prev => ({ ...prev, flipVertical: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Flip Vertical</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={applyChanges}
                  disabled={isProcessing}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Applying Changes...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Apply Changes
                    </>
                  )}
                </button>

                {/* Download Edited Image Button */}
                {currentImage && (
                  <button
                    onClick={downloadEditedImage}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Download Edited Image
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Images List */}
        {images.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Edited Images ({images.length})
              </h3>
              <button
                onClick={clearAll}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={image.dataUrl}
                      alt={`Edited ${image.original.name}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {image.edited.name}
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {image.operations.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatFileSize(image.originalSize)} → {formatFileSize(image.editedSize)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentImage(image)}
                        className="p-2 text-primary-600 hover:text-primary-700"
                        title="Edit"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadImage(image)}
                        className="p-2 text-green-600 hover:text-green-700"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                        title="Remove"
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
            <p className="text-gray-600 dark:text-gray-400">Processing images...</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}