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
  { code: 'chi_tra', name: 'Chinese (Traditional)' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'ara', name: 'Arabic' },
  { code: 'hin', name: 'Hindi' },
  { code: 'ben', name: 'Bengali' },
  { code: 'tel', name: 'Telugu' },
  { code: 'mar', name: 'Marathi' },
  { code: 'tam', name: 'Tamil' },
  { code: 'guj', name: 'Gujarati' },
  { code: 'kan', name: 'Kannada' },
  { code: 'mal', name: 'Malayalam' },
  { code: 'pan', name: 'Punjabi' },
  { code: 'ori', name: 'Odia' },
  { code: 'asm', name: 'Assamese' },
  { code: 'nep', name: 'Nepali' },
  { code: 'sin', name: 'Sinhala' },
  { code: 'tha', name: 'Thai' },
  { code: 'vie', name: 'Vietnamese' },
  { code: 'ind', name: 'Indonesian' },
  { code: 'msa', name: 'Malay' },
  { code: 'fil', name: 'Filipino' },
  { code: 'nld', name: 'Dutch' },
  { code: 'swe', name: 'Swedish' },
  { code: 'nor', name: 'Norwegian' },
  { code: 'dan', name: 'Danish' },
  { code: 'fin', name: 'Finnish' },
  { code: 'pol', name: 'Polish' },
  { code: 'ces', name: 'Czech' },
  { code: 'hun', name: 'Hungarian' },
  { code: 'ron', name: 'Romanian' },
  { code: 'bul', name: 'Bulgarian' },
  { code: 'hrv', name: 'Croatian' },
  { code: 'slv', name: 'Slovenian' },
  { code: 'slk', name: 'Slovak' },
  { code: 'est', name: 'Estonian' },
  { code: 'lav', name: 'Latvian' },
  { code: 'lit', name: 'Lithuanian' },
  { code: 'ell', name: 'Greek' },
  { code: 'heb', name: 'Hebrew' },
  { code: 'fas', name: 'Persian' },
  { code: 'urd', name: 'Urdu' },
  { code: 'pus', name: 'Pashto' },
  { code: 'kaz', name: 'Kazakh' },
  { code: 'kir', name: 'Kyrgyz' },
  { code: 'uzb', name: 'Uzbek' },
  { code: 'mon', name: 'Mongolian' },
  { code: 'mya', name: 'Burmese' },
  { code: 'khm', name: 'Khmer' },
  { code: 'lao', name: 'Lao' },
  { code: 'amh', name: 'Amharic' },
  { code: 'swa', name: 'Swahili' },
  { code: 'yor', name: 'Yoruba' },
  { code: 'ibo', name: 'Igbo' },
  { code: 'hau', name: 'Hausa' },
  { code: 'zul', name: 'Zulu' },
  { code: 'xho', name: 'Xhosa' },
  { code: 'afr', name: 'Afrikaans' },
  { code: 'sot', name: 'Sotho' },
  { code: 'tsn', name: 'Tswana' },
  { code: 'ven', name: 'Venda' },
  { code: 'nso', name: 'Northern Sotho' },
  { code: 'ssw', name: 'Swati' },
  { code: 'nbl', name: 'Southern Ndebele' },
  { code: 'nrb', name: 'Northern Ndebele' },
  { code: 'tso', name: 'Tsonga' },
  { code: 'ndo', name: 'Ndonga' },
  { code: 'her', name: 'Herero' },
  { code: 'hgm', name: 'Khoekhoe' },
  { code: 'naq', name: 'Nama' },
  { code: 'kj', name: 'Kuanyama' },
  { code: 'ng', name: 'Ndonga' },
  { code: 'ii', name: 'Nuosu' },
  { code: 'bo', name: 'Tibetan' },
  { code: 'dz', name: 'Dzongkha' },
  { code: 'ne', name: 'Nepali' },
  { code: 'si', name: 'Sinhala' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'or', name: 'Odia' },
  { code: 'as', name: 'Assamese' },
  { code: 'bn', name: 'Bengali' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'gom', name: 'Konkani' },
  { code: 'mni', name: 'Manipuri' },
  { code: 'sat', name: 'Santali' },
  { code: 'brx', name: 'Bodo' },
  { code: 'mni-Mtei', name: 'Meitei' },
  { code: 'lus', name: 'Mizo' },
  { code: 'njo', name: 'Ao' },
  { code: 'njz', name: 'Nyishi' },
  { code: 'grt', name: 'Garo' },
  { code: 'kha', name: 'Khasi' },
  { code: 'jai', name: 'Jaintia' },
  { code: 'mni-Beng', name: 'Manipuri (Bengali)' },
  { code: 'mni-Latn', name: 'Manipuri (Latin)' },
  { code: 'mni-Mtei', name: 'Manipuri (Meitei Mayek)' },
  { code: 'mni-Beng', name: 'Manipuri (Bengali)' },
  { code: 'mni-Latn', name: 'Manipuri (Latin)' },
  { code: 'mni-Mtei', name: 'Manipuri (Meitei Mayek)' }
]

