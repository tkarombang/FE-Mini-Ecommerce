export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  total_price: number;
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderDTO {
  item: OrderItem[];
}
