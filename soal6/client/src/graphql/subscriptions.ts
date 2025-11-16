import { gql } from '@apollo/client';
import { PRODUCT_FRAGMENT } from './queries';

// Subscription definitions
export const PRODUCT_UPDATED = gql`
  ${PRODUCT_FRAGMENT}
  subscription ProductUpdated($productId: ID) {
    productUpdated(productId: $productId) {
      ...ProductInfo
    }
  }
`;

export const STOCK_LEVEL_CHANGED = gql`
  ${PRODUCT_FRAGMENT}
  subscription StockLevelChanged($productId: ID, $threshold: Int) {
    stockLevelChanged(productId: $productId, threshold: $threshold) {
      ...ProductInfo
    }
  }
`;

export const NEW_PRODUCT_IN_CATEGORY = gql`
  ${PRODUCT_FRAGMENT}
  subscription NewProductInCategory($category: String!) {
    newProductInCategory(category: $category) {
      ...ProductInfo
    }
  }
`;

export const PRODUCT_STATUS_CHANGED = gql`
  ${PRODUCT_FRAGMENT}
  subscription ProductStatusChanged($productIds: [ID!]) {
    productStatusChanged(productIds: $productIds) {
      ...ProductInfo
    }
  }
`;