import { catalogClient } from '../grpc/catalogClient';
import { UserInputError, ForbiddenError } from 'apollo-server-express';

// Helper function to transform gRPC product to GraphQL format
function transformProduct(grpcProduct: any) {
  if (!grpcProduct) return null;

  return {
    id: grpcProduct.id,
    name: grpcProduct.name,
    description: grpcProduct.description || '',
    category: grpcProduct.category,
    price: grpcProduct.price,
    currency: grpcProduct.currency || 'USD',
    stockQuantity: grpcProduct.stock_quantity || 0,
    sku: grpcProduct.sku,
    imageUrls: grpcProduct.image_urls || [],
    status: grpcProduct.status?.toUpperCase() || 'UNKNOWN',
    createdAt: new Date(grpcProduct.created_at * 1000),
    updatedAt: new Date(grpcProduct.updated_at * 1000),
    attributes: grpcProduct.attributes || {},
    metrics: grpcProduct.metrics ? {
      viewsCount: grpcProduct.metrics.views_count || 0,
      salesCount: grpcProduct.metrics.sales_count || 0,
      averageRating: grpcProduct.metrics.average_rating || 0,
      reviewsCount: grpcProduct.metrics.reviews_count || 0,
      wishlistCount: grpcProduct.metrics.wishlist_count || 0
    } : null,
    tags: grpcProduct.tags || []
  };
}

// Helper function to transform product list response
function transformProductListResponse(grpcResponse: any) {
  return {
    products: grpcResponse.products.map(transformProduct).filter(Boolean),
    totalCount: grpcResponse.total_count || 0,
    hasMore: grpcResponse.has_more || false,
    pagination: grpcResponse.pagination ? {
      currentPage: grpcResponse.pagination.current_page,
      totalPages: grpcResponse.pagination.total_pages,
      pageSize: grpcResponse.pagination.page_size,
      totalItems: grpcResponse.pagination.total_items
    } : null
  };
}

// Helper function for input validation
function validateProductInput(input: any) {
  const errors = [];

  if (!input.name || input.name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters long');
  }

  if (!input.category || input.category.trim().length < 1) {
    errors.push('Product category is required');
  }

  if (input.price !== undefined && input.price < 0) {
    errors.push('Product price cannot be negative');
  }

  if (!input.sku || input.sku.trim().length < 1) {
    errors.push('Product SKU is required');
  }

  if (input.stockQuantity !== undefined && input.stockQuantity < 0) {
    errors.push('Stock quantity cannot be negative');
  }

  if (errors.length > 0) {
    throw new UserInputError('Invalid input provided', { validationErrors: errors });
  }
}

