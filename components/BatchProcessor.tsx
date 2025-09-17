'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle, AlertCircle, Download, Trash2, FileText, Image } from 'lucide-react'
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
}

export default function BatchProcessor() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('eng')

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
          let extractedText = ''
          
          if (file.type === 'image') {
            // Process image with Tesseract
            const { data: { text } } = await worker.recognize(file.file)
            extractedText = text
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
          
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, text: extractedText, status: 'completed' as const, progress: 100 }
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
  }

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
          {files.map((file) => (
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
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

              <button
                onClick={() => removeFile(file.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
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
