import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getProducts, createProduct, updateProduct } from '../../services/productService';
import type { Product, ProductFormData } from '../../types/product';
import { getIdToken } from '../../services/authService';
import { uploadImage } from '../../services/storageService';
import styles from './ProductPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import ProductForm from '../../components/productForm/ProductForm';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const handleAddProductClick = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  const handleSubmitForm = async (formData: ProductFormData, imageFile?: File) => {
    setIsSubmitting(true);
    const token = await getIdToken();
    if (!token) {
      toast.error("Authentication error.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = editingProduct?.imageUrl || '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const finalProductData = { ...formData, imageUrl };

      if (editingProduct) {
        await updateProduct(editingProduct.id, finalProductData, token);
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...finalProductData, id: p.id, price: finalProductData.price } : p));
        toast.success('Product updated successfully!');
      } else {
        const newProduct = await createProduct(finalProductData, token);
        setProducts(prev => [newProduct, ...prev]);
        toast.success('Product created successfully!');
      }
      handleCloseForm();
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => { console.log("Delete product:", id); };

  return (
    <div className={styles.productsPage}>
      {isFormVisible && (
        <ProductForm
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          isLoading={isSubmitting}
          initialData={editingProduct}
        />
      )}
      <header className={styles.header}>
        <h1>All Menus</h1>
        <div className={styles.headerActions}>
          <input type="text" placeholder="Search here..." className={styles.searchInput} />
          <button onClick={handleAddProductClick} className={styles.addButton}>Add Product +</button>
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
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
                      ) : (
                        <div className={styles.productImagePlaceholder}></div>
                      )}
                      <span>
                        {product.name}
                        <small>{product.category}</small>
                      </span>
                    </div>
                  </td>
                  <td>${(product.price / 100).toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button onClick={() => handleEditClick(product)} title="Edit">
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
    </div>
  );
};

export default ProductsPage;