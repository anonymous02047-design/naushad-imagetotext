'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Download, 
  FileText, 
  FileImage, 
  Settings, 
  Trash2,
  Loader2,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

interface PDFToImageProps {
  className?: string
}

interface PDFPage {
  pageNumber: number
  imageData: string
}

export default function PDFToImage({ className }: PDFToImageProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PDFPage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState({
    format: 'png',
    quality: 0.9,
    scale: 2
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file')
      return
    }

    setPdfFile(file)
    setPages([])
    toast.success('PDF file uploaded successfully')
  }

  const convertPDFToImages = async () => {
    if (!pdfFile) {
      toast.error('Please upload a PDF file first')
      return
    }

    setIsProcessing(true)
    try {
      // Dynamic import for PDF.js
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      const newPages: PDFPage[] = []

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: settings.scale })
        
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        const imageData = canvas.toDataURL(`image/${settings.format}`, settings.quality)
        newPages.push({
          pageNumber: pageNum,
          imageData
        })
      }

      setPages(newPages)
      toast.success(`PDF converted to ${newPages.length} image(s)`)
    } catch (error) {
      console.error('Error converting PDF:', error)
      toast.error('Failed to convert PDF. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = (page: PDFPage) => {
    const link = document.createElement('a')
    link.href = page.imageData
    link.download = `page-${page.pageNumber}.${settings.format}`
    link.click()
    toast.success(`Page ${page.pageNumber} downloaded`)
  }

  const downloadAllImages = () => {
    pages.forEach((page, index) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = page.imageData
        link.download = `page-${page.pageNumber}.${settings.format}`
        link.click()
      }, index * 100) // Stagger downloads
    })
    toast.success('All images downloaded')
  }

  const clearAll = () => {
    setPdfFile(null)
    setPages([])
    toast.success('All data cleared')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card ${className}`}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
        <FileText className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
        PDF to Image Converter
      </h2>

      <div className="space-y-6">
        {/* Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload PDF File
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Click to upload PDF or drag and drop
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Supports PDF files
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handlePDFUpload}
            className="hidden"
          />
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Output Format
            </label>
            <select
              value={settings.format}
              onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value }))}
              className="input-field"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Scale
            </label>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={settings.scale}
              onChange={(e) => setSettings(prev => ({ ...prev, scale: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{settings.scale}x</div>
          </div>
        </div>

        {/* Convert Button */}
        {pdfFile && pages.length === 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={convertPDFToImages}
            disabled={isProcessing}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Converting PDF...
              </>
            ) : (
              <>
                <FileImage className="w-5 h-5 mr-2" />
                Convert to Images
              </>
            )}
          </motion.button>
        )}

        {/* Pages Preview */}
        {pages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Converted Pages ({pages.length})
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={downloadAllImages}
                  className="btn-secondary flex items-center space-x-1 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All</span>
                </button>
                <button
                  onClick={clearAll}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <div key={page.pageNumber} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="relative group">
                    <img
                      src={page.imageData}
                      alt={`Page ${page.pageNumber}`}
                      className="w-full h-48 object-contain bg-gray-50 dark:bg-gray-800 rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => downloadImage(page)}
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-medium transition-opacity"
                      >
                        <Download className="w-4 h-4 inline mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Page {page.pageNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
