import axios from "axios";
import { Order, CreateOrderDTO } from "@/types/order";

const API_URL = "http://localhost:8000";

export const createOrder = async (orderData: CreateOrderDTO): Promise<Order> => {
  const res = await axios.post<Order>(`${API_URL}/orders`, orderData);
  return res.data;
};

export const getOrders = async (): Promise<Order[]> => {
  const res = await axios.get<Order[]>(`${API_URL}/orders`);
  return res.data;
};

export const deleteOrder = async (orderId: number): Promise<void> => {
  await axios.delete<Order[]>(`${API_URL}/orders/${orderId}`);
};

export const getTotalRevenueEndpoint = async (): Promise<number> => {
  const res = await axios.get<number>(`${API_URL}/analytics/revenue`);
  return res.data;
};
