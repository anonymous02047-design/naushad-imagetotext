'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function RedirectPage() {
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading')
  const [originalUrl, setOriginalUrl] = useState('')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const shortId = searchParams.get('id')
    
    if (!shortId) {
      setStatus('error')
      setError('Invalid short URL')
      return
    }

    // Get URL history from localStorage
    const urlHistory = localStorage.getItem('url-shortener-history')
    
    if (!urlHistory) {
      setStatus('error')
      setError('Short URL not found')
      return
    }

    try {
      const urls = JSON.parse(urlHistory)
      
      // Find URL by shortId
      const urlData = urls.find((url: any) => {
        if (url.shortUrl && url.shortUrl.includes('id=')) {
          const urlId = url.shortUrl.split('id=')[1]
          return urlId === shortId
        }
        return false
      })
      
      if (!urlData) {
        setStatus('error')
        setError('Short URL not found')
        return
      }

      setOriginalUrl(urlData.originalUrl)
      setStatus('redirecting')

      // Update click count
      const updatedUrls = urls.map((url: any) => 
        url.id === urlData.id 
          ? { ...url, clicks: (url.clicks || 0) + 1, lastAccessed: new Date().toISOString() }
          : url
      )
      localStorage.setItem('url-shortener-history', JSON.stringify(updatedUrls))

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = urlData.originalUrl
      }, 1500)

    } catch (error) {
      console.error('Error processing redirect:', error)
      setStatus('error')
      setError('Failed to process redirect')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-spin border-4 border-primary-600 border-t-transparent rounded-full"></div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Processing Redirect
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we redirect you...
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div className="bg-primary-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </>
        )}

        {status === 'redirecting' && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 text-green-600">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Redirecting...
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You are being redirected to:
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-400 break-all mb-4">
              {originalUrl}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 text-red-600">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Redirect Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go to Homepage
            </button>
          </>
        )}
      </div>
    </div>
  )
}
