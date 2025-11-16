// Mock data for orders
const mockOrders = [
  {
    id: "1",
    userId: "user-1",
    orderNumber: "ORD-2024-001",
    status: "SHIPPED",
    items: [
      {
        productId: "prod-1",
        productName: "Wireless Headphones",
        productSku: "WH-001",
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99,
        productAttributes: { color: "Black", size: "Medium" }
      }
    ],
    pricing: {
      subtotal: 199.99,
      taxAmount: 16.00,
      shippingAmount: 9.99,
      discountAmount: 0,
      totalAmount: 225.98,
      currency: "USD"
    },
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA"
    },
    billingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA"
    },
    paymentInfo: {
      paymentMethod: "CREDIT_CARD",
      paymentStatus: "PAID",
      transactionId: "txn_123456789",
      amountPaid: 225.98,
      currency: "USD"
    },
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-16T14:45:00Z"),
    shippedAt: new Date("2024-01-16T14:45:00Z"),
    deliveredAt: null
  },
  {
    id: "2",
    userId: "user-1",
    orderNumber: "ORD-2024-002",
    status: "DELIVERED",
    items: [
      {
        productId: "prod-2",
        productName: "Gaming Mouse",
        productSku: "GM-002",
        quantity: 1,
        unitPrice: 79.99,
        totalPrice: 79.99,
        productAttributes: { color: "RGB", dpi: "16000" }
      }
    ],
    pricing: {
      subtotal: 79.99,
      taxAmount: 6.40,
      shippingAmount: 5.99,
      discountAmount: 10.00,
      totalAmount: 82.38,
      currency: "USD"
    },
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90210",
      country: "USA"
    },
    billingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90210",
      country: "USA"
    },
    paymentInfo: {
      paymentMethod: "PAYPAL",
      paymentStatus: "PAID",
      transactionId: "pp_987654321",
      amountPaid: 82.38,
      currency: "USD"
    },
    createdAt: new Date("2024-01-10T09:15:00Z"),
    updatedAt: new Date("2024-01-12T16:20:00Z"),
    shippedAt: new Date("2024-01-11T11:30:00Z"),
    deliveredAt: new Date("2024-01-12T16:20:00Z")
  }
];

const mockUsers = [
  {
    id: "user-1",
    username: "johndoe",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+1-555-123-4567",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA"
    },
    role: "CUSTOMER",
    isActive: true,
    createdAt: new Date("2023-12-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z")
  }
];

const mockProducts = [
  {
    id: "prod-1",
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
    attributes: { color: "Black", wireless: "true" }
  },
  {
    id: "prod-2",
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
    attributes: { color: "RGB", dpi: "16000" }
  }
];

// Order resolvers with mock data
export const orderResolvers = {
  Query: {
    // Get single order by ID
    order: async (_: any, { id }: { id: string }) => {
      const order = mockOrders.find(o => o.id === id);
      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }
      return order;
    },

    // Get orders for a specific user with optional status filter and pagination
    userOrders: async (
      _: any,
      {
        userId,
        status,
        pagination
      }: {
        userId: string;
        status?: string;
        pagination?: { limit?: number; offset?: number };
      }
    ) => {
      let orders = mockOrders.filter(o => o.userId === userId);

      if (status) {
        orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
      }

      const offset = pagination?.offset || 0;
      const limit = pagination?.limit || orders.length;

      return orders.slice(offset, offset + limit);
    },

    // Get order statistics with optional filters
    orderStats: async (
      _: any,
      {
        userId,
        startDate,
        endDate
      }: {
        userId?: string;
        startDate?: Date;
        endDate?: Date;
      }
    ) => {
      let orders = mockOrders;

      if (userId) {
        orders = orders.filter(o => o.userId === userId);
      }

      if (startDate) {
        orders = orders.filter(o => o.createdAt >= startDate);
      }

      if (endDate) {
        orders = orders.filter(o => o.createdAt <= endDate);
      }

      const totalOrders = orders.length;
      const totalAmount = orders.reduce((sum, o) => sum + o.pricing.totalAmount, 0);
      const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;

      const statusCounts: { [key: string]: number } = {};
      orders.forEach(o => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      });

      return {
        totalOrders,
        totalAmount,
        averageOrderValue,
        statusCounts
      };
    }
  }
};

// Type resolvers for Order fields that require additional data fetching
export const orderTypeResolvers = {
  Order: {
    // Resolve user information for the order
    user: async (parent: any) => {
      const user = mockUsers.find(u => u.id === parent.userId);
      return user || null;
    }
  },

  OrderItem: {
    // Resolve product information for each order item
    product: async (parent: any) => {
      const product = mockProducts.find(p => p.id === parent.productId);
      return product || null;
    }
  }
};