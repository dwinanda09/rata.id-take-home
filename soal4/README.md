# Soal 4: GraphQL for Microservice

## Overview
Complete GraphQL microservice implementation for e-commerce with gRPC communication, autocomplete support, and comprehensive schema design.

## Files Structure
```
soal4/
├── proto/                    # gRPC Protocol Buffer definitions
│   ├── catalog.proto        # Product catalog service
│   ├── user.proto           # User management service
│   └── order.proto          # Order processing service
├── src/
│   ├── schema/
│   │   └── typeDefs.ts      # GraphQL schema definitions
│   ├── resolvers/           # GraphQL resolvers
│   │   ├── productResolvers.ts
│   │   ├── userResolvers.ts
│   │   ├── orderResolvers.ts
│   │   └── index.ts
│   ├── grpc/               # gRPC client implementations
│   │   ├── catalogClient.ts
│   │   ├── userClient.ts
│   │   └── orderClient.ts
│   ├── mockServices/       # Mock gRPC servers for testing
│   │   └── catalogMockServer.ts
│   └── server.ts           # Main GraphQL server
├── graphql-concepts.md     # GraphQL explanation and concepts
├── architecture.md         # System architecture diagram
└── README.md
```

## Available Services

### gRPC Services
- **Product Catalog**: `localhost:50051`
- **User Service**: `localhost:50052`
- **Order Service**: `localhost:50053`

### Example Queries
- Get Product: `query { product(id: "123") { name, price, category } }`
- Search Products: `query { searchProducts(search: { category: "electronics" }) { name, price } }`
- Get User: `query { user(id: "456") { username, email, orders { orderNumber } } }`

### Endpoints
- **GraphQL Server**: `localhost:4000/graphql`
- **Health Check**: `localhost:4000/health`

## Key Features

### GraphQL Schema
- **Comprehensive Type System**: Complete e-commerce entity definitions
- **Autocomplete Support**: Detailed field descriptions and type information
- **Introspection Enabled**: Self-documenting API
- **Custom Scalars**: DateTime and JSON types
- **Input Types**: Complex query and filter inputs

### gRPC Integration
- **Protocol Buffer Definitions**: Strongly typed service contracts
- **Client Implementations**: Type-safe gRPC clients
- **Error Handling**: Graceful service failure management
- **Connection Management**: Efficient connection reuse

### Resolver Architecture
- **Service Separation**: Independent resolvers for each domain
- **Data Transformation**: gRPC to GraphQL format conversion
- **Nested Resolvers**: Efficient relationship loading
- **Error Boundaries**: Isolated error handling per resolver

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Mock Services (Optional)
```bash
# Start catalog mock service
npm run mock:catalog

# Or use real gRPC services on:
# - Catalog: localhost:50051
# - User: localhost:50052
# - Order: localhost:50053
```

### 3. Start GraphQL Server
```bash
# Development mode
npm run dev

# Production build and start
npm run build
npm start
```

### 4. Access GraphQL Playground
- **GraphQL Playground**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health

## GraphQL Capabilities

### Query Examples

#### Get Single Product
```graphql
query GetProduct {
  product(id: "1") {
    id
    name
    description
    price
    currency
    stockQuantity
    category
    status
    imageUrls
    attributes
  }
}
```

#### Search Products
```graphql
query SearchProducts {
  searchProducts(
    search: {
      category: "smartphones"
      minPrice: 500
      maxPrice: 1500
    }
    pagination: {
      limit: 10
      offset: 0
    }
  ) {
    id
    name
    price
    category
    status
  }
}
```

#### User with Orders
```graphql
query UserWithOrders {
  user(id: "123") {
    id
    username
    email
    firstName
    lastName
    orders(status: PENDING) {
      id
      orderNumber
      status
      pricing {
        totalAmount
        currency
      }
      items {
        productName
        quantity
        unitPrice
        product {
          name
          category
        }
      }
    }
  }
}
```

#### Check Product Availability
```graphql
query CheckAvailability {
  productAvailability(productId: "1", quantity: 5) {
    isAvailable
    availableQuantity
    message
  }
}
```

### Autocomplete Features
- **Field Descriptions**: Comprehensive documentation for all fields
- **Type Information**: Strong typing for all operations
- **Input Validation**: Schema-based validation
- **IDE Support**: Full IntelliSense in GraphQL IDEs

## gRPC Services

### Service Definitions
- **CatalogService**: Product catalog operations
- **UserService**: User management and authentication
- **OrderService**: Order processing and tracking

### Communication Pattern
1. GraphQL receives client query
2. Resolvers parse query requirements
3. gRPC clients call appropriate microservices
4. Data is transformed and combined
5. Unified response sent to client

## Architecture Highlights

### Microservice Benefits
- **Service Independence**: Each service can be developed and deployed separately
- **Technology Flexibility**: Services can use different programming languages
- **Scalability**: Individual service scaling based on load
- **Fault Isolation**: Service failures don't affect entire system

### GraphQL Advantages
- **Single Endpoint**: Unified API for all client needs
- **Efficient Data Loading**: Fetch exactly what's needed
- **Real-time Capabilities**: Subscription support for live updates
- **Developer Experience**: Excellent tooling and autocomplete

### Performance Considerations
- **DataLoader Pattern**: Batch and cache requests (ready for implementation)
- **Connection Pooling**: Efficient gRPC connection management
- **Query Complexity Analysis**: Prevent expensive queries
- **Caching Strategy**: Schema and resolver-level caching

## Production Readiness
- **Error Handling**: Comprehensive error management
- **Health Checks**: Service monitoring endpoints
- **Graceful Shutdown**: Proper cleanup on termination
- **Environment Configuration**: Production and development settings
- **Logging**: Structured logging for debugging and monitoring

This implementation provides a solid foundation for GraphQL-based microservice architecture with professional-grade features and scalability considerations.