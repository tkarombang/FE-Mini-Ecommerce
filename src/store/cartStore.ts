import { create } from "zustand";
import { Product } from "@/data/products";

type ProductState = {
  currentPage: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
};

type CartItem = Product & { qty: number };
type CartState = {
  items: CartItem[];
  orders: CartItem[][];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  checkout: () => void;
};

export const useProductStore = create<ProductState>((set) => ({
  currentPage: 1,
  itemsPerPage: 4,
  setPage: (page) => {
    set({ currentPage: page });
  },
}));

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  orders: [],
  addToCart: (product) => {
    const existingItem = get().items.find((item) => item.id === product.id);
    if (existingItem) {
      set({
        items: get().items.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)),
      });
    } else {
      set({
        items: [...get().items, { ...product, qty: 1 }],
      });
    }
  },
  removeFromCart: (id) => {
    set({
      items: get().items.filter((item) => item.id !== id),
    });
  },
  clearCart: () => set({ items: [] }),
  totalItems: 0,
  totalPrice: 0,

  checkout: () => {
    set((state) => {
      if (state.items.length === 0) return state;
      return {
        orders: [...state.orders, state.items],
        items: [],
      };
    });
  },
}));

useCartStore.subscribe((state) => {
  const totalItems = state.items.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = state.items.reduce((acc, curr) => acc + curr.qty * curr.price, 0);
  setTimeout(() => {
    useCartStore.setState({ totalItems, totalPrice });
  }, 0);
});
