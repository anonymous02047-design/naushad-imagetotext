'use client'

import { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Memoized motion components for better performance
export const MemoizedMotionDiv = memo(motion.div)
export const MemoizedMotionButton = memo(motion.button)

// Performance-optimized image component
export const OptimizedImage = memo(({ src, alt, className, ...props }: any) => {
  const imageProps = useMemo(() => ({
    src,
    alt,
    className,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    ...props
  }), [src, alt, className, props])

  return <img {...imageProps} />
})

OptimizedImage.displayName = 'OptimizedImage'

// Debounced input hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Virtual scrolling hook for large lists
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )

    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }))
  }, [items, itemHeight, containerHeight, scrollTop])

  const totalHeight = items.length * itemHeight
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  }
}

// Lazy loading component
export const LazyComponent = memo(({ 
  children, 
  fallback = null,
  threshold = 0.1 
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  )
})

LazyComponent.displayName = 'LazyComponent'
