"use client";

import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export default function Home() {
  const addToCart = useCartStore((state) => state.addToCart);
  const item = useCartStore((state) => state.items);
  console.log(item);

  return (
    <div className="bg-amber-400">
      <h1 className="text-3xl font-bold">Wellcome</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg- p-4 shadow-sm hover:shadow-lg transition">
            <Image src={product.image} alt={product.nama} width={400} height={400} className="object-cover rounded-mb mb-4" />
            <h2 className="text-lg font-semibold">{product.nama}</h2>
            <p className="text-stone-200">Rp{product.price.toLocaleString("id-ID")}</p>
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
            <button onClick={() => addToCart(product)} className="mt-4 w-full bg-sky-700 hover:bg-sky-500 text-stone-100 py-2 px-4 rounded transition cursor-pointer">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
