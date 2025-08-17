"use client";

import { deleteOrder, getOrders, getTotalRevenueEndpoint } from "@/service/orderService";
import { Order } from "@/types/orders";
import { useEffect, useState } from "react";
// import Image from "next/image";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Order> | null>(null);

  const fetchTotalRevenue = async () => {
    const data = await getTotalRevenueEndpoint();
    setTotalRevenue(data);
  };

  useEffect(() => {
    fetchOrders();
    fetchTotalRevenue();
  }, [setTotalRevenue]);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleDelete = async (orderId: number) => {
    if (window.confirm("Yakin Ingin Menghapusnya..?")) await deleteOrder(orderId);
    fetchOrders();
    fetchTotalRevenue();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, itemId?: number) => {
    const { name, value } = e.target;
    if (itemId !== undefined) {
      setFormData((prev) => {
        if (!prev) return null;
        const updatedItems = prev.items?.map((item) => (item.product_id === itemId ? { ...item, quantity: parseInt(value, 10) } : item));
        return { ...prev, items: updatedItems };
      });
    } else {
      setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };
  return (
    <div>
      <div className="flex flex-row-reverse justify-between">
        <h1 className="text-2xl font-bold mb-6 text-teal-800">Daftar Pesanan</h1>
        <h1 className="text-xl font-bold mb-6 text-teal-800">Orders: Rp{totalRevenue?.toLocaleString("id-ID")}</h1>
      </div>

      {orders.length === 0 ? (
        <p className="text-amber-500 text-center font-bold text-5xl">Belum Melakukan Pemesanan</p>
      ) : (
        orders.map((order, index) => (
          <div key={order.id} className="mb-6 border rounded-lg shadow p-4 space-y-2">
            <h2 className="font-semibold">Pesanan #{index + 1}</h2>

            {editingOrderId === order.id && formData ? (
              <div className="flex flex-col gap-2">
                <input type="text" name="customer_name" value={formData.customer_name || ""} onChange={handleChange} placeholder="Nama Pelanggan" className="border p-2 rounded" />
                <input type="email" name="customer_email" value={formData.customer_email || ""} onChange={handleChange} placeholder="Email Pelanggan" className="border p-2 rounded" />
              </div>
            ) : (
              <>
                <p className="font-semibold">{new Date(order.created_at).toLocaleString()}</p>
                <p className="font-semibold">{order.customer_name}</p>
                <p className="font-semibold">{order.customer_email}</p>
                {order.items.map((item) => (
                  <div key={item.product_id} className="flex justify-between items-center border-b pb-2">
                    {/* <Image src={item.product.image} alt={item.product.nama} width={60} height={60} className="object-cover rounded-mb mb-4" priority /> */}
                    <p>{item.product.nama}</p>
                    <p className="text-sm text-stone-500">Jumlah Barang: {item.quantity}</p>
                  </div>
                ))}
                <p className="font-bold pt-2 border-t">Total: Rp{order.total_price.toLocaleString("id-ID")}</p>
                <div>
                  <button onClick={() => handleDelete(order.id)} className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded mt-2 cursor-pointer">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
      <div>
        <button onClick={() => alert("Coming Soon")} className="w-full h-12 transition bg-teal-700 hover:bg-emerald-600 text-stone-100 px-4 py-1 rounded mt-2 cursor-pointer">
          Process ● ● ●
        </button>
      </div>
    </div>
  );
}
