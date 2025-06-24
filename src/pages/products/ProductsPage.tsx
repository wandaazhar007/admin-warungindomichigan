import { useState, useEffect } from 'react';
import { getProducts, createProduct } from '../../services/productService';
import type { Product, ProductFormData } from '../../types/product';
import { getIdToken } from '../../services/authService';
import styles from './ProductPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import ProductForm from '../../components/productForm/ProductForm';
import { uploadImage } from '../../services/storageService';

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

  const handleAddProductClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  // const handleSubmitForm = async (formData: ProductFormData, imageFile?: File) => {
  //   setIsSubmitting(true);
  //   setError(null);

  //   const token = await getIdToken();
  //   if (!token) {
  //     alert("Authentication error. Please log in again.");
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   console.log("Image file to be uploaded:", imageFile);

  //   try {
  //     const newProductData = { ...formData };
  //     const newProduct = await createProduct(newProductData, token);
  //     setProducts(prev => [newProduct, ...prev]);
  //     handleCloseForm();
  //   } catch (error) {
  //     console.error("Failed to create product", error);
  //     setError("Failed to create product. Please check the console for details.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmitForm = async (formData: ProductFormData, imageFile?: File) => {
    setIsSubmitting(true);
    setError(null);

    const token = await getIdToken();
    if (!token) {
      setError("Authentication error. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = ''; // Default to an empty string

      // 1. If an image file exists, upload it first
      if (imageFile) {
        console.log("Uploading image...");
        imageUrl = await uploadImage(imageFile);
        console.log("Image uploaded successfully:", imageUrl);
      }

      // 2. Prepare the final product data with the new image URL
      const finalProductData = {
        ...formData,
        imageUrl: imageUrl, // Add the URL to the data object
      };

      // 3. Create the product document in Firestore
      const newProduct = await createProduct(finalProductData, token);

      // 4. Update the UI
      setProducts(prev => [newProduct, ...prev]);
      handleCloseForm();

    } catch (error) {
      console.error("Failed to create product", error);
      setError("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit product:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete product:", id);
  };

  return (
    <div className={styles.productsPage}>
      {/* This is where the prop is passed. It must match the definition in ProductForm.tsx */}
      {isFormVisible && (
        <ProductForm
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          isLoading={isSubmitting}
          error={error} // <-- PASS THE ERROR STATE AS A PROP
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
        {/* ... The rest of your table JSX remains the same ... */}
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
                        <small>{product.category}</small>
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
    </div>
  );
};

export default ProductsPage;