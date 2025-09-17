'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Download, 
  FileImage, 
  FileText, 
  Settings, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

interface ImageToPDFProps {
  className?: string
}

export default function ImageToPDF({ className }: ImageToPDFProps) {
  const [images, setImages] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 10,
    quality: 0.9
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files')
      return
    }

    setImages(prev => [...prev, ...imageFiles])
    toast.success(`${imageFiles.length} image(s) added`)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    toast.success('Image removed')
  }

  const convertToPDF = async () => {
    if (images.length === 0) {
      toast.error('Please add at least one image')
      return
    }

    setIsProcessing(true)
    try {
      const pdf = new jsPDF({
        orientation: settings.orientation as 'portrait' | 'landscape',
        unit: 'mm',
        format: settings.pageSize.toLowerCase() as any
      })

      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        
        // Add new page for each image (except the first one)
        if (i > 0) {
          pdf.addPage()
        }

        // Create image element to get dimensions
        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        await new Promise((resolve) => {
          img.onload = () => {
            // Calculate dimensions to fit page with margins
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            const margin = settings.margin
            const availableWidth = pageWidth - (margin * 2)
            const availableHeight = pageHeight - (margin * 2)

            const imgAspectRatio = img.width / img.height
            const pageAspectRatio = availableWidth / availableHeight

            let imgWidth, imgHeight
            if (imgAspectRatio > pageAspectRatio) {
              imgWidth = availableWidth
              imgHeight = availableWidth / imgAspectRatio
            } else {
              imgHeight = availableHeight
              imgWidth = availableHeight * imgAspectRatio
            }

            // Center the image
            const x = (pageWidth - imgWidth) / 2
            const y = (pageHeight - imgHeight) / 2

            // Draw image to canvas
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            // Convert canvas to data URL
            const imgData = canvas.toDataURL('image/jpeg', settings.quality)
            
            // Add image to PDF
            pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight)
            resolve(true)
          }
          img.src = URL.createObjectURL(image)
        })
      }

      // Download the PDF
      const fileName = `images-to-pdf-${Date.now()}.pdf`
      pdf.save(fileName)
      
      toast.success('PDF created successfully!')
    } catch (error) {
      console.error('Error creating PDF:', error)
      toast.error('Failed to create PDF. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const clearAll = () => {
    setImages([])
    toast.success('All images cleared')
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
        Image to PDF Converter
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

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Page Size
            </label>
            <select
              value={settings.pageSize}
              onChange={(e) => setSettings(prev => ({ ...prev, pageSize: e.target.value }))}
              className="input-field"
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Orientation
            </label>
            <select
              value={settings.orientation}
              onChange={(e) => setSettings(prev => ({ ...prev, orientation: e.target.value }))}
              className="input-field"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Margin (mm)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={settings.margin}
              onChange={(e) => setSettings(prev => ({ ...prev, margin: Number(e.target.value) }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quality
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.quality}
              onChange={(e) => setSettings(prev => ({ ...prev, quality: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{Math.round(settings.quality * 100)}%</div>
          </div>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Images ({images.length})
              </h3>
              <button
                onClick={clearAll}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Convert Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={convertToPDF}
          disabled={images.length === 0 || isProcessing}
          className="btn-primary w-full flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating PDF...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 mr-2" />
              Convert to PDF
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
