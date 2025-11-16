import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # GraphQL Schema for E-commerce Application

  # Custom scalar types
  scalar DateTime
  scalar JSON

  # Product related types
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
    "Calculated discounted price"
    discountedPrice: Float
  }

  # Product status enumeration
  enum ProductStatus {
    "Product is active and available"
    ACTIVE
    "Product is temporarily inactive"
    INACTIVE
    "Product is out of stock"
    OUT_OF_STOCK
    "Product has been discontinued"
    DISCONTINUED
  }

  # Product availability information
  type ProductAvailability {
    "Whether the requested quantity is available"
    isAvailable: Boolean!
    "Currently available quantity"
    availableQuantity: Int!
    "Additional availability message"
    message: String
  }

  # User related types
  type User {
    "Unique identifier for the user"
    id: ID!
    "User's username"
    username: String!
    "User's email address"
    email: String!
    "User's first name"
    firstName: String!
    "User's last name"
    lastName: String!
    "User's phone number"
    phone: String
    "User's primary address"
    address: Address
    "User's role in the system"
    role: UserRole!
    "Whether the user account is active"
    isActive: Boolean!
    "User account creation timestamp"
    createdAt: DateTime!
    "User account last update timestamp"
    updatedAt: DateTime!
    "User's orders"
    orders: [Order!]!
    "User's preferences"
    preferences: UserPreferences
  }

  # User role enumeration
  enum UserRole {
    "Regular customer"
    CUSTOMER
    "System administrator"
    ADMIN
    "Product seller"
    SELLER
    "Content moderator"
    MODERATOR
  }

  # Address type
  type Address {
    "Street address"
    street: String!
    "City name"
    city: String!
    "State or province"
    state: String!
    "Postal or ZIP code"
    postalCode: String!
    "Country name"
    country: String!
  }

  # User preferences
  type UserPreferences {
    "User ID this preferences belong to"
    userId: ID!
    "Preferred language code"
    language: String!
    "Preferred currency code"
    currency: String!
    "Email notification preference"
    emailNotifications: Boolean!
    "SMS notification preference"
    smsNotifications: Boolean!
    "UI theme preference"
    theme: String!
    "Custom preferences as key-value pairs"
    customPreferences: JSON
  }

  # Order related types
  type Order {
    "Unique identifier for the order"
    id: ID!
    "User who placed the order"
    userId: ID!
    "Human-readable order number"
    orderNumber: String!
    "Current order status"
    status: OrderStatus!
    "Items in the order"
    items: [OrderItem!]!
    "Order pricing breakdown"
    pricing: OrderPricing!
    "Shipping address"
    shippingAddress: Address!
    "Billing address"
    billingAddress: Address!
    "Payment information"
    paymentInfo: PaymentInfo!
    "Order creation timestamp"
    createdAt: DateTime!
    "Order last update timestamp"
    updatedAt: DateTime!
    "Order shipping timestamp"
    shippedAt: DateTime
    "Order delivery timestamp"
    deliveredAt: DateTime
    "User who placed the order"
    user: User!
  }

  # Order status enumeration
  enum OrderStatus {
    "Order is pending confirmation"
    PENDING
    "Order has been confirmed"
    CONFIRMED
    "Order is being processed"
    PROCESSING
    "Order has been shipped"
    SHIPPED
    "Order has been delivered"
    DELIVERED
    "Order has been cancelled"
    CANCELLED
    "Order has been refunded"
    REFUNDED
  }

  # Order item details
  type OrderItem {
    "Product ID"
    productId: ID!
    "Product name at time of order"
    productName: String!
    "Product SKU at time of order"
    productSku: String!
    "Quantity ordered"
    quantity: Int!
    "Unit price at time of order"
    unitPrice: Float!
    "Total price for this item"
    totalPrice: Float!
    "Product attributes at time of order"
    productAttributes: JSON
    "Associated product information"
    product: Product
  }

  # Order pricing breakdown
  type OrderPricing {
    "Subtotal before taxes and fees"
    subtotal: Float!
    "Tax amount"
    taxAmount: Float!
    "Shipping cost"
    shippingAmount: Float!
    "Discount amount"
    discountAmount: Float!
    "Final total amount"
    totalAmount: Float!
    "Currency code"
    currency: String!
  }

  # Payment information
  type PaymentInfo {
    "Payment method used"
    paymentMethod: String!
    "Current payment status"
    paymentStatus: String!
    "External transaction ID"
    transactionId: String
    "Amount paid"
    amountPaid: Float!
    "Currency code"
    currency: String!
  }

  # Order statistics
  type OrderStats {
    "Total number of orders"
    totalOrders: Int!
    "Total monetary amount"
    totalAmount: Float!
    "Average order value"
    averageOrderValue: Float!
    "Count of orders by status"
    statusCounts: JSON!
  }

  # Input types for mutations and complex queries
  input ProductSearchInput {
    "Search query string"
    query: String
    "Category filter"
    category: String
    "Minimum price filter"
    minPrice: Float
    "Maximum price filter"
    maxPrice: Float
    "Sort field"
    sortBy: String
    "Sort order (ASC or DESC)"
    sortOrder: String
  }

  input PaginationInput {
    "Number of items to return"
    limit: Int = 20
    "Number of items to skip"
    offset: Int = 0
  }

  # Query root type
  type Query {
    # Product queries
    "Get a single product by ID"
    product(id: ID!): Product

    "Get multiple products by IDs"
    products(ids: [ID!], pagination: PaginationInput): [Product!]!

    "Search products with filters"
    searchProducts(search: ProductSearchInput!, pagination: PaginationInput): [Product!]!

    "Get products by category"
    productsByCategory(category: String!, pagination: PaginationInput): [Product!]!

    "Check product availability"
    productAvailability(productId: ID!, quantity: Int!): ProductAvailability!

    # User queries
    "Get a single user by ID"
    user(id: ID!): User

    "Get multiple users by IDs"
    users(ids: [ID!]!, pagination: PaginationInput): [User!]!

    # Order queries
    "Get a single order by ID"
    order(id: ID!): Order

    "Get orders for a specific user"
    userOrders(userId: ID!, status: OrderStatus, pagination: PaginationInput): [Order!]!

    "Get order statistics"
    orderStats(userId: ID, startDate: DateTime, endDate: DateTime): OrderStats!
  }

  # Mutation root type (placeholder for future CRUD operations)
  type Mutation {
    # Placeholder mutation
    "Health check mutation"
    ping: String!
  }

  # Subscription root type (placeholder for real-time features)
  type Subscription {
    # Placeholder subscription
    "Order status updates"
    orderStatusUpdate(orderId: ID!): Order
  }
`;