'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Trash2, ArrowUp, ArrowDown, Eye, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pages: number;
  preview?: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      // Get page counts for each PDF
      for (let i = 0; i < newPDFFiles.length; i++) {
        const pdfFile = newPDFFiles[i];
        try {
          const pageCount = await getPDFPageCount(pdfFile.file);
          setPdfFiles(prev => prev.map(f => 
            f.id === pdfFile.id ? { ...f, pages: pageCount } : f
          ));
        } catch (err) {
          console.error(`Error getting page count for ${pdfFile.name}:`, err);
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
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
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
      
      const mergedPdf = new jsPDF();
      let isFirstPage = true;

      for (const pdfFile of pdfFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const loadingTask = pdf.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Could not get canvas context');
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          const imgData = canvas.toDataURL('image/png');
          
          if (!isFirstPage) {
            mergedPdf.addPage();
          }
          
          const imgWidth = mergedPdf.internal.pageSize.getWidth();
          const imgHeight = mergedPdf.internal.pageSize.getHeight();
          mergedPdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          
          isFirstPage = false;
        }
      }

      const mergedPdfBlob = mergedPdf.output('blob');
      const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);
      
      setMergedPdfUrl(mergedPdfUrl);
      setSuccess(`Successfully merged ${pdfFiles.length} PDF files!`);
      
    } catch (err) {
      setError('Error merging PDFs. Please try again.');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

        {/* PDF Files List */}
        {pdfFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                PDF Files ({pdfFiles.length})
              </h3>
              <button
                onClick={clearAll}
                className="text-red-600 hover:text-red-700 flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {pdfFiles.map((pdfFile, index) => (
                <div
                  key={pdfFile.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{pdfFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(pdfFile.size)} • {pdfFile.pages} pages
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
              ))}
            </div>
          </div>
        )}

        {/* Merge Button */}
        {pdfFiles.length >= 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <button
              onClick={mergePDFs}
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Merging PDFs...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Merge PDFs</span>
                </>
              )}
            </button>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use PDF Merger</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Step 1: Upload PDFs</h4>
              <p className="text-gray-600 text-sm">
                Drag and drop multiple PDF files or click to browse and select them. You can add as many PDFs as needed.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Step 2: Arrange Order</h4>
              <p className="text-gray-600 text-sm">
                Use the up/down arrows to arrange the PDFs in the order you want them to appear in the merged document.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Step 3: Merge</h4>
              <p className="text-gray-600 text-sm">
                Click "Merge PDFs" to combine all files into a single document. The process may take a moment for large files.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Step 4: Download</h4>
              <p className="text-gray-600 text-sm">
                Once merged, download your combined PDF document. The file will contain all pages in the order you specified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFMerge;
