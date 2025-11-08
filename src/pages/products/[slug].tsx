import { GetServerSideProps } from 'next'
import { CategoryService, ProductService } from '@/services'
import { IProduct } from '@/models/common/types'
import Image from 'next/image'
import styles from './styles.module.scss'
import { useState, useRef, useEffect } from 'react'
import AddToCartDetail from '@/components/ProductCard/AddToCartDetail'
import { API_CONFIG } from '@/api/config'
import Link from 'next/link'

interface IProps {
  product: IProduct
}

const Product = ({ product }: IProps) => {
  // Normalize image URLs - convert relative URLs to absolute
  const normalizeImageUrl = (url: string): string => {
    return url.startsWith('http') ? url : `${API_CONFIG.baseURL}${url}`
  }

  const normalizedImages = product.images?.map(img => ({
    ...img,
    url: normalizeImageUrl(img.url)
  })) || []

  const [currentPreviewImage, setCurrentPreviewImage] = useState<string>(
    normalizedImages[0]?.url || '',
  )
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const hasMovedRef = useRef(false)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const updatePreviewImage = (image: string) => {
    setCurrentPreviewImage(image)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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
    // Reset after a brief delay to allow click event to check
    setTimeout(() => {
      hasMovedRef.current = false
    }, 100)
    thumbnailContainerRef.current.style.cursor = 'grab'
    thumbnailContainerRef.current.style.userSelect = 'auto'
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !thumbnailContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - thumbnailContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    
    // Check if mouse has moved significantly (more than 5px) to distinguish drag from click
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true
      thumbnailContainerRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleThumbnailClick = (imageUrl: string, e: React.MouseEvent) => {
    // Only update preview if this was a click (not a drag)
    if (!hasMovedRef.current) {
      e.stopPropagation()
      updatePreviewImage(imageUrl)
    }
  }

  const handleThumbnailMouseEnter = (imageUrl: string) => {
    // Only update on hover if not currently dragging
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
  return (
    <main className={styles.root}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className={styles.separator}>/</span>
        <Link href="/products">Products</Link>
        {product.category && (
          <>
            <span className={styles.separator}>/</span>
            <Link href={`/categories/${product.category.slug}`}>
              {product.category.name}
            </Link>
          </>
        )}
        <span className={styles.separator}>/</span>
        <span className={styles.current}>{product.title}</span>
      </nav>

      <section className={styles.productDetails}>
        <div className={styles.imageSection}>
          {normalizedImages.length > 0 ? (
            <>
              <div className={styles.previewContainer}>
                {normalizedImages.map((image) => (
                  <Image
                    src={image.url}
                    alt={product.title}
                    width={700}
                    height={700}
                    className={styles.image}
                    priority
                    key={image.id}
                    unoptimized
                    style={{
                      display:
                        currentPreviewImage === image.url ? 'block' : 'none',
                    }}
                  />
                ))}
              </div>
              <div 
                ref={thumbnailContainerRef}
                className={styles.smallerImagesContainer}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                {normalizedImages.map((image) => (
                  <Image
                    src={image.url}
                    alt={product.title}
                    width={150}
                    height={150}
                    key={image.id}
                    priority
                    unoptimized
                    className={`${styles.smallerImage} ${image.url !== currentPreviewImage && styles.blurredImage}`}
                    onMouseEnter={() => handleThumbnailMouseEnter(image.url)}
                    onClick={(e) => handleThumbnailClick(image.url, e)}
                    draggable={false}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.previewContainer}>
              <div className={styles.noImage}>No image available</div>
            </div>
          )}
        </div>
        <div>
          <h1 className={styles.title}>{product.title}</h1>
          {product.category && (
            <h2 className={styles.category}>{product.category.name}</h2>
          )}

          {product.flags && product.flags.length > 0 && (
            <div className={styles.flags}>
              {product.flags.map((flag) => (
                <span key={flag.id} className={styles.flagBadge}>
                  {flag.name}
                </span>
              ))}
            </div>
          )}

          <div className={styles.priceContainer}>
            {product.discountedPrice && product.discountedPrice < product.price ? (
              <>
                <div className={styles.discountedPriceContainer}>
                  <span className={styles.dollarSymbol}>$</span>
                  <span className={styles.discountedPrice}>{product.discountedPrice.toFixed(2)}</span>
                </div>
                <div className={styles.originalPriceContainer}>
                  <span className={styles.originalPriceLabel}>Was:</span>
                  <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <>
                <span className={styles.dollarSymbol}>$</span>
                <span>{product.price.toFixed(2)}</span>
              </>
            )}
          </div>

          {product.description && (
            <div className={styles.description}>
              <span className={styles.label}>Description</span>
              <p>{product.description}</p>
            </div>
          )}

          <AddToCartDetail product={product} />
        </div>
      </section>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { slug } = context.params as { slug: string }

    const [categories, product] = await Promise.all([
      CategoryService.getAll(),
      ProductService.getBySlug(slug),
    ])

    if (!product) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        categories,
        product,
      },
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      notFound: true,
    }
  }
}

export default Product
