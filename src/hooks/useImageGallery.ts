import { useState, useRef, useEffect } from 'react'

interface UseImageGalleryProps {
  images: Array<{ url: string; id?: number | string }>
}

export const useImageGallery = ({ images }: UseImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState<string>(
    images[0]?.url || '',
  )
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const hasMovedRef = useRef(false)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const updatePreviewImage = (imageUrl: string) => {
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
    if (!isDragging || !thumbnailContainerRef.current) return
    
    // Don't handle drag if mouse is over a thumbnail
    const target = e.target as HTMLElement
    if (target.closest('[data-thumbnail="true"]')) {
      return
    }
    
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

  const handleThumbnailMouseEnter = (imageUrl: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    // Update preview on hover, but only if not actively dragging
    // hasMovedRef is only used to prevent click events, not hover
    if (!isDragging) {
      updatePreviewImage(imageUrl)
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

  // Set initial image
  useEffect(() => {
    if (images.length > 0 && images[0]?.url) {
      setCurrentImage(images[0].url)
    }
  }, [images])

  return {
    currentImage,
    thumbnailContainerRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    handleThumbnailClick,
    handleThumbnailMouseEnter,
  }
}

