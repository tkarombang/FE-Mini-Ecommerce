"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-stone-700 border-b border-stone-400 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-arrow items-center">
        <Link href="/" className="text-xl font-bold text-stone-300 uppercase p-3">
          mini-e-commerce
        </Link>

        <div className="flex items-center space-x-6 ">
          <Link href="/" className="texxt-stone-700 text-stone-50 hover:text-stone-400">
            Products
          </Link>
          <Link href="/orders" className="texxt-stone-700 text-stone-50 hover:text-stone-400">
            List Order
          </Link>
          <Link href="/checkout" className="texxt-stone-700 text-stone-50 hover:text-stone-400">
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}
