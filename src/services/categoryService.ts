import axios from 'axios';
import { getIdToken } from './authService';

const API_URL = 'http://192.168.0.52:8080/api/categories'; // Using your network IP

// Define the shape of a Category object
export interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ApiResponse<T> {
  data: T;
}

// GET all categories
export const getCategories = async (): Promise<Category[]> => {
  const token = await getIdToken();
  const response = await axios.get<ApiResponse<Category[]>>(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data.data;
};

// POST a new category
export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
  const token = await getIdToken();
  const response = await axios.post<ApiResponse<Category>>(API_URL, categoryData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data.data;
};

// PUT (update) a category
export const updateCategory = async (id: string, categoryData: Omit<Category, 'id'>): Promise<void> => {
  const token = await getIdToken();
  await axios.put(`${API_URL}/${id}`, categoryData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

// DELETE a category
export const deleteCategory = async (id: string): Promise<void> => {
  const token = await getIdToken();
  await axios.delete(`${API_URL}/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};