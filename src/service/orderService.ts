// import axios from "axios";
import api from "./api";
import { Order, CreateOrderDTO } from "@/types/orders";

// const API_URL = "http://localhost:8000";

export const createOrder = async (orderData: CreateOrderDTO): Promise<Order> => {
  const res = await api.post<Order>(`/orders`, orderData);
  return res.data;
};

export const getOrders = async (): Promise<Order[]> => {
  const res = await api.get<Order[]>(`/orders`);
  return res.data;
};

export const deleteOrder = async (orderId: number): Promise<void> => {
  await api.delete<Order[]>(`/orders/${orderId}`);
};

export const getTotalRevenueEndpoint = async (): Promise<number> => {
  const res = await api.get<number>(`/analytics/revenue`);
  return res.data;
};
