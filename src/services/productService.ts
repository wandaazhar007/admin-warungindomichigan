import axios from 'axios';
import type { Product } from '../types/product';

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