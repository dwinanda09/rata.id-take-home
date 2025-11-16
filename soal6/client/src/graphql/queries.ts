import { gql } from '@apollo/client';

// Fragment definitions for reusability
export const PRODUCT_FRAGMENT = gql`
  fragment ProductInfo on Product {
    id
    name
    description
    category
    price
    currency
    stockQuantity
    sku
    imageUrls
    status
    createdAt
    updatedAt
    attributes
    tags
  }
`;

export const PRODUCT_METRICS_FRAGMENT = gql`
  fragment ProductMetrics on ProductMetrics {
    viewsCount
    salesCount
    averageRating
    reviewsCount
    wishlistCount
  }
`;

export const PAGINATION_FRAGMENT = gql`
  fragment PaginationInfo on PaginationInfo {
    currentPage
    totalPages
    pageSize
    totalItems
  }
`;

// Query definitions
export const GET_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  ${PAGINATION_FRAGMENT}
  query GetProducts($ids: [ID!], $statusFilter: ProductStatus, $includeMetrics: Boolean, $pagination: PaginationInput) {
    products(ids: $ids, statusFilter: $statusFilter, includeMetrics: $includeMetrics, pagination: $pagination) {
      products {
        ...ProductInfo
        metrics @include(if: $includeMetrics) {
          ...ProductMetrics
        }
      }
      totalCount
      hasMore
      pagination {
        ...PaginationInfo
      }
    }
  }
  ${PRODUCT_METRICS_FRAGMENT}
`;

export const GET_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  ${PRODUCT_METRICS_FRAGMENT}
  query GetProduct($id: ID!, $includeMetrics: Boolean = false) {
    product(id: $id, includeMetrics: $includeMetrics) {
      ...ProductInfo
      metrics @include(if: $includeMetrics) {
        ...ProductMetrics
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  ${PAGINATION_FRAGMENT}
  query SearchProducts($search: ProductSearchInput!, $pagination: PaginationInput) {
    searchProducts(search: $search, pagination: $pagination) {
      products {
        ...ProductInfo
      }
      totalCount
      hasMore
      pagination {
        ...PaginationInfo
      }
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  ${PRODUCT_FRAGMENT}
  ${PAGINATION_FRAGMENT}
  query GetProductsByCategory($category: String!, $includeSubcategories: Boolean, $pagination: PaginationInput, $sortBy: String, $sortOrder: String) {
    productsByCategory(
      category: $category
      includeSubcategories: $includeSubcategories
      pagination: $pagination
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      products {
        ...ProductInfo
      }
      totalCount
      hasMore
      pagination {
        ...PaginationInfo
      }
    }
  }
`;

export const CHECK_PRODUCT_AVAILABILITY = gql`
  query CheckProductAvailability($productId: ID!, $quantity: Int!) {
    productAvailability(productId: $productId, quantity: $quantity) {
      isAvailable
      availableQuantity
      message
      restockDate
    }
  }
`;

export const GET_LOW_STOCK_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query GetLowStockProducts($threshold: Int, $pagination: PaginationInput) {
    lowStockProducts(threshold: $threshold, pagination: $pagination) {
      products {
        ...ProductInfo
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_TOP_SELLING_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  ${PRODUCT_METRICS_FRAGMENT}
  query GetTopSellingProducts($limit: Int) {
    topSellingProducts(limit: $limit) {
      ...ProductInfo
      metrics {
        ...ProductMetrics
      }
    }
  }
`;

export const GET_RECENT_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query GetRecentProducts($days: Int, $pagination: PaginationInput) {
    recentProducts(days: $days, pagination: $pagination) {
      products {
        ...ProductInfo
      }
      totalCount
      hasMore
    }
  }
`;