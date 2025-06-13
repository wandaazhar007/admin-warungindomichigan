import { useState, useEffect } from 'react';
import { getProducts, createProduct } from '../../services/productService';
import type { Product, ProductFormData } from '../../types/product';
import ProductForm from '../../components/productForm/ProductForm';
import styles from './ProductPage.module.scss';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
  }, []);

  const handleCreateProduct = async (formData: ProductFormData) => {
    const token = prompt("Enter placeholder admin auth token:");
    if (!token) {
      alert("A token is required to create a product.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const newProduct = await createProduct(formData, token);
      setProducts(prevProducts => [newProduct, ...prevProducts]);
      setIsFormVisible(false);
    } catch (err) {
      setError('Failed to create product. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Main page content is wrapped in a React Fragment <>
  return (
    <>
      {/* The form is now a SIBLING to the page container, not inside it */}
      {isFormVisible && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsFormVisible(false)}
          isLoading={isSubmitting}
        />
      )}

      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <h1>Product Management</h1>
          <button onClick={() => setIsFormVisible(true)} className={styles.createButton}>
            Create New Product
          </button>
        </header>

        {loading && <div>Loading products...</div>}
        {error && <div>Error: {error}</div>}

        {!loading && !error && products.length > 0 ? (
          <ul className={styles.productList}>
            {products.map((product) => (
              <li key={product.id} className={styles.productListItem}>
                {product.name} - ${product.price / 100}
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>No products found. Go add some via the API!</p>
        )}
      </div>
    </>
  );
};

export default ProductsPage;