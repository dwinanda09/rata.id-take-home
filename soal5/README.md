# Soal 5: GraphQL Query Operations with Complete CRUD

## Overview
Advanced GraphQL microservice implementation with complete CRUD operations, real-time subscriptions, and comprehensive product management for e-commerce applications.

## Enhanced Features

### Complete CRUD Operations
- **Create**: Single and bulk product creation with validation
- **Read**: Advanced queries with filtering, sorting, and pagination
- **Update**: Comprehensive product updates and stock management
- **Delete**: Soft and hard delete with bulk operations

### Real-time Capabilities
- **WebSocket Subscriptions**: Live updates for product changes
- **Event-driven Architecture**: Pub/Sub system for real-time notifications
- **Stock Alerts**: Low inventory notifications
- **Status Monitoring**: Product status change alerts

### Advanced Query Features
- **Search & Filter**: Text search with category, price, and tag filters
- **Analytics Queries**: Top selling, low stock, and recent products
- **Metrics Integration**: Product performance and sales data
- **Pagination**: Cursor and offset-based pagination

## File Structure
```
soal5/
├── proto/
│   └── catalog.proto          # Enhanced gRPC definitions with CRUD
├── src/
│   ├── schema/
│   │   └── typeDefs.ts        # Complete GraphQL schema with subscriptions
│   ├── resolvers/
│   │   ├── productResolvers.ts # Full CRUD resolvers
│   │   └── index.ts           # Combined resolvers with subscriptions
│   ├── grpc/
│   │   └── catalogClient.ts   # Enhanced gRPC client
│   ├── mockServices/
│   │   └── catalogMockServer.ts # Full CRUD mock service
│   └── server.ts              # Enhanced server with subscriptions
├── architecture.md            # CRUD operations architecture
└── README.md
```

## Available Operations

### Queries
- `product(id, includeMetrics)` - Get single product
- `products(ids, statusFilter, pagination)` - Get multiple products
- `searchProducts(search, pagination)` - Advanced product search
- `productsByCategory(category, pagination)` - Products by category
- `productAvailability(productId, quantity)` - Check availability
- `lowStockProducts(threshold)` - Products with low stock
- `topSellingProducts(limit)` - Best selling products
- `recentProducts(days)` - Recently added products

### Mutations
- `createProduct(input)` - Create new product
- `updateProduct(input)` - Update existing product
- `deleteProduct(id, softDelete)` - Delete product
- `updateProductStock(input)` - Update stock levels
- `activateProduct(id)` - Activate product
- `deactivateProduct(id)` - Deactivate product
- `duplicateProduct(id, newSku)` - Duplicate product

### Subscriptions
- `productUpdated` - Real-time product updates
- `stockLevelChanged` - Stock level alerts
- `newProductInCategory` - New products in category
- `productStatusChanged` - Status change notifications

### Services
- **GraphQL Server**: `localhost:4000/graphql`
- **gRPC Catalog Service**: `localhost:50051`
- **Health Check**: `localhost:4000/health`
- **Examples**: `localhost:4000/examples`

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Mock gRPC Service
```bash
npm run mock:catalog
```

### 3. Start GraphQL Server
```bash
npm run dev
```

### 4. Access Interfaces
- **GraphQL Playground**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health
- **Example Queries**: http://localhost:4000/examples

## GraphQL Operations

### Query Operations

#### Basic Product Queries
```graphql
# Get single product with metrics
query GetProduct {
  product(id: "1", includeMetrics: true) {
    id
    name
    description
    price
    stockQuantity
    metrics {
      salesCount
      averageRating
      viewsCount
    }
  }
}

# Advanced product search
query SearchProducts {
  searchProducts(
    search: {
      query: "smartphone"
      category: "electronics"
      minPrice: 500
      maxPrice: 1500
      tags: ["premium", "flagship"]
      status: ACTIVE
      sortBy: "price"
      sortOrder: "ASC"
    }
    pagination: { limit: 10, offset: 0 }
  ) {
    products {
      id
      name
      price
      category
      tags
    }
    totalCount
    hasMore
    pagination {
      currentPage
      totalPages
      totalItems
    }
  }
}
```

#### Analytics Queries
```graphql
# Low stock products
query LowStockProducts {
  lowStockProducts(threshold: 10) {
    products {
      id
      name
      stockQuantity
      status
    }
  }
}

# Top selling products
query TopSelling {
  topSellingProducts(limit: 5) {
    id
    name
    metrics {
      salesCount
      averageRating
    }
  }
}

# Recent products
query RecentProducts {
  recentProducts(days: 7) {
    products {
      id
      name
      createdAt
    }
  }
}
```

### Mutation Operations

#### Create Operations
```graphql
# Create single product
mutation CreateProduct {
  createProduct(input: {
    name: "iPhone 16 Pro"
    description: "Next generation iPhone"
    category: "smartphones"
    price: 1199.99
    currency: "USD"
    stockQuantity: 100
    sku: "IPHONE-16-PRO-128"
    imageUrls: ["https://example.com/image.jpg"]
    tags: ["apple", "premium", "smartphone"]
    attributes: {
      color: "Titanium"
      storage: "128GB"
    }
  }) {
    id
    name
    price
    sku
    status
    createdAt
  }
}

# Bulk create products
mutation CreateMultipleProducts {
  createProducts(inputs: [
    {
      name: "Product A"
      category: "electronics"
      price: 299.99
      sku: "PROD-A-001"
    },
    {
      name: "Product B"
      category: "electronics"
      price: 399.99
      sku: "PROD-B-001"
    }
  ]) {
    successCount
    errorCount
    updatedProducts {
      id
      name
      sku
    }
    failedUpdates
  }
}
```

#### Update Operations
```graphql
# Update product
mutation UpdateProduct {
  updateProduct(input: {
    id: "1"
    name: "Updated iPhone 15 Pro"
    price: 1099.99
    stockQuantity: 75
    status: ACTIVE
    tags: ["updated", "premium"]
  }) {
    id
    name
    price
    stockQuantity
    status
    updatedAt
  }
}

# Update stock
mutation UpdateStock {
  updateProductStock(input: {
    productId: "1"
    quantityChange: 25
    operation: ADD
    reason: "Inventory restock"
  }) {
    id
    stockQuantity
    updatedAt
  }
}

# Status management
mutation ActivateProduct {
  activateProduct(id: "1") {
    id
    status
    updatedAt
  }
}
```

#### Delete Operations
```graphql
# Soft delete
mutation DeleteProduct {
  deleteProduct(id: "1", softDelete: true, reason: "Discontinued")
}

# Hard delete
mutation DeleteProductPermanently {
  deleteProduct(id: "1", softDelete: false)
}
```

#### Utility Operations
```graphql
# Duplicate product
mutation DuplicateProduct {
  duplicateProduct(
    id: "1"
    newSku: "IPHONE-15-PRO-COPY"
    modifications: {
      name: "iPhone 15 Pro (Copy)"
      stockQuantity: 0
    }
  ) {
    id
    name
    sku
    stockQuantity
  }
}
```

### Subscription Operations

#### Real-time Updates
```graphql
# Subscribe to product updates
subscription ProductUpdates {
  productUpdated {
    id
    name
    status
    stockQuantity
    updatedAt
  }
}

# Subscribe to specific product
subscription SpecificProductUpdates {
  productUpdated(productId: "1") {
    id
    name
    stockQuantity
    status
  }
}

# Stock level alerts
subscription StockAlerts {
  stockLevelChanged(threshold: 10) {
    id
    name
    stockQuantity
    status
  }
}

# New products in category
subscription NewSmartphones {
  newProductInCategory(category: "smartphones") {
    id
    name
    price
    createdAt
  }
}

# Status changes
subscription StatusChanges {
  productStatusChanged(productIds: ["1", "2", "3"]) {
    id
    name
    status
    updatedAt
  }
}
```

## Advanced Features

### Input Validation
- Comprehensive validation for all mutation inputs
- Custom error messages with field-level details
- Business rule enforcement (price validation, SKU uniqueness)
- Sanitization of user inputs

### Error Handling
- Structured error responses with error codes
- Partial success handling for bulk operations
- Graceful degradation for service failures
- Detailed logging for debugging

### Performance Optimizations
- Connection pooling for gRPC clients
- Subscription event filtering
- Pagination for large datasets
- Query complexity analysis

### Real-time Architecture
- WebSocket-based subscriptions
- Event-driven pub/sub system
- Topic-based event routing
- Connection lifecycle management

## Testing the Implementation

### Using GraphQL Playground
1. Navigate to http://localhost:4000/graphql
2. Use the schema explorer for autocomplete
3. Test queries, mutations, and subscriptions
4. Monitor real-time updates

### Example Test Sequence
1. **Create** a product using `createProduct`
2. **Query** the product using `product(id)`
3. **Update** stock using `updateProductStock`
4. **Subscribe** to `stockLevelChanged` for alerts
5. **Search** products using `searchProducts`
6. **Delete** the product using `deleteProduct`

## Production Considerations

### Security
- Input validation and sanitization
- Rate limiting for mutations
- Authentication and authorization (ready for implementation)
- Query depth and complexity limits

### Scalability
- Horizontal scaling support
- Load balancing for gRPC services
- Caching strategies for queries
- Background processing for bulk operations

### Monitoring
- Health check endpoints
- Performance metrics
- Error tracking
- Query analytics

This implementation provides enterprise-grade CRUD operations with real-time capabilities, making it suitable for production e-commerce applications with comprehensive product management requirements.