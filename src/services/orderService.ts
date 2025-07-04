import axios from 'axios';
import type { Order } from '../types/order';
import { getIdToken } from './authService';

const API_URL = 'http://192.168.0.52:8080/api/orders';

interface PaginatedOrdersResponse {
  orders: Order[];
  lastVisible: string | null;
}

interface ApiResponse {
  message: string;
  data: PaginatedOrdersResponse;
}

/**
 * Fetches all orders for a specific user.
 * @param userId The ID of the user whose orders to fetch.
 * @param lastVisible The cursor for pagination.
 */
export const getOrdersByUserId = async (
  userId: string,
  lastVisible: string | null = null,
  searchTerm: string = '' // <-- ADD SEARCHTERM
): Promise<PaginatedOrdersResponse> => {
  const token = await getIdToken();
  if (!token) throw new Error("User not authenticated");

  try {
    const params: { lastVisible?: string, searchTerm?: string } = {}; // <-- DEFINE PARAMS
    if (lastVisible) params.lastVisible = lastVisible;
    if (searchTerm) params.searchTerm = searchTerm;

    const response = await axios.get<ApiResponse>(`${API_URL}/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params // <-- PASS PARAMS
    });
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch orders for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetches a paginated list of all orders.
 * @param lastVisible The cursor for pagination.
 * @param searchTerm The term to search for (by customer name/email).
 */
export const getAllOrders = async (
  lastVisible: string | null = null,
  searchTerm: string = ''
): Promise<PaginatedOrdersResponse> => {
  const token = await getIdToken();
  if (!token) throw new Error("User not authenticated");

  try {
    const params: { lastVisible?: string; searchTerm?: string } = {};
    if (lastVisible) params.lastVisible = lastVisible;
    if (searchTerm) params.searchTerm = searchTerm;

    // Note: This call goes to the root API_URL, which is '/api/orders'
    const response = await axios.get<ApiResponse>(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` },
      params
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch all orders:', error);
    throw error;
  }
};

/**
 * Updates the status of a specific order.
 * @param orderId The ID of the order to update.
 * @param status The new status for the order.
 */
export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  const token = await getIdToken();
  if (!token) throw new Error("User not authenticated");

  try {
    await axios.put(`${API_URL}/${orderId}/status`, { status }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error(`Failed to update status for order ${orderId}:`, error);
    throw error;
  }
};

interface SingleOrderApiResponse {
  message: string;
  data: Order;
}

/**
 * Fetches a single order by its ID.
 * @param orderId The ID of the order to fetch.
 */
export const getOrderById = async (orderId: string): Promise<Order> => {
  const token = await getIdToken();
  if (!token) throw new Error("User not authenticated");

  try {
    const response = await axios.get<SingleOrderApiResponse>(`${API_URL}/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch order ${orderId}:`, error);
    throw error;
  }
};