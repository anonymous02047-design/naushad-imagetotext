'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { RotateCw, ZoomIn, ZoomOut, Download, X } from 'lucide-react'
import Image from 'next/image'

interface ImagePreviewProps {
  image: File
  isProcessing: boolean
  processingProgress: number
}

export default function ImagePreview({ image, isProcessing, processingProgress }: ImagePreviewProps) {
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Create object URL for the image
  useState(() => {
    const url = URL.createObjectURL(image)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  })

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = image.name
    link.click()
  }

  const resetTransform = () => {
    setRotation(0)
    setScale(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Image Preview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
          </span>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div className="relative aspect-video">
          <motion.div
            animate={{ 
              rotate: rotation,
              scale: scale 
            }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-contain"
                onClick={() => setShowFullscreen(true)}
              />
            )}
          </motion.div>

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="loading-dots mx-auto mb-4">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <p className="text-lg font-medium">Processing Image...</p>
                <p className="text-sm opacity-75">{processingProgress}%</p>
                <div className="w-48 bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
            disabled={isProcessing}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
            disabled={isProcessing}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
            disabled={isProcessing}
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2">
          <button
            onClick={resetTransform}
            className="btn-secondary text-sm"
            disabled={isProcessing}
          >
            Reset View
          </button>
          <button
            onClick={handleDownload}
            className="btn-secondary text-sm flex items-center"
            disabled={isProcessing}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          Click image to view fullscreen
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl max-h-full"
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Fullscreen preview"
                width={800}
                height={600}
                className="object-contain max-w-full max-h-full"
              />
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
