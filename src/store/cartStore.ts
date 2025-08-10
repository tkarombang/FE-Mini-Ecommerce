import { create } from "zustand";
import { Product, products } from "@/data/products";

type ProductState = {
  allProducts: Product[];
  filteredProducts: Product[];
  currentPage: number;
  category: string;
  priceSort: "asc" | "desc" | "";
  itemsPerPage: number;
  setPage: (page: number) => void;
  setCategory: (category: string) => void;
  setPriceSort: (sort: "asc" | "desc" | "") => void;
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

export const useProductStore = create<ProductState>((set, get) => ({
  allProducts: products,
  filteredProducts: products,
  category: "",
  priceSort: "",
  currentPage: 1,
  itemsPerPage: 4,
  setPage: (page) => {
    set({ currentPage: page });
  },
  setCategory: (category) => {
    const { allProducts, priceSort } = get();
    let result = [...allProducts];

    if (category) {
      result = result.filter((p) => p.kategori === category);
    }
    if (priceSort === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    set({ category, filteredProducts: result, currentPage: 1 });
  },
  setPriceSort: (sort) => {
    const { allProducts, category } = get();
    let result = [...allProducts];

    if (category) {
      result = result.filter((p) => p.kategori === category);
    }
    if (sort === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }
    set({ priceSort: sort, filteredProducts: result, currentPage: 1 });
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
