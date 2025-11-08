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
  const isTouchDeviceRef = useRef(false)

  const updatePreviewImage = (imageUrl: string) => {
    hasUserSelectedImageRef.current = true
    currentImageRef.current = imageUrl
    setCurrentImage(imageUrl)
  }

  const startDrag = (clientX: number) => {
    if (!thumbnailContainerRef.current) return

    setIsDragging(true)
    hasMovedRef.current = false
    const rect = thumbnailContainerRef.current.getBoundingClientRect()
    setStartX(clientX - rect.left)
    setScrollLeft(thumbnailContainerRef.current.scrollLeft)
    thumbnailContainerRef.current.style.cursor = 'grabbing'
    thumbnailContainerRef.current.style.userSelect = 'none'
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!thumbnailContainerRef.current) return

    // Allow dragging even when starting on a thumbnail
    // We'll check movement distance to distinguish between click and drag
    startDrag(e.clientX)
    e.preventDefault()
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!thumbnailContainerRef.current) return

    isTouchDeviceRef.current = true
    const touch = e.touches[0]
    startDrag(touch.clientX)
    e.preventDefault()
  }

  const handleMouseLeave = () => {
    if (!thumbnailContainerRef.current) return
    setIsDragging(false)
    hasMovedRef.current = false
    thumbnailContainerRef.current.style.cursor = 'grab'
    thumbnailContainerRef.current.style.userSelect = 'auto'
  }

  const endDrag = () => {
    if (!thumbnailContainerRef.current) return

    const wasDragging = isDragging && hasMovedRef.current
    setIsDragging(false)

    // Reset after a short delay to allow click detection
    setTimeout(() => {
      hasMovedRef.current = false
    }, 100)

    // Restore cursor and selection
    thumbnailContainerRef.current.style.cursor = 'grab'
    thumbnailContainerRef.current.style.userSelect = 'auto'

    // If we were dragging, re-enable hover on thumbnails
    if (wasDragging) {
      isOverThumbnailRef.current = false
    }
  }

  const handleMouseUp = () => {
    endDrag()
  }

  const handleTouchEnd = () => {
    endDrag()
    isTouchDeviceRef.current = false
  }

  const updateDrag = (clientX: number) => {
    if (!isDragging || !thumbnailContainerRef.current) return

    const rect = thumbnailContainerRef.current.getBoundingClientRect()
    const currentX = clientX - rect.left
    const walk = (startX - currentX) * 1.5 // Drag distance (positive = dragged left, negative = dragged right)
    const dragDistance = Math.abs(walk)

    // If we've moved enough, this is a drag operation
    if (dragDistance > 3) {
      hasMovedRef.current = true

      // Update scroll position
      // When dragging left (walk > 0), scroll right (scrollLeft increases)
      // When dragging right (walk < 0), scroll left (scrollLeft decreases)
      thumbnailContainerRef.current.scrollLeft = scrollLeft + walk

      // Update thumbnail hover state - don't trigger hover during active drag
      isOverThumbnailRef.current = false
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateDrag(e.clientX)
    if (hasMovedRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const touch = e.touches[0]
    updateDrag(touch.clientX)
    if (hasMovedRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleThumbnailClick = (imageUrl: string, e: React.MouseEvent) => {
    // Only trigger click if we didn't drag (moved less than threshold)
    if (!hasMovedRef.current) {
      e.stopPropagation()
      e.preventDefault()
      updatePreviewImage(imageUrl)
    }
  }

  const handleThumbnailMouseEnter = (
    imageUrl: string,
    e?: React.MouseEvent,
  ) => {
    // Don't trigger hover if we're actively dragging
    if (isDragging && hasMovedRef.current) {
      return
    }

    isOverThumbnailRef.current = true

    if (e) {
      e.stopPropagation()
    }

    // Update preview on hover only if not dragging
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
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleThumbnailClick,
    handleThumbnailMouseEnter,
    handleThumbnailMouseLeave,
  }
}
