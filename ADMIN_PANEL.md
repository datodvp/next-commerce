# Admin Panel Documentation

## Overview

The admin panel is a fully functional content management system for managing products and categories. It's completely separated from the client-facing codebase for maintainability and security.

## Structure

```
src/
├── admin/                          # Admin-specific code (completely separated)
│   ├── components/                 # Admin UI components
│   │   ├── AdminLayout/           # Main admin layout with sidebar
│   │   ├── AdminButton/           # Reusable button component
│   │   ├── AdminCard/             # Card container component
│   │   ├── AdminTable/            # Table component for data display
│   │   └── AdminForm/             # Form components (input, textarea, select)
│   ├── hooks/
│   │   └── useAdminAuth.ts        # Authentication hook
│   ├── services/                  # Admin API services
│   │   ├── adminProductService.ts # Product CRUD operations
│   │   └── adminCategoryService.ts # Category CRUD operations
│   └── utils/
│       └── auth.ts                # Authentication utilities
└── pages/
    └── admin/                     # Admin routes
        ├── login.tsx              # Login page
        ├── index.tsx              # Dashboard
        ├── products/
        │   ├── index.tsx          # Products list
        │   ├── create.tsx         # Create product
        │   └── edit/[id].tsx      # Edit product
        └── categories/
            ├── index.tsx          # Categories list
            ├── create.tsx         # Create category
            └── edit/[id].tsx      # Edit category
```

## Features

### Authentication
- Simple authentication system (currently using mock credentials)
- Login page at `/admin/login`
- Protected routes that redirect to login if not authenticated
- Session management via localStorage

**Demo Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

### Dashboard (`/admin`)
- Overview statistics (total products, total categories)
- Quick action buttons
- Clean, modern UI matching the website design

### Products Management (`/admin/products`)
- **List View**: View all products in a table with edit/delete actions
- **Create**: Add new products with:
  - SKU, Title, Slug, Description
  - Price, Stock
  - Category selection
  - Image URLs and file uploads
- **Edit**: Update existing product information
- **Delete**: Remove products with confirmation

### Categories Management (`/admin/categories`)
- **List View**: View all categories in a table
- **Create**: Add new categories with name and slug
- **Edit**: Update category information
- **Delete**: Remove categories with confirmation

## Design

The admin panel uses the same color scheme as the main website:
- Primary Green: `#3d7277`
- Primary Red: `#df6c68`
- Primary Gray: `#e5eced`
- Secondary Black: `rgb(40, 39, 39)`

## Code Separation

### Client Code (`src/`)
- All client-facing components, pages, and logic
- Public routes (home, products, categories, cart)
- Regular Layout component

### Admin Code (`src/admin/`)
- All admin-specific components, services, and utilities
- Admin routes (`src/pages/admin/`)
- AdminLayout component (separate from client Layout)

### Layout Routing (`_app.tsx`)
The app automatically detects admin routes and uses the appropriate layout:
- `/admin/*` routes → AdminLayout
- All other routes → Client Layout

## API Integration

The admin panel uses the same API client as the client app but with admin-specific services:
- `adminProductService`: Product CRUD operations
- `adminCategoryService`: Category CRUD operations
- Both services handle authentication tokens automatically

## Security Notes

⚠️ **Current Implementation:**
- Uses mock authentication (hardcoded credentials)
- Tokens stored in localStorage
- No backend authentication integration yet

**For Production:**
1. Integrate with your backend authentication API
2. Implement proper JWT token management
3. Add server-side route protection
4. Implement role-based access control (RBAC)
5. Add CSRF protection
6. Use httpOnly cookies for tokens

## Usage

1. **Access Admin Panel**: Navigate to `/admin/login`
2. **Login**: Use demo credentials above
3. **Navigate**: Use sidebar navigation to access different sections
4. **Manage Content**: Create, edit, or delete products and categories
5. **Logout**: Click the logout button in the sidebar footer

## Future Enhancements

- [ ] Backend authentication integration
- [ ] Image upload preview
- [ ] Bulk operations
- [ ] Advanced filtering and search
- [ ] Analytics dashboard
- [ ] User management
- [ ] Order management
- [ ] Inventory tracking

