import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

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

// Mock data for demonstration
const mockProducts = [
  {
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
    attributes: { color: 'Natural Titanium', storage: '128GB' }
  },
  {
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
    attributes: { processor: 'M3 Pro', memory: '18GB', storage: '512GB' }
  },
  {
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
    attributes: { color: 'Black', connectivity: 'Bluetooth 5.2' }
  },
  {
    id: '4',
    name: 'iPad Air',
    description: 'Powerful and versatile tablet with M1 chip',
    category: 'tablets',
    price: 599.99,
    currency: 'USD',
    stock_quantity: 0,
    sku: 'IPAD-AIR-M1-64',
    image_urls: ['https://example.com/ipadair1.jpg'],
    status: 'OUT_OF_STOCK',
    created_at: Math.floor(Date.now() / 1000) - 345600,
    updated_at: Math.floor(Date.now() / 1000) - 1800,
    attributes: { processor: 'M1', storage: '64GB', color: 'Space Gray' }
  }
];

// Implement gRPC service methods
const catalogService = {
  GetProduct: (call: any, callback: any) => {
    const productId = call.request.product_id;
    const product = mockProducts.find(p => p.id === productId);

    if (product) {
      callback(null, product);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Product with ID ${productId} not found`
      });
    }
  },

  GetProducts: (call: any, callback: any) => {
    const { product_ids, limit = 20, offset = 0 } = call.request;
    let filteredProducts = mockProducts;

    if (product_ids && product_ids.length > 0) {
      filteredProducts = mockProducts.filter(p => product_ids.includes(p.id));
    }

    const startIndex = offset;
    const endIndex = startIndex + limit;
    const products = filteredProducts.slice(startIndex, endIndex);

    callback(null, {
      products,
      total_count: filteredProducts.length,
      has_more: endIndex < filteredProducts.length
    });
  },

  SearchProducts: (call: any, callback: any) => {
    const { query, category, min_price, max_price, limit = 20, offset = 0 } = call.request;
    let filteredProducts = mockProducts;

    // Filter by query (search in name and description)
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Filter by price range
    if (min_price !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= min_price);
    }
    if (max_price !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= max_price);
    }

    // Apply pagination
    const startIndex = offset;
    const endIndex = startIndex + limit;
    const products = filteredProducts.slice(startIndex, endIndex);

    callback(null, {
      products,
      total_count: filteredProducts.length,
      has_more: endIndex < filteredProducts.length
    });
  },

  CheckAvailability: (call: any, callback: any) => {
    const { product_id, quantity } = call.request;
    const product = mockProducts.find(p => p.id === product_id);

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

    callback(null, {
      is_available: isAvailable,
      available_quantity: product.stock_quantity,
      message
    });
  },

  GetProductsByCategory: (call: any, callback: any) => {
    const { category, limit = 20, offset = 0 } = call.request;
    const filteredProducts = mockProducts.filter(p => p.category === category);

    const startIndex = offset;
    const endIndex = startIndex + limit;
    const products = filteredProducts.slice(startIndex, endIndex);

    callback(null, {
      products,
      total_count: filteredProducts.length,
      has_more: endIndex < filteredProducts.length
    });
  }
};

// Start the gRPC server
function startCatalogMockServer() {
  const server = new grpc.Server();

  server.addService(catalogProto.CatalogService.service, catalogService);

  const port = '0.0.0.0:50051';
  server.bindAsync(port, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (err) {
      console.error('Failed to bind catalog server:', err);
      return;
    }

    console.log(`📦 Catalog Mock Service running on ${port}`);
    server.start();
  });

  return server;
}

// Export for use in other modules or standalone execution
export { startCatalogMockServer };

// Start server if this file is run directly
if (require.main === module) {
  startCatalogMockServer();

  process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down Catalog Mock Server...');
    process.exit(0);
  });
}