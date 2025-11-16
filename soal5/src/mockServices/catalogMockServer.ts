import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Load the protobuf definition
const PROTO_PATH = path.join(__dirname, '../../proto/catalog.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const catalogProto = grpc.loadPackageDefinition(packageDefinition).catalog as any;

// In-memory storage for mock data
let mockProducts = new Map([
  ['1', {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip',
    category: 'smartphones',
    price: 999.99,
    currency: 'USD',
    stock_quantity: 50,
    sku: 'IPHONE-15-PRO-128',
    image_urls: ['https://example.com/iphone15pro1.jpg', 'https://example.com/iphone15pro2.jpg'],
    status: 'ACTIVE',
    created_at: Math.floor(Date.now() / 1000) - 86400,
    updated_at: Math.floor(Date.now() / 1000),
    attributes: { color: 'Natural Titanium', storage: '128GB' },
    metrics: {
      views_count: 1250,
      sales_count: 45,
      average_rating: 4.8,
      reviews_count: 32,
      wishlist_count: 89
    },
    tags: ['premium', 'flagship', 'apple', 'smartphone']
  }],
  ['2', {
    id: '2',
    name: 'MacBook Pro 16"',
    description: 'Professional laptop with M3 Pro chip for developers and creators',
    category: 'laptops',
    price: 2399.99,
    currency: 'USD',
    stock_quantity: 25,
    sku: 'MBP-16-M3PRO-512',
    image_urls: ['https://example.com/macbook16pro1.jpg'],
    status: 'ACTIVE',
    created_at: Math.floor(Date.now() / 1000) - 172800,
    updated_at: Math.floor(Date.now() / 1000) - 3600,
    attributes: { processor: 'M3 Pro', memory: '18GB', storage: '512GB' },
    metrics: {
      views_count: 890,
      sales_count: 23,
      average_rating: 4.9,
      reviews_count: 18,
      wishlist_count: 156
    },
    tags: ['professional', 'laptop', 'apple', 'developer']
  }],
  ['3', {
    id: '3',
    name: 'Sony WH-1000XM5',
    description: 'Premium noise-canceling wireless headphones',
    category: 'headphones',
    price: 399.99,
    currency: 'USD',
    stock_quantity: 100,
    sku: 'SONY-WH1000XM5-BLACK',
    image_urls: ['https://example.com/sony-headphones1.jpg'],
    status: 'ACTIVE',
    created_at: Math.floor(Date.now() / 1000) - 259200,
    updated_at: Math.floor(Date.now() / 1000) - 7200,
    attributes: { color: 'Black', connectivity: 'Bluetooth 5.2' },
    metrics: {
      views_count: 2100,
      sales_count: 156,
      average_rating: 4.7,
      reviews_count: 89,
      wishlist_count: 234
    },
    tags: ['audio', 'wireless', 'noise-canceling', 'sony']
  }],
  ['4', {
    id: '4',
    name: 'iPad Air',
    description: 'Powerful and versatile tablet with M1 chip',
    category: 'tablets',
    price: 599.99,
    currency: 'USD',
    stock_quantity: 5, // Low stock for testing
    sku: 'IPAD-AIR-M1-64',
    image_urls: ['https://example.com/ipadair1.jpg'],
    status: 'ACTIVE',
    created_at: Math.floor(Date.now() / 1000) - 345600,
    updated_at: Math.floor(Date.now() / 1000) - 1800,
    attributes: { processor: 'M1', storage: '64GB', color: 'Space Gray' },
    metrics: {
      views_count: 1560,
      sales_count: 78,
      average_rating: 4.6,
      reviews_count: 45,
      wishlist_count: 123
    },
    tags: ['tablet', 'apple', 'productivity', 'creative']
  }]
]);

// Helper functions
function generateId(): string {
  return uuidv4();
}

function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

function applyPagination(items: any[], limit?: number, offset?: number) {
  const startIndex = offset || 0;
  const endIndex = startIndex + (limit || 20);
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    total_count: items.length,
    has_more: endIndex < items.length,
    pagination: {
      current_page: Math.floor(startIndex / (limit || 20)) + 1,
      total_pages: Math.ceil(items.length / (limit || 20)),
      page_size: limit || 20,
      total_items: items.length
    }
  };
}

