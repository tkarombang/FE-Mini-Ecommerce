"use client";
import Image from "next/image";
// import { Product } from "@/data/products";
import { ProductsApi } from "@/types/products";
import React, { useMemo } from "react";
import { useCartStore } from "@/store/cartStore";

type ProductCardProps = {
  product: ProductsApi;
  onAdd: (product: ProductsApi) => void;
};

const ProductCard = React.memo(({ product, onAdd }: ProductCardProps) => {
  const { items } = useCartStore();
  const isItemsProductInCart = useMemo(() => items.some((item) => item.id === product.id), [items, product.id]);
  return (
    <div className=" border-teal-600 border rounded-lg p-4 shadow-lg hover:shadow-lg transition">
      <div className="flex gap-3 sm:flex-col md:flex-row">
        <Image src={product.image} alt={product.nama} width={200} height={200} className="object-cover rounded-mb mb-4" priority />
        <div className="flex flex-col">
          <p className="text-teal-600">{product.deskripsi}</p>
          <p className="text-stone-700 font-light">
            <strong>Kategori: </strong>
            {product.kategori}
          </p>
          <p className="text-stone-300">Rp{product.price.toLocaleString("id-ID")}</p>
          <h4 className="text-teal-700">
            <strong>Stok: </strong>
            {product.stok}
          </h4>
        </div>
      </div>
      <h3 className="text-lg font-semibold flex justify-between">
        {product.nama} |<strong className="text-amber-400">{product.rating}</strong>
      </h3>
      <button
        disabled={isItemsProductInCart}
        onClick={() => onAdd(product)}
        className={`mt-4 w-full text-stone-100 py-2 px-4 rounded transition 
        ${isItemsProductInCart ? "cursor-not-allowed bg-stone-300" : "cursor-pointer bg-teal-700 hover:bg-teal-600"}`}
      >
        {isItemsProductInCart ? "● ● ●" : "Add To Cart"}
      </button>
    </div>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
