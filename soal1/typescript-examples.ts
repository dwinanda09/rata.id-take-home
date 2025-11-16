// Basic TypeScript Types and Interfaces

// Basic primitive types
const userName: string = "John Doe";
const userAge: number = 30;
const isActive: boolean = true;
const userTags: string[] = ["developer", "typescript", "backend"];
const scores: number[] = [95, 87, 92];

// Object type annotation
const user: { name: string; age: number; email: string } = {
  name: "Jane Smith",
  age: 25,
  email: "jane@example.com"
};

// Interface definitions
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  description?: string; // Optional property
}

interface User {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
  preferences: UserPreferences;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
}

interface UserPreferences {
  theme: "light" | "dark"; // Union type
  notifications: boolean;
  language: string;
}

// Function with typed parameters and return type
function calculateTotal(products: Product[]): number {
  return products.reduce((total, product) => total + product.price, 0);
}

function getUserFullName(profile: UserProfile): string {
  return `${profile.firstName} ${profile.lastName}`;
}

// Generic types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

function processApiResponse<T>(response: ApiResponse<T>): T | null {
  if (response.success) {
    return response.data;
  }
  console.error(response.message);
  return null;
}

// Type aliases
type Status = "pending" | "approved" | "rejected";
type ProductId = number;
type UserRole = "admin" | "user" | "moderator";

// Class with typed properties and methods
class ShoppingCart {
  private items: Product[] = [];
  private readonly userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  addProduct(product: Product): void {
    if (product.inStock) {
      this.items.push(product);
    }
  }

  removeProduct(productId: ProductId): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== productId);
    return this.items.length < initialLength;
  }

  getTotal(): number {
    return calculateTotal(this.items);
  }

  getItems(): readonly Product[] {
    return this.items;
  }
}

// Enum usage
enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

class Order {
  id: number;
  userId: number;
  products: Product[];
  status: OrderStatus;
  createdAt: Date;
  totalAmount: number;

  constructor(id: number, userId: number, products: Product[]) {
    this.id = id;
    this.userId = userId;
    this.products = products;
    this.status = OrderStatus.PENDING;
    this.createdAt = new Date();
    this.totalAmount = calculateTotal(products);
  }

  updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }

  isDelivered(): boolean {
    return this.status === OrderStatus.DELIVERED;
  }
}

// Example usage
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    inStock: true,
    description: "High-performance laptop"
  },
  {
    id: 2,
    name: "Mouse",
    price: 29.99,
    category: "Electronics",
    inStock: true
  }
];

const cart = new ShoppingCart(123);
sampleProducts.forEach(product => cart.addProduct(product));

const order = new Order(1, 123, cart.getItems() as Product[]);
console.log(`Order total: $${order.totalAmount}`);