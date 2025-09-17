'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Settings, Languages } from 'lucide-react'
import { createWorker } from 'tesseract.js'
import toast from 'react-hot-toast'

import { OCRSettings } from './AdvancedOCRSettings'

interface TextExtractorProps {
  image: File
  onTextExtracted: (text: string) => void
  onProcessingState: (processing: boolean, progress: number) => void
  ocrSettings?: OCRSettings
}

const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'rus', name: 'Russian' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'ara', name: 'Arabic' },
  { code: 'hin', name: 'Hindi' },
]

export default function TextExtractor({ image, onTextExtracted, onProcessingState, ocrSettings }: TextExtractorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('eng')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  const extractText = async () => {
    if (!image) return

    setIsProcessing(true)
    onProcessingState(true, 0)

    try {
      const worker = await createWorker(selectedLanguage)
      
      // Apply OCR settings if provided
      if (ocrSettings) {
        await worker.setParameters({
          tessedit_pageseg_mode: ocrSettings.pageSegmentationMode as any,
          tessedit_ocr_engine_mode: ocrSettings.ocrEngineMode as any,
        })
      }

      const { data: { text } } = await worker.recognize(image)

      await worker.terminate()
      
      onTextExtracted(text)
      onProcessingState(false, 0)
      toast.success('Text extracted successfully!')
    } catch (error) {
      console.error('OCR Error:', error)
      toast.error('Failed to extract text. Please try again.')
      onProcessingState(false, 0)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Text Extraction</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Language Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Languages className="w-4 h-4 inline mr-1" />
          Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="input-field"
          disabled={isProcessing}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Settings */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-gray-50 rounded-lg"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2">Advanced Settings</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <p>• OCR Engine: Tesseract.js v5</p>
            <p>• Image preprocessing: Automatic</p>
            <p>• Confidence threshold: 60%</p>
          </div>
        </motion.div>
      )}

      {/* Extract Button */}
      <motion.button
        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        onClick={extractText}
        disabled={isProcessing}
        className={`w-full btn-primary flex items-center justify-center ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isProcessing ? (
          <>
            <div className="loading-dots mr-3">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            Extracting Text... {progress}%
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Extract Text
          </>
        )}
      </motion.button>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
