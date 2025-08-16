"use client";
import { create } from "zustand";
// import { Product, products } from "@/data/products";
import { ProductsApi } from "@/types/products";

type ProductState = {
  allProducts: ProductsApi[];
  filteredProducts: ProductsApi[];
  currentPage: number;
  category: string;
  priceSort: "asc" | "desc" | "";
  itemsPerPage: number;
  setPage: (page: number) => void;
  setCategory: (category: string) => void;
  setPriceSort: (sort: "asc" | "desc" | "") => void;
  setAllProductsApi: (products: ProductsApi[]) => void;
};

type CartItem = ProductsApi & { qty: number };
type CartState = {
  items: CartItem[];
  orders: CartItem[][];
  addToCart: (product: ProductsApi) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  // checkout: () => void;
};

const applyFilters = (products: ProductsApi[], category: string, priceSort: string) => {
  let result = [...products];
  if (category) {
    result = result.filter((p) => p.kategori === category);
  }
  if (priceSort === "asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (priceSort === "desc") {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
};

export const useProductStore = create<ProductState>((set, get) => ({
  allProducts: [],
  filteredProducts: [],
  category: "",
  priceSort: "",
  currentPage: 1,
  itemsPerPage: 4,
  setAllProductsApi: (products) => {
    const { category, priceSort } = get();
    const filtered = applyFilters(products, category, priceSort);
    set({
      allProducts: products,
      filteredProducts: filtered,
      currentPage: 1,
    });
  },
  setPage: (page) => {
    set({ currentPage: page });
  },
  setCategory: (category) => {
    const { allProducts, priceSort } = get();
    const filtered = applyFilters(allProducts, category, priceSort);
    set({ category, filteredProducts: filtered, currentPage: 1 });
  },
  setPriceSort: (priceSort) => {
    const { allProducts, category } = get();
    const filtered = applyFilters(allProducts, category, priceSort);

    set({ priceSort, filteredProducts: filtered, currentPage: 1 });
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
}));

useCartStore.subscribe((state) => {
  const totalItems = state.items.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = state.items.reduce((acc, curr) => acc + curr.qty * curr.price, 0);
  setTimeout(() => {
    useCartStore.setState({ totalItems, totalPrice });
  }, 0);
});