// Enhanced product resolvers with full CRUD operations
export const productResolvers = {
  Query: {
    // Get single product by ID with optional metrics
    product: async (_: any, { id, includeMetrics }: { id: string; includeMetrics?: boolean }) => {
      try {
        const grpcProduct = await catalogClient.getProduct(id, includeMetrics);
        return transformProduct(grpcProduct);
      } catch (error) {
        console.error('Error in product resolver:', error);
        throw new Error('Failed to fetch product');
      }
    },

    // Get multiple products with enhanced filtering
    products: async (
      _: any,
      { ids, statusFilter, includeMetrics, pagination }: any
    ) => {
      try {
        const grpcResponse = await catalogClient.getProducts(
          ids,
          pagination?.limit,
          pagination?.offset,
          includeMetrics,
          statusFilter?.toLowerCase()
        );

        return transformProductListResponse(grpcResponse);
      } catch (error) {
        console.error('Error in products resolver:', error);
        throw new Error('Failed to fetch products');
      }
    },

    // Enhanced search with advanced filtering
    searchProducts: async (
      _: any,
      { search, pagination }: any
    ) => {
      try {
        const searchParams = {
          query: search.query,
          category: search.category,
          min_price: search.minPrice,
          max_price: search.maxPrice,
          tags: search.tags,
          status_filter: search.status?.toLowerCase(),
          sort_by: search.sortBy || 'name',
          sort_order: search.sortOrder || 'ASC'
        };

        const grpcResponse = await catalogClient.searchProducts(
          searchParams,
          pagination?.limit,
          pagination?.offset
        );

        return transformProductListResponse(grpcResponse);
      } catch (error) {
        console.error('Error in searchProducts resolver:', error);
        throw new Error('Failed to search products');
      }
    },

    // Get products by category with subcategory support
    productsByCategory: async (
      _: any,
      { category, includeSubcategories, pagination, sortBy, sortOrder }: any
    ) => {
      try {
        const grpcResponse = await catalogClient.getProductsByCategory(
          category,
          pagination?.limit,
          pagination?.offset,
          sortBy,
          sortOrder,
          includeSubcategories
        );

        return transformProductListResponse(grpcResponse);
      } catch (error) {
        console.error('Error in productsByCategory resolver:', error);
        throw new Error('Failed to fetch products by category');
      }
    },

    // Enhanced availability check
    productAvailability: async (
      _: any,
      { productId, quantity }: { productId: string; quantity: number }
    ) => {
      try {
        const grpcResponse = await catalogClient.checkAvailability(productId, quantity);

        return {
          isAvailable: grpcResponse.is_available,
          availableQuantity: grpcResponse.available_quantity,
          message: grpcResponse.message || null,
          restockDate: grpcResponse.restock_date ? new Date(grpcResponse.restock_date * 1000) : null
        };
      } catch (error) {
        console.error('Error in productAvailability resolver:', error);
        throw new Error('Failed to check product availability');
      }
    },

    // Additional query resolvers for enhanced functionality
    lowStockProducts: async (_: any, { threshold = 10, pagination }: any) => {
      try {
        // This would typically be a specific gRPC method
        // For now, we'll simulate it with a search
        const grpcResponse = await catalogClient.searchProducts(
          { status_filter: 'ACTIVE' },
          pagination?.limit,
          pagination?.offset
        );

        // Filter products with stock below threshold
        const lowStockProducts = grpcResponse.products.filter(
          (product: any) => product.stock_quantity <= threshold
        );

        return {
          products: lowStockProducts.map(transformProduct).filter(Boolean),
          totalCount: lowStockProducts.length,
          hasMore: false,
          pagination: null
        };
      } catch (error) {
        console.error('Error in lowStockProducts resolver:', error);
        throw new Error('Failed to fetch low stock products');
      }
    },

    topSellingProducts: async (_: any, { limit = 10 }: { limit: number }) => {
      try {
        // This would typically be a specific gRPC method for analytics
        // For now, we'll simulate with regular product fetch
        const grpcResponse = await catalogClient.getProducts([], limit, 0, true);

        // Sort by sales count (from metrics)
        const sortedProducts = grpcResponse.products.sort((a: any, b: any) => {
          const aSales = a.metrics?.sales_count || 0;
          const bSales = b.metrics?.sales_count || 0;
          return bSales - aSales;
        });

        return sortedProducts.map(transformProduct).filter(Boolean);
      } catch (error) {
        console.error('Error in topSellingProducts resolver:', error);
        throw new Error('Failed to fetch top selling products');
      }
    },

    recentProducts: async (_: any, { days = 7, pagination }: any) => {
      try {
        const grpcResponse = await catalogClient.getProducts(
          [],
          pagination?.limit,
          pagination?.offset,
          false,
          'ACTIVE'
        );

        // Filter products created within the specified days
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffTimestamp = Math.floor(cutoffDate.getTime() / 1000);

        const recentProducts = grpcResponse.products.filter(
          (product: any) => product.created_at >= cutoffTimestamp
        );

        return {
          products: recentProducts.map(transformProduct).filter(Boolean),
          totalCount: recentProducts.length,
          hasMore: false,
          pagination: null
        };
      } catch (error) {
        console.error('Error in recentProducts resolver:', error);
        throw new Error('Failed to fetch recent products');
      }
    }
  },

  Mutation: {
    // Create a new product
    createProduct: async (_: any, { input }: { input: any }) => {
      try {
        validateProductInput(input);

        const grpcRequest = {
          name: input.name,
          description: input.description,
          category: input.category,
          price: input.price,
          currency: input.currency || 'USD',
          stock_quantity: input.stockQuantity || 0,
          sku: input.sku,
          image_urls: input.imageUrls || [],
          attributes: input.attributes || {},
          tags: input.tags || []
        };

        const grpcProduct = await catalogClient.createProduct(grpcRequest);

        if (!grpcProduct) {
          throw new Error('Failed to create product');
        }

        return transformProduct(grpcProduct);
      } catch (error) {
        console.error('Error in createProduct resolver:', error);
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error('Failed to create product');
      }
    },

    // Update an existing product
    updateProduct: async (_: any, { input }: { input: any }) => {
      try {
        if (input.name) validateProductInput({ name: input.name, category: input.category || 'temp', sku: input.id });

        const grpcRequest = {
          product_id: input.id,
          name: input.name,
          description: input.description,
          category: input.category,
          price: input.price,
          currency: input.currency,
          stock_quantity: input.stockQuantity,
          image_urls: input.imageUrls,
          status: input.status?.toLowerCase(),
          attributes: input.attributes,
          tags: input.tags
        };

        const grpcProduct = await catalogClient.updateProduct(grpcRequest);

        if (!grpcProduct) {
          throw new Error('Failed to update product or product not found');
        }

        return transformProduct(grpcProduct);
      } catch (error) {
        console.error('Error in updateProduct resolver:', error);
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error('Failed to update product');
      }
    },

    // Update product stock
    updateProductStock: async (_: any, { input }: { input: any }) => {
      try {
        const grpcRequest = {
          product_id: input.productId,
          quantity_change: input.quantityChange,
          operation: input.operation.toLowerCase(),
          reason: input.reason
        };

        const grpcProduct = await catalogClient.updateProductStock(grpcRequest);

        if (!grpcProduct) {
          throw new Error('Failed to update product stock');
        }

        return transformProduct(grpcProduct);
      } catch (error) {
        console.error('Error in updateProductStock resolver:', error);
        throw new Error('Failed to update product stock');
      }
    },

    // Delete a product
    deleteProduct: async (_: any, { id, softDelete = true, reason }: any) => {
      try {
        const grpcResponse = await catalogClient.deleteProduct(id, softDelete, reason);
        return grpcResponse.success;
      } catch (error) {
        console.error('Error in deleteProduct resolver:', error);
        throw new Error('Failed to delete product');
      }
    },

    // Bulk operations
    createProducts: async (_: any, { inputs }: { inputs: any[] }) => {
      try {
        const results = {
          successCount: 0,
          errorCount: 0,
          updatedProducts: [],
          failedUpdates: [],
          success: false
        };

        for (const input of inputs) {
          try {
            validateProductInput(input);
            const grpcProduct = await catalogClient.createProduct({
              name: input.name,
              description: input.description,
              category: input.category,
              price: input.price,
              currency: input.currency || 'USD',
              stock_quantity: input.stockQuantity || 0,
              sku: input.sku,
              image_urls: input.imageUrls || [],
              attributes: input.attributes || {},
              tags: input.tags || []
            });

            if (grpcProduct) {
              results.updatedProducts.push(transformProduct(grpcProduct));
              results.successCount++;
            } else {
              results.failedUpdates.push(`Failed to create product: ${input.sku}`);
              results.errorCount++;
            }
          } catch (error) {
            results.failedUpdates.push(`Failed to create product ${input.sku}: ${error.message}`);
            results.errorCount++;
          }
        }

        results.success = results.successCount > 0;
        return results;
      } catch (error) {
        console.error('Error in createProducts resolver:', error);
        throw new Error('Failed to create products');
      }
    },

    updateProducts: async (_: any, { inputs }: { inputs: any[] }) => {
      try {
        const updateRequests = inputs.map(input => ({
          product_id: input.id,
          name: input.name,
          description: input.description,
          category: input.category,
          price: input.price,
          currency: input.currency,
          stock_quantity: input.stockQuantity,
          image_urls: input.imageUrls,
          status: input.status?.toLowerCase(),
          attributes: input.attributes,
          tags: input.tags
        }));

        const grpcResponse = await catalogClient.bulkUpdateProducts(updateRequests);

        return {
          successCount: grpcResponse.success_count || 0,
          errorCount: grpcResponse.error_count || 0,
          updatedProducts: (grpcResponse.updated_products || []).map(transformProduct).filter(Boolean),
          failedUpdates: grpcResponse.failed_updates || [],
          success: (grpcResponse.success_count || 0) > 0
        };
      } catch (error) {
        console.error('Error in updateProducts resolver:', error);
        throw new Error('Failed to update products');
      }
    },

    // Status management mutations
    activateProduct: async (_: any, { id }: { id: string }) => {
      const grpcProduct = await catalogClient.updateProduct({
        product_id: id,
        status: 'active'
      });

      if (!grpcProduct) {
        throw new Error('Failed to activate product');
      }

      return transformProduct(grpcProduct);
    },

    deactivateProduct: async (_: any, { id }: { id: string }) => {
      const grpcProduct = await catalogClient.updateProduct({
        product_id: id,
        status: 'inactive'
      });

      if (!grpcProduct) {
        throw new Error('Failed to deactivate product');
      }

      return transformProduct(grpcProduct);
    },

    archiveProduct: async (_: any, { id }: { id: string }) => {
      const grpcProduct = await catalogClient.updateProduct({
        product_id: id,
        status: 'archived'
      });

      if (!grpcProduct) {
        throw new Error('Failed to archive product');
      }

      return transformProduct(grpcProduct);
    },

    // Utility mutation
    duplicateProduct: async (
      _: any,
      { id, newSku, modifications }: { id: string; newSku: string; modifications?: any }
    ) => {
      try {
        // First, get the original product
        const originalProduct = await catalogClient.getProduct(id);

        if (!originalProduct) {
          throw new Error('Original product not found');
        }

        // Create new product based on original with modifications
        const newProductData = {
          name: modifications?.name || `${originalProduct.name} (Copy)`,
          description: modifications?.description || originalProduct.description,
          category: modifications?.category || originalProduct.category,
          price: modifications?.price || originalProduct.price,
          currency: modifications?.currency || originalProduct.currency,
          stock_quantity: modifications?.stockQuantity || 0, // Reset stock for new product
          sku: newSku,
          image_urls: modifications?.imageUrls || originalProduct.image_urls,
          attributes: modifications?.attributes || originalProduct.attributes,
          tags: modifications?.tags || originalProduct.tags || []
        };

        const grpcProduct = await catalogClient.createProduct(newProductData);

        if (!grpcProduct) {
          throw new Error('Failed to duplicate product');
        }

        return transformProduct(grpcProduct);
      } catch (error) {
        console.error('Error in duplicateProduct resolver:', error);
        throw new Error('Failed to duplicate product');
      }
    }
  }
};