import { gql } from '@apollo/client';
import { PRODUCT_FRAGMENT } from './queries';

// Mutation definitions
export const CREATE_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...ProductInfo
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      ...ProductInfo
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!, $softDelete: Boolean, $reason: String) {
    deleteProduct(id: $id, softDelete: $softDelete, reason: $reason)
  }
`;

export const UPDATE_PRODUCT_STOCK = gql`
  ${PRODUCT_FRAGMENT}
  mutation UpdateProductStock($input: StockUpdateInput!) {
    updateProductStock(input: $input) {
      ...ProductInfo
    }
  }
`;

export const ACTIVATE_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  mutation ActivateProduct($id: ID!) {
    activateProduct(id: $id) {
      ...ProductInfo
    }
  }
`;

export const DEACTIVATE_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  mutation DeactivateProduct($id: ID!) {
    deactivateProduct(id: $id) {
      ...ProductInfo
    }
  }
`;

export const ARCHIVE_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  mutation ArchiveProduct($id: ID!) {
    archiveProduct(id: $id) {
      ...ProductInfo
    }
  }
`;

export const DUPLICATE_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  mutation DuplicateProduct($id: ID!, $newSku: String!, $modifications: UpdateProductInput) {
    duplicateProduct(id: $id, newSku: $newSku, modifications: $modifications) {
      ...ProductInfo
    }
  }
`;

export const CREATE_MULTIPLE_PRODUCTS = gql`
  mutation CreateMultipleProducts($inputs: [CreateProductInput!]!) {
    createProducts(inputs: $inputs) {
      successCount
      errorCount
      updatedProducts {
        id
        name
        sku
        status
      }
      failedUpdates
      success
    }
  }
`;

export const UPDATE_MULTIPLE_PRODUCTS = gql`
  mutation UpdateMultipleProducts($inputs: [UpdateProductInput!]!) {
    updateProducts(inputs: $inputs) {
      successCount
      errorCount
      updatedProducts {
        id
        name
        status
        updatedAt
      }
      failedUpdates
      success
    }
  }
`;

export const BULK_UPDATE_STOCK = gql`
  mutation BulkUpdateStock($inputs: [StockUpdateInput!]!) {
    bulkUpdateStock(inputs: $inputs) {
      successCount
      errorCount
      updatedProducts {
        id
        name
        stockQuantity
      }
      failedUpdates
      success
    }
  }
`;

export const DELETE_MULTIPLE_PRODUCTS = gql`
  mutation DeleteMultipleProducts($ids: [ID!]!, $softDelete: Boolean, $reason: String) {
    deleteProducts(ids: $ids, softDelete: $softDelete, reason: $reason) {
      successCount
      errorCount
      failedUpdates
      success
    }
  }
`;