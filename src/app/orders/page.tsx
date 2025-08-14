"use client";

import { deleteOrder, getOrders } from "@/service/orderService";
import { Order } from "@/types/order";
import { useEffect, useState } from "react";
// import Image from "next/image";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleDelete = async (orderId: number) => {
    if (window.confirm("Yakin Ingin Menghapusnya..?")) await deleteOrder(orderId);
    fetchOrders();
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-teal-800">Daftar Pesanan</h1>

      {orders.length === 0 ? (
        <p className="text-amber-500 text-center font-bold text-5xl">Belum Melakukan Pemesanan</p>
      ) : (
        orders.map((order, index) => (
          <div key={order.id} className="mb-6 border rounded-lg shadow p-4 space-y-2">
            <h2 className="font-semibold">Pesanan #{index + 1}</h2>
            <p className="font-semibold">{new Date(order.created_at).toLocaleString()}</p>
            {order.items.map((item) => (
              <div key={item.product_id} className="flex justify-between items-center border-b pb-2">
                {/* <Image src={item.product.image} alt={item.product.nama} width={60} height={60} className="object-cover rounded-mb mb-4" priority /> */}
                <p>{item.product.nama}</p>
                <p className="text-sm text-stone-500">
                  Qty: {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
            <p className="font-bold pt-2 border-t">Total: Rp{order.total_price.toLocaleString("id-ID")}</p>
            <div>
              <button onClick={() => handleDelete(order.id)} className="bg-red-500 hover:bg-rose-600 text-white px-2 py-1 rounded mt-2 cursor-pointer">
                Hapus
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
