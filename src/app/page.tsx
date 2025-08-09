"use client";

// import { products } from "@/data/products";
import { useCartStore, useProductStore } from "@/store/cartStore";
import Image from "next/image";
// import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

export default function ProductListPage() {
  const {
    filteredProducts,
    category,
    priceSort,
    currentPage,
    itemsPerPage,
    setPage,
    setCategory,
    setPriceSort,
    // visibleCount,
    // loadMore,
  } = useProductStore();

  const addToCart = useCartStore((state) => state.addToCart);
  // const item = useCartStore((state) => state.items);
  // console.log(item);

  // const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         loadMore();
  //       }
  //     },
  //     { threshold: 1 },
  //   );

  //   if (loadMoreRef.current) {
  //     observer.observe(loadMoreRef.current);
  //   }

  //   return () => {
  //     if (loadMoreRef.current) {
  //       observer.unobserve(loadMoreRef.current);
  //     }
  //   };
  // }, [loadMore]);

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

        <select value={priceSort} onChange={(e) => setPriceSort(e.target.value as "asc" | "desc" | "")} className="border-teal-600 border rounded px-2 py-2 cursor-pointer">
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
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-4"> */}
        {/* {filteredProducts.slice(0, visibleCount).map((product) => ( */}
        {paginatedProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <div className=" border-teal-600 border rounded-lg- p-4 shadow-lg hover:shadow-lg transition">
              <div className="flex gap-3">
                <Image src={product.image} alt={product.nama} width={200} height={200} className="object-cover rounded-mb mb-4" />
                <div className="flex flex-col">
                  <p className="text-teal-600">{product.deskripsi}</p>
                  <p className="text-stone-700">
                    <strong>
                      Kategori: <span className="text-sm font-light">{product.kategori}</span>
                    </strong>
                  </p>
                  <p className="text-stone-300">Rp{product.price.toLocaleString("id-ID")}</p>
                  <h5 className="text-teal-700">
                    <strong>Stok: </strong>
                    {product.stok}
                  </h5>
                </div>
              </div>
              <h2 className="text-lg font-semibold flex justify-between">
                {product.nama} |<strong className="text-amber-400">{product.rating}</strong>
              </h2>
              <button onClick={() => addToCart(product)} className="mt-4 w-full bg-teal-700 hover:bg-teal-600 text-stone-100 py-2 px-4 rounded transition cursor-pointer">
                Add to Cart
              </button>
            </div>
          </SwiperSlide>
        ))}
        {/* ))} */}
        {/* </div> */}
      </Swiper>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} onClick={() => setPage(page)} className={`cursor-pointer px-3 py-1 rounded ${page === currentPage ? "bg-teal-700 text-stone-100" : "bg-stone-200"}`}></button>
        ))}
        {/* {visibleCount < filteredProducts.length && (
          <div ref={loadMoreRef} className="text-center py-6 text-teal-800">
            Memmuat Produk...
          </div>
        )} */}
      </div>
    </div>
  );
}
