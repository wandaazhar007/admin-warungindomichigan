import { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import type { Product } from '../../types/product';
import './productPage.scss';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // The empty array means this effect runs once when the component mounts

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Product Management</h1>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price / 100}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found. Go add some via the API!</p>
      )}
    </div>
  );
};

export default ProductsPage;