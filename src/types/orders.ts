export interface OrderItemPayload {
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    nama: string;
    price: number;
    kategori: string;
    image: string;
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

export interface updatedOrderDTO {
  customer_name: string;
  customer_email: string;
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
}
