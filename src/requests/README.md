# Legacy Requests (Deprecated)

⚠️ **This directory is deprecated and kept for backward compatibility.**

The new API structure has been moved to:
- **API Client**: `src/api/` - Enterprise API client with interceptors and error handling
- **Services**: `src/services/` - Business logic layer
- **Hooks**: `src/hooks/api/` - SWR hooks for data fetching

## Migration

Old code:
```typescript
import { requestProducts } from '@/requests/requestProducts'
const products = await requestProducts.fetchAllProducts()
```

New code:
```typescript
import { ProductService } from '@/services'
const products = await ProductService.getAll()
```

These files will be removed in a future version. Please migrate to the new structure.

