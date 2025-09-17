'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  isProcessing: boolean
}

export default function ImageUploader({ onImageSelect, isProcessing }: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }

      onImageSelect(file)
      toast.success('Image uploaded successfully!')
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.tiff']
    },
    multiple: false,
    disabled: isProcessing,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
        <ImageIcon className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
        Upload Image
      </h2>

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : isDragReject 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{ 
            scale: isDragActive ? 1.05 : 1,
            rotate: isDragActive ? 5 : 0 
          }}
          transition={{ duration: 0.2 }}
        >
          {isDragReject ? (
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          ) : (
            <Upload className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          )}
        </motion.div>

        <div className="space-y-2">
          {isDragReject ? (
            <p className="text-red-600 dark:text-red-400 font-medium">Invalid file type</p>
          ) : isDragActive ? (
            <p className="text-primary-600 dark:text-primary-400 font-medium">Drop the image here</p>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports: JPG, PNG, GIF, BMP, WebP, TIFF (max 10MB)
              </p>
            </>
          )}
        </div>

        {!isProcessing && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 btn-primary"
            onClick={(e) => {
              e.stopPropagation()
              // Trigger file input
              const input = document.querySelector('input[type="file"]') as HTMLInputElement
              input?.click()
            }}
          >
            <FileText className="w-4 h-4 mr-2" />
            Choose File
          </motion.button>
        )}

        {isProcessing && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-primary-600">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span className="text-sm">Processing...</span>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>💡 <strong>Tips for better results:</strong></p>
        <ul className="mt-1 space-y-1 ml-4">
          <li>• Use high-resolution images with clear text</li>
          <li>• Ensure good contrast between text and background</li>
          <li>• Avoid blurry or rotated images</li>
          <li>• Supported languages: English, Spanish, French, German, and 100+ more</li>
        </ul>
      </div>
    </motion.div>
  )
}
