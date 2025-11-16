import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';

async function startServer() {
  // Create Express application
  const app = express();

  // Create executable schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Create Apollo Server instance
  const server = new ApolloServer({
    schema,

    // Enable GraphQL Playground and introspection
    introspection: true,

    // Context function for request handling
    context: ({ req }: { req: any }) => {
      // For queries and mutations
      return {
        headers: req.headers,
        // Add any context data needed by resolvers
      };
    },

    // Format error responses
    formatError: (error) => {
      console.error('GraphQL Error:', error.message);
      console.error('Stack:', error.stack);

      // In production, you might want to hide internal error details
      return {
        message: error.message,
        code: error.extensions?.code,
        path: error.path,
        locations: error.locations
      };
    },

    // Enable detailed logging in development
    debug: process.env.NODE_ENV !== 'production'
  });

  // Start the Apollo server
  await server.start();

  // Apply the Apollo GraphQL middleware
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:4000'], // Allow common frontend ports
      credentials: true
    }
  });

  // Subscription handlers are automatically handled by Apollo Server v4

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        graphql: 'running',
        subscriptions: 'enabled',
        catalog_grpc: 'connected'
      },
      endpoints: {
        graphql: '/graphql',
        subscriptions: 'ws://localhost:4000/graphql',
        playground: 'http://localhost:4000/graphql'
      }
    });
  });

  // GraphQL schema introspection endpoint (useful for development)
  app.get('/schema', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ schema: typeDefs });
  });

  // Sample queries endpoint for testing
  app.get('/examples', (req, res) => {
    res.json({
      queries: {
        getAllProducts: `
          query GetAllProducts {
            products(pagination: { limit: 10 }) {
              products {
                id
                name
                price
                category
                status
                stockQuantity
              }
              totalCount
              hasMore
            }
          }
        `,
        searchProducts: `
          query SearchProducts {
            searchProducts(
              search: {
                query: "phone"
                category: "smartphones"
                minPrice: 500
              }
              pagination: { limit: 5 }
            ) {
              products {
                id
                name
                description
                price
                stockQuantity
                imageUrls
                metrics {
                  salesCount
                  averageRating
                }
              }
            }
          }
        `,
        productWithMetrics: `
          query ProductWithMetrics {
            product(id: "1", includeMetrics: true) {
              id
              name
              price
              metrics {
                viewsCount
                salesCount
                averageRating
                reviewsCount
                wishlistCount
              }
            }
          }
        `
      },
      mutations: {
        createProduct: `
          mutation CreateProduct {
            createProduct(input: {
              name: "New Smartphone"
              description: "Latest smartphone with advanced features"
              category: "smartphones"
              price: 899.99
              sku: "SMARTPHONE-2024-001"
              stockQuantity: 100
              tags: ["new", "smartphone", "advanced"]
            }) {
              id
              name
              price
              sku
              status
            }
          }
        `,
        updateProduct: `
          mutation UpdateProduct {
            updateProduct(input: {
              id: "1"
              name: "Updated iPhone 15 Pro"
              price: 1099.99
              stockQuantity: 75
            }) {
              id
              name
              price
              stockQuantity
              updatedAt
            }
          }
        `,
        updateStock: `
          mutation UpdateStock {
            updateProductStock(input: {
              productId: "1"
              quantityChange: 10
              operation: ADD
              reason: "Restocked inventory"
            }) {
              id
              stockQuantity
              updatedAt
            }
          }
        `
      },
      subscriptions: {
        productUpdates: `
          subscription ProductUpdates {
            productUpdated {
              id
              name
              status
              stockQuantity
              updatedAt
            }
          }
        `,
        stockAlerts: `
          subscription StockAlerts {
            stockLevelChanged(threshold: 10) {
              id
              name
              stockQuantity
              status
            }
          }
        `,
        newProducts: `
          subscription NewProducts {
            newProductInCategory(category: "smartphones") {
              id
              name
              category
              price
              createdAt
            }
          }
        `
      }
    });
  });

  // Start the HTTP server
  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    console.log(`GraphQL CRUD Server running on port ${PORT}`);
    console.log(`GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
  });

  // Graceful shutdown handling
  process.on('SIGINT', async () => {
    console.log('\nShutting down GraphQL CRUD server...');

    try {
      await server.stop();
      httpServer.close();
      console.log('Success: GraphQL server stopped');

      process.exit(0);
    } catch (error) {
      console.error('Error: Error during shutdown:', error);
      process.exit(1);
    }
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});