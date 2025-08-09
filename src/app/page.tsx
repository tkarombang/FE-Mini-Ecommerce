"use client";

// import { products } from "@/data/products";
import { useCartStore, useProductStore } from "@/store/cartStore";
import Image from "next/image";

export default function ProductListPage() {
  const { filteredProducts, category, priceSort, currentPage, itemsPerPage, setCategory, setPriceSort, setPage } = useProductStore();

  const addToCart = useCartStore((state) => state.addToCart);
  // const item = useCartStore((state) => state.items);
  // console.log(item);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div>
      <h1 className="text-3xl font-bold">Daftar Produk</h1>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="border-teal-600 border rounded-lg- p-4 shadow-lg hover:shadow-lg transition">
            <Image src={product.image} alt={product.nama} width={400} height={400} className="object-cover rounded-mb mb-4" />
            <h2 className="text-lg font-semibold">{product.nama}</h2>
            <p className="text-stone-300">Rp{product.price.toLocaleString("id-ID")}</p>
            <p className="text-stone-700 flex justify-between">
              <strong>
                Kategori: <span className="text-sm font-light">{product.kategori}</span>
              </strong>
              <strong>{product.rating}</strong>
            </p>
            <h3 className="text-emerald-700">
              <strong>Stok: </strong>
              {product.stok}
            </h3>
            <button onClick={() => addToCart(product)} className="mt-4 w-full bg-teal-700 hover:bg-teal-600 text-stone-100 py-2 px-4 rounded transition cursor-pointer">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} onClick={() => setPage(page)} className={`cursor-pointer px-3 py-1 rounded ${page === currentPage ? "bg-teal-700 text-stone-100" : "bg-stone-200"}`}></button>
        ))}
      </div>
    </div>
  );
}
