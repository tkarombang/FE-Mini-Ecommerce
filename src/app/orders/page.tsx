"use client";

import { useCartStore } from "@/store/cartStore";

export default function OrderPage() {
  const orders = useCartStore((state) => state.orders);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Daftar Pesanan</h1>

      {orders.length === 0 ? (
        <p className="text-amber-500 text-center font-bold text-5xl">Belum Melakukan Pemesanan</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="mb-6 border rounded-lg shadow p-4 space-y-2">
            <h2 className="font-semibold">Pesanan #{index + 1}</h2>
            {order.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p>{item.nama}</p>
                  <p className="text-sm text-stone-500">
                    Qty: {item.qty} x Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="font-semibold">Rp {(item.qty * item.price).toLocaleString("id-ID")}</p>
              </div>
            ))}
            <p className="font-bold pt-2 border-t">Total: Rp {order.reduce((acc, curr) => acc + curr.price * curr.qty, 0).toLocaleString("id-ID")}</p>
          </div>
        ))
      )}
    </div>
  );
}
