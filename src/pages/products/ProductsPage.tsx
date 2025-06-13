import { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import type { Product } from '../../types/product';
import styles from './ProductPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
// We will use this later for the Add Product form
// import ProductForm from '../../components/ProductForm'; 

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // We'll add state for the form visibility later
  // const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

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

  const handleEdit = (id: string) => {
    console.log("Edit product:", id);
    // Edit logic will go here
  };

  const handleDelete = (id: string) => {
    console.log("Delete product:", id);
    // Delete logic will go here
  };

  return (
    <div className={styles.productsPage}>
      <header className={styles.header}>
        <h1>All Menus</h1>
        <div className={styles.headerActions}>
          <input type="text" placeholder="Search here..." className={styles.searchInput} />
          <button className={styles.addButton}>Add Product +</button>
        </div>
      </header>

      <div className={styles.tableContainer}>
        {loading && <p>Loading products...</p>}
        {error && <p className={styles.errorText}>{error}</p>}
        {!loading && !error && (
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>Name Products</th>
                <th>Price</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productNameCell}>
                      <div className={styles.productImagePlaceholder}></div>
                      <span>
                        {product.name}
                        <small>{product.category} Roll</small> {/* Example subtitle */}
                      </span>
                    </div>
                  </td>
                  <td>${(product.price / 100).toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button onClick={() => handleEdit(product.id)} title="Edit">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} title="Delete" className={styles.deleteButton}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* We will add pagination here later */}
    </div>
  );
};

export default ProductsPage;