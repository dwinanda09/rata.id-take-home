import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './graphql/client';
import ProductList from './components/ProductList';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1 style={{ padding: '20px', margin: 0, backgroundColor: '#f5f5f5', borderBottom: '1px solid #ccc' }}>
          Product Management System
        </h1>
        <ProductList />
      </div>
    </ApolloProvider>
  );
};

export default App;