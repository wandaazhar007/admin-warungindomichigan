import axios from 'axios';
import type { Product } from '../types/product';
import type { ProductFormData } from '../types/product';

// The base URL of our backend API
// const API_URL = 'http://localhost:8080/api/products';
const API_URL = 'http://192.168.0.52:8080/api/products';

// interface ApiResponse {
//   message: string;
//   data: Product[];
// }

// Define the new shape of the API response for getProducts
interface PaginatedProductsResponse {
  products: Product[];
  lastVisible: string | null;
}

interface ApiResponse {
  message: string;
  data: PaginatedProductsResponse;
}


/**
 * Fetches a paginated list of products, with optional search.
 * @param lastVisible - The ID of the last visible product.
 * @param searchTerm - The term to search for.
 */
export const getProducts = async (
  lastVisible: string | null = null,
  searchTerm: string = ''
): Promise<PaginatedProductsResponse> => {
  try {
    const params: { lastVisible?: string; searchTerm?: string } = {};
    if (lastVisible) params.lastVisible = lastVisible;
    if (searchTerm) params.searchTerm = searchTerm;

    const response = await axios.get<ApiResponse>(API_URL, { params });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { products: [], lastVisible: null };
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


/**
 * Updates an existing product.
 * @param productId The ID of the product to update.
 * @param productData The new data for the product.
 * @param token The user's auth token.
 * @returns A promise that resolves when the update is complete.
 */
export const updateProduct = async (
  productId: string,
  productData: ProductFormData,
  token: string
): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${productId}`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error(`Failed to update product ${productId}:`, error);
    throw error;
  }
};


/**
 * Deletes a product from the database.
 * @param productId The ID of the product to delete.
 * @param token The user's auth token.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteProduct = async (productId: string, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error(`Failed to delete product ${productId}:`, error);
    throw error;
  }
};