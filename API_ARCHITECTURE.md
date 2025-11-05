# Enterprise API Architecture

## Overview

The API layer has been restructured to enterprise production-grade standards with proper separation of concerns, error handling, retry logic, and type safety.

## Architecture

```
src/
├── api/                    # API Client Layer
│   ├── client.ts          # Axios instance with interceptors
│   ├── config.ts          # API configuration
│   ├── endpoints.ts       # Type-safe endpoints
│   ├── errors.ts          # Error handling
│   ├── types.ts           # API types
│   └── index.ts           # Exports
│
├── services/              # Business Logic Layer
│   ├── productService.ts  # Product operations
│   ├── categoryService.ts # Category operations
│   └── index.ts           # Exports
│
└── hooks/api/             # Client-side Data Fetching
    ├── useProducts.ts     # Product SWR hooks
    ├── useCategories.ts   # Category SWR hooks
    └── index.ts           # Exports
```

## Key Features

### 1. API Client (`src/api/client.ts`)
- ✅ Automatic retry logic (3 retries for network/5xx errors)
- ✅ Request/response interceptors
- ✅ Automatic auth token injection
- ✅ Request timeout handling (30s)
- ✅ Development logging
- ✅ Type-safe methods (get, post, put, patch, delete)

### 2. Error Handling (`src/api/errors.ts`)
- ✅ Custom `ApiError` class with error codes
- ✅ Detailed error information (status code, message, response)
- ✅ Network error detection
- ✅ Client/Server error classification
- ✅ Proper error propagation

### 3. Services Layer (`src/services/`)
- ✅ Business logic separation
- ✅ Clean API interface
- ✅ Error handling integration
- ✅ Type-safe operations

### 4. SWR Hooks (`src/hooks/api/`)
- ✅ Automatic caching
- ✅ Revalidation strategies
- ✅ Request deduplication
- ✅ Error retry logic
- ✅ Loading states

## Usage Examples

### Server-Side (getServerSideProps)

```typescript
import { ProductService, CategoryService } from '@/services'

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [products, categories] = await Promise.all([
      ProductService.getAll(),
      CategoryService.getAll(),
    ])

    return { props: { products, categories } }
  } catch (error) {
    // Handle error
    return { props: { products: [], categories: [] } }
  }
}
```

### Client-Side (SWR Hooks)

```typescript
import { useProducts, useProduct } from '@/hooks/api'

function ProductsPage() {
  const { products, isLoading, error } = useProducts()

  if (isLoading) return <Loading />
  if (error) return <Error message={error.message} />

  return <ProductList products={products} />
}
```

### Direct API Client (Advanced)

```typescript
import { apiClient } from '@/api'

// Custom request
const data = await apiClient.get<MyType>('/custom-endpoint')
```

## Error Handling

```typescript
import { ApiError, ApiErrorCode } from '@/api'

try {
  const product = await ProductService.getBySlug('slug')
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case ApiErrorCode.NOT_FOUND:
        // Handle 404
        break
      case ApiErrorCode.NETWORK_ERROR:
        // Handle network issues
        break
      case ApiErrorCode.SERVER_ERROR:
        // Handle server errors
        break
    }
  }
}
```

## Configuration

Edit `src/api/config.ts` to customize:

- `baseURL`: API base URL
- `timeout`: Request timeout (default: 30000ms)
- `retries`: Max retry attempts (default: 3)
- `retryDelay`: Delay between retries (default: 1000ms)

## Migration from Old Structure

### Old Code
```typescript
import { requestProducts } from '@/requests/requestProducts'
const products = await requestProducts.fetchAllProducts()
```

### New Code
```typescript
import { ProductService } from '@/services'
const products = await ProductService.getAll()
```

## Benefits

1. **Separation of Concerns**: Clear separation between API client, services, and hooks
2. **Type Safety**: Full TypeScript support throughout
3. **Error Handling**: Comprehensive error handling with retry logic
4. **Performance**: SWR caching and request deduplication
5. **Maintainability**: Clean, organized structure
6. **Scalability**: Easy to add new endpoints and services
7. **Testing**: Services can be easily mocked and tested

## Next Steps

- [ ] Add request cancellation support
- [ ] Implement request/response transformers
- [ ] Add API response caching
- [ ] Implement rate limiting
- [ ] Add request queuing for concurrent requests
- [ ] Add performance monitoring

