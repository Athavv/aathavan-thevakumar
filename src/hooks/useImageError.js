import { useCallback } from 'react'

export function useImageError() {
  return useCallback((e, fallbackElement = null) => {
    e.target.style.display = 'none'
    if (fallbackElement) {
      fallbackElement.style.display = 'flex'
    }
  }, [])
}

