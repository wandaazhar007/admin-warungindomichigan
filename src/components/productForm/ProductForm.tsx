import { useState } from 'react';
import type { ProductFormData } from '../../types/product';
import styles from './ProductForm.module.scss'; // We will create this file next

interface ProductFormProps {
  onSubmit: (formData: ProductFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ProductForm = ({ onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'Foods', // Default category
    stockQuantity: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Convert to number if the input type is number
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Product name is required.');
      return;
    }
    // Remember price should be in cents
    onSubmit({ ...formData, price: formData.price * 100 });
  };

  return (
    <div className={styles.formOverlay}>
      <form className={styles.productForm} onSubmit={handleSubmit}>
        <h2>Create New Product</h2>

        <div className={styles.formGroup}>
          <label htmlFor="name">Product Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="price">Price ($)</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="stockQuantity">Stock Quantity</label>
            <input type="number" id="stockQuantity" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} min="0" />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            <option value="Foods">Foods</option>
            <option value="Beverages">Beverages</option>
            <option value="Seasonings">Seasonings</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onCancel} className={styles.cancelButton} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;