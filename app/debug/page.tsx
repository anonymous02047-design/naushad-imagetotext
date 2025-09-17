'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [localStorageData, setLocalStorageData] = useState<any>(null)

  useEffect(() => {
    // Get all localStorage data
    const data: any = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || '')
        } catch {
          data[key] = localStorage.getItem(key)
        }
      }
    }
    setLocalStorageData(data)
  }, [])

  const clearStorage = () => {
    localStorage.clear()
    setLocalStorageData({})
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          LocalStorage Debug Page
        </h1>
        
        <div className="mb-4">
          <button
            onClick={clearStorage}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Clear All LocalStorage
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            LocalStorage Contents:
          </h2>
          
          {localStorageData ? (
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          )}
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            URL Shortener Test:
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Test Short ID:
              </label>
              <input
                type="text"
                placeholder="Enter short ID (e.g., s5gkd2)"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                id="testShortId"
              />
            </div>
            
            <button
              onClick={() => {
                const shortId = (document.getElementById('testShortId') as HTMLInputElement)?.value
                if (shortId) {
                  window.location.href = `/redirect?id=${shortId}`
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Test Redirect
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
