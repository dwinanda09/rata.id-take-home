import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries';
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../graphql/mutations';
import { Product } from '../types';

const ProductList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const { data, loading, refetch } = useQuery(GET_PRODUCTS);

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      alert('Product created!');
      setShowForm(false);
      setNewProductName('');
      setNewProductPrice('');
      refetch();
    }
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      alert('Product updated!');
      setEditingProduct(undefined);
      refetch();
    }
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      alert('Product deleted!');
      refetch();
    }
  });

  const products = data?.products?.products || [];

  const handleCreate = () => {
    if (!newProductName || !newProductPrice) {
      alert('Please fill all fields');
      return;
    }
    createProduct({
      variables: {
        input: {
          name: newProductName,
          price: parseFloat(newProductPrice),
          category: 'general',
          sku: 'SKU-' + Date.now(),
          stockQuantity: 100
        }
      }
    });
  };

  const handleEdit = (product: Product) => {
    const newName = prompt('Enter new name:', product.name);
    const newPrice = prompt('Enter new price:', product.price.toString());

    if (newName && newPrice) {
      updateProduct({
        variables: {
          input: {
            id: product.id,
            name: newName,
            price: parseFloat(newPrice)
          }
        }
      });
    }
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Delete ${product.name}?`)) {
      deleteProduct({
        variables: {
          id: product.id,
          softDelete: true,
          reason: 'User deleted'
        }
      });
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading products...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setShowForm(!showForm)} style={{ marginRight: '10px', padding: '8px 16px' }}>
          {showForm ? 'Cancel' : 'Add Product'}
        </button>

        {showForm && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <input
              type="text"
              placeholder="Product name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <button onClick={handleCreate} style={{ padding: '5px 10px' }}>
              Create
            </button>
          </div>
        )}
      </div>

      <div>
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product: Product) => (
            <div key={product.id} style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stockQuantity}</p>
                <p>Status: {product.status}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(product)} style={{ marginRight: '10px', padding: '5px 10px' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(product)} style={{ padding: '5px 10px' }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;