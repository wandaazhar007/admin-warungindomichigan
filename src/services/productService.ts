import axios from 'axios';
import type { Product } from '../types/product';
import type { ProductFormData } from '../types/product';

// The base URL of our backend API
const API_URL = 'http://localhost:8080/api/products';

interface ApiResponse {
  message: string;
  data: Product[];
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL);
    // The actual product array is in response.data.data
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    // Return an empty array or throw the error, depending on how you want to handle it
    return [];
  }
};

export const createProduct = async (productData: ProductFormData, token: string): Promise<Product> => {
  try {
    const response = await axios.post(`${API_URL}`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // The API returns the newly created product details
    return response.data.data;
  } catch (error) {
    console.error('Failed to create product:', error);
    // We re-throw the error to be handled by the component
    throw error;
  }
};