# Soal 6: GraphQL with Frontend - Complete Fullstack E-commerce

## Overview
Complete fullstack e-commerce application demonstrating GraphQL microservice architecture with React frontend, real-time updates, and comprehensive product management capabilities.

## Architecture Overview
This implementation showcases a modern fullstack application with:
- **React Frontend** with TypeScript and Tailwind CSS
- **GraphQL API** with Apollo Server and subscriptions
- **gRPC Microservices** for backend communication
- **Real-time Updates** via WebSocket subscriptions
- **Complete CRUD Operations** with advanced features

## Project Structure
```
soal6/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── components/         # React Components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductFilters.tsx
│   │   ├── graphql/           # GraphQL Operations
│   │   │   ├── client.ts      # Apollo Client setup
│   │   │   ├── queries.ts     # GraphQL queries
│   │   │   ├── mutations.ts   # GraphQL mutations
│   │   │   └── subscriptions.ts # Real-time subscriptions
│   │   ├── types/             # TypeScript definitions
│   │   ├── styles/            # CSS and styling
│   │   └── App.tsx           # Main application
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── src/                       # Backend GraphQL Server
│   ├── schema/               # GraphQL schema definitions
│   ├── resolvers/           # GraphQL resolvers
│   ├── grpc/               # gRPC client implementations
│   ├── mockServices/       # Mock backend services
│   └── server.ts           # Apollo Server setup
├── proto/                   # gRPC Protocol Buffers
├── architecture.md         # System architecture diagram
└── README.md
```

## Key Features

### Frontend Features
- **Modern React UI**: Component-based architecture with hooks
- **TypeScript Integration**: Full type safety across the application
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live data updates via GraphQL subscriptions
- **Advanced Filtering**: Search, category, price, and status filters
- **Form Management**: Robust forms with validation using React Hook Form
- **State Management**: Apollo Client for GraphQL state management
- **Notifications**: Toast notifications for user feedback
- **Loading States**: Skeleton loaders and loading indicators

### Backend Features
- **GraphQL API**: Complete schema with queries, mutations, and subscriptions
- **gRPC Integration**: Efficient service-to-service communication
- **Real-time Subscriptions**: WebSocket-based live updates
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Structured error responses
- **Mock Services**: Complete mock backend for development

### Business Features
- **Product Management**: Complete product lifecycle management
- **Inventory Tracking**: Real-time stock level monitoring
- **Analytics Dashboard**: Top-selling products and low stock alerts
- **Bulk Operations**: Multi-product operations support
- **Status Management**: Product status workflow
- **Duplicate Products**: Clone existing products with modifications

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with WebSocket support

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 2. Start Development Servers
```bash
# Start all services in parallel (recommended)
npm run dev
```

This will start:
- **Mock gRPC Service**: `localhost:50051`
- **GraphQL Server**: `localhost:4000`
- **React Frontend**: `localhost:3000`

### 3. Alternative: Start Services Individually
```bash
# Terminal 1: Start mock gRPC service
npm run mock:catalog

# Terminal 2: Start GraphQL server
npm run dev:server

# Terminal 3: Start React frontend
npm run dev:client
```

### 4. Access the Application
- **Frontend Application**: http://localhost:3000
- **GraphQL Playground**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health

## Application Features

### Product Management Interface
- **Product Grid**: Responsive grid layout with product cards
- **Advanced Search**: Text search across product names and descriptions
- **Multi-Filter Support**: Category, price range, status, and tag filters
- **Sorting Options**: Sort by name, price, creation date, or stock level
- **View Modes**: All products, top-selling, and low stock views

### CRUD Operations
- **Create Product**: Full product creation form with validation
- **Edit Product**: In-place editing with form pre-population
- **Delete Product**: Soft delete with confirmation dialogs
- **Duplicate Product**: Clone products with customizable modifications
- **Bulk Operations**: Multi-product operations support

### Real-time Features
- **Live Updates**: Automatic UI updates when products change
- **Stock Alerts**: Notifications for low inventory levels
- **Status Changes**: Real-time status update notifications
- **New Product Alerts**: Notifications for new products in categories

### Analytics Dashboard
- **Top Selling Products**: Products ranked by sales performance
- **Low Stock Products**: Inventory alerts for products below threshold
- **Recent Products**: Recently added products dashboard
- **Product Metrics**: Views, sales, ratings, and wishlist data

## GraphQL Operations

### Example Queries
```graphql
# Get all products with pagination
query GetProducts {
  products(pagination: { limit: 10 }) {
    products {
      id
      name
      price
      stockQuantity
      status
    }
    totalCount
    hasMore
  }
}

# Advanced product search
query SearchProducts {
  searchProducts(
    search: {
      query: "smartphone"
      category: "electronics"
      minPrice: 500
      status: ACTIVE
    }
  ) {
    products {
      id
      name
      price
      category
    }
  }
}
```

### Example Mutations
```graphql
# Create new product
mutation CreateProduct {
  createProduct(input: {
    name: "New Smartphone"
    category: "electronics"
    price: 699.99
    sku: "PHONE-2024-001"
    stockQuantity: 100
  }) {
    id
    name
    status
  }
}

# Update product stock
mutation UpdateStock {
  updateProductStock(input: {
    productId: "1"
    quantityChange: 50
    operation: ADD
    reason: "Inventory restock"
  }) {
    id
    stockQuantity
  }
}
```

### Example Subscriptions
```graphql
# Real-time product updates
subscription ProductUpdates {
  productUpdated {
    id
    name
    stockQuantity
    status
    updatedAt
  }
}

# Low stock alerts
subscription StockAlerts {
  stockLevelChanged(threshold: 10) {
    id
    name
    stockQuantity
  }
}
```

## Technology Stack

### Frontend
- **React 18**: Modern React with functional components
- **TypeScript**: Full type safety and IntelliSense support
- **Apollo Client**: GraphQL client with caching and subscriptions
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Performant form library with validation
- **Heroicons**: Beautiful SVG icons
- **React Toastify**: Toast notification system
- **Vite**: Fast build tool and development server

### Backend
- **Apollo Server Express**: Production-ready GraphQL server
- **TypeScript**: Type-safe backend development
- **GraphQL Subscriptions**: Real-time WebSocket support
- **gRPC**: High-performance service communication
- **Express**: Web application framework
- **Protocol Buffers**: Efficient data serialization

## Development Features

### Developer Experience
- **Hot Reload**: Instant updates during development
- **Type Safety**: End-to-end TypeScript integration
- **GraphQL Code Generation**: Automatic type generation from schema
- **Error Boundaries**: Graceful error handling
- **Development Tools**: Apollo DevTools integration
- **Concurrent Development**: Parallel service execution

### Code Quality
- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting
- **Component Architecture**: Reusable, maintainable components
- **Separation of Concerns**: Clear layer separation
- **Error Handling**: Comprehensive error management

## Production Considerations

### Performance
- **Apollo Client Caching**: Intelligent query result caching
- **Connection Pooling**: Efficient gRPC connection management
- **Code Splitting**: Optimized bundle sizes
- **Image Optimization**: Lazy loading and error handling
- **Subscription Management**: Efficient WebSocket handling

### Scalability
- **Microservice Architecture**: Independent service scaling
- **Horizontal Scaling**: Load balancer ready
- **Database Optimization**: Efficient queries and indexes
- **CDN Ready**: Static asset optimization
- **Environment Configuration**: Multi-environment support

### Security
- **Input Validation**: Comprehensive data validation
- **Error Sanitization**: Safe error message exposure
- **CORS Configuration**: Secure cross-origin requests
- **Authentication Ready**: Prepared for auth integration
- **Rate Limiting**: API abuse prevention

This fullstack implementation demonstrates enterprise-level GraphQL application development with modern frontend frameworks, real-time capabilities, and scalable architecture patterns suitable for production e-commerce applications.