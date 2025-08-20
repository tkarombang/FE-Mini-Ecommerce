"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isMmounted, setIsMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <nav className="bg-teal-700 border-b border-stone-400 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-arrow items-center">
        <Link href="/" className="text-xl font-bold text-stone-300 uppercase p-3 sm:text-sm">
          mini-e-commerce
        </Link>

        <div className="flex items-center space-x-6 ">
          <Link href="/" className="sm:text-sm sm:font-light text-stone-50 hover:text-stone-400">
            Products
          </Link>
          <Link href="/admin/dashboard" className="sm:text-sm sm:font-light text-stone-50 hover:text-stone-400">
            Dashboard
          </Link>
          <Link href="/orders" className="sm:text-sm sm:font-light text-stone-50 hover:text-stone-400">
            List Order
          </Link>
          <Link href="/cart" className="sm:text-sm sm:font-light text-stone-50 hover:text-stone-400 relative">
            Cart
            {isMmounted && totalItems > 0 && <span className="absolute -top-2 -right-3 bg-rose-600 text-stone-50 text-xs px-2 py-0.5 rounded-full">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