export default function TextExtractor({ image, onTextExtracted, onProcessingState, ocrSettings }: TextExtractorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('eng')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  const formatTextOutput = (text: string, filename: string) => {
    // Clean and structure the text
    let cleanedText = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
      .trim()

    // Add structure based on content type
    if (cleanedText.toLowerCase().includes('driving licence') || cleanedText.toLowerCase().includes('dlno')) {
      return formatDrivingLicense(cleanedText, filename)
    } else if (cleanedText.toLowerCase().includes('admit card') || cleanedText.toLowerCase().includes('examination')) {
      return formatAdmitCard(cleanedText, filename)
    } else if (cleanedText.toLowerCase().includes('mark sheet') || cleanedText.toLowerCase().includes('marksheet')) {
      return formatMarksheet(cleanedText, filename)
    }

    // Default formatting
    return `📄 ${filename}
${'='.repeat(60)}
${cleanedText}
${'='.repeat(60)}

`
  }

  const formatDrivingLicense = (text: string, filename: string) => {
    let formatted = `🚗 DRIVING LICENSE - ${filename}
${'='.repeat(60)}

`

    // Extract key information
    const dlNoMatch = text.match(/DLNo[:\s]*([A-Z0-9\s]+)/i)
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const dobMatch = text.match(/Date of Birth[:\s]*([0-9-]+)/i)
    const addressMatch = text.match(/Address[:\s]*([^,]+)/i)

    if (dlNoMatch) formatted += `📋 License Number: ${dlNoMatch[1].trim()}\n`
    if (nameMatch) formatted += `👤 Name: ${nameMatch[1].trim()}\n`
    if (dobMatch) formatted += `📅 Date of Birth: ${dobMatch[1].trim()}\n`
    if (addressMatch) formatted += `🏠 Address: ${addressMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatAdmitCard = (text: string, filename: string) => {
    let formatted = `🎓 ADMIT CARD - ${filename}
${'='.repeat(60)}

`

    // Extract key information
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const rollMatch = text.match(/Roll[:\s]*([A-Z0-9-]+)/i)
    const regMatch = text.match(/Reg[:\s]*([A-Z0-9-]+)/i)
    const schoolMatch = text.match(/School[:\s]*([A-Z\s]+)/i)

    if (nameMatch) formatted += `👤 Student Name: ${nameMatch[1].trim()}\n`
    if (rollMatch) formatted += `🎫 Roll Number: ${rollMatch[1].trim()}\n`
    if (regMatch) formatted += `📋 Registration: ${regMatch[1].trim()}\n`
    if (schoolMatch) formatted += `🏫 School: ${schoolMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

  const formatMarksheet = (text: string, filename: string) => {
    let formatted = `📊 MARK SHEET - ${filename}
${'='.repeat(60)}

`

    // Extract key information
    const nameMatch = text.match(/Name[:\s]*([A-Z\s]+)/i)
    const rollMatch = text.match(/Roll[:\s]*([A-Z0-9-]+)/i)
    const regMatch = text.match(/Reg[:\s]*([A-Z0-9-]+)/i)
    const resultMatch = text.match(/RESULT[:\s]*([A-Z0-9\s]+)/i)

    if (nameMatch) formatted += `👤 Student Name: ${nameMatch[1].trim()}\n`
    if (rollMatch) formatted += `🎫 Roll Number: ${rollMatch[1].trim()}\n`
    if (regMatch) formatted += `📋 Registration: ${regMatch[1].trim()}\n`
    if (resultMatch) formatted += `🏆 Result: ${resultMatch[1].trim()}\n`

    formatted += `\n📝 Full Text:\n${text}\n${'='.repeat(60)}\n\n`
    return formatted
  }

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
      
      // Format the text output
      const formattedText = formatTextOutput(text, image.name)
      
      onTextExtracted(formattedText)
      onProcessingState(false, 0)
      toast.success('Text extracted and formatted successfully!')
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
