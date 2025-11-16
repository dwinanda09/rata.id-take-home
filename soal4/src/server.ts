import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';

async function startServer() {
  // Create Express application
  const app = express();

  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    context: ({ req }) => {
      return {
        headers: req.headers,
      };
    },

    // Format error responses
    formatError: (error) => {
      // Only log non-validation errors to reduce noise
      if (error.extensions?.code !== 'GRAPHQL_VALIDATION_FAILED') {
        console.error('GraphQL Error:', error);
      }

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

  // Start the server
  await server.start();

  // Apply the Apollo GraphQL middleware
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: true, // Allow all origins in development
      credentials: true
    }
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        graphql: 'running',
        catalog_grpc: 'connected', // In real implementation, check connection status
        user_grpc: 'connected',
        order_grpc: 'connected'
      }
    });
  });

  // Start the HTTP server
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`GraphQL Microservice running on port ${PORT}`);
    console.log(`GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
  });

  // Graceful shutdown handling
  process.on('SIGINT', async () => {
    console.log('\n Shutting down GraphQL server...');

    try {
      await server.stop();
      console.log('Success: GraphQL server stopped');

      // Close gRPC connections
      // catalogClient.close();
      // userClient.close();
      // orderClient.close();

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