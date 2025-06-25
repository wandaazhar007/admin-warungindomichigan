import { useState, useEffect } from 'react';
import type { Product, ProductFormData } from '../../types/product';
import styles from './ProductForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ProductFormProps {
  onSubmit: (formData: ProductFormData, imageFile?: File) => void;
  onClose: () => void;
  isLoading: boolean;
  error?: string | null;
  initialData?: Product | null;
}

const ProductForm = ({ onSubmit, onClose, isLoading, error, initialData }: ProductFormProps) => {
  const [formData, setFormData] = useState<Omit<ProductFormData, 'price'>>({
    name: '',
    slug: '',
    description: '',
    category: 'Foods',
    stockQuantity: 0,
  });
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [validationError, setValidationError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null); // <-- NEW STATE for the preview URL

  useEffect(() => {
    if (initialData) {
      // Manually build the object to ensure types match perfectly
      setFormData({
        name: initialData.name,
        // Use the slug from initialData, OR default to an empty string if it's undefined
        slug: initialData.slug ?? '', // <-- THIS IS THE FIX
        description: initialData.description,
        category: initialData.category,
        stockQuantity: initialData.stockQuantity,
        imageUrl: initialData.imageUrl
      });
      // Set the price separately
      setPrice((initialData.price / 100).toString());
      // Set the image preview if an image URL exists
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
    // Cleanup function for local image previews
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValidationError('');
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError('');
    setPrice(e.target.value);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a temporary local URL for the new image and set it for preview
      const newPreviewUrl = URL.createObjectURL(file);
      // If there was an old blob preview, revoke it to prevent memory leaks
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(newPreviewUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setValidationError('Product name is required.');
      return;
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      setValidationError('Please enter a valid price.');
      return;
    }
    onSubmit({ ...formData, price: numericPrice * 100 }, imageFile);
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <header className={styles.formHeader}>
          <h2>{initialData ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className={styles.closeButton} disabled={isLoading}>
            <FontAwesomeIcon icon={faXmark} />
            <span>Close</span>
          </button>
        </header>
        {/* The form JSX was missing, this restores it. */}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {(error || validationError) && (
              <p className={styles.errorMessage}>{error || validationError}</p>
            )}
            <div className={styles.formGroup}>
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="slug">Slug</label>
              <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="image">Image Product</label>
              {/* --- NEW IMAGE PREVIEW --- */}
              {imagePreview && (
                <img src={imagePreview} alt="Product Preview" className={styles.imagePreview} />
              )}
              <input type="file" id="image" name="image" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price ($)</label>
              <input type="number" id="price" name="price" value={price} onChange={handlePriceChange} step="0.01" min="0" disabled={isLoading} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} disabled={isLoading}>
                <option value="Foods">Foods</option>
                <option value="Beverages">Beverages</option>
                <option value="Seasonings">Seasonings</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <input type="number" id="stockQuantity" name="stockQuantity" value={String(formData.stockQuantity)} onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value, 10) || 0 })} min="0" disabled={isLoading} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton} disabled={isLoading}>
              {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;