# API Hooks

SWR hooks for client-side data fetching with automatic caching and revalidation.

## Available Hooks

### `useProducts()`
Fetch all products with automatic caching.

```typescript
import { useProducts } from '@/hooks/api'

const { products, isLoading, error, mutate } = useProducts()
```

### `useProduct(slug)`
Fetch a single product by slug.

```typescript
import { useProduct } from '@/hooks/api'

const { product, isLoading, error, mutate } = useProduct('product-slug')
```

### `useProductsByCategory(categoryId)`
Fetch products filtered by category.

```typescript
import { useProductsByCategory } from '@/hooks/api'

const { products, isLoading, error, mutate } = useProductsByCategory(1)
```

### `useCategories()`
Fetch all categories with longer cache duration (5 minutes).

```typescript
import { useCategories } from '@/hooks/api'

const { categories, isLoading, error, mutate } = useCategories()
```

## Features

- ✅ Automatic caching and request deduplication
- ✅ Automatic revalidation on reconnect
- ✅ Error retry logic
- ✅ Loading states
- ✅ Manual mutation support

## Usage Notes

These hooks are currently **not used** in the application as all pages use `getServerSideProps` for server-side rendering. However, they are available for:

- Client-side data fetching
- Real-time data updates
- Optimistic UI updates
- Future client-side pages

## Example: Converting Server-Side to Client-Side

**Before (Server-Side):**
```typescript
export const getServerSideProps: GetServerSideProps = async () => {
  const products = await ProductService.getAll()
  return { props: { products } }
}
```

**After (Client-Side with SWR):**
```typescript
import { useProducts } from '@/hooks/api'

export default function ProductsPage() {
  const { products, isLoading, error } = useProducts()

  if (isLoading) return <Loading />
  if (error) return <Error message={error.message} />

  return <ProductList products={products} />
}
```

