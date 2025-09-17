'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCw, Sun, Contrast, Filter, Undo2 } from 'lucide-react'

interface ImageProcessorProps {
  image: File
  onProcessedImage: (processedImage: File) => void
}

export default function ImageProcessor({ image, onProcessedImage }: ImageProcessorProps) {
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const originalImageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      originalImageRef.current = img
      processImage()
    }
    img.src = URL.createObjectURL(image)
  }, [image])

  const processImage = () => {
    if (!originalImageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = originalImageRef.current

    if (!ctx) return

    // Set canvas size
    canvas.width = img.width
    canvas.height = img.height

    // Apply transformations
    ctx.save()
    
    // Rotate
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    // Apply brightness and contrast
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`

    // Draw image
    ctx.drawImage(img, 0, 0)

    ctx.restore()

    // Convert to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        setProcessedImageUrl(url)
        
        // Create new file from processed image
        const processedFile = new File([blob], image.name, { type: image.type })
        onProcessedImage(processedFile)
      }
    }, image.type, 0.9)
  }

  useEffect(() => {
    processImage()
  }, [brightness, contrast, rotation])

  const resetFilters = () => {
    setBrightness(100)
    setContrast(100)
    setRotation(0)
  }

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Filter className="w-5 h-5 mr-2 text-primary-600" />
          Image Processing
        </h2>
        <button
          onClick={resetFilters}
          className="btn-secondary text-sm flex items-center"
        >
          <Undo2 className="w-4 h-4 mr-1" />
          Reset
        </button>
      </div>

      {/* Processed Image Preview */}
      <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <div className="relative aspect-video">
          {processedImageUrl && (
            <img
              src={processedImageUrl}
              alt="Processed preview"
              className="w-full h-full object-contain"
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Brightness */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Sun className="w-4 h-4 mr-2" />
            Brightness: {brightness}%
          </label>
          <input
            type="range"
            min="50"
            max="200"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Contrast */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Contrast className="w-4 h-4 mr-2" />
            Contrast: {contrast}%
          </label>
          <input
            type="range"
            min="50"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Rotation */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <RotateCw className="w-4 h-4 mr-2" />
            Rotation: {rotation}°
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="360"
              step="90"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <button
              onClick={rotateImage}
              className="p-2 bg-primary-100 hover:bg-primary-200 text-primary-600 rounded-lg transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setBrightness(120)
              setContrast(110)
            }}
            className="btn-secondary text-xs"
          >
            Enhance
          </button>
          <button
            onClick={() => {
              setBrightness(80)
              setContrast(120)
            }}
            className="btn-secondary text-xs"
          >
            High Contrast
          </button>
          <button
            onClick={() => {
              setBrightness(90)
              setContrast(90)
            }}
            className="btn-secondary text-xs"
          >
            Soft
          </button>
          <button
            onClick={() => {
              setBrightness(110)
              setContrast(100)
            }}
            className="btn-secondary text-xs"
          >
            Bright
          </button>
        </div>
      </div>
    </motion.div>
  )
}
