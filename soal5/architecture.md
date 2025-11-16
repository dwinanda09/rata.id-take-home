# GraphQL CRUD Operations Architecture

```mermaid
graph TB
    subgraph "Client Applications"
        A[Web Admin Dashboard]
        B[Mobile App]
        C[API Consumers]
        D[GraphQL Playground]
    end

    subgraph "GraphQL Gateway"
        E[Apollo Server]
        F[GraphQL Schema]
        G[Subscription Server]
        H[Context & Auth]
    end

    subgraph "Resolver Layer"
        I[Query Resolvers]
        J[Mutation Resolvers]
        K[Subscription Resolvers]
        L[Custom Scalars]
    end

    subgraph "Business Logic"
        M[Validation Layer]
        N[Data Transformation]
        O[Error Handling]
        P[Pub/Sub System]
    end

    subgraph "gRPC Communication"
        Q[Catalog Client]
        R[Connection Pool]
        S[Request Mapping]
    end

    subgraph "Microservice Layer"
        T[Catalog Service<br/>Port: 50051]
        U[Mock Service<br/>Enhanced CRUD]
    end

    subgraph "Data Operations"
        V[Query Operations]
        W[Create Operations]
        X[Update Operations]
        Y[Delete Operations]
        Z[Bulk Operations]
    end

    subgraph "Real-time Features"
        AA[Product Updates]
        BB[Stock Alerts]
        CC[Status Changes]
        DD[New Products]
    end

    A --> E
    B --> E
    C --> E
    D --> E

    E --> F
    E --> G
    E --> H

    F --> I
    F --> J
    F --> K
    F --> L

    I --> M
    J --> M
    K --> M

    M --> N
    N --> O
    O --> P

    I --> Q
    J --> Q

    Q --> R
    R --> S
    S --> T
    S --> U

    T --> V
    T --> W
    T --> X
    T --> Y
    T --> Z

    K --> P
    P --> AA
    P --> BB
    P --> CC
    P --> DD

    J --> P
    P --> K
```

## CRUD Operations Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant GQL as GraphQL Server
    participant R as Resolver
    participant V as Validator
    participant gRPC as gRPC Client
    participant MS as Microservice
    participant PS as PubSub

    Note over C,PS: CREATE Operation
    C->>GQL: mutation createProduct(input)
    GQL->>R: Execute createProduct resolver
    R->>V: Validate input data
    V-->>R: Validation result
    R->>gRPC: CreateProduct gRPC call
    gRPC->>MS: Create product request
    MS-->>gRPC: Created product response
    gRPC-->>R: Transform response
    R->>PS: Publish NEW_PRODUCT event
    R-->>GQL: Created product data
    GQL-->>C: GraphQL response

    Note over C,PS: READ Operation
    C->>GQL: query searchProducts(filters)
    GQL->>R: Execute searchProducts resolver
    R->>gRPC: SearchProducts gRPC call
    gRPC->>MS: Search request with filters
    MS-->>gRPC: Filtered products
    gRPC-->>R: Transform response
    R-->>GQL: Products list
    GQL-->>C: GraphQL response

    Note over C,PS: UPDATE Operation
    C->>GQL: mutation updateProduct(input)
    GQL->>R: Execute updateProduct resolver
    R->>V: Validate update data
    V-->>R: Validation result
    R->>gRPC: UpdateProduct gRPC call
    gRPC->>MS: Update product request
    MS-->>gRPC: Updated product response
    gRPC-->>R: Transform response
    R->>PS: Publish PRODUCT_UPDATED event
    R-->>GQL: Updated product data
    GQL-->>C: GraphQL response

    Note over C,PS: DELETE Operation
    C->>GQL: mutation deleteProduct(id)
    GQL->>R: Execute deleteProduct resolver
    R->>gRPC: DeleteProduct gRPC call
    gRPC->>MS: Delete product request
    MS-->>gRPC: Delete confirmation
    gRPC-->>R: Transform response
    R-->>GQL: Delete status
    GQL-->>C: Boolean response
```

## Key Architecture Components

### GraphQL Layer
- **Apollo Server**: Production-ready GraphQL server with subscriptions
- **Schema Definition**: Comprehensive type system with enhanced CRUD operations
- **Resolver Architecture**: Modular resolvers for different operations
- **Context Management**: Request context with authentication and validation

### Business Logic Layer
- **Input Validation**: Comprehensive validation for all mutations
- **Data Transformation**: gRPC to GraphQL format conversion
- **Error Handling**: Structured error responses with proper error codes
- **Pub/Sub System**: Real-time event publishing for subscriptions

### Communication Layer
- **gRPC Clients**: Type-safe clients with connection pooling
- **Request Mapping**: GraphQL to gRPC parameter transformation
- **Response Handling**: Error handling and data transformation
- **Health Monitoring**: Service availability checking

### CRUD Operations Support

#### Create Operations
- Single product creation with validation
- Bulk product creation with batch processing
- Duplicate product functionality
- Real-time notifications for new products

#### Read Operations
- Single product queries with optional metrics
- Advanced search with filtering and sorting
- Category-based queries with pagination
- Analytics queries (top selling, low stock, recent)

#### Update Operations
- Comprehensive product updates
- Stock level management with operations (ADD/SUBTRACT/SET)
- Status management (activate/deactivate/archive)
- Bulk update operations

#### Delete Operations
- Soft delete (archive) functionality
- Hard delete capability
- Bulk delete operations
- Reason tracking for deletions

### Real-time Features

#### Subscription Types
- **Product Updates**: Real-time product changes
- **Stock Alerts**: Low stock notifications
- **Status Changes**: Product status modifications
- **New Products**: Category-based new product alerts

#### Event System
- Publisher-Subscriber pattern for real-time updates
- Topic-based routing for targeted notifications
- Connection management for WebSocket clients
- Event filtering and transformation

## Performance Optimizations

### Caching Strategy
- Schema-level caching for static data
- Resolver-level caching for expensive operations
- Connection pooling for gRPC clients
- Query result caching with TTL

### Scalability Features
- Horizontal scaling support
- Load balancing for gRPC services
- Connection multiplexing
- Background job processing for bulk operations

### Monitoring & Observability
- Health check endpoints
- Performance metrics collection
- Error tracking and alerting
- Query complexity analysis

This architecture provides a robust, scalable foundation for e-commerce CRUD operations with real-time capabilities and comprehensive data management features.