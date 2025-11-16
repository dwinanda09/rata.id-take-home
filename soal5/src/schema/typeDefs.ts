import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # Custom scalar types
  scalar DateTime
  scalar JSON

  # Product related types with enhanced CRUD support
  type Product {
    "Unique identifier for the product"
    id: ID!
    "Product name"
    name: String!
    "Detailed product description"
    description: String
    "Product category"
    category: String!
    "Product price in the specified currency"
    price: Float!
    "Currency code (e.g., USD, EUR)"
    currency: String!
    "Available stock quantity"
    stockQuantity: Int!
    "Stock Keeping Unit identifier"
    sku: String!
    "Product image URLs"
    imageUrls: [String!]!
    "Current product status"
    status: ProductStatus!
    "Product creation timestamp"
    createdAt: DateTime!
    "Product last update timestamp"
    updatedAt: DateTime!
    "Additional product attributes as key-value pairs"
    attributes: JSON
    "Product performance metrics"
    metrics: ProductMetrics
    "Product tags for categorization"
    tags: [String!]!
  }

  # Product metrics for analytics
  type ProductMetrics {
    "Number of product page views"
    viewsCount: Int!
    "Number of times this product was sold"
    salesCount: Int!
    "Average customer rating"
    averageRating: Float!
    "Number of customer reviews"
    reviewsCount: Int!
    "Number of users who added to wishlist"
    wishlistCount: Int!
  }

  # Enhanced product status enumeration
  enum ProductStatus {
    "Product is active and available for purchase"
    ACTIVE
    "Product is temporarily inactive"
    INACTIVE
    "Product is currently out of stock"
    OUT_OF_STOCK
    "Product has been discontinued"
    DISCONTINUED
    "Product is in draft status"
    DRAFT
    "Product has been archived"
    ARCHIVED
  }

  # Product availability with enhanced information
  type ProductAvailability {
    "Whether the requested quantity is available"
    isAvailable: Boolean!
    "Currently available quantity"
    availableQuantity: Int!
    "Additional availability message"
    message: String
    "Expected restock date if out of stock"
    restockDate: DateTime
  }

  # Pagination information
  type PaginationInfo {
    "Current page number"
    currentPage: Int!
    "Total number of pages"
    totalPages: Int!
    "Number of items per page"
    pageSize: Int!
    "Total number of items"
    totalItems: Int!
  }

  # Enhanced product list response
  type ProductListResponse {
    "List of products"
    products: [Product!]!
    "Total number of products"
    totalCount: Int!
    "Whether there are more products available"
    hasMore: Boolean!
    "Pagination information"
    pagination: PaginationInfo
  }

  # Bulk operation response
  type BulkOperationResponse {
    "Number of successful operations"
    successCount: Int!
    "Number of failed operations"
    errorCount: Int!
    "List of successfully updated products"
    updatedProducts: [Product!]!
    "List of failed product IDs with error messages"
    failedUpdates: [String!]!
    "Overall success status"
    success: Boolean!
  }

  # Input types for enhanced filtering and searching
  input ProductSearchInput {
    "Search query string for name and description"
    query: String
    "Category filter"
    category: String
    "Minimum price filter"
    minPrice: Float
    "Maximum price filter"
    maxPrice: Float
    "Product tags filter"
    tags: [String!]
    "Product status filter"
    status: ProductStatus
    "Sort field (name, price, created_at, etc.)"
    sortBy: String
    "Sort order (ASC or DESC)"
    sortOrder: String
  }

  input PaginationInput {
    "Number of items to return (default: 20, max: 100)"
    limit: Int = 20
    "Number of items to skip (default: 0)"
    offset: Int = 0
  }

  # Input types for product creation and updates
  input CreateProductInput {
    "Product name"
    name: String!
    "Product description"
    description: String
    "Product category"
    category: String!
    "Product price"
    price: Float!
    "Currency code (default: USD)"
    currency: String = "USD"
    "Initial stock quantity"
    stockQuantity: Int = 0
    "Stock Keeping Unit identifier"
    sku: String!
    "Product image URLs"
    imageUrls: [String!] = []
    "Product attributes as key-value pairs"
    attributes: JSON
    "Product tags"
    tags: [String!] = []
  }

  input UpdateProductInput {
    "Product ID to update"
    id: ID!
    "Updated product name"
    name: String
    "Updated product description"
    description: String
    "Updated product category"
    category: String
    "Updated product price"
    price: Float
    "Updated currency code"
    currency: String
    "Updated stock quantity"
    stockQuantity: Int
    "Updated product image URLs"
    imageUrls: [String!]
    "Updated product status"
    status: ProductStatus
    "Updated product attributes"
    attributes: JSON
    "Updated product tags"
    tags: [String!]
  }

  input StockUpdateInput {
    "Product ID to update stock for"
    productId: ID!
    "Quantity to add, subtract, or set"
    quantityChange: Int!
    "Stock operation type"
    operation: StockOperation!
    "Reason for stock update"
    reason: String
  }

  enum StockOperation {
    "Add to current stock"
    ADD
    "Subtract from current stock"
    SUBTRACT
    "Set absolute stock value"
    SET
  }

  # Query root type with enhanced operations
  type Query {
    # Single product queries
    "Get a single product by ID with optional metrics"
    product(id: ID!, includeMetrics: Boolean = false): Product

    # Multiple product queries
    "Get multiple products by IDs with filtering and pagination"
    products(
      ids: [ID!]
      statusFilter: ProductStatus
      includeMetrics: Boolean = false
      pagination: PaginationInput
    ): ProductListResponse!

    "Search products with advanced filtering and sorting"
    searchProducts(
      search: ProductSearchInput!
      pagination: PaginationInput
    ): ProductListResponse!

    "Get products by category with subcategory inclusion option"
    productsByCategory(
      category: String!
      includeSubcategories: Boolean = false
      pagination: PaginationInput
      sortBy: String = "name"
      sortOrder: String = "ASC"
    ): ProductListResponse!

    "Check product availability for specific quantity"
    productAvailability(productId: ID!, quantity: Int!): ProductAvailability!

    # Analytics and reporting queries
    "Get products with low stock (below threshold)"
    lowStockProducts(threshold: Int = 10, pagination: PaginationInput): ProductListResponse!

    "Get top performing products by sales"
    topSellingProducts(limit: Int = 10): [Product!]!

    "Get recently added products"
    recentProducts(days: Int = 7, pagination: PaginationInput): ProductListResponse!
  }

  # Mutation root type with full CRUD operations
  type Mutation {
    # Create operations
    "Create a new product"
    createProduct(input: CreateProductInput!): Product!

    "Create multiple products in batch"
    createProducts(inputs: [CreateProductInput!]!): BulkOperationResponse!

    # Update operations
    "Update an existing product"
    updateProduct(input: UpdateProductInput!): Product!

    "Update multiple products in batch"
    updateProducts(inputs: [UpdateProductInput!]!): BulkOperationResponse!

    "Update product stock quantity"
    updateProductStock(input: StockUpdateInput!): Product!

    "Update stock for multiple products"
    bulkUpdateStock(inputs: [StockUpdateInput!]!): BulkOperationResponse!

    # Delete operations
    "Delete a product (soft delete by default)"
    deleteProduct(id: ID!, softDelete: Boolean = true, reason: String): Boolean!

    "Delete multiple products"
    deleteProducts(ids: [ID!]!, softDelete: Boolean = true, reason: String): BulkOperationResponse!

    # Status management
    "Activate a product (set status to ACTIVE)"
    activateProduct(id: ID!): Product!

    "Deactivate a product (set status to INACTIVE)"
    deactivateProduct(id: ID!): Product!

    "Archive a product (set status to ARCHIVED)"
    archiveProduct(id: ID!): Product!

    # Utility operations
    "Duplicate an existing product with new SKU"
    duplicateProduct(id: ID!, newSku: String!, modifications: UpdateProductInput): Product!
  }

  # Subscription root type for real-time updates
  type Subscription {
    "Subscribe to product updates"
    productUpdated(productId: ID): Product!

    "Subscribe to stock level changes"
    stockLevelChanged(productId: ID, threshold: Int): Product!

    "Subscribe to new products in category"
    newProductInCategory(category: String!): Product!

    "Subscribe to product status changes"
    productStatusChanged(productIds: [ID!]): Product!
  }
`;