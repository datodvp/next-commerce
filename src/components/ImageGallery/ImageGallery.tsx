import Image from 'next/image'
import { useImageGallery } from '@/hooks/useImageGallery'
import { normalizeImageUrl } from '@/utils/imageUtils'
import styles from './ImageGallery.module.scss'

interface ImageGalleryProps {
  images: Array<{ url: string; id?: number | string }>
  alt: string
}

const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
  const normalizedImages = images.map((img) => ({
    ...img,
    url: normalizeImageUrl(img.url),
  }))

  const {
    currentImage,
    thumbnailContainerRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    handleThumbnailClick,
    handleThumbnailMouseEnter,
  } = useImageGallery({ images: normalizedImages })

  if (normalizedImages.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.previewContainer}>
          <div className={styles.noImage}>No image available</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.imageSection}>
        <div className={styles.previewContainer}>
          {normalizedImages.map((image) => (
            <Image
              key={image.id || image.url}
              src={image.url}
              alt={alt}
              width={700}
              height={700}
              className={styles.image}
              priority
              unoptimized
              style={{
                display: currentImage === image.url ? 'block' : 'none',
              }}
            />
          ))}
        </div>
        {normalizedImages.length > 1 && (
          <div
            ref={thumbnailContainerRef}
            className={styles.thumbnailContainer}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {normalizedImages.map((image) => (
              <Image
                key={image.id || image.url}
                src={image.url}
                alt={alt}
                width={150}
                height={150}
                unoptimized
                className={`${styles.thumbnail} ${
                  image.url !== currentImage ? styles.blurred : ''
                }`}
                onMouseEnter={() => handleThumbnailMouseEnter(image.url)}
                onClick={(e) => handleThumbnailClick(image.url, e)}
                draggable={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGallery

