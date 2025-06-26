import axios from 'axios';
import type { Customer } from '../types/customer';
import { getIdToken } from './authService';

const API_URL = 'http://192.168.0.52:8080/api/customers'; // Using your network IP

// Define the new shape of the API response
interface PaginatedCustomersResponse {
  customers: Customer[];
  nextPageToken: string | null;
}

interface ApiResponse {
  message: string;
  data: PaginatedCustomersResponse;
}

/**
 * Fetches a paginated list of customers, with optional search.
 * @param searchTerm - The term to search for.
 * @param pageToken - The token for the next page of results.
 */
export const getCustomers = async (
  searchTerm: string = '',
  pageToken: string | null = null
): Promise<PaginatedCustomersResponse> => {
  const token = await getIdToken();
  if (!token) throw new Error("User not authenticated");

  try {
    const params: { searchTerm?: string; nextPageToken?: string } = {};
    if (searchTerm) params.searchTerm = searchTerm;
    if (pageToken) params.nextPageToken = pageToken;

    const response = await axios.get<ApiResponse>(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` },
      params
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw error;
  }
};