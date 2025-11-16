import { GraphQLScalarType, Kind } from 'graphql';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { productResolvers } from './productResolvers';

// Create PubSub instance for subscriptions
const pubsub = new PubSub();

// Custom scalar resolvers
const dateScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Date and time scalar type',
  serialize(value: any): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'string') {
      return new Date(value).toISOString();
    }
    if (typeof value === 'number') {
      return new Date(value * 1000).toISOString();
    }
    throw new Error('Value is not a valid date');
  },
  parseValue(value: any): Date {
    if (typeof value === 'string') {
      return new Date(value);
    }
    if (typeof value === 'number') {
      return new Date(value * 1000);
    }
    throw new Error('Value is not a valid date string or timestamp');
  },
  parseLiteral(ast): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value) * 1000);
    }
    throw new Error('Can only parse date strings or integers to dates');
  }
});

const jsonScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON scalar type',
  serialize(value: any): any {
    return value;
  },
  parseValue(value: any): any {
    return value;
  },
  parseLiteral(ast): any {
    switch (ast.kind) {
      case Kind.STRING:
        try {
          return JSON.parse(ast.value);
        } catch {
          return ast.value;
        }
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.OBJECT: {
        const value: any = {};
        ast.fields.forEach(field => {
          value[field.name.value] = this.parseLiteral(field.value);
        });
        return value;
      }
      case Kind.LIST:
        return ast.values.map(node => this.parseLiteral(node));
      case Kind.NULL:
        return null;
      default:
        return null;
    }
  }
});

// Subscription resolvers for real-time updates
const subscriptionResolvers = {
  Subscription: {
    productUpdated: {
      subscribe: (_, { productId }: { productId?: string }) => {
        if (productId) {
          return (pubsub as any).asyncIterator([`PRODUCT_UPDATED_${productId}`]);
        }
        return (pubsub as any).asyncIterator(['PRODUCT_UPDATED']);
      },
      resolve: (payload: any) => payload.product
    },

    stockLevelChanged: {
      subscribe: (_, { productId, threshold }: { productId?: string; threshold?: number }) => {
        const topics = [];
        if (productId) {
          topics.push(`STOCK_CHANGED_${productId}`);
        } else {
          topics.push('STOCK_CHANGED');
        }
        return (pubsub as any).asyncIterator(topics);
      },
      resolve: (payload: any) => {
        const { product, threshold } = payload;
        // Only send if stock is below threshold (if specified)
        if (threshold && product.stockQuantity >= threshold) {
          return null;
        }
        return product;
      }
    },

    newProductInCategory: {
      subscribe: (_, { category }: { category: string }) => {
        return (pubsub as any).asyncIterator([`NEW_PRODUCT_${category.toUpperCase()}`]);
      },
      resolve: (payload: any) => payload.product
    },

    productStatusChanged: {
      subscribe: (_, { productIds }: { productIds?: string[] }) => {
        const topics = [];
        if (productIds && productIds.length > 0) {
          productIds.forEach(id => topics.push(`STATUS_CHANGED_${id}`));
        } else {
          topics.push('STATUS_CHANGED');
        }
        return (pubsub as any).asyncIterator(topics);
      },
      resolve: (payload: any) => payload.product
    }
  }
};

// Enhanced mutation resolvers with subscription publishing
const enhancedProductResolvers = {
  ...productResolvers,
  Mutation: {
    ...productResolvers.Mutation,

    // Override create product to publish subscription
    createProduct: async (parent: any, args: any, context: any) => {
      const product = await productResolvers.Mutation.createProduct(parent, args);

      // Publish subscription for new product in category
      if (product) {
        pubsub.publish(`NEW_PRODUCT_${product.category.toUpperCase()}`, { product });
        pubsub.publish('PRODUCT_UPDATED', { product });
      }

      return product;
    },

    // Override update product to publish subscription
    updateProduct: async (parent: any, args: any, context: any) => {
      const originalProduct = context.originalProduct; // Would need to be set in context
      const product = await productResolvers.Mutation.updateProduct(parent, args);

      if (product) {
        // Publish general product update
        pubsub.publish(`PRODUCT_UPDATED_${product.id}`, { product });
        pubsub.publish('PRODUCT_UPDATED', { product });

        // If status changed, publish status change
        if (originalProduct && originalProduct.status !== product.status) {
          pubsub.publish(`STATUS_CHANGED_${product.id}`, { product });
          pubsub.publish('STATUS_CHANGED', { product });
        }
      }

      return product;
    },

    // Override update stock to publish subscription
    updateProductStock: async (parent: any, args: any, context: any) => {
      const product = await productResolvers.Mutation.updateProductStock(parent, args);

      if (product) {
        // Publish stock level change
        pubsub.publish(`STOCK_CHANGED_${product.id}`, { product });
        pubsub.publish('STOCK_CHANGED', { product });

        // Also publish general product update
        pubsub.publish(`PRODUCT_UPDATED_${product.id}`, { product });
        pubsub.publish('PRODUCT_UPDATED', { product });
      }

      return product;
    },

    // Override status management mutations to publish subscriptions
    activateProduct: async (parent: any, args: any, context: any) => {
      const product = await productResolvers.Mutation.activateProduct(parent, args);

      if (product) {
        pubsub.publish(`STATUS_CHANGED_${product.id}`, { product });
        pubsub.publish('STATUS_CHANGED', { product });
        pubsub.publish(`PRODUCT_UPDATED_${product.id}`, { product });
      }

      return product;
    },

    deactivateProduct: async (parent: any, args: any, context: any) => {
      const product = await productResolvers.Mutation.deactivateProduct(parent, args);

      if (product) {
        pubsub.publish(`STATUS_CHANGED_${product.id}`, { product });
        pubsub.publish('STATUS_CHANGED', { product });
        pubsub.publish(`PRODUCT_UPDATED_${product.id}`, { product });
      }

      return product;
    },

    archiveProduct: async (parent: any, args: any, context: any) => {
      const product = await productResolvers.Mutation.archiveProduct(parent, args);

      if (product) {
        pubsub.publish(`STATUS_CHANGED_${product.id}`, { product });
        pubsub.publish('STATUS_CHANGED', { product });
        pubsub.publish(`PRODUCT_UPDATED_${product.id}`, { product });
      }

      return product;
    }
  }
};

// Combine all resolvers
export const resolvers = {
  // Scalar type resolvers
  DateTime: dateScalar,
  JSON: jsonScalar,

  // Query resolvers
  Query: {
    ...enhancedProductResolvers.Query
  },

  // Mutation resolvers with subscription support
  Mutation: {
    ...enhancedProductResolvers.Mutation
  },

  // Subscription resolvers
  ...subscriptionResolvers
};

// Export PubSub instance for use in other parts of the application
export { pubsub };

export default resolvers;