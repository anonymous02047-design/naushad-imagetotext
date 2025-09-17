'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Download, 
  FileText, 
  Settings, 
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

interface PDFCompressorProps {
  className?: string
}

interface CompressedPDF {
  original: File
  compressed: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
  dataUrl: string
}

export default function PDFCompressor({ className }: PDFCompressorProps) {
  const [pdfs, setPdfs] = useState<CompressedPDF[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState({
    quality: 0.9,
    imageQuality: 0.85,
    removeMetadata: true,
    optimizeImages: true
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const pdfFiles = files.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length === 0) {
      toast.error('Please select valid PDF files')
      return
    }

    compressPDFs(pdfFiles)
  }

  const compressPDFs = async (files: File[]) => {
    setIsProcessing(true)
    try {
      const compressedPDFs: CompressedPDF[] = []

      for (const file of files) {
        const compressed = await compressPDF(file)
        if (compressed) {
          compressedPDFs.push(compressed)
        }
      }

      setPdfs(prev => [...prev, ...compressedPDFs])
      toast.success(`${compressedPDFs.length} PDF(s) compressed successfully`)
    } catch (error) {
      console.error('Error compressing PDFs:', error)
      toast.error('Failed to compress PDFs. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const compressPDF = async (file: File): Promise<CompressedPDF | null> => {
    try {
      // Dynamic import for PDF.js
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      }).promise
      
      // Create a new PDF document with better settings
      const { jsPDF } = await import('jspdf')
      const compressedPdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      })

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        
        // Use higher scale for better quality
        const scale = Math.min(2.0, settings.quality * 2) // Scale based on quality setting
        const viewport = page.getViewport({ scale })
        
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.height = viewport.height
        canvas.width = viewport.width

        // Enable text rendering optimizations
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = 'high'

        await page.render({
          canvasContext: context,
          viewport: viewport,
          intent: 'display'
        }).promise

        // Add new page for each page (except the first one)
        if (pageNum > 1) {
          compressedPdf.addPage()
        }

        // Calculate dimensions to fit page
        const pageWidth = compressedPdf.internal.pageSize.getWidth()
        const pageHeight = compressedPdf.internal.pageSize.getHeight()
        
        const imgAspectRatio = canvas.width / canvas.height
        const pageAspectRatio = pageWidth / pageHeight

        let imgWidth, imgHeight
        if (imgAspectRatio > pageAspectRatio) {
          imgWidth = pageWidth
          imgHeight = pageWidth / imgAspectRatio
        } else {
          imgHeight = pageHeight
          imgWidth = pageHeight * imgAspectRatio
        }

        // Center the image
        const x = (pageWidth - imgWidth) / 2
        const y = (pageHeight - imgHeight) / 2

        // Use PNG for better text quality, JPEG only for very low quality settings
        const usePNG = settings.imageQuality > 0.7
        const format = usePNG ? 'image/png' : 'image/jpeg'
        const quality = usePNG ? 1.0 : settings.imageQuality
        
        // Convert canvas to data URL with better quality settings
        const imgData = canvas.toDataURL(format, quality)
        
        // Add image to PDF with better compression
        compressedPdf.addImage(imgData, format.split('/')[1].toUpperCase(), x, y, imgWidth, imgHeight, undefined, 'FAST')
      }

      // Generate compressed PDF with better settings
      const compressedPdfBlob = compressedPdf.output('blob')
      
      const compressedFile = new File([compressedPdfBlob], file.name.replace('.pdf', '_compressed.pdf'), {
        type: 'application/pdf'
      })

      const compressionRatio = ((file.size - compressedFile.size) / file.size) * 100

      return {
        original: file,
        compressed: compressedFile,
        originalSize: file.size,
        compressedSize: compressedFile.size,
        compressionRatio,
        dataUrl: URL.createObjectURL(compressedFile)
      }
    } catch (error) {
      console.error('Error compressing PDF:', error)
      toast.error(`Failed to compress PDF: ${file.name}`)
      return null
    }
  }

  const downloadPDF = (pdf: CompressedPDF) => {
    const link = document.createElement('a')
    link.href = pdf.dataUrl
    link.download = pdf.compressed.name
    link.click()
    toast.success('PDF downloaded')
  }

  const downloadAllPDFs = () => {
    pdfs.forEach((pdf, index) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = pdf.dataUrl
        link.download = pdf.compressed.name
        link.click()
      }, index * 100)
    })
    toast.success('All PDFs downloaded')
  }

  const removePDF = (index: number) => {
    setPdfs(prev => prev.filter((_, i) => i !== index))
    toast.success('PDF removed')
  }

  const clearAll = () => {
    setPdfs([])
    toast.success('All PDFs cleared')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const totalOriginalSize = pdfs.reduce((sum, pdf) => sum + pdf.originalSize, 0)
  const totalCompressedSize = pdfs.reduce((sum, pdf) => sum + pdf.compressedSize, 0)
  const totalSavings = totalOriginalSize - totalCompressedSize
  const totalSavingsPercent = totalOriginalSize > 0 ? (totalSavings / totalOriginalSize) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card ${className}`}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
        <Zap className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
        PDF Compressor
      </h2>

      <div className="space-y-6">
        {/* Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload PDF Files
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Click to upload PDFs or drag and drop
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Supports PDF files
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            onChange={handlePDFUpload}
            className="hidden"
          />
        </div>

        {/* Quality Presets */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quality Presets
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSettings(prev => ({ ...prev, quality: 0.95, imageQuality: 0.9 }))}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                settings.quality >= 0.95 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              High Quality
            </button>
            <button
              onClick={() => setSettings(prev => ({ ...prev, quality: 0.85, imageQuality: 0.8 }))}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                settings.quality >= 0.8 && settings.quality < 0.95 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Balanced
            </button>
            <button
              onClick={() => setSettings(prev => ({ ...prev, quality: 0.7, imageQuality: 0.6 }))}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                settings.quality >= 0.6 && settings.quality < 0.8 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Compressed
            </button>
            <button
              onClick={() => setSettings(prev => ({ ...prev, quality: 0.5, imageQuality: 0.4 }))}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                settings.quality < 0.6 ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Maximum Compression
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Overall Quality
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={settings.quality}
              onChange={(e) => setSettings(prev => ({ ...prev, quality: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{Math.round(settings.quality * 100)}%</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image Quality
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={settings.imageQuality}
              onChange={(e) => setSettings(prev => ({ ...prev, imageQuality: Number(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{Math.round(settings.imageQuality * 100)}%</div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="removeMetadata"
              checked={settings.removeMetadata}
              onChange={(e) => setSettings(prev => ({ ...prev, removeMetadata: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="removeMetadata" className="text-sm text-gray-700 dark:text-gray-300">
              Remove Metadata
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="optimizeImages"
              checked={settings.optimizeImages}
              onChange={(e) => setSettings(prev => ({ ...prev, optimizeImages: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="optimizeImages" className="text-sm text-gray-700 dark:text-gray-300">
              Optimize Images
            </label>
          </div>
        </div>

        {/* Statistics */}
        {pdfs.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Compression Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatFileSize(totalOriginalSize)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Original Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatFileSize(totalCompressedSize)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Compressed Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {totalSavingsPercent.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Space Saved</div>
              </div>
            </div>
          </div>
        )}

        {/* PDFs Preview */}
        {pdfs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Compressed PDFs ({pdfs.length})
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={downloadAllPDFs}
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
                  <span>Clear All</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {pdfs.map((pdf, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {pdf.compressed.name}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>Original: {formatFileSize(pdf.originalSize)}</span>
                        <span>Compressed: {formatFileSize(pdf.compressedSize)}</span>
                        <span className="text-green-600 font-medium">
                          {pdf.compressionRatio.toFixed(1)}% smaller
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadPDF(pdf)}
                        className="btn-primary flex items-center space-x-1 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => removePDF(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary-600" />
            <p className="text-gray-600 dark:text-gray-400">Compressing PDFs...</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
