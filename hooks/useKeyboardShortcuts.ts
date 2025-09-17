'use client'

import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrlKey, shiftKey, altKey, action }) => {
        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          !!event.ctrlKey === !!ctrlKey &&
          !!event.shiftKey === !!shiftKey &&
          !!event.altKey === !!altKey
        ) {
          event.preventDefault()
          action()
        }
      })
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}