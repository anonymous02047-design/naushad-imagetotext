'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Info, Zap, Target, Eye } from 'lucide-react'

interface AdvancedOCRSettingsProps {
  onSettingsChange: (settings: OCRSettings) => void
}

export interface OCRSettings {
  confidenceThreshold: number
  pageSegmentationMode: number
  ocrEngineMode: number
  enablePreprocessing: boolean
  enableBinarization: boolean
  enableDeskew: boolean
  enableDenoise: boolean
}

const PAGE_SEGMENTATION_MODES = [
  { value: 0, label: 'Orientation and script detection (OSD) only' },
  { value: 1, label: 'Automatic page segmentation with OSD' },
  { value: 3, label: 'Fully automatic page segmentation (default)' },
  { value: 6, label: 'Single uniform block of text' },
  { value: 7, label: 'Single text line' },
  { value: 8, label: 'Single word' },
  { value: 10, label: 'Single character' },
  { value: 13, label: 'Raw line. Treat the image as a single text line' }
]

const OCR_ENGINE_MODES = [
  { value: 0, label: 'Legacy engine only' },
  { value: 1, label: 'Neural nets LSTM engine only' },
  { value: 2, label: 'Legacy + LSTM engines' },
  { value: 3, label: 'Default, based on what is available' }
]

export default function AdvancedOCRSettings({ onSettingsChange }: AdvancedOCRSettingsProps) {
  const [settings, setSettings] = useState<OCRSettings>({
    confidenceThreshold: 60,
    pageSegmentationMode: 3,
    ocrEngineMode: 3,
    enablePreprocessing: true,
    enableBinarization: false,
    enableDeskew: true,
    enableDenoise: false
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const updateSetting = <K extends keyof OCRSettings>(key: K, value: OCRSettings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const resetToDefaults = () => {
    const defaultSettings: OCRSettings = {
      confidenceThreshold: 60,
      pageSegmentationMode: 3,
      ocrEngineMode: 3,
      enablePreprocessing: true,
      enableBinarization: false,
      enableDeskew: true,
      enableDenoise: false
    }
    setSettings(defaultSettings)
    onSettingsChange(defaultSettings)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          Advanced OCR Settings
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        >
          <Settings className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="space-y-6">
          {/* Confidence Threshold */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Target className="w-4 h-4 mr-2" />
              Confidence Threshold: {settings.confidenceThreshold}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.confidenceThreshold}
              onChange={(e) => updateSetting('confidenceThreshold', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Minimum confidence level for text recognition (0-100%)
            </p>
          </div>

          {/* Page Segmentation Mode */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Eye className="w-4 h-4 mr-2" />
              Page Segmentation Mode
            </label>
            <select
              value={settings.pageSegmentationMode}
              onChange={(e) => updateSetting('pageSegmentationMode', Number(e.target.value))}
              className="input-field"
            >
              {PAGE_SEGMENTATION_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          {/* OCR Engine Mode */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Zap className="w-4 h-4 mr-2" />
              OCR Engine Mode
            </label>
            <select
              value={settings.ocrEngineMode}
              onChange={(e) => updateSetting('ocrEngineMode', Number(e.target.value))}
              className="input-field"
            >
              {OCR_ENGINE_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          {/* Preprocessing Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Image Preprocessing
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.enablePreprocessing}
                  onChange={(e) => updateSetting('enablePreprocessing', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable automatic preprocessing
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.enableBinarization}
                  onChange={(e) => updateSetting('enableBinarization', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable binarization (black/white conversion)
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.enableDeskew}
                  onChange={(e) => updateSetting('enableDeskew', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable deskewing (rotation correction)
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.enableDenoise}
                  onChange={(e) => updateSetting('enableDenoise', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable noise reduction
                </span>
              </label>
            </div>
          </div>

          {/* Presets */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Presets
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const preset = {
                    ...settings,
                    confidenceThreshold: 80,
                    pageSegmentationMode: 6,
                    enablePreprocessing: true
                  }
                  setSettings(preset)
                  onSettingsChange(preset)
                }}
                className="btn-secondary text-xs"
              >
                High Accuracy
              </button>
              <button
                onClick={() => {
                  const preset = {
                    ...settings,
                    confidenceThreshold: 40,
                    pageSegmentationMode: 3,
                    enablePreprocessing: true
                  }
                  setSettings(preset)
                  onSettingsChange(preset)
                }}
                className="btn-secondary text-xs"
              >
                Fast Processing
              </button>
              <button
                onClick={() => {
                  const preset = {
                    ...settings,
                    confidenceThreshold: 60,
                    pageSegmentationMode: 7,
                    enablePreprocessing: true
                  }
                  setSettings(preset)
                  onSettingsChange(preset)
                }}
                className="btn-secondary text-xs"
              >
                Single Line
              </button>
              <button
                onClick={resetToDefaults}
                className="btn-secondary text-xs"
              >
                Reset Defaults
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Settings Guide:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Higher confidence = more accurate but slower</li>
                  <li>• Page segmentation affects text layout detection</li>
                  <li>• LSTM engine is more accurate for most languages</li>
                  <li>• Preprocessing can improve results on poor quality images</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
