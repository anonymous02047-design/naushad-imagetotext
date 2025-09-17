'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Brain, Globe, BookOpen, TrendingUp, Hash } from 'lucide-react'

interface TextAnalyzerProps {
  text: string
}

interface AnalysisResult {
  wordCount: number
  characterCount: number
  sentenceCount: number
  paragraphCount: number
  averageWordsPerSentence: number
  readabilityScore: number
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number
  language: string
  topWords: Array<{ word: string; count: number }>
  readingTime: number
}

export default function TextAnalyzer({ text }: TextAnalyzerProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeText = useCallback(async (inputText: string) => {
    setIsAnalyzing(true)
    
    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const words = inputText.split(/\s+/).filter(word => word.length > 0)
      const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const paragraphs = inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0)
      
      // Word frequency analysis
      const wordFreq: { [key: string]: number } = {}
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '')
        if (cleanWord.length > 2) {
          wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1
        }
      })
      
      const topWords = Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }))

      // Simple sentiment analysis
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'best', 'perfect']
      const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'disappointing', 'poor', 'wrong', 'fail']
      
      const sentimentScore = words.reduce((score, word) => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '')
        if (positiveWords.includes(cleanWord)) return score + 1
        if (negativeWords.includes(cleanWord)) return score - 1
        return score
      }, 0)

      const sentiment = sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral'

      // Simple readability score (Flesch Reading Ease approximation)
      const avgWordsPerSentence = words.length / sentences.length
      const avgSyllablesPerWord = 1.5 // Simplified
      const readabilityScore = Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)))

      // Reading time (average 200 words per minute)
      const readingTime = Math.ceil(words.length / 200)

      // Simple language detection
      const commonEnglishWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i']
      const isEnglish = commonEnglishWords.some(word => words.includes(word.toLowerCase()))
      const language = isEnglish ? 'English' : 'Unknown'

      setAnalysis({
        wordCount: words.length,
        characterCount: inputText.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        averageWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
        readabilityScore: Math.round(readabilityScore * 10) / 10,
        sentiment,
        sentimentScore,
        language,
        topWords,
        readingTime
      })
    } catch (error) {
      console.error('Text analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  useEffect(() => {
    if (text.trim()) {
      analyzeText(text)
    } else {
      setAnalysis(null)
    }
  }, [text, analyzeText])

  if (!text.trim()) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
        <BarChart3 className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
        Text Analysis
        {isAnalyzing && (
          <div className="ml-2 w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        )}
      </h2>

      {analysis && (
        <div className="space-y-6">
          {/* Basic Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{analysis.wordCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{analysis.characterCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{analysis.sentenceCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sentences</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{analysis.readingTime}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Min Read</div>
            </div>
          </div>

          {/* Advanced Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Analysis */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <Brain className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Sentiment Analysis
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Sentiment:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                  }`}>
                    {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sentiment Score:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{analysis.sentimentScore}</span>
                </div>
              </div>
            </div>

            {/* Readability */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <BookOpen className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Readability
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Score:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{analysis.readabilityScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Words/Sentence:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{analysis.averageWordsPerSentence}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Language Detection */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
              <Globe className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
              Language Detection
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Detected Language:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{analysis.language}</span>
            </div>
          </div>

          {/* Top Words */}
          {analysis.topWords.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Most Frequent Words
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.topWords.map((item, index) => (
                  <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">{item.word}</span>
                    <span className="text-gray-500 dark:text-gray-400">({item.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}