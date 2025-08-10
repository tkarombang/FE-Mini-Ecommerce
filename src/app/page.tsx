"use client";

import { useCartStore, useProductStore } from "@/store/cartStore";
import ProductCard from "@/components/ProductCard";
import { useCallback, useMemo, useState } from "react";
import { Product, products } from "@/data/products";
import { debounce } from "lodash";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

export default function ProductListPage() {
  const { currentPage, itemsPerPage, setPage } = useProductStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const [priceSort, setPriceSort] = useState("");
  const [category, setCategory] = useState("");

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product);
    },
    [addToCart],
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category) {
      result = result.filter((p) => p.kategori === category);
    }

    if (priceSort === "asc") {
      result.sort((a, b) => a.price - b.price);
    }
    if (priceSort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }
    return result;
  }, [priceSort, category]);

  const handlePriceSort = useMemo(() => debounce((value: "asc" | "desc" | "") => setPriceSort(value), 300), [setPriceSort]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div>
      <h1 className="text-3xl font-bold text-teal-800">Daftar Produk</h1>

      <div className="flex flex-wrap gap-4 mb-6 justify-end">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border-teal-600 border rounded px-2 py-2 cursor-pointer">
          <option value="">Semua Kategori</option>
          <option value="Elektronik">Elektronik</option>
          <option value="Aksesoris Komputer">Aksesoris Komputer</option>
          <option value="Perangkat Wearable">Perangkat Wearable</option>
        </select>

        <select value={priceSort} onChange={(e) => handlePriceSort(e.target.value as "asc" | "desc" | "")} className="border-teal-600 border rounded px-2 py-2 cursor-pointer">
          <option value="">Urutkan Harga</option>
          <option value="asc">Harga Terendah</option>
          <option value="desc">Harga Tertinggi</option>
        </select>
      </div>

      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {paginatedProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} onAdd={handleAddToCart} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} onClick={() => setPage(page)} className={`cursor-pointer px-3 py-1 rounded ${page === currentPage ? "bg-teal-700 text-stone-100" : "bg-stone-200"}`}></button>
        ))}
      </div>
    </div>
  );
}
