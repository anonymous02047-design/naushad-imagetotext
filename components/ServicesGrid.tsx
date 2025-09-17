'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileImage, 
  FileText, 
  Zap, 
  QrCode, 
  Link, 
  Upload,
  Download,
  Settings,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  icon: any
  color: string
  features: string[]
  isPopular?: boolean
  isNew?: boolean
}

const services: Service[] = [
  {
    id: 'single',
    title: 'Image to Text',
    description: 'Extract text from images using advanced OCR technology with high accuracy.',
    icon: FileImage,
    color: 'from-blue-500 to-blue-600',
    features: ['Multi-language support', 'Image preprocessing', 'Batch processing', 'Export options'],
    isPopular: true
  },
  {
    id: 'batch',
    title: 'Batch Processing',
    description: 'Process multiple images simultaneously for efficient text extraction.',
    icon: Upload,
    color: 'from-green-500 to-green-600',
    features: ['Multiple file upload', 'Progress tracking', 'Bulk export', 'Queue management']
  },
  {
    id: 'pdf',
    title: 'PDF to Text',
    description: 'Extract text from PDF documents with intelligent page recognition.',
    icon: FileText,
    color: 'from-red-500 to-red-600',
    features: ['PDF parsing', 'Text extraction', 'Page-by-page processing', 'Format preservation']
  },
  {
    id: 'img2pdf',
    title: 'Image to PDF',
    description: 'Convert multiple images into a single PDF document with customizable settings.',
    icon: FileText,
    color: 'from-purple-500 to-purple-600',
    features: ['Multiple formats', 'Custom page sizes', 'Quality control', 'Batch conversion'],
    isNew: true
  },
  {
    id: 'pdf2img',
    title: 'PDF to Image',
    description: 'Convert PDF pages to high-quality images in various formats.',
    icon: FileImage,
    color: 'from-orange-500 to-orange-600',
    features: ['High resolution', 'Multiple formats', 'Quality settings', 'Individual download'],
    isNew: true
  },
  {
    id: 'compress-img',
    title: 'Image Compressor',
    description: 'Reduce image file sizes without losing quality using smart compression.',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600',
    features: ['Quality control', 'Size optimization', 'Format conversion', 'Batch processing'],
    isNew: true
  },
  {
    id: 'compress-pdf',
    title: 'PDF Compressor',
    description: 'Compress PDF files while maintaining quality and readability.',
    icon: Zap,
    color: 'from-indigo-500 to-indigo-600',
    features: ['File size reduction', 'Quality preservation', 'Metadata removal', 'Image optimization'],
    isNew: true
  },
  {
    id: 'qr',
    title: 'QR Code Generator',
    description: 'Create custom QR codes for URLs, text, WiFi, and more with advanced options.',
    icon: QrCode,
    color: 'from-pink-500 to-pink-600',
    features: ['Multiple types', 'Custom styling', 'Export options', 'History tracking']
  },
  {
    id: 'url',
    title: 'URL Shortener',
    description: 'Create short, memorable URLs with analytics and QR code generation.',
    icon: Link,
    color: 'from-teal-500 to-teal-600',
    features: ['Custom aliases', 'Click tracking', 'QR codes', 'Analytics dashboard']
  },
  {
    id: 'edit-img',
    title: 'Image Editor',
    description: 'Advanced image editing with resize, crop, enhance, and color conversion.',
    icon: Settings,
    color: 'from-cyan-500 to-cyan-600',
    features: ['Resize & Crop', 'Color adjustments', 'Filters & Effects', 'Undo/Redo'],
    isNew: true
  },
  {
    id: 'edit-pdf',
    title: 'PDF Editor',
    description: 'Edit PDFs with resize, crop, enhance, and color conversion options.',
    icon: FileText,
    color: 'from-amber-500 to-amber-600',
    features: ['Page editing', 'Color conversion', 'Size adjustment', 'Batch processing'],
    isNew: true
  }
]

interface ServicesGridProps {
  onServiceSelect: (serviceId: string) => void
  activeService: string
}

export default function ServicesGrid({ onServiceSelect, activeService }: ServicesGridProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          All Services
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose from our comprehensive suite of tools for all your document and image processing needs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon
          const isActive = activeService === service.id
          const isHovered = hoveredService === service.id

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredService(service.id)}
              onHoverEnd={() => setHoveredService(null)}
              onClick={() => onServiceSelect(service.id)}
              className={`relative cursor-pointer group ${
                isActive 
                  ? 'ring-2 ring-primary-500 ring-opacity-50' 
                  : 'hover:ring-2 hover:ring-primary-300 hover:ring-opacity-50'
              }`}
            >
              <div className={`card h-full transition-all duration-300 ${
                isActive 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700' 
                  : 'hover:shadow-lg hover:shadow-primary-100 dark:hover:shadow-primary-900/20'
              }`}>
                {/* Badges */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {service.isPopular && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  {service.isNew && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{service.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                  }`}>
                    <span>{isActive ? 'Active' : 'Select'}</span>
                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                      isHovered ? 'translate-x-1' : ''
                    }`} />
                  </div>
                  
                  {isActive && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                        Active
                      </span>
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg`} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {services.length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Total Services
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            100%
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Free to Use
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            24/7
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Available
          </div>
        </div>
      </motion.div>
    </div>
  )
}
