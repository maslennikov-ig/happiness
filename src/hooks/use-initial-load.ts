'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'happiness-initial-load'

export function useInitialLoad() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if the page was already loaded in this session
    const hasLoadedBefore = sessionStorage.getItem(STORAGE_KEY) === 'true'

    if (hasLoadedBefore) {
      // Intentional - sync with sessionStorage on mount
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoaded(true)
    }
  }, [])

  const markAsLoaded = useCallback(() => {
    setIsLoaded(true)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }, [])

  return {
    isLoaded,
    markAsLoaded,
  }
}
