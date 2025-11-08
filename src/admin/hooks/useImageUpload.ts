import { useState, useEffect, useRef, useCallback } from 'react'

interface UseImageUploadReturn {
  imageFiles: File[]
  imagePreviewUrls: string[]
  fileInputRef: React.RefObject<HTMLInputElement>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemovePreviewImage: (index: number) => void
  clearImages: () => void
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviewUrls])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...newFiles])

      // Create preview URLs for new files
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }

    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleRemovePreviewImage = useCallback((index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index])

    // Remove from both arrays
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }, [imagePreviewUrls])

  const clearImages = useCallback(() => {
    // Revoke all object URLs
    imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    setImageFiles([])
    setImagePreviewUrls([])
  }, [imagePreviewUrls])

  return {
    imageFiles,
    imagePreviewUrls,
    fileInputRef,
    handleFileChange,
    handleRemovePreviewImage,
    clearImages,
  }
}
