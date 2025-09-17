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
  Crop,
  Maximize2,
  Palette,
  Zap,
  RotateCw,
  FlipHorizontal,
  FlipVertical
} from 'lucide-react'
import toast from 'react-hot-toast'

interface PDFEditorProps {
  className?: string
}

interface EditedPDF {
  original: File
  edited: File
  originalSize: number
  editedSize: number
  dataUrl: string
  operations: string[]
}

export default function PDFEditor({ className }: PDFEditorProps) {
  const [pdfs, setPdfs] = useState<EditedPDF[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentPdf, setCurrentPdf] = useState<EditedPDF | null>(null)
  const [settings, setSettings] = useState({
    width: 595, // A4 width in points
    height: 842, // A4 height in points
    maintainAspectRatio: true,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sharpen: 0,
    colorMode: 'color' as 'color' | 'grayscale' | 'sepia' | 'invert',
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    pageRange: 'all' as 'all' | 'first' | 'last' | 'custom',
    customRange: '1-1'
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const pdfFiles = files.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length === 0) {
      toast.error('Please select valid PDF files')
      return
    }

    processPDFs(pdfFiles)
  }

  const processPDFs = async (files: File[]) => {
    setIsProcessing(true)
    try {
      const processedPDFs: EditedPDF[] = []

      for (const file of files) {
        const processed = await processPDF(file)
        if (processed) {
          processedPDFs.push(processed)
        }
      }

      setPdfs(prev => [...prev, ...processedPDFs])
      if (processedPDFs.length > 0) {
        setCurrentPdf(processedPDFs[0])
      }
      toast.success(`${processedPDFs.length} PDF(s) processed successfully`)
    } catch (error) {
      console.error('Error processing PDFs:', error)
      toast.error('Failed to process PDFs. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const processPDF = async (file: File): Promise<EditedPDF | null> => {
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
      
      // Create a new PDF document
      const { jsPDF } = await import('jspdf')
      const editedPdf = new jsPDF({
        orientation: settings.width > settings.height ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [settings.width, settings.height]
      })

      // Determine which pages to process
      let pagesToProcess: number[] = []
      switch (settings.pageRange) {
        case 'all':
          pagesToProcess = Array.from({ length: pdf.numPages }, (_, i) => i + 1)
          break
        case 'first':
          pagesToProcess = [1]
          break
        case 'last':
          pagesToProcess = [pdf.numPages]
          break
        case 'custom':
          const range = settings.customRange.split('-')
          const start = parseInt(range[0]) || 1
          const end = parseInt(range[1]) || pdf.numPages
          pagesToProcess = Array.from({ length: end - start + 1 }, (_, i) => start + i)
          break
      }

      for (let i = 0; i < pagesToProcess.length; i++) {
        const pageNum = pagesToProcess[i]
        const page = await pdf.getPage(pageNum)
        
        // Use higher scale for better quality
        const scale = 2.0
        const viewport = page.getViewport({ scale })
        
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.height = viewport.height
        canvas.width = viewport.width

        // Enable better rendering
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = 'high'

        await page.render({
          canvasContext: context,
          viewport: viewport,
          intent: 'display'
        }).promise

        // Add new page for each page (except the first one)
        if (i > 0) {
          editedPdf.addPage()
        }

        // Calculate dimensions to fit page
        const pageWidth = editedPdf.internal.pageSize.getWidth()
        const pageHeight = editedPdf.internal.pageSize.getHeight()
        
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

        // Apply filters to canvas
        applyFiltersToCanvas(context, canvas.width, canvas.height)

        // Convert canvas to data URL
        const imgData = canvas.toDataURL('image/png', 1.0)
        
        // Add image to PDF
        editedPdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
      }

      // Generate edited PDF
      const editedPdfBlob = editedPdf.output('blob')
      
      const editedFile = new File([editedPdfBlob], file.name.replace('.pdf', '_edited.pdf'), {
        type: 'application/pdf'
      })

      const operations = []
      if (settings.width !== 595 || settings.height !== 842) operations.push('Resize')
      if (settings.brightness !== 100) operations.push('Brightness')
      if (settings.contrast !== 100) operations.push('Contrast')
      if (settings.saturation !== 100) operations.push('Saturation')
      if (settings.hue !== 0) operations.push('Hue')
      if (settings.colorMode !== 'color') operations.push('Color Mode')
      if (settings.rotation !== 0) operations.push('Rotation')
      if (settings.flipHorizontal || settings.flipVertical) operations.push('Flip')
      if (settings.pageRange !== 'all') operations.push('Page Range')

      return {
        original: file,
        edited: editedFile,
        originalSize: file.size,
        editedSize: editedFile.size,
        dataUrl: URL.createObjectURL(editedFile),
        operations
      }
    } catch (error) {
      console.error('Error processing PDF:', error)
      toast.error(`Failed to process PDF: ${file.name}`)
      return null
    }
  }

  const applyFiltersToCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]

      // Apply brightness
      r = Math.min(255, Math.max(0, r * (settings.brightness / 100)))
      g = Math.min(255, Math.max(0, g * (settings.brightness / 100)))
      b = Math.min(255, Math.max(0, b * (settings.brightness / 100)))

      // Apply contrast
      const contrastFactor = (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast))
      r = Math.min(255, Math.max(0, contrastFactor * (r - 128) + 128))
      g = Math.min(255, Math.max(0, contrastFactor * (g - 128) + 128))
      b = Math.min(255, Math.max(0, contrastFactor * (b - 128) + 128))

      // Apply saturation
      if (settings.saturation !== 100) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b
        r = gray + (r - gray) * (settings.saturation / 100)
        g = gray + (g - gray) * (settings.saturation / 100)
        b = gray + (b - gray) * (settings.saturation / 100)
      }

      // Apply hue
      if (settings.hue !== 0) {
        const hsv = rgbToHsv(r, g, b)
        hsv.h = (hsv.h + settings.hue) % 360
        const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v)
        r = rgb.r
        g = rgb.g
        b = rgb.b
      }

      // Apply color mode
      switch (settings.colorMode) {
        case 'grayscale':
          const gray = 0.299 * r + 0.587 * g + 0.114 * b
          r = g = b = gray
          break
        case 'sepia':
          const sepiaR = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
          const sepiaG = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
          const sepiaB = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
          r = sepiaR
          g = sepiaG
          b = sepiaB
          break
        case 'invert':
          r = 255 - r
          g = 255 - g
          b = 255 - b
          break
      }

      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    let h = 0
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6
      else if (max === g) h = (b - r) / diff + 2
      else h = (r - g) / diff + 4
    }
    h = Math.round(h * 60)
    if (h < 0) h += 360

    const s = max === 0 ? 0 : diff / max
    const v = max

    return { h, s, v }
  }

  const hsvToRgb = (h: number, s: number, v: number) => {
    const c = v * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = v - c

    let r = 0, g = 0, b = 0

    if (h >= 0 && h < 60) { r = c; g = x; b = 0 }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0 }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    }
  }

  const applyChanges = async () => {
    if (!currentPdf) return

    setIsProcessing(true)
    try {
      const updated = await processPDF(currentPdf.original)
      if (updated) {
        setCurrentPdf(updated)
        toast.success('Changes applied successfully')
      }
    } catch (error) {
      console.error('Error applying changes:', error)
      toast.error('Failed to apply changes')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadPDF = (pdf: EditedPDF) => {
    try {
      // Use the dataUrl directly which contains the edited PDF data
      const link = document.createElement('a')
      link.href = pdf.dataUrl
      link.download = pdf.edited.name
      link.click()
      toast.success('Edited PDF downloaded')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download PDF')
    }
  }

  const downloadEditedPDF = async () => {
    if (!currentPdf) return

    try {
      setIsProcessing(true)
      
      // Process the PDF to get the latest edited version
      const editedPDF = await processPDF(currentPdf.original)
      if (editedPDF) {
        // Create download link with the edited data
        const link = document.createElement('a')
        link.href = editedPDF.dataUrl
        link.download = editedPDF.edited.name
        link.click()
        toast.success('Edited PDF downloaded successfully')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download edited PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  const removePDF = (index: number) => {
    setPdfs(prev => prev.filter((_, i) => i !== index))
    if (currentPdf === pdfs[index]) {
      setCurrentPdf(pdfs.length > 1 ? pdfs[index === 0 ? 1 : 0] : null)
    }
    toast.success('PDF removed')
  }

  const clearAll = () => {
    setPdfs([])
    setCurrentPdf(null)
    toast.success('All PDFs cleared')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
        Advanced PDF Editor
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

        {/* PDF Preview and Controls */}
        {currentPdf && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF Preview */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Preview
              </h3>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">PDF Preview</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {currentPdf.edited.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editing Controls */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Edit Controls
              </h3>
              
              <div className="space-y-4">
                {/* Page Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Range
                  </label>
                  <select
                    value={settings.pageRange}
                    onChange={(e) => setSettings(prev => ({ ...prev, pageRange: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="all">All Pages</option>
                    <option value="first">First Page Only</option>
                    <option value="last">Last Page Only</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  {settings.pageRange === 'custom' && (
                    <input
                      type="text"
                      placeholder="e.g., 1-3, 5, 7-10"
                      value={settings.customRange}
                      onChange={(e) => setSettings(prev => ({ ...prev, customRange: e.target.value }))}
                      className="input-field mt-2"
                    />
                  )}
                </div>

                {/* Resize */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Maximize2 className="w-4 h-4 inline mr-1" />
                    Page Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Width (points)"
                      value={settings.width}
                      onChange={(e) => setSettings(prev => ({ ...prev, width: Number(e.target.value) }))}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Height (points)"
                      value={settings.height}
                      onChange={(e) => setSettings(prev => ({ ...prev, height: Number(e.target.value) }))}
                      className="input-field"
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, width: 595, height: 842 }))}
                      className="text-xs text-primary-600 hover:text-primary-700 mr-3"
                    >
                      A4 (595×842)
                    </button>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, width: 612, height: 792 }))}
                      className="text-xs text-primary-600 hover:text-primary-700 mr-3"
                    >
                      Letter (612×792)
                    </button>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, width: 842, height: 595 }))}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      A4 Landscape
                    </button>
                  </div>
                </div>

                {/* Color Adjustments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Palette className="w-4 h-4 inline mr-1" />
                    Color Adjustments
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Brightness: {settings.brightness}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.brightness}
                        onChange={(e) => setSettings(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Contrast: {settings.contrast}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.contrast}
                        onChange={(e) => setSettings(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Saturation: {settings.saturation}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={settings.saturation}
                        onChange={(e) => setSettings(prev => ({ ...prev, saturation: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Hue: {settings.hue}°</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={settings.hue}
                        onChange={(e) => setSettings(prev => ({ ...prev, hue: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Mode
                  </label>
                  <select
                    value={settings.colorMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, colorMode: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="color">Color</option>
                    <option value="grayscale">Black & White</option>
                    <option value="sepia">Sepia</option>
                    <option value="invert">Invert</option>
                  </select>
                </div>

                {/* Transformations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transformations
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Rotation: {settings.rotation}°</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={settings.rotation}
                        onChange={(e) => setSettings(prev => ({ ...prev, rotation: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.flipHorizontal}
                          onChange={(e) => setSettings(prev => ({ ...prev, flipHorizontal: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Flip Horizontal</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.flipVertical}
                          onChange={(e) => setSettings(prev => ({ ...prev, flipVertical: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Flip Vertical</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={applyChanges}
                  disabled={isProcessing}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Applying Changes...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Apply Changes
                    </>
                  )}
                </button>

                {/* Download Edited PDF Button */}
                {currentPdf && (
                  <button
                    onClick={downloadEditedPDF}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Download Edited PDF
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PDFs List */}
        {pdfs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Edited PDFs ({pdfs.length})
              </h3>
              <button
                onClick={clearAll}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pdfs.map((pdf, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {pdf.edited.name}
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {pdf.operations.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatFileSize(pdf.originalSize)} → {formatFileSize(pdf.editedSize)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPdf(pdf)}
                        className="p-2 text-primary-600 hover:text-primary-700"
                        title="Edit"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadPDF(pdf)}
                        className="p-2 text-green-600 hover:text-green-700"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removePDF(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                        title="Remove"
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
            <p className="text-gray-600 dark:text-gray-400">Processing PDFs...</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
