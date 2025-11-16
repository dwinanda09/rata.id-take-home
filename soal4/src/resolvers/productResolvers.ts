// Mock data for products
const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    price: 199.99,
    currency: "USD",
    stockQuantity: 50,
    sku: "WH-001",
    imageUrls: ["https://example.com/headphones.jpg"],
    status: "ACTIVE",
    createdAt: new Date("2023-11-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
    attributes: { color: "Black", wireless: "true", battery: "30 hours" }
  },
  {
    id: "2",
    name: "Gaming Mouse",
    description: "RGB gaming mouse with high precision sensor",
    category: "Gaming",
    price: 79.99,
    currency: "USD",
    stockQuantity: 25,
    sku: "GM-002",
    imageUrls: ["https://example.com/mouse.jpg"],
    status: "ACTIVE",
    createdAt: new Date("2023-10-15T00:00:00Z"),
    updatedAt: new Date("2023-12-01T00:00:00Z"),
    attributes: { color: "RGB", dpi: "16000", buttons: "8" }
  },
  {
    id: "3",
    name: "Mechanical Keyboard",
    description: "Cherry MX mechanical keyboard with RGB backlight",
    category: "Gaming",
    price: 149.99,
    currency: "USD",
    stockQuantity: 15,
    sku: "MK-003",
    imageUrls: ["https://example.com/keyboard.jpg"],
    status: "ACTIVE",
    createdAt: new Date("2023-12-01T00:00:00Z"),
    updatedAt: new Date("2024-01-15T00:00:00Z"),
    attributes: { switches: "Cherry MX Blue", backlight: "RGB", layout: "Full" }
  },
  {
    id: "4",
    name: "Smartphone",
    description: "Latest flagship smartphone with advanced camera",
    category: "Electronics",
    price: 899.99,
    currency: "USD",
    stockQuantity: 30,
    sku: "SP-004",
    imageUrls: ["https://example.com/smartphone.jpg"],
    status: "ACTIVE",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
    attributes: { storage: "256GB", camera: "108MP", screen: "6.7 inch" }
  },
  {
    id: "5",
    name: "Laptop Stand",
    description: "Adjustable aluminum laptop stand for better ergonomics",
    category: "Accessories",
    price: 39.99,
    currency: "USD",
    stockQuantity: 100,
    sku: "LS-005",
    imageUrls: ["https://example.com/laptop-stand.jpg"],
    status: "ACTIVE",
    createdAt: new Date("2023-09-01T00:00:00Z"),
    updatedAt: new Date("2023-11-01T00:00:00Z"),
    attributes: { material: "Aluminum", adjustable: "true", weight: "1.2kg" }
  }
];

// Product resolvers with mock data
export const productResolvers = {
  Query: {
    // Get single product by ID
    product: async (_: any, { id }: { id: string }) => {
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      return product;
    },

    // Get multiple products by IDs with pagination
    products: async (
      _: any,
      { ids, pagination }: { ids?: string[]; pagination?: { limit?: number; offset?: number } }
    ) => {
      let products = mockProducts;

      if (ids && ids.length > 0) {
        products = products.filter(p => ids.includes(p.id));
      }

      const offset = pagination?.offset || 0;
      const limit = pagination?.limit || products.length;

      return products.slice(offset, offset + limit);
    },

    // Search products with filters and pagination
    searchProducts: async (
      _: any,
      {
        search,
        pagination
      }: {
        search: {
          query?: string;
          category?: string;
          minPrice?: number;
          maxPrice?: number;
          sortBy?: string;
          sortOrder?: string;
        };
        pagination?: { limit?: number; offset?: number };
      }
    ) => {
      let products = [...mockProducts];

      // Filter by search query
      if (search.query) {
        const query = search.query.toLowerCase();
        products = products.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }

      // Filter by category
      if (search.category) {
        products = products.filter(p =>
          p.category.toLowerCase() === search.category!.toLowerCase()
        );
      }

      // Filter by price range
      if (search.minPrice !== undefined) {
        products = products.filter(p => p.price >= search.minPrice!);
      }

      if (search.maxPrice !== undefined) {
        products = products.filter(p => p.price <= search.maxPrice!);
      }

      // Sort products
      if (search.sortBy) {
        products.sort((a, b) => {
          const aVal = (a as any)[search.sortBy!];
          const bVal = (b as any)[search.sortBy!];

          if (search.sortOrder === 'DESC') {
            return bVal > aVal ? 1 : -1;
          }
          return aVal > bVal ? 1 : -1;
        });
      }

      const offset = pagination?.offset || 0;
      const limit = pagination?.limit || products.length;

      return products.slice(offset, offset + limit);
    },

    // Get products by category with pagination and sorting
    productsByCategory: async (
      _: any,
      {
        category,
        pagination
      }: {
        category: string;
        pagination?: { limit?: number; offset?: number };
      }
    ) => {
      const products = mockProducts.filter(p =>
        p.category.toLowerCase() === category.toLowerCase()
      );

      const offset = pagination?.offset || 0;
      const limit = pagination?.limit || products.length;

      return products.slice(offset, offset + limit);
    },

    // Check product availability
    productAvailability: async (
      _: any,
      { productId, quantity }: { productId: string; quantity: number }
    ) => {
      const product = mockProducts.find(p => p.id === productId);

      if (!product) {
        return {
          isAvailable: false,
          availableQuantity: 0,
          message: "Product not found"
        };
      }

      const isAvailable = product.stockQuantity >= quantity;

      return {
        isAvailable,
        availableQuantity: product.stockQuantity,
        message: isAvailable ? "Product is available" : "Insufficient stock"
      };
    }
  }
};

// Type resolvers for nested fields
export const productTypeResolvers = {
  Product: {
    // Calculate discounted price (10% discount example)
    discountedPrice: (product: any) => {
      return product.price * 0.9;
    }
  }
};