'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Edit3, Search, FileText, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface TextDisplayProps {
  text: string
  originalImage: File | null
}

export default function TextDisplay({ text, originalImage }: TextDisplayProps) {
  const [editedText, setEditedText] = useState(text)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText)
      toast.success('Text copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy text')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([editedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `extracted-text-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Text downloaded!')
  }

  const handleSave = () => {
    setEditedText(editedText)
    setIsEditing(false)
    toast.success('Changes saved!')
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term) {
      const regex = new RegExp(`(${term})`, 'gi')
      const highlightedText = editedText.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
      // This is a simplified approach - in a real app you'd want more sophisticated highlighting
    }
  }

  const wordCount = editedText.split(/\s+/).filter(word => word.length > 0).length
  const charCount = editedText.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Extracted Text</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {wordCount} words • {charCount} characters
          </span>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search in text..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="btn-secondary text-sm flex items-center"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="btn-secondary text-sm flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary text-sm flex items-center"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Text Content */}
      <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full h-full min-h-[250px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            placeholder="Edit the extracted text..."
          />
        ) : (
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {editedText || 'No text extracted yet.'}
          </div>
        )}
      </div>

      {/* Save Button for Edit Mode */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex justify-end"
        >
          <button
            onClick={handleSave}
            className="btn-primary flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </motion.div>
      )}

      {/* Text Statistics */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Words:</span>
            <span className="ml-2 font-medium">{wordCount}</span>
          </div>
          <div>
            <span className="text-gray-600">Characters:</span>
            <span className="ml-2 font-medium">{charCount}</span>
          </div>
          <div>
            <span className="text-gray-600">Lines:</span>
            <span className="ml-2 font-medium">{editedText.split('\n').length}</span>
          </div>
          <div>
            <span className="text-gray-600">Language:</span>
            <span className="ml-2 font-medium">Auto-detected</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
