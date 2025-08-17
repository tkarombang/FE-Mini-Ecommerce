export interface OrderItemPayload {
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderItem {
  product_id: number;
  product: {
    id: number;
    nama: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customer_name?: string;
  customer_email?: string;
  total_price: number;
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderDTO {
  customer_name?: string;
  customer_email?: string;
  items: OrderItemPayload[];
}
