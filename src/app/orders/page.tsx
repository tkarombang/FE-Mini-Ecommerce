"use client";

import DeleteModal from "@/components/modals/OrdereDelete";
import { deleteOrder, getOrders, getTotalRevenueEndpoint, updateOrder } from "@/service/orderService";
import { Order } from "@/types/orders";
import { useEffect, useState } from "react";
// import Image from "next/image";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Order> | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchTotalRevenue();
  }, []);

  const fetchOrders = async () => {
    const data: Order[] = await getOrders();
    setOrders(data);
  };

  const fetchTotalRevenue = async (): Promise<void> => {
    const data: number = await getTotalRevenueEndpoint();
    setTotalRevenue(data);
  };

  const handleDelete = async () => {
    try {
      if (showDeleteModal !== null) {
        await deleteOrder(showDeleteModal);
        setShowDeleteModal(null);
        fetchOrders();
        fetchTotalRevenue();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Kamu Gagal Menghapus Order", err.message);
      } else {
        console.error("Kamu Gagal Menghapus Order", err);
      }
      return null;
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrderId(order.id);
    setFormData(order);
  };

  const handleUpdate = async () => {
    if (formData && formData.id) {
      const updatedOrderData = {
        customer_name: formData.customer_name ?? "",
        customer_email: formData.customer_email ?? "",
        items:
          formData.items?.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: 0,
          })) || [],
      };

      await updateOrder(formData.id, updatedOrderData);
      setEditingOrderId(null);
      setFormData(null);
      fetchOrders();
      fetchTotalRevenue();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, itemId?: number): void => {
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

  const handleCancelDelete = () => {
    setShowDeleteModal(null);
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
              <div>
                <div className="flex flex-col gap-2">
                  <input type="text" name="customer_name" value={formData.customer_name || ""} onChange={handleChange} placeholder="Nama Pelanggan" className="border p-2 rounded" />
                  <input type="email" name="customer_email" value={formData.customer_email || ""} onChange={handleChange} placeholder="Email Pelanggan" className="border p-2 rounded" />
                  <button onClick={handleUpdate} className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded mt-2 cursor-pointer">
                    Update
                  </button>
                  <button onClick={() => setEditingOrderId(null)} className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded mt-2 cursor-pointer">
                    Cancel
                  </button>
                </div>

                {formData.items?.map((item) => (
                  <div key={item.product_id} className="flex justify-between items-center border-b p-2">
                    <p className="font-semibold">{item.product.nama}</p>
                    <div className="flex gap-2 items-center">
                      <p className="font-semibold">Jumlah Barang:</p>
                      <input type="number" value={item.quantity || 0} onChange={(e) => handleChange(e, item.product_id)} min="1" className="w-16 border p-1 rounded text-center" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="font-semibold">{new Date(order.created_at).toLocaleString()}</p>
                <p className="font-semibold">{order.customer_name}</p>
                <p className="font-semibold">{order.customer_email}</p>
                {order.items.map((item) => (
                  <div key={item.product_id} className="flex justify-between items-center border-b pb-2">
                    <p>{item.product.nama}</p>
                    <p className="text-sm text-stone-500">Jumlah Barang: {item.quantity}</p>
                  </div>
                ))}
                <p className="font-bold pt-2 border-t">Total: Rp{order.total_price.toLocaleString("id-ID")}</p>
                {/* <div>
                  <button onClick={() => handleDelete(order.id)} className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded mt-2 cursor-pointer">
                    Cancel
                  </button>
                </div> */}
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(order)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded mt-2 cursor-pointer">
                    Edit
                  </button>
                  <button onClick={() => setShowDeleteModal(order.id)} className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded mt-2 cursor-pointer">
                    Hapus
                  </button>
                </div>
                <div>
                  <button onClick={() => alert("Fitur Coming Soon")} className="w-full h-12 transition bg-teal-700 hover:bg-emerald-600 text-stone-100 px-4 py-1 rounded mt-2 cursor-pointer">
                    FINISH CHECKOUT ● ● ●
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}

      {showDeleteModal !== null && <DeleteModal orderId={showDeleteModal} onDelete={handleDelete} onCancel={handleCancelDelete} />}
    </div>
  );
}
