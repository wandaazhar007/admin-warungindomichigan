'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import type { Category } from '../../services/categoryService';
import styles from './CategoriesPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (category: Category | null) => {
    setIsEditing(category);
    setFormData(category ? { name: category.name, description: category.description || '' } : { name: '', description: '' });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setIsEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Category name is required.");
      return;
    }

    const toastId = toast.loading(isEditing ? 'Updating category...' : 'Creating category...');
    try {
      if (isEditing) {
        await updateCategory(isEditing.id, formData);
        toast.success("Category updated!", { id: toastId });
      } else {
        await createCategory(formData);
        toast.success("Category created!", { id: toastId });
      }
      fetchCategories();
      handleCloseForm();
    } catch (error) {
      toast.error("An error occurred.", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    const toastId = toast.loading("Deleting category...");
    try {
      await deleteCategory(id);
      toast.success("Category deleted!", { id: toastId });
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category.", { id: toastId });
    }
  }

  return (
    <div className={styles.categoriesPage}>
      <header className={styles.header}>
        <h1>Categories</h1>
        <button onClick={() => handleOpenForm(null)} className={styles.addButton}>Add Category +</button>
      </header>

      {/* Form Modal */}
      {showForm && (
        <div className={styles.formOverlay}>
          <form onSubmit={handleSubmit} className={styles.categoryForm}>
            <h2>{isEditing ? 'Edit Category' : 'New Category'}</h2>
            <input
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <textarea
              placeholder="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className={styles.formActions}>
              <button type="button" onClick={handleCloseForm}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className={styles.tableContainer}>
        <table className={styles.categoriesTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3}>Loading...</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button onClick={() => handleOpenForm(cat)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                    <button onClick={() => handleDelete(cat.id)}><FontAwesomeIcon icon={faTrash} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesPage;