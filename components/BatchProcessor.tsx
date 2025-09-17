'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle, AlertCircle, Download, Trash2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { createWorker } from 'tesseract.js'
import toast from 'react-hot-toast'

interface ProcessedImage {
  id: string
  file: File
  text: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
}

export default function BatchProcessor() {
  const [images, setImages] = useState<ProcessedImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('eng')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: ProcessedImage[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      text: '',
      status: 'pending',
      progress: 0
    }))
    
    setImages(prev => [...prev, ...newImages])
    toast.success(`${acceptedFiles.length} images added to batch`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.tiff']
    },
    multiple: true,
    disabled: isProcessing
  })

  const processBatch = async () => {
    if (images.length === 0) return

    setIsProcessing(true)
    const pendingImages = images.filter(img => img.status === 'pending')
    
    try {
      const worker = await createWorker(selectedLanguage)
      
      for (let i = 0; i < pendingImages.length; i++) {
        const image = pendingImages[i]
        
        // Update status to processing
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'processing' as const } : img
        ))

        try {
          const { data: { text } } = await worker.recognize(image.file)
          
          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { ...img, text, status: 'completed' as const, progress: 100 }
              : img
          ))
        } catch (error) {
          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { ...img, status: 'error' as const, error: 'Processing failed' }
              : img
          ))
        }
      }

      await worker.terminate()
      toast.success('Batch processing completed!')
    } catch (error) {
      toast.error('Batch processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const clearAll = () => {
    setImages([])
  }

  const downloadAll = () => {
    const completedImages = images.filter(img => img.status === 'completed')
    if (completedImages.length === 0) {
      toast.error('No completed images to download')
      return
    }

    const allText = completedImages.map(img => 
      `=== ${img.file.name} ===\n${img.text}\n\n`
    ).join('')

    const blob = new Blob([allText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `batch-extracted-text-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
    
    toast.success('All text downloaded!')
  }

  const completedCount = images.filter(img => img.status === 'completed').length
  const errorCount = images.filter(img => img.status === 'error').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Batch Processing</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedCount}/{images.length} completed
          </span>
          {errorCount > 0 && (
            <span className="text-sm text-red-500">
              {errorCount} errors
            </span>
          )}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 mb-4
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-primary-500 mx-auto mb-2" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          Drop multiple images here or click to select
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Process up to 10 images at once
        </p>
      </div>

      {/* Language Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="input-field"
          disabled={isProcessing}
        >
          <option value="eng">English</option>
          <option value="spa">Spanish</option>
          <option value="fra">French</option>
          <option value="deu">German</option>
          <option value="chi_sim">Chinese (Simplified)</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={processBatch}
          disabled={isProcessing || images.length === 0}
          className="btn-primary flex-1"
        >
          {isProcessing ? 'Processing...' : `Process ${images.length} Images`}
        </button>
        
        {images.length > 0 && (
          <>
            <button
              onClick={downloadAll}
              disabled={completedCount === 0}
              className="btn-secondary flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              Download All
            </button>
            <button
              onClick={clearAll}
              className="btn-secondary flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </button>
          </>
        )}
      </div>

      {/* Image List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {images.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  {image.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {image.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {image.status === 'processing' && (
                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {image.status === 'pending' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {image.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(image.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {image.status === 'processing' && (
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${image.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {image.progress}%
                  </span>
                </div>
              )}

              <button
                onClick={() => removeImage(image.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No images added yet</p>
        </div>
      )}
    </motion.div>
  )
}
