// Mock data for users
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
  },
  {
    id: "user-2",
    username: "janesmith",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    phone: "+1-555-987-6543",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90210",
      country: "USA"
    },
    role: "CUSTOMER",
    isActive: true,
    createdAt: new Date("2023-11-15T00:00:00Z"),
    updatedAt: new Date("2023-12-15T00:00:00Z")
  }
];

const mockUserPreferences = [
  {
    userId: "user-1",
    language: "en",
    currency: "USD",
    emailNotifications: true,
    smsNotifications: false,
    theme: "light",
    customPreferences: {
      newsletter: true,
      promotions: false
    }
  },
  {
    userId: "user-2",
    language: "en",
    currency: "USD",
    emailNotifications: false,
    smsNotifications: true,
    theme: "dark",
    customPreferences: {
      newsletter: false,
      promotions: true
    }
  }
];

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

// User resolvers with mock data
export const userResolvers = {
  Query: {
    // Get single user by ID
    user: async (_: any, { id }: { id: string }) => {
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    },

    // Get multiple users by IDs with pagination
    users: async (
      _: any,
      { ids, pagination }: { ids: string[]; pagination?: { limit?: number; offset?: number } }
    ) => {
      let users = mockUsers.filter(u => ids.includes(u.id));

      const offset = pagination?.offset || 0;
      const limit = pagination?.limit || users.length;

      return users.slice(offset, offset + limit);
    }
  }
};

// Type resolvers for User fields that require additional data fetching
export const userTypeResolvers = {
  User: {
    // Resolve user orders by fetching from mock data
    orders: async (
      parent: any,
      { status, pagination }: { status?: string; pagination?: { limit?: number; offset?: number } }
    ) => {
      let orders = mockOrders.filter(o => o.userId === parent.id);

      if (status) {
        orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
      }

      const offset = pagination?.offset || 0;
      const limit = pagination?.limit || 10;

      return orders.slice(offset, offset + limit);
    },

    // Resolve user preferences
    preferences: async (parent: any) => {
      const preferences = mockUserPreferences.find(p => p.userId === parent.id);
      return preferences || null;
    }
  }
};