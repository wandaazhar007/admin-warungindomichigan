import axios from 'axios';
import type { Customer } from '../types/customer';
import { getIdToken } from './authService';

const API_URL = 'http://192.168.0.52:8080/api/customers'; // Using your network IP

interface ApiResponse {
  message: string;
  data: Customer[];
}

export const getCustomers = async (): Promise<Customer[]> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await axios.get<ApiResponse>(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw error;
  }
};