// Enhanced catalog service implementation
const catalogService = {
  // Query operations
  GetProduct: (call: any, callback: any) => {
    const { product_id, include_metrics } = call.request;
    const product = mockProducts.get(product_id);

    if (product) {
      const response = { ...product };
      if (!include_metrics) {
        delete response.metrics;
      }
      callback(null, response);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Product with ID ${product_id} not found`
      });
    }
  },

  GetProducts: (call: any, callback: any) => {
    const { product_ids, limit = 20, offset = 0, include_metrics, status_filter } = call.request;
    let filteredProducts = Array.from(mockProducts.values());

    // Filter by IDs if provided
    if (product_ids && product_ids.length > 0) {
      filteredProducts = filteredProducts.filter(p => product_ids.includes(p.id));
    }

    // Filter by status
    if (status_filter) {
      filteredProducts = filteredProducts.filter(p => p.status.toLowerCase() === status_filter.toLowerCase());
    }

    // Remove metrics if not requested
    if (!include_metrics) {
      filteredProducts = filteredProducts.map(p => {
        const { metrics, ...productWithoutMetrics } = p;
        return productWithoutMetrics;
      }) as any;
    }

    const result = applyPagination(filteredProducts, limit, offset);

    callback(null, {
      products: result.items,
      total_count: result.total_count,
      has_more: result.has_more,
      pagination: result.pagination
    });
  },

  SearchProducts: (call: any, callback: any) => {
    const { query, category, min_price, max_price, tags, status_filter, limit = 20, offset = 0, sort_by, sort_order } = call.request;
    let filteredProducts = Array.from(mockProducts.values());

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Price range filter
    if (min_price !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= min_price);
    }
    if (max_price !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= max_price);
    }

    // Tags filter
    if (tags && tags.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        p.tags && tags.some(tag => p.tags.includes(tag))
      );
    }

    // Status filter
    if (status_filter) {
      filteredProducts = filteredProducts.filter(p => p.status.toLowerCase() === status_filter.toLowerCase());
    }

    // Sorting
    if (sort_by) {
      filteredProducts.sort((a: any, b: any) => {
        const aValue = a[sort_by] || 0;
        const bValue = b[sort_by] || 0;

        if (sort_order === 'DESC') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    const result = applyPagination(filteredProducts, limit, offset);

    callback(null, {
      products: result.items,
      total_count: result.total_count,
      has_more: result.has_more,
      pagination: result.pagination
    });
  },

  GetProductsByCategory: (call: any, callback: any) => {
    const { category, limit = 20, offset = 0, sort_by, sort_order, include_subcategories } = call.request;
    let filteredProducts = Array.from(mockProducts.values()).filter(p => p.category === category);

    // Simple sorting implementation
    if (sort_by) {
      filteredProducts.sort((a: any, b: any) => {
        const aValue = a[sort_by] || 0;
        const bValue = b[sort_by] || 0;

        if (sort_order === 'DESC') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    const result = applyPagination(filteredProducts, limit, offset);

    callback(null, {
      products: result.items,
      total_count: result.total_count,
      has_more: result.has_more,
      pagination: result.pagination
    });
  },

  CheckAvailability: (call: any, callback: any) => {
    const { product_id, quantity } = call.request;
    const product = mockProducts.get(product_id);

    if (!product) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Product with ID ${product_id} not found`
      });
      return;
    }

    const isAvailable = product.stock_quantity >= quantity;
    const message = isAvailable
      ? 'Product is available'
      : `Only ${product.stock_quantity} items available`;

    // Simulate restock date for out of stock items
    const restockDate = !isAvailable ? getCurrentTimestamp() + 86400 * 7 : undefined; // 7 days from now

    callback(null, {
      is_available: isAvailable,
      available_quantity: product.stock_quantity,
      message,
      restock_date: restockDate
    });
  },

  // Create operations
  CreateProduct: (call: any, callback: any) => {
    const productData = call.request;
    const id = generateId();
    const timestamp = getCurrentTimestamp();

    // Check if SKU already exists
    const existingProduct = Array.from(mockProducts.values()).find(p => p.sku === productData.sku);
    if (existingProduct) {
      callback({
        code: grpc.status.ALREADY_EXISTS,
        message: `Product with SKU ${productData.sku} already exists`
      });
      return;
    }

    const newProduct = {
      id,
      name: productData.name,
      description: productData.description || '',
      category: productData.category,
      price: productData.price,
      currency: productData.currency || 'USD',
      stock_quantity: productData.stock_quantity || 0,
      sku: productData.sku,
      image_urls: productData.image_urls || [],
      status: 'ACTIVE',
      created_at: timestamp,
      updated_at: timestamp,
      attributes: productData.attributes || {},
      metrics: {
        views_count: 0,
        sales_count: 0,
        average_rating: 0,
        reviews_count: 0,
        wishlist_count: 0
      },
      tags: productData.tags || []
    };

    mockProducts.set(id, newProduct);
    callback(null, newProduct);
  },

  // Update operations
  UpdateProduct: (call: any, callback: any) => {
    const { product_id, ...updateData } = call.request;
    const existingProduct = mockProducts.get(product_id);

    if (!existingProduct) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Product with ID ${product_id} not found`
      });
      return;
    }

    const updatedProduct = {
      ...existingProduct,
      ...Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null)
      ),
      updated_at: getCurrentTimestamp()
    };

    mockProducts.set(product_id, updatedProduct);
    callback(null, updatedProduct);
  },

  UpdateProductStock: (call: any, callback: any) => {
    const { product_id, quantity_change, operation } = call.request;
    const existingProduct = mockProducts.get(product_id);

    if (!existingProduct) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Product with ID ${product_id} not found`
      });
      return;
    }

    let newStockQuantity;
    switch (operation.toLowerCase()) {
      case 'add':
        newStockQuantity = existingProduct.stock_quantity + quantity_change;
        break;
      case 'subtract':
        newStockQuantity = Math.max(0, existingProduct.stock_quantity - quantity_change);
        break;
      case 'set':
        newStockQuantity = Math.max(0, quantity_change);
        break;
      default:
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: `Invalid operation: ${operation}. Must be 'add', 'subtract', or 'set'`
        });
        return;
    }

    const updatedProduct = {
      ...existingProduct,
      stock_quantity: newStockQuantity,
      updated_at: getCurrentTimestamp()
    };

    mockProducts.set(product_id, updatedProduct);
    callback(null, updatedProduct);
  },

  BulkUpdateProducts: (call: any, callback: any) => {
    const { updates } = call.request;
    const updatedProducts = [];
    const failedUpdates = [];
    let successCount = 0;
    let errorCount = 0;

    for (const update of updates) {
      try {
        const existingProduct = mockProducts.get(update.product_id);

        if (!existingProduct) {
          failedUpdates.push(`Product ${update.product_id} not found`);
          errorCount++;
          continue;
        }

        const updatedProduct = {
          ...existingProduct,
          ...Object.fromEntries(
            Object.entries(update).filter(([key, value]) =>
              key !== 'product_id' && value !== undefined && value !== null
            )
          ),
          updated_at: getCurrentTimestamp()
        };

        mockProducts.set(update.product_id, updatedProduct);
        updatedProducts.push(updatedProduct);
        successCount++;
      } catch (error) {
        failedUpdates.push(`Failed to update product ${update.product_id}: ${error.message}`);
        errorCount++;
      }
    }

    callback(null, {
      updated_products: updatedProducts,
      failed_updates: failedUpdates,
      success_count: successCount,
      error_count: errorCount
    });
  },

  // Delete operations
  DeleteProduct: (call: any, callback: any) => {
    const { product_id, soft_delete = true, reason } = call.request;
    const existingProduct = mockProducts.get(product_id);

    if (!existingProduct) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Product with ID ${product_id} not found`
      });
      return;
    }

    if (soft_delete) {
      // Soft delete - mark as archived
      const updatedProduct = {
        ...existingProduct,
        status: 'ARCHIVED',
        updated_at: getCurrentTimestamp()
      };
      mockProducts.set(product_id, updatedProduct);
    } else {
      // Hard delete - remove from storage
      mockProducts.delete(product_id);
    }

    callback(null, {
      success: true,
      message: soft_delete ? 'Product archived successfully' : 'Product deleted successfully',
      deleted_product_id: product_id
    });
  }
};

// Start the enhanced gRPC mock server
function startCatalogMockServer() {
  const server = new grpc.Server();

  server.addService(catalogProto.CatalogService.service, catalogService);

  const port = '0.0.0.0:50051';
  server.bindAsync(port, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (err) {
      console.error('Failed to bind catalog server:', err);
      return;
    }

    console.log(`📦 Enhanced Catalog Mock Service running on ${port}`);
    console.log('   - Query Operations: GetProduct, GetProducts, SearchProducts, GetProductsByCategory, CheckAvailability');
    console.log('   - Mutation Operations: CreateProduct, UpdateProduct, UpdateProductStock, DeleteProduct');
    console.log('   - Bulk Operations: BulkUpdateProducts');
    console.log(`   - Mock Data: ${mockProducts.size} products loaded`);

    server.start();
  });

  return server;
}

// Export for use in other modules or standalone execution
export { startCatalogMockServer, mockProducts };

// Start server if this file is run directly
if (require.main === module) {
  startCatalogMockServer();

  process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down Enhanced Catalog Mock Server...');
    process.exit(0);
  });
}