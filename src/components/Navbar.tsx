"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-stone-100 border-b border-stone-400 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-stone-800">
          mini-e-commerce
        </Link>
      </div>
    </nav>
  );
}
