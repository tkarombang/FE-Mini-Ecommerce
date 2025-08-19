"use client";

import { getOrders, getTotalRevenueEndpoint } from "@/service/orderService";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalProductSold, setTotalProductSold] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrders();
      const totalOrdersCount = ordersData.length;
      const revenueData = await getTotalRevenueEndpoint();

      const totalProductsCount = ordersData.reduce((total, order) => {
        const orderItemsCount = order.items.reduce((itemTotal, item) => {
          return itemTotal + item.quantity;
        }, 0);
        return total + orderItemsCount;
      }, 0);

      setTotalOrders(totalOrdersCount);
      setTotalProductSold(totalProductsCount);
      setTotalRevenue(revenueData);
      setLoading(false);
    } catch (err) {
      console.error("Gagal Mengambil data Dashboard:", err);
      setError("Connection Error, Silahkan coba lagi");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-stone-300">
        <p className="text-xl font-semibold text-teal-800 animate-pulse">Memuat ● ● ●</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-stone-300">
        <p className="text-xl font-semibold text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-teal-900 mb-10 tracking-wide">Dashboard Admin Toko</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div className="bg-stone-100 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-base font-semibold text-gray-500 uppercase mb-2">Total Pesanan</h2>
          <p className="text-5xl md:text-6xl font-bold text-teal-600 leading-light">{totalOrders}</p>
        </div>

        <div className="bg-stone-100 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3">Produk Terjual</h2>
          <p className="text-5xl md:text-6xl font-bold text-emerald-600 leading-tight">{totalProductSold}</p>
        </div>

        <div className="bg-stone-100 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2 ">Total Pendapatan</h2>
          <p className="text-4xl md:text-5xl font-bold text-amber-600 leading-tight">Rp{totalRevenue.toLocaleString("id-ID")}</p>
        </div>
      </div>
    </div>
  );
}
