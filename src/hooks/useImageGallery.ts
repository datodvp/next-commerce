import { useState, useRef, useEffect } from 'react'

interface UseImageGalleryProps {
  images: Array<{ url: string; id?: number | string }>
}

export const useImageGallery = ({ images }: UseImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState<string>(images[0]?.url || '')
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const hasMovedRef = useRef(false)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const isOverThumbnailRef = useRef(false)
  const hasUserSelectedImageRef = useRef(false)
  const initializedRef = useRef(false)
  const imagesUrlsRef = useRef<string>('')
  const currentImageRef = useRef<string>(images[0]?.url || '')

  const updatePreviewImage = (imageUrl: string) => {
    hasUserSelectedImageRef.current = true
    currentImageRef.current = imageUrl
    setCurrentImage(imageUrl)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't start dragging if clicking directly on a thumbnail
    const target = e.target as HTMLElement
    if (target.closest('[data-thumbnail="true"]')) {
      return
    }

    if (!thumbnailContainerRef.current) return
    setIsDragging(true)
    hasMovedRef.current = false
    setStartX(e.pageX - thumbnailContainerRef.current.offsetLeft)
    setScrollLeft(thumbnailContainerRef.current.scrollLeft)
    thumbnailContainerRef.current.style.cursor = 'grabbing'
    thumbnailContainerRef.current.style.userSelect = 'none'
  }

  const handleMouseLeave = () => {
    if (!thumbnailContainerRef.current) return
    setIsDragging(false)
    hasMovedRef.current = false
    thumbnailContainerRef.current.style.cursor = 'grab'
    thumbnailContainerRef.current.style.userSelect = 'auto'
  }

  const handleMouseUp = () => {
    if (!thumbnailContainerRef.current) return
    setIsDragging(false)
    // Reset hasMovedRef after a short delay to allow click detection
    // This delay should be short enough not to interfere with hover
    setTimeout(() => {
      hasMovedRef.current = false
    }, 50)
    thumbnailContainerRef.current.style.cursor = 'grab'
    thumbnailContainerRef.current.style.userSelect = 'auto'
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if mouse is over a thumbnail first - if so, don't handle drag
    const target = e.target as HTMLElement
    const isOverThumbnail = target.closest('[data-thumbnail="true"]') !== null
    isOverThumbnailRef.current = isOverThumbnail

    if (isOverThumbnail) {
      // If we were dragging, stop it when entering thumbnail area
      if (isDragging) {
        setIsDragging(false)
        hasMovedRef.current = false
        if (thumbnailContainerRef.current) {
          thumbnailContainerRef.current.style.cursor = 'default'
          thumbnailContainerRef.current.style.userSelect = 'auto'
        }
      }
      // Don't prevent default or handle drag when over thumbnail
      return
    }

    if (!isDragging || !thumbnailContainerRef.current) return

    e.preventDefault()
    const x = e.pageX - thumbnailContainerRef.current.offsetLeft
    const walk = (x - startX) * 2

    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true
      thumbnailContainerRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleThumbnailClick = (imageUrl: string, e: React.MouseEvent) => {
    if (!hasMovedRef.current) {
      e.stopPropagation()
      updatePreviewImage(imageUrl)
    }
  }

  const handleThumbnailMouseEnter = (
    imageUrl: string,
    e?: React.MouseEvent,
  ) => {
    isOverThumbnailRef.current = true

    // Stop any active dragging
    if (isDragging) {
      setIsDragging(false)
      hasMovedRef.current = false
      if (thumbnailContainerRef.current) {
        thumbnailContainerRef.current.style.cursor = 'default'
        thumbnailContainerRef.current.style.userSelect = 'auto'
      }
    }

    if (e) {
      e.stopPropagation()
    }
    // Always update preview on hover, regardless of drag state
    // This ensures hover works even if dragging was triggered
    updatePreviewImage(imageUrl)
  }

  const handleThumbnailMouseLeave = (e?: React.MouseEvent) => {
    isOverThumbnailRef.current = false
    if (e) {
      e.stopPropagation()
    }
  }

  // Handle mouse up globally to catch cases where mouse is released outside container
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        hasMovedRef.current = false
        if (thumbnailContainerRef.current) {
          thumbnailContainerRef.current.style.cursor = 'grab'
          thumbnailContainerRef.current.style.userSelect = 'auto'
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mouseup', handleGlobalMouseUp)
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [isDragging])

  // Initialize image only once on mount, or reset if images array actually changed
  // Never reset if user has manually selected an image (via hover or click)
  useEffect(() => {
    if (images.length === 0) return

    const imageUrls = images.map((img) => img.url)
    const imageUrlsString = JSON.stringify(imageUrls.sort())

    // Check if images array content has actually changed (not just reference)
    const imagesChanged = imagesUrlsRef.current !== imageUrlsString

    // Only set initial image if:
    // 1. Not yet initialized, OR
    // 2. Images changed AND user hasn't manually selected an image, OR
    // 3. Current image is invalid (empty or not in images array) AND user hasn't selected
    if (!initializedRef.current) {
      // First time initialization
      currentImageRef.current = images[0].url
      setCurrentImage(images[0].url)
      initializedRef.current = true
      imagesUrlsRef.current = imageUrlsString
    } else if (imagesChanged) {
      // Images array content changed - check current image from ref to avoid stale closure
      const currentImageValid =
        currentImageRef.current && imageUrls.includes(currentImageRef.current)

      if (!hasUserSelectedImageRef.current || !currentImageValid) {
        // Reset only if user hasn't selected an image, or current image is invalid
        currentImageRef.current = images[0].url
        setCurrentImage(images[0].url)
        hasUserSelectedImageRef.current = false // Reset flag since we're resetting
      }
      imagesUrlsRef.current = imageUrlsString
    }
  }, [images]) // Only depend on images, not currentImage

  return {
    currentImage,
    thumbnailContainerRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    handleThumbnailClick,
    handleThumbnailMouseEnter,
    handleThumbnailMouseLeave,
  }
}
