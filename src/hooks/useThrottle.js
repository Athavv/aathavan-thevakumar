import { useRef, useCallback } from 'react'

export function useThrottle(func, delay) {
  const timeoutRef = useRef(null)
  const lastRunRef = useRef(Date.now())

  return useCallback((...args) => {
    const now = Date.now()
    const timeSinceLastRun = now - lastRunRef.current

    if (timeSinceLastRun >= delay) {
      lastRunRef.current = now
      func(...args)
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        lastRunRef.current = Date.now()
        func(...args)
      }, delay - timeSinceLastRun)
    }
  }, [func, delay])
}

