"use client";

import { createOrder } from "@/service/orderService";
import { useCartStore } from "@/store/cartStore";
import { CreateOrderDTO, Order } from "@/types/orders";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CheckoutFormPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData: CreateOrderDTO = {
        customer_name: customerName,
        customer_email: customerEmail,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
          price: item.price,
        })),
      };

      const kirimOrder: Order = await createOrder(orderData);
      clearCart();
      toast.success(`Berhasil Buat Order-ID: ${kirimOrder.id}`);
      router.push(`/orders`);
    } catch (err) {
      console.error(err);
      toast.error(`Gagal membuat order: ${err instanceof Error ? err.message : "Terjadi kesalahan."}`);
      setIsSubmitting(false);
      // alert("Gagal Membuat Order");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-stone-200 rounded shadodw">
      <h1 className="text-2xl font-bold mb-4 text-teal-700">Input Customers</h1>

      <form onSubmit={handleCheckout} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="mt-1 w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Customer Email</label>
          <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required className="mt-1 w-full border px-3 py-2 rounded" />
        </div>

        <div className="font-bold">Total: Rp{totalPrice.toLocaleString("id-ID")}</div>
        <button
          type="submit"
          // onClick={handleCheckout}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-teal-700 font-bold text-white transition-all duration-300 transform hover:scale-105 hover:bg-teal-600 cursor-pointer"
          disabled={isSubmitting || items.length === 0}
        >
          {isSubmitting ? "Memproses..." : "Bayar Sekarang"}
        </button>
      </form>
    </div>
  );
}
