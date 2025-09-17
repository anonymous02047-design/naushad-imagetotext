'use client'

import { useState } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ImagePreview from '@/components/ImagePreview'
import ImageProcessor from '@/components/ImageProcessor'
import TextExtractor from '@/components/TextExtractor'
import TextDisplay from '@/components/TextDisplay'
import BatchProcessor from '@/components/BatchProcessor'
import PDFProcessor from '@/components/PDFProcessor'
import AdvancedOCRSettings, { OCRSettings } from '@/components/AdvancedOCRSettings'
import TextAnalyzer from '@/components/TextAnalyzer'
import ExportManager from '@/components/ExportManager'
import QRCodeGenerator from '@/components/QRCodeGenerator' // Added QRCodeGenerator
import URLShortener from '@/components/URLShortener' // Added URLShortener
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Trash2, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [processedImage, setProcessedImage] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [ocrSettings, setOcrSettings] = useState<OCRSettings>({
    confidenceThreshold: 60,
    pageSegmentationMode: 3,
    ocrEngineMode: 3,
    enablePreprocessing: true,
    enableBinarization: false,
    enableDeskew: true,
    enableDenoise: false
  })
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'pdf' | 'qr' | 'url'>('single')

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    setProcessedImage(file)
    setExtractedText('')
  }

  const handleProcessedImage = (file: File) => {
    setProcessedImage(file)
  }

  const handleTextExtracted = (text: string, filename?: string) => {
    setExtractedText(text)
  }

  const handleProcessingState = (processing: boolean, progress: number = 0) => {
    setIsProcessing(processing)
    setProcessingProgress(progress)
  }

  const handleOcrSettingsChange = (settings: OCRSettings) => {
    setOcrSettings(settings)
  }

  const clearAllData = () => {
    setSelectedImage(null)
    setProcessedImage(null)
    setExtractedText('')
    setIsProcessing(false)
    setProcessingProgress(0)
    setOcrSettings({
      confidenceThreshold: 60,
      pageSegmentationMode: 3,
      ocrEngineMode: 3,
      enablePreprocessing: true,
      enableBinarization: false,
      enableDeskew: true,
      enableDenoise: false
    })
    toast.success('All data cleared successfully!')
  }

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'u',
      ctrlKey: true,
      action: () => {
        if (!isProcessing) {
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
          fileInput?.click()
          toast.success('File picker opened (Ctrl+U)')
        }
      },
      description: 'Upload image'
    },
    {
      key: 'c',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        if (extractedText) {
          navigator.clipboard.writeText(extractedText)
          toast.success('Text copied to clipboard (Ctrl+Shift+C)')
        }
      },
      description: 'Copy text to clipboard'
    },
    {
      key: 'd',
      ctrlKey: true,
      action: () => {
        if (extractedText) {
          const blob = new Blob([extractedText], { type: 'text/plain' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `extracted-text-${Date.now()}.txt`
          link.click()
          URL.revokeObjectURL(url)
          toast.success('Text downloaded (Ctrl+D)')
        }
      },
      description: 'Download text'
    },
    {
      key: 'r',
      ctrlKey: true,
      action: () => {
        if (selectedImage || extractedText) {
          clearAllData()
        }
      },
      description: 'Clear all data'
    },
    {
      key: 'h',
      ctrlKey: true,
      action: () => {
        const helpButton = document.querySelector('[title*="Keyboard shortcuts"]') as HTMLButtonElement
        helpButton?.click()
        toast.success('Keyboard shortcuts opened (Ctrl+H)')
      },
      description: 'Show keyboard shortcuts'
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Image to Text
              <span className="text-primary-600 dark:text-primary-400"> Converter</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Extract text from images with advanced OCR technology. Support for multiple languages, 
              image preprocessing, and intelligent text recognition.
            </motion.p>
          </div>

                  {/* Tab Navigation and Clear Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex justify-center items-center mb-8 space-x-4"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setActiveTab('single')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          activeTab === 'single'
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        Single Image
                      </button>
                      <button
                        onClick={() => setActiveTab('batch')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          activeTab === 'batch'
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        Batch Processing
                      </button>
                      <button
                        onClick={() => setActiveTab('pdf')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          activeTab === 'pdf'
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        PDF to Text
                      </button>
                      <button
                        onClick={() => setActiveTab('qr')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          activeTab === 'qr'
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        QR Generator
                      </button>
                      <button
                        onClick={() => setActiveTab('url')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          activeTab === 'url'
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        URL Shortener
                      </button>
                    </div>
                    
                    {/* Clear Button */}
                    {(selectedImage || extractedText || isProcessing) && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearAllData}
                        disabled={isProcessing}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        title="Clear all data"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear All</span>
                      </motion.button>
                    )}
                  </motion.div>

          {/* Main Content */}
          {activeTab === 'single' ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Image Upload and Preview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-6"
              >
                <ImageUploader 
                  onImageSelect={handleImageSelect}
                  isProcessing={isProcessing}
                />
                
                {selectedImage && (
                  <ImagePreview 
                    image={selectedImage}
                    isProcessing={isProcessing}
                    processingProgress={processingProgress}
                  />
                )}
              </motion.div>

              {/* Middle Column - Image Processing and OCR Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="space-y-6"
              >
                {selectedImage && (
                  <ImageProcessor
                    image={selectedImage}
                    onProcessedImage={handleProcessedImage}
                  />
                )}
                
                <AdvancedOCRSettings
                  onSettingsChange={handleOcrSettingsChange}
                />
              </motion.div>

              {/* Right Column - Text Extraction and Analysis */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-6"
              >
                {processedImage && (
                  <TextExtractor
                    image={processedImage}
                    onTextExtracted={handleTextExtracted}
                    onProcessingState={handleProcessingState}
                    ocrSettings={ocrSettings}
                  />
                )}
                
                {extractedText && (
                  <>
                    <TextDisplay 
                      text={extractedText}
                      originalImage={selectedImage}
                    />
                    <TextAnalyzer text={extractedText} />
                    <ExportManager 
                      text={extractedText}
                      imageName={selectedImage?.name}
                      originalImage={selectedImage}
                    />
                  </>
                )}
              </motion.div>
            </div>
          ) : activeTab === 'batch' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <BatchProcessor />
            </motion.div>
          ) : activeTab === 'pdf' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <PDFProcessor onTextExtracted={handleTextExtracted} />
            </motion.div>
          ) : activeTab === 'qr' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <QRCodeGenerator />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <URLShortener />
            </motion.div>
          )}

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Advanced Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Multi-Language Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Extract text from images in over 100 languages with high accuracy.
                </p>
              </div>
              
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Image Preprocessing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automatic image enhancement for better text recognition accuracy.
                </p>
              </div>
              
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Export Options</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Download extracted text in multiple formats including PDF, TXT, and DOCX.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      
              <Footer />
            </div>
          )
        }
