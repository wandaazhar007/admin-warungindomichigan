import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import type { Product, ProductFormData } from '../../types/product';
import { useDebounce } from '../../hooks/useDebounce';
import SkeletonLoader from '../../components/skeletonLoader/SkeletonLoader';
import ProductForm from '../../components/productForm/ProductForm';
import { getIdToken } from '../../services/authService';
import { uploadImage, deleteImageByUrl } from '../../services/storageService';
import styles from './ProductPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // State for form and pagination
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSearching(true);
    setProducts([]);
    fetchProducts(true, debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const fetchProducts = async (isInitialFetch = false, currentSearchTerm = '') => {
    if (!isInitialFetch) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setIsSearching(true);
    }
    try {
      const cursor = isInitialFetch ? null : lastVisible;
      const data = await getProducts(cursor, currentSearchTerm);
      setProducts(prev => isInitialFetch ? data.products : [...prev, ...data.products]);
      setLastVisible(data.lastVisible);
      setHasMore(!!data.lastVisible);
      setError(null);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsSearching(false);
    }
  };

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
        if (editingProduct?.imageUrl) {
          await deleteImageByUrl(editingProduct.imageUrl);
        }
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

  const handleDelete = async (productId: string, imageUrl: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const token = await getIdToken();
    if (!token) {
      toast.error("Authentication error.");
      return;
    }
    const deleteToast = toast.loading("Deleting product...");
    try {
      await deleteProduct(productId, token);
      if (imageUrl) {
        await deleteImageByUrl(imageUrl);
      }
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      toast.success("Product deleted successfully!", { id: deleteToast });
    } catch (error) {
      toast.error("Failed to delete product.", { id: deleteToast });
    }
  };

  // --- THIS IS THE FIX ---
  // Define the column configuration for the product table skeleton
  const skeletonColumns = [
    { width: '300px' },
    { width: '100px' },
    { width: '150px' },
    { width: '100px' },
  ];

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
          <input
            type="text"
            placeholder="Search products by name..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleAddProductClick} className={styles.addButton}>Add Product +</button>
        </div>
      </header>
      <div className={styles.tableContainer}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>Name Products</th>
              <th>Price</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          {(loading || isSearching) ? (
            // Pass the defined columns to the SkeletonLoader
            <SkeletonLoader columns={skeletonColumns} rows={10} />
          ) : (
            <tbody>
              {products.length > 0 ? (
                products.map(product => (
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
                        <button onClick={() => handleDelete(product.id, product.imageUrl)} title="Delete" className={styles.deleteButton}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={styles.noResults}>No products found.</td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
      <div className={styles.paginationContainer}>
        {!isSearching && hasMore && (
          <button onClick={() => fetchProducts(false, debouncedSearchTerm)} disabled={loadingMore} className={styles.loadMoreButton}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        )}
        {!loading && !isSearching && !hasMore && products.length > 0 && (
          <p className={styles.endOfListText}>You've reached the end of the list.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
