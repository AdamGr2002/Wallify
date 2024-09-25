'use client'

import { useState, useEffect } from 'react'

export default function ResolutionOptimizer() {
  const [resolution, setResolution] = useState({ width: 1080, height: 1920 })

  useEffect(() => {
    const optimizeResolution = () => {
      const width = window.screen.width * window.devicePixelRatio
      const height = window.screen.height * window.devicePixelRatio

      // Ensure the resolution is not too high for the AI model
      const maxDimension = 2048
      const aspectRatio = width / height

      let optimizedWidth = width
      let optimizedHeight = height

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          optimizedWidth = maxDimension
          optimizedHeight = Math.round(maxDimension / aspectRatio)
        } else {
          optimizedHeight = maxDimension
          optimizedWidth = Math.round(maxDimension * aspectRatio)
        }
      }

      setResolution({ width: optimizedWidth, height: optimizedHeight })
    }

    optimizeResolution()
    window.addEventListener('resize', optimizeResolution)

    return () => window.removeEventListener('resize', optimizeResolution)
  }, [])

  return resolution
}