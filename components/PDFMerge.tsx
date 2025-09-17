'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Trash2, ArrowUp, ArrowDown, Eye, CheckCircle, AlertCircle, Loader2, Settings, Maximize2, RotateCw, Palette, Ruler, Grid3X3 } from 'lucide-react';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pages: number;
  preview?: string;
  pagePreviews?: string[];
}

interface MergeSettings {
  pageSize: 'A4' | 'A3' | 'Letter' | 'Legal' | 'Custom';
  orientation: 'portrait' | 'landscape';
  margin: number;
  quality: 'high' | 'medium' | 'low';
  colorMode: 'color' | 'grayscale' | 'blackwhite';
  scale: number;
  customWidth?: number;
  customHeight?: number;
}

interface PDFMergeProps {
  onClose: () => void;
}

const PDFMerge: React.FC<PDFMergeProps> = ({ onClose }) => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPages, setSelectedPages] = useState<{[fileId: string]: number[]}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mergeSettings, setMergeSettings] = useState<MergeSettings>({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    quality: 'high',
    colorMode: 'color',
    scale: 1.5
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      addPDFFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      addPDFFiles(files);
    }
  };

  const addPDFFiles = async (files: File[]) => {
    setError(null);
    setSuccess(null);
    
    try {
      const newPDFFiles: PDFFile[] = [];
      
      for (const file of files) {
        const pdfFile: PDFFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: file.size,
          pages: 0, // Will be updated after processing
        };
        
        newPDFFiles.push(pdfFile);
      }
      
      setPdfFiles(prev => [...prev, ...newPDFFiles]);
      
      // Get page counts and previews for each PDF
      for (let i = 0; i < newPDFFiles.length; i++) {
        const pdfFile = newPDFFiles[i];
        try {
          const pageCount = await getPDFPageCount(pdfFile.file);
          const pagePreviews = await generatePagePreviews(pdfFile.file, 3);
          
          setPdfFiles(prev => prev.map(f => 
            f.id === pdfFile.id ? { 
              ...f, 
              pages: pageCount, 
              pagePreviews: pagePreviews 
            } : f
          ));
          
          // Initialize selected pages (all pages selected by default)
          setSelectedPages(prev => ({
            ...prev,
            [pdfFile.id]: Array.from({ length: pageCount }, (_, i) => i + 1)
          }));
        } catch (err) {
          console.error(`Error processing ${pdfFile.name}:`, err);
          setPdfFiles(prev => prev.map(f => 
            f.id === pdfFile.id ? { ...f, pages: 0 } : f
          ));
        }
      }
      
    } catch (err) {
      setError('Error adding PDF files. Please try again.');
      console.error('Error adding PDF files:', err);
    }
  };

  const getPDFPageCount = async (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdf = await import('pdfjs-dist');
          const loadingTask = pdf.getDocument({ data: arrayBuffer });
          const pdfDoc = await loadingTask.promise;
          resolve(pdfDoc.numPages);
        } catch (err) {
          console.error('Error getting page count:', err);
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const generatePagePreviews = async (file: File, maxPages: number = 3): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdf = await import('pdfjs-dist');
          const loadingTask = pdf.getDocument({ data: arrayBuffer });
          const pdfDoc = await loadingTask.promise;
          
          const previews: string[] = [];
          const pagesToPreview = Math.min(maxPages, pdfDoc.numPages);
          
          for (let pageNum = 1; pageNum <= pagesToPreview; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 0.3 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) continue;
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;
            
            previews.push(canvas.toDataURL('image/png'));
          }
          
          resolve(previews);
        } catch (err) {
          console.error('Error generating previews:', err);
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const getPageSizeDimensions = (pageSize: string, orientation: string) => {
    const sizes = {
      'A4': { width: 210, height: 297 },
      'A3': { width: 297, height: 420 },
      'Letter': { width: 216, height: 279 },
      'Legal': { width: 216, height: 356 }
    };
    
    const size = sizes[pageSize as keyof typeof sizes] || sizes.A4;
    return orientation === 'landscape' 
      ? { width: size.height, height: size.width }
      : { width: size.width, height: size.height };
  };

  const removePDF = (id: string) => {
    setPdfFiles(prev => prev.filter(file => file.id !== id));
    setError(null);
    setSuccess(null);
  };

  const movePDF = (id: string, direction: 'up' | 'down') => {
    setPdfFiles(prev => {
      const index = prev.findIndex(file => file.id === id);
      if (index === -1) return prev;
      
      const newFiles = [...prev];
      if (direction === 'up' && index > 0) {
        [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
      } else if (direction === 'down' && index < newFiles.length - 1) {
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      }
      
      return newFiles;
    });
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const { default: jsPDF } = await import('jspdf');
      const pdf = await import('pdfjs-dist');
      
      // Get page dimensions based on settings
      const dimensions = getPageSizeDimensions(mergeSettings.pageSize, mergeSettings.orientation);
      const pageWidth = mergeSettings.pageSize === 'Custom' ? mergeSettings.customWidth || 210 : dimensions.width;
      const pageHeight = mergeSettings.pageSize === 'Custom' ? mergeSettings.customHeight || 297 : dimensions.height;
      
      const mergedPdf = new jsPDF({
        orientation: mergeSettings.orientation,
        unit: 'mm',
        format: mergeSettings.pageSize === 'Custom' ? [pageWidth, pageHeight] : mergeSettings.pageSize
      });
      
      let isFirstPage = true;
      let totalPagesProcessed = 0;
      const totalPages = pdfFiles.reduce((sum, file) => {
        const selected = selectedPages[file.id] || [];
        return sum + selected.length;
      }, 0);

      for (const pdfFile of pdfFiles) {
        try {
          const arrayBuffer = await pdfFile.file.arrayBuffer();
          const loadingTask = pdf.getDocument({ data: arrayBuffer });
          const pdfDoc = await loadingTask.promise;
          
          const pagesToProcess = selectedPages[pdfFile.id] || Array.from({ length: pdfDoc.numPages }, (_, i) => i + 1);

          for (const pageNum of pagesToProcess) {
            if (pageNum > pdfDoc.numPages) continue;
            
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: mergeSettings.scale });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Could not get canvas context');
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;

            // Apply color mode
            let imgData = canvas.toDataURL('image/png');
            if (mergeSettings.colorMode !== 'color') {
              const tempCanvas = document.createElement('canvas');
              const tempContext = tempCanvas.getContext('2d');
              if (tempContext) {
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                tempContext.drawImage(canvas, 0, 0);
                
                const imageData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                  if (mergeSettings.colorMode === 'blackwhite') {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    const bw = gray > 128 ? 255 : 0;
                    data[i] = bw;     // Red
                    data[i + 1] = bw; // Green
                    data[i + 2] = bw; // Blue
                  } else if (mergeSettings.colorMode === 'grayscale') {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    data[i] = gray;     // Red
                    data[i + 1] = gray; // Green
                    data[i + 2] = gray; // Blue
                  }
                }
                
                tempContext.putImageData(imageData, 0, 0);
                imgData = tempCanvas.toDataURL('image/png');
              }
            }
            
            if (!isFirstPage) {
              mergedPdf.addPage();
            }
            
            // Calculate image dimensions with margins
            const margin = mergeSettings.margin;
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = pageHeight - (margin * 2);
            
            mergedPdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
            
            isFirstPage = false;
            totalPagesProcessed++;
            
            // Update progress
            const progress = (totalPagesProcessed / totalPages) * 100;
            console.log(`Progress: ${progress.toFixed(1)}%`);
          }
        } catch (err) {
          console.error(`Error processing ${pdfFile.name}:`, err);
          throw new Error(`Failed to process ${pdfFile.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      const mergedPdfBlob = mergedPdf.output('blob');
      const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);
      
      setMergedPdfUrl(mergedPdfUrl);
      setSuccess(`Successfully merged ${totalPagesProcessed} pages from ${pdfFiles.length} PDF files!`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error merging PDFs: ${errorMessage}`);
      console.error('Error merging PDFs:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMergedPDF = () => {
    if (mergedPdfUrl) {
      const link = document.createElement('a');
      link.href = mergedPdfUrl;
      link.download = 'merged-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearAll = () => {
    setPdfFiles([]);
    setMergedPdfUrl(null);
    setError(null);
    setSuccess(null);
    setSelectedPages({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePageSelection = (fileId: string, pageNum: number) => {
    setSelectedPages(prev => {
      const current = prev[fileId] || [];
      const isSelected = current.includes(pageNum);
      
      if (isSelected) {
        return {
          ...prev,
          [fileId]: current.filter(p => p !== pageNum)
        };
      } else {
        return {
          ...prev,
          [fileId]: [...current, pageNum].sort((a, b) => a - b)
        };
      }
    });
  };

  const selectAllPages = (fileId: string, totalPages: number) => {
    setSelectedPages(prev => ({
      ...prev,
      [fileId]: Array.from({ length: totalPages }, (_, i) => i + 1)
    }));
  };

  const deselectAllPages = (fileId: string) => {
    setSelectedPages(prev => ({
      ...prev,
      [fileId]: []
    }));
  };

  const updateMergeSettings = (newSettings: Partial<MergeSettings>) => {
    setMergeSettings(prev => ({ ...prev, ...newSettings }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PDF Merger</h1>
                <p className="text-gray-600">Combine multiple PDF files into one document</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close PDF Merger"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop PDF files here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Select multiple PDF files to merge into one document
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choose PDF Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Advanced Settings Panel */}
        {pdfFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Merge Settings</span>
              </h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>{showSettings ? 'Hide' : 'Show'} Settings</span>
              </button>
            </div>
            
            {showSettings && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Page Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Maximize2 className="w-4 h-4 inline mr-1" />
                    Page Size
                  </label>
                  <select
                    value={mergeSettings.pageSize}
                    onChange={(e) => updateMergeSettings({ pageSize: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="A3">A3 (297 × 420 mm)</option>
                    <option value="Letter">Letter (216 × 279 mm)</option>
                    <option value="Legal">Legal (216 × 356 mm)</option>
                    <option value="Custom">Custom Size</option>
                  </select>
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <RotateCw className="w-4 h-4 inline mr-1" />
                    Orientation
                  </label>
                  <select
                    value={mergeSettings.orientation}
                    onChange={(e) => updateMergeSettings({ orientation: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                {/* Color Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="w-4 h-4 inline mr-1" />
                    Color Mode
                  </label>
                  <select
                    value={mergeSettings.colorMode}
                    onChange={(e) => updateMergeSettings({ colorMode: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="color">Color</option>
                    <option value="grayscale">Grayscale</option>
                    <option value="blackwhite">Black & White</option>
                  </select>
                </div>

                {/* Margin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Ruler className="w-4 h-4 inline mr-1" />
                    Margin (mm)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={mergeSettings.margin}
                    onChange={(e) => updateMergeSettings({ margin: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Grid3X3 className="w-4 h-4 inline mr-1" />
                    Quality
                  </label>
                  <select
                    value={mergeSettings.quality}
                    onChange={(e) => {
                      const quality = e.target.value as any;
                      const scale = quality === 'high' ? 2.0 : quality === 'medium' ? 1.5 : 1.0;
                      updateMergeSettings({ quality, scale });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="high">High Quality (2.0x)</option>
                    <option value="medium">Medium Quality (1.5x)</option>
                    <option value="low">Low Quality (1.0x)</option>
                  </select>
                </div>

                {/* Custom Size */}
                {mergeSettings.pageSize === 'Custom' && (
                  <div className="md:col-span-2 lg:col-span-3 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width (mm)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="1000"
                        value={mergeSettings.customWidth || 210}
                        onChange={(e) => updateMergeSettings({ customWidth: parseInt(e.target.value) || 210 })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (mm)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="1000"
                        value={mergeSettings.customHeight || 297}
                        onChange={(e) => updateMergeSettings({ customHeight: parseInt(e.target.value) || 297 })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PDF Files List with Page Selection */}
        {pdfFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                PDF Files ({pdfFiles.length})
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                </button>
                <button
                  onClick={clearAll}
                  className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {pdfFiles.map((pdfFile, index) => {
                const selected = selectedPages[pdfFile.id] || [];
                const totalPages = pdfFile.pages;
                
                return (
                  <div
                    key={pdfFile.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{pdfFile.name}</p>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(pdfFile.size)} • {totalPages} pages • {selected.length} selected
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        
                        <button
                          onClick={() => movePDF(pdfFile.id, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => movePDF(pdfFile.id, 'down')}
                          disabled={index === pdfFiles.length - 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => removePDF(pdfFile.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded"
                          aria-label="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Page Selection */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Select Pages:</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => selectAllPages(pdfFile.id, totalPages)}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Select All
                          </button>
                          <button
                            onClick={() => deselectAllPages(pdfFile.id)}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                          <button
                            key={pageNum}
                            onClick={() => togglePageSelection(pdfFile.id, pageNum)}
                            className={`w-8 h-8 text-xs rounded border transition-colors ${
                              selected.includes(pageNum)
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Page Previews */}
                    {showPreview && pdfFile.pagePreviews && pdfFile.pagePreviews.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Page Previews:</span>
                        <div className="flex space-x-2 overflow-x-auto">
                          {pdfFile.pagePreviews.map((preview, previewIndex) => (
                            <div key={previewIndex} className="flex-shrink-0">
                              <img
                                src={preview}
                                alt={`Page ${previewIndex + 1} preview`}
                                className="w-16 h-20 object-cover border border-gray-300 rounded"
                              />
                              <p className="text-xs text-center text-gray-600 mt-1">
                                Page {previewIndex + 1}
                              </p>
                            </div>
                          ))}
                          {totalPages > 3 && (
                            <div className="flex-shrink-0 flex items-center justify-center w-16 h-20 border border-gray-300 rounded bg-gray-100">
                              <span className="text-xs text-gray-600">
                                +{totalPages - 3} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Merge Button */}
        {pdfFiles.length >= 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Merge</h3>
                <p className="text-sm text-gray-600">
                  Total pages to merge: {pdfFiles.reduce((sum, file) => {
                    const selected = selectedPages[file.id] || [];
                    return sum + selected.length;
                  }, 0)} pages from {pdfFiles.length} files
                </p>
              </div>
              
              <button
                onClick={mergePDFs}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors text-lg font-medium"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Merging PDFs...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-6 h-6" />
                    <span>Merge PDFs</span>
                  </>
                )}
              </button>
              
              {isProcessing && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Processing pages...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Download Section */}
        {mergedPdfUrl && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Merged PDF Ready</h3>
                  <p className="text-gray-600">Your combined PDF document is ready for download</p>
                </div>
              </div>
              <button
                onClick={downloadMergedPDF}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download Merged PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced PDF Merger Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload & Preview
              </h4>
              <p className="text-gray-600 text-sm">
                Drag and drop multiple PDF files with automatic page count detection and thumbnail previews.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Grid3X3 className="w-4 h-4 mr-2" />
                Page Selection
              </h4>
              <p className="text-gray-600 text-sm">
                Select specific pages from each PDF to include in the merge. Choose individual pages or select all.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Maximize2 className="w-4 h-4 mr-2" />
                Page Size & Orientation
              </h4>
              <p className="text-gray-600 text-sm">
                Choose from A4, A3, Letter, Legal, or custom page sizes with portrait or landscape orientation.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Ruler className="w-4 h-4 mr-2" />
                Margins & Quality
              </h4>
              <p className="text-gray-600 text-sm">
                Adjust margins and select quality settings (High, Medium, Low) for optimal file size and clarity.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Color Processing
              </h4>
              <p className="text-gray-600 text-sm">
                Convert to Color, Grayscale, or Black & White during the merge process for different output needs.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <ArrowUp className="w-4 h-4 mr-2" />
                File Ordering
              </h4>
              <p className="text-gray-600 text-sm">
                Use up/down arrows to arrange PDFs in the exact order you want them to appear in the final document.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use page selection to merge only specific pages from large documents</li>
              <li>• Choose grayscale or black & white to reduce file size significantly</li>
              <li>• Preview pages before merging to ensure correct selection</li>
              <li>• Custom page sizes are perfect for non-standard document formats</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFMerge;
