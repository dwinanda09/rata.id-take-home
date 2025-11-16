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

// Enhanced types for CRUD operations
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock_quantity: number;
  sku: string;
  image_urls: string[];
  status: string;
  created_at: number;
  updated_at: number;
  attributes: { [key: string]: string };
  metrics?: ProductMetrics;
  tags?: string[];
}

export interface ProductMetrics {
  views_count: number;
  sales_count: number;
  average_rating: number;
  reviews_count: number;
  wishlist_count: number;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  category: string;
  price: number;
  currency?: string;
  stock_quantity?: number;
  sku: string;
  image_urls?: string[];
  attributes?: { [key: string]: string };
  tags?: string[];
}

export interface UpdateProductRequest {
  product_id: string;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  currency?: string;
  stock_quantity?: number;
  image_urls?: string[];
  status?: string;
  attributes?: { [key: string]: string };
  tags?: string[];
}

export interface DeleteProductRequest {
  product_id: string;
  soft_delete?: boolean;
  reason?: string;
}

export interface UpdateProductStockRequest {
  product_id: string;
  quantity_change: number;
  operation: string;
  reason?: string;
}

export interface GetProductsResponse {
  products: Product[];
  total_count: number;
  has_more: boolean;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  page_size: number;
  total_items: number;
}

// Enhanced catalog service client with full CRUD operations
export class CatalogServiceClient {
  private client: any;

  constructor(serverAddress: string = 'localhost:50051') {
    this.client = new catalogProto.CatalogService(
      serverAddress,
      grpc.credentials.createInsecure(),
      {
        'grpc.keepalive_time_ms': 120000,
        'grpc.keepalive_timeout_ms': 5000,
        'grpc.keepalive_permit_without_calls': true,
        'grpc.http2.max_pings_without_data': 0,
        'grpc.http2.min_time_between_pings_ms': 10000,
        'grpc.http2.min_ping_interval_without_data_ms': 5000
      }
    );
  }

  // Query operations
  async getProduct(productId: string, includeMetrics: boolean = false): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      const request = { product_id: productId, include_metrics: includeMetrics };

      this.client.GetProduct(request, (error: any, response: Product) => {
        if (error) {
          console.error('Error fetching product:', error);
          resolve(null);
          return;
        }
        resolve(response);
      });
    });
  }

  async getProducts(
    productIds?: string[],
    limit?: number,
    offset?: number,
    includeMetrics?: boolean,
    statusFilter?: string
  ): Promise<GetProductsResponse> {
    return new Promise((resolve, reject) => {
      const request = {
        product_ids: productIds || [],
        limit,
        offset,
        include_metrics: includeMetrics,
        status_filter: statusFilter
      };

      this.client.GetProducts(request, (error: any, response: GetProductsResponse) => {
        if (error) {
          console.error('Error fetching products:', error);
          resolve({ products: [], total_count: 0, has_more: false });
          return;
        }
        resolve(response);
      });
    });
  }

  async searchProducts(searchParams: any, limit?: number, offset?: number): Promise<GetProductsResponse> {
    return new Promise((resolve, reject) => {
      const request = {
        ...searchParams,
        limit,
        offset,
      };

      this.client.SearchProducts(request, (error: any, response: GetProductsResponse) => {
        if (error) {
          console.error('Error searching products:', error);
          resolve({ products: [], total_count: 0, has_more: false });
          return;
        }
        resolve(response);
      });
    });
  }

  async getProductsByCategory(
    category: string,
    limit?: number,
    offset?: number,
    sortBy?: string,
    sortOrder?: string,
    includeSubcategories?: boolean
  ): Promise<GetProductsResponse> {
    return new Promise((resolve, reject) => {
      const request = {
        category,
        limit,
        offset,
        sort_by: sortBy,
        sort_order: sortOrder,
        include_subcategories: includeSubcategories
      };

      this.client.GetProductsByCategory(request, (error: any, response: GetProductsResponse) => {
        if (error) {
          console.error('Error fetching products by category:', error);
          resolve({ products: [], total_count: 0, has_more: false });
          return;
        }
        resolve(response);
      });
    });
  }

  async checkAvailability(productId: string, quantity: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = { product_id: productId, quantity };

      this.client.CheckAvailability(request, (error: any, response: any) => {
        if (error) {
          console.error('Error checking availability:', error);
          resolve({ is_available: false, available_quantity: 0, message: 'Service unavailable' });
          return;
        }
        resolve(response);
      });
    });
  }

  // Create operations
  async createProduct(productData: CreateProductRequest): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      this.client.CreateProduct(productData, (error: any, response: Product) => {
        if (error) {
          console.error('Error creating product:', error);
          resolve(null);
          return;
        }
        resolve(response);
      });
    });
  }

  // Update operations
  async updateProduct(productData: UpdateProductRequest): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      this.client.UpdateProduct(productData, (error: any, response: Product) => {
        if (error) {
          console.error('Error updating product:', error);
          resolve(null);
          return;
        }
        resolve(response);
      });
    });
  }

  async updateProductStock(stockUpdate: UpdateProductStockRequest): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      this.client.UpdateProductStock(stockUpdate, (error: any, response: Product) => {
        if (error) {
          console.error('Error updating product stock:', error);
          resolve(null);
          return;
        }
        resolve(response);
      });
    });
  }

  async bulkUpdateProducts(updates: UpdateProductRequest[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = { updates };

      this.client.BulkUpdateProducts(request, (error: any, response: any) => {
        if (error) {
          console.error('Error bulk updating products:', error);
          resolve({
            updated_products: [],
            failed_updates: [],
            success_count: 0,
            error_count: updates.length
          });
          return;
        }
        resolve(response);
      });
    });
  }

  // Delete operations
  async deleteProduct(productId: string, softDelete: boolean = true, reason?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request: DeleteProductRequest = {
        product_id: productId,
        soft_delete: softDelete,
        reason
      };

      this.client.DeleteProduct(request, (error: any, response: any) => {
        if (error) {
          console.error('Error deleting product:', error);
          resolve({ success: false, message: 'Delete operation failed' });
          return;
        }
        resolve(response);
      });
    });
  }

  // Connection management
  close(): void {
    this.client.close();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.getProducts([], 1, 0);
      return true;
    } catch (error) {
      console.error('Catalog service health check failed:', error);
      return false;
    }
  }
}

// Create a singleton instance
export const catalogClient = new CatalogServiceClient();