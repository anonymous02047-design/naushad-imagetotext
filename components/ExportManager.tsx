'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, File, FileImage, Share2, Copy, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

interface ExportManagerProps {
  text: string
  imageName?: string
  originalImage?: File | null
}

export default function ExportManager({ text, imageName, originalImage }: ExportManagerProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportAsTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    downloadFile(blob, `${imageName || 'extracted-text'}.txt`)
  }

  const exportAsJson = () => {
    const data = {
      text,
      metadata: {
        extractedAt: new Date().toISOString(),
        imageName: imageName || 'unknown',
        characterCount: text.length,
        wordCount: text.split(/\s+/).filter(word => word.length > 0).length
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadFile(blob, `${imageName || 'extracted-text'}.json`)
  }

  const exportAsMarkdown = () => {
    const markdown = `# Extracted Text

**Source:** ${imageName || 'Unknown Image'}  
**Extracted:** ${new Date().toLocaleString()}

---

${text}

---

*Extracted using ImageToText OCR Tool*`
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    downloadFile(blob, `${imageName || 'extracted-text'}.md`)
  }

  const exportAsHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Extracted Text - ${imageName || 'Unknown'}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
        .metadata { color: #6b7280; font-size: 14px; }
        .content { white-space: pre-wrap; }
        .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Extracted Text</h1>
        <div class="metadata">
            <p><strong>Source:</strong> ${imageName || 'Unknown Image'}</p>
            <p><strong>Extracted:</strong> ${new Date().toLocaleString()}</p>
        </div>
    </div>
    <div class="content">${text}</div>
    <div class="footer">
        <p>Extracted using ImageToText OCR Tool</p>
    </div>
</body>
</html>`
    
    const blob = new Blob([html], { type: 'text/html' })
    downloadFile(blob, `${imageName || 'extracted-text'}.html`)
  }

  const exportAsPdf = async () => {
    setIsExporting(true)
    try {
      // Simple PDF generation using browser's print functionality
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Extracted Text - ${imageName || 'Unknown'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .metadata { color: #666; font-size: 12px; }
              .content { white-space: pre-wrap; }
              @media print { body { margin: 20px; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Extracted Text</h1>
              <div class="metadata">
                <p><strong>Source:</strong> ${imageName || 'Unknown Image'}</p>
                <p><strong>Extracted:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>
            <div class="content">${text}</div>
          </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
        printWindow.close()
      }
      toast.success('PDF export initiated')
    } catch (error) {
      toast.error('PDF export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(`${filename} downloaded successfully!`)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Text copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy text')
    }
  }

  const shareText = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Extracted Text',
          text: text,
          url: window.location.href
        })
        toast.success('Text shared successfully!')
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error('Failed to share text')
        }
      }
    } else {
      // Fallback to copying to clipboard
      copyToClipboard()
    }
  }

  const exportOptions = [
    {
      name: 'Plain Text',
      icon: FileText,
      action: exportAsTxt,
      description: 'Simple text file (.txt)'
    },
    {
      name: 'JSON',
      icon: File,
      action: exportAsJson,
      description: 'Structured data with metadata (.json)'
    },
    {
      name: 'Markdown',
      icon: FileText,
      action: exportAsMarkdown,
      description: 'Formatted markdown document (.md)'
    },
    {
      name: 'HTML',
      icon: FileImage,
      action: exportAsHtml,
      description: 'Web-ready HTML document (.html)'
    },
    {
      name: 'PDF',
      icon: File,
      action: exportAsPdf,
      description: 'Print-ready PDF document (.pdf)'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <Download className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          Export Options
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={shareText}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="Share text"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {exportOptions.map((option, index) => {
          const IconComponent = option.icon
          return (
            <motion.button
              key={option.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={option.action}
              disabled={isExporting}
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3">
                <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {option.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copyToClipboard}
            className="btn-secondary text-sm flex items-center"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy Text
          </button>
          <button
            onClick={shareText}
            className="btn-secondary text-sm flex items-center"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </button>
          <button
            onClick={() => {
              const mailtoLink = `mailto:?subject=Extracted Text&body=${encodeURIComponent(text)}`
              window.open(mailtoLink)
            }}
            className="btn-secondary text-sm flex items-center"
          >
            <Mail className="w-4 h-4 mr-1" />
            Email
          </button>
        </div>
      </div>

      {/* Export Info */}
      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-1">Export Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• JSON format includes metadata and extraction details</li>
            <li>• HTML format is perfect for web sharing</li>
            <li>• PDF uses your browser's print functionality</li>
            <li>• All formats preserve original text formatting</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
