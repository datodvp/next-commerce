export interface BreadcrumbItem {
  label: string
  href?: string
}

/**
 * Creates breadcrumb items for product detail page
 */
export const createProductBreadcrumbs = (
  productTitle: string,
  categorySlug?: string,
  categoryName?: string,
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ]

  if (categorySlug && categoryName) {
    items.push({
      label: categoryName,
      href: `/categories/${categorySlug}`,
    })
  }

  items.push({ label: productTitle })
  return items
}

/**
 * Creates breadcrumb items for category page
 */
export const createCategoryBreadcrumbs = (
  categoryName: string,
): BreadcrumbItem[] => {
  return [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: categoryName },
  ]
}

/**
 * Creates breadcrumb items for search page
 */
export const createSearchBreadcrumbs = (
  searchQuery: string,
): BreadcrumbItem[] => {
  return [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
    { label: `"${searchQuery}"` },
  ]
}

