'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle, AlertCircle, Download, Trash2, FileText, Image, Settings, Filter, Search, Copy, Save, Clock, BarChart3, Zap } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { createWorker } from 'tesseract.js'
import toast from 'react-hot-toast'

interface ProcessedFile {
  id: string
  file: File
  text: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
  type: 'image' | 'pdf'
  processingTime?: number
  wordCount?: number
  confidence?: number
  processedAt?: Date
}

export default function BatchProcessor() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('eng')
  const [showSettings, setShowSettings] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'error' | 'pending'>('all')
  const [processingStats, setProcessingStats] = useState({
    totalFiles: 0,
    completedFiles: 0,
    errorFiles: 0,
    totalWords: 0,
    averageConfidence: 0,
    totalProcessingTime: 0
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: ProcessedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      text: '',
      status: 'pending',
      progress: 0,
      type: file.type.startsWith('image/') ? 'image' : 'pdf'
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    toast.success(`${acceptedFiles.length} files added to batch`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.tiff'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    disabled: isProcessing
  })

  const processBatch = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    const pendingFiles = files.filter(file => file.status === 'pending')
    
    try {
      const worker = await createWorker(selectedLanguage)
      
      for (let i = 0; i < pendingFiles.length; i++) {
        const file = pendingFiles[i]
        
        // Update status to processing
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing' as const } : f
        ))

        try {
          const fileStartTime = Date.now()
          let extractedText = ''
          let confidence = 0
          let wordCount = 0
          
          if (file.type === 'image') {
            // Process image with Tesseract
            const { data: { text, confidence: conf } } = await worker.recognize(file.file)
            extractedText = text
            confidence = conf
            wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length
          } else if (file.type === 'pdf') {
            // Process PDF with PDF.js + OCR fallback
            const pdfjsLib = await import('pdfjs-dist')
            
            // Set worker source with fallback
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
              pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
            }
            
            try {
              const arrayBuffer = await file.file.arrayBuffer()
              console.log(`Processing PDF: ${file.file.name}, size: ${arrayBuffer.byteLength} bytes`)
              
              const pdf = await pdfjsLib.getDocument({ 
                data: arrayBuffer,
                useWorkerFetch: false,
                isEvalSupported: false,
                useSystemFonts: true,
                verbosity: 0,
                disableAutoFetch: true,
                disableStream: true
              }).promise
              
              console.log(`PDF loaded: ${pdf.numPages} pages`)
              const allText: string[] = []
              let hasTextContent = false
              
              // First try to extract text directly
              for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                try {
                  const page = await pdf.getPage(pageNum)
                  const textContent = await page.getTextContent()
                  
                  console.log(`Page ${pageNum} text items:`, textContent.items.length)
                  
                  const pageText = textContent.items
                    .filter((item: any) => item.str && typeof item.str === 'string' && item.str.trim().length > 0)
                    .map((item: any) => item.str.trim())
                    .join(' ')
                  
                  if (pageText.trim().length > 0) {
                    allText.push(`Page ${pageNum}:\n${pageText}`)
                    hasTextContent = true
                    console.log(`Page ${pageNum} extracted text length:`, pageText.length)
                  }
                } catch (pageError) {
                  console.error(`Error processing page ${pageNum}:`, pageError)
                }
              }
              
              // If no text content found, use OCR on PDF pages
              if (!hasTextContent) {
                console.log(`No text content found, using OCR for PDF: ${file.file.name}`)
                
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                  try {
                    const page = await pdf.getPage(pageNum)
                    const viewport = page.getViewport({ scale: 2.0 })
                    
                    // Create canvas to render PDF page as image
                    const canvas = document.createElement('canvas')
                    const context = canvas.getContext('2d')
                    canvas.height = viewport.height
                    canvas.width = viewport.width
                    
                    // Render PDF page to canvas
                    await page.render({
                      canvasContext: context!,
                      viewport: viewport
                    }).promise
                    
                    // Convert canvas to blob and process with Tesseract
                    const blob = await new Promise<Blob>((resolve) => {
                      canvas.toBlob((blob) => resolve(blob!), 'image/png')
                    })
                    
                    // Create a temporary file for OCR processing
                    const tempFile = new File([blob], `page_${pageNum}.png`, { type: 'image/png' })
                    
                    // Use Tesseract to extract text from the rendered page
                    const { data: { text } } = await worker.recognize(tempFile)
                    
                    if (text.trim().length > 0) {
                      allText.push(`Page ${pageNum} (OCR):\n${text}`)
                      console.log(`Page ${pageNum} OCR text length:`, text.length)
                    }
                  } catch (ocrError) {
                    console.error(`Error with OCR on page ${pageNum}:`, ocrError)
                    allText.push(`Page ${pageNum}: OCR processing failed`)
                  }
                }
              }
              
              if (allText.length > 0) {
                extractedText = allText.join('\n\n')
                console.log(`Total extracted text length:`, extractedText.length)
              } else {
                extractedText = `No text content found in PDF "${file.file.name}" even with OCR processing.`
                console.log(`No text found in PDF: ${file.file.name}`)
              }
              
            } catch (pdfError) {
              console.error('PDF processing error:', pdfError)
              extractedText = `Error processing PDF "${file.file.name}": ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`
            }
          }
          
          const processingTime = Date.now() - fileStartTime
          const finalWordCount = extractedText.trim().split(/\s+/).filter(word => word.length > 0).length
          
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { 
                  ...f, 
                  text: extractedText, 
                  status: 'completed' as const, 
                  progress: 100,
                  processingTime,
                  wordCount: finalWordCount,
                  confidence,
                  processedAt: new Date()
                }
              : f
          ))
        } catch (error) {
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'error' as const, error: 'Processing failed' }
              : f
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

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const clearAll = () => {
    setFiles([])
    setProcessingStats({
      totalFiles: 0,
      completedFiles: 0,
      errorFiles: 0,
      totalWords: 0,
      averageConfidence: 0,
      totalProcessingTime: 0
    })
  }

  const calculateStats = () => {
    const completedFiles = files.filter(f => f.status === 'completed')
    const errorFiles = files.filter(f => f.status === 'error')
    const totalWords = completedFiles.reduce((sum, f) => sum + (f.wordCount || 0), 0)
    const totalProcessingTime = completedFiles.reduce((sum, f) => sum + (f.processingTime || 0), 0)
    const averageConfidence = completedFiles.length > 0 
      ? completedFiles.reduce((sum, f) => sum + (f.confidence || 0), 0) / completedFiles.length 
      : 0

    setProcessingStats({
      totalFiles: files.length,
      completedFiles: completedFiles.length,
      errorFiles: errorFiles.length,
      totalWords,
      averageConfidence,
      totalProcessingTime
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Text copied to clipboard!')
  }

  const saveAsFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    toast.success('File saved!')
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || file.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Update stats when files change
  useEffect(() => {
    calculateStats()
  }, [files])

  const downloadAll = () => {
    const completedFiles = files.filter(file => file.status === 'completed')
    if (completedFiles.length === 0) {
      toast.error('No completed files to download')
      return
    }

    const allText = completedFiles.map(file => 
      `=== ${file.file.name} (${file.type.toUpperCase()}) ===\n${file.text}\n\n`
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

  const completedCount = files.filter(file => file.status === 'completed').length
  const errorCount = files.filter(file => file.status === 'error').length

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
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedCount}/{files.length} completed
          </span>
          {errorCount > 0 && (
            <span className="text-sm text-red-500">
              {errorCount} errors
            </span>
          )}
        </div>
      </div>

      {/* Statistics Panel */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Files</span>
            </div>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{processingStats.totalFiles}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">Completed</span>
            </div>
            <p className="text-lg font-bold text-green-900 dark:text-green-100">{processingStats.completedFiles}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Words</span>
            </div>
            <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{processingStats.totalWords.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Avg Time</span>
            </div>
            <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
              {processingStats.completedFiles > 0 ? Math.round(processingStats.totalProcessingTime / processingStats.completedFiles / 1000) : 0}s
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      {files.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files or text content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Files</option>
              <option value="completed">Completed</option>
              <option value="error">Errors</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      )}

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
          Drop multiple files here or click to select
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Support for images (JPG, PNG, GIF, etc.) and PDF files
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
          disabled={isProcessing || files.length === 0}
          className="btn-primary flex-1"
        >
          {isProcessing ? 'Processing...' : `Process ${files.length} Files`}
        </button>
        
        {files.length > 0 && (
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

      {/* File List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredFiles.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  {file.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {file.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {file.status === 'processing' && (
                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {file.status === 'pending' && (
                    file.type === 'image' ? <Image className="w-4 h-4 text-gray-400" /> : <FileText className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.file.name}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      file.type === 'image' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {file.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    {file.status === 'completed' && (
                      <>
                        {file.wordCount && <span>{file.wordCount} words</span>}
                        {file.confidence && <span>{Math.round(file.confidence)}% confidence</span>}
                        {file.processingTime && <span>{Math.round(file.processingTime / 1000)}s</span>}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {file.status === 'processing' && (
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {file.progress}%
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-1">
                {file.status === 'completed' && (
                  <>
                    <button
                      onClick={() => copyToClipboard(file.text)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copy text"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => saveAsFile(file.text, `${file.file.name.replace(/\.[^/.]+$/, '')}.txt`)}
                      className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                      title="Save as file"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No files added yet</p>
        </div>
      )}
    </motion.div>
  )
}
