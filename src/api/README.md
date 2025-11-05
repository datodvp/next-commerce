# API Architecture

This directory contains the enterprise-grade API client and configuration.

## Structure

```
api/
├── client.ts      # Axios instance with interceptors and retry logic
├── config.ts      # API configuration and constants
├── endpoints.ts   # Type-safe endpoint definitions
├── errors.ts      # Error handling and custom error classes
├── types.ts       # API-specific TypeScript types
└── index.ts       # Central export point
```

## Features

- **Automatic Retry**: Retries failed requests (network errors, 5xx errors) up to 3 times
- **Request Interceptors**: Automatically adds auth tokens
- **Response Interceptors**: Error handling and logging
- **Type Safety**: Full TypeScript support
- **Error Handling**: Custom error classes with detailed error information
- **Development Logging**: Request/response logging in development mode

## Usage

### Direct API Client Usage

```typescript
import { apiClient } from '@/api'

// GET request
const products = await apiClient.get<IProduct[]>('/products')

// POST request
const newProduct = await apiClient.post<IProduct>('/products', productData)
```

### Using Services (Recommended)

```typescript
import { ProductService } from '@/services'

// Fetch all products
const products = await ProductService.getAll()

// Fetch by slug
const product = await ProductService.getBySlug('product-slug')

// Fetch by category
const products = await ProductService.getByCategory(1)
```

### Using SWR Hooks (Client-side)

```typescript
import { useProducts, useProduct } from '@/hooks/api'

// In a component
const { products, isLoading, error } = useProducts()
const { product, isLoading } = useProduct(slug)
```

## Error Handling

All API errors are wrapped in `ApiError` class:

```typescript
import { ApiError, ApiErrorCode } from '@/api'

try {
  const products = await ProductService.getAll()
} catch (error) {
  if (error instanceof ApiError) {
    if (error.code === ApiErrorCode.NOT_FOUND) {
      // Handle 404
    } else if (error.isNetworkError()) {
      // Handle network errors
    }
  }
}
```

## Configuration

API configuration is in `config.ts`:

- `baseURL`: API base URL (from env or default)
- `timeout`: Request timeout (30s)
- `retries`: Max retry attempts (3)
- `retryDelay`: Delay between retries (1s)

