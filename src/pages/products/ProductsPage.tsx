import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import type { Product, ProductFormData } from '../../types/product';
import { getIdToken } from '../../services/authService';
import { uploadImage, deleteImageByUrl } from '../../services/storageService';
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
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<string | null>(null); // To store the cursor
  const [hasMore, setHasMore] = useState<boolean>(true); // To know if there are more products to load

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await getProducts();
  //       setProducts(data);
  //       setError(null);
  //     } catch (err) {
  //       setError('Failed to load products.');
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  useEffect(() => {
    fetchProducts(true);
  }, []);

  const fetchProducts = async (isInitialFetch = false) => {
    if (!isInitialFetch) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const cursor = isInitialFetch ? null : lastVisible;
      const data = await getProducts(cursor);

      if (data.products.length > 0) {
        setProducts(prev => isInitialFetch ? data.products : [...prev, ...data.products]);
      }

      setLastVisible(data.lastVisible);
      setHasMore(!!data.lastVisible); // If lastVisible is null, there are no more products
      setError(null);
    } catch (err) {
      setError('Failed to load products.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
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

  // const handleDelete = (id: string) => { console.log("Delete product:", id); };

  const handleDelete = async (productId: string, imageUrl: string) => {
    // Use a simple browser confirmation dialog
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    const token = await getIdToken();
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      // Show a loading toast while deleting
      const deleteToast = toast.loading("Deleting product...");

      // 1. Delete the product document from Firestore
      await deleteProduct(productId, token);

      // 2. Delete the associated image from Firebase Storage (if it exists)
      if (imageUrl) {
        await deleteImageByUrl(imageUrl);
      }

      // 3. Update the UI by filtering out the deleted product
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));

      // Update the toast to show success
      toast.success("Product deleted successfully!", { id: deleteToast });

    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product.");
    }
  };

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
            {/* ... (your table head is the same) ... */}
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
                      {/* <button onClick={() => handleDelete(product.id)} title="Delete" className={styles.deleteButton}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button> */}

                      <button
                        onClick={() => handleDelete(product.id, product.imageUrl)}
                        title="Delete"
                        className={styles.deleteButton}
                      >
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

      {/* --- PAGINATION BUTTON --- */}
      <div className={styles.paginationContainer}>
        {hasMore && (
          <button onClick={() => fetchProducts(false)} disabled={loadingMore} className={styles.loadMoreButton}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        )}
        {!loading && !hasMore && (
          <p className={styles.endOfListText}>You've reached the end of the list.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

