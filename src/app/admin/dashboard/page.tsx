"use client";

import { getOrders, getTotalRevenueEndpoint } from "@/service/orderService";
import { Order } from "@/types/orders";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";

// Antarmuka untuk data grafik pendapatan bulanan
interface MonthlyData {
  name: string;
  pendapatan: number;
}

// Antarmuka untuk data grafik produk per kategori
interface CategoryData {
  name: string;
  jumlah: number;
}

// Antarmuka untuk data grafik tren penjualan harian
interface DailyData {
  name: string;
  pendapatan: number;
}

// Antarmuka untuk rincian pesanan per pelanggan
interface CustomerOrderDetails {
  customer_name: string;
  totalProductsOrdered: number;
}

// Komponen utama untuk halaman dashboard
export default function DashboardPage() {
  // State untuk menyimpan data-data metrik dan grafik
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalProductsSold, setTotalProductsSold] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyData[]>([]);
  const [productsByCategoryData, setProductsByCategoryData] = useState<CategoryData[]>([]);
  const [dailyRevenueData, setDailyRevenueData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State baru untuk fitur pencarian dan tabel interaktif
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedCustomerNama, setSelectedCustomerNama] = useState<string>("");
  const [customerOrderDetails, setCustomerOrderDetails] = useState<CustomerOrderDetails | null>(null);
  const [isCustomerDataLoading, setIsCustomerDataLoading] = useState<boolean>(false);
  const [customerDataError, setCustomerDataError] = useState<string | null>(null);

  // Fungsi untuk mengambil semua data yang dibutuhkan
  const fetchDashboardData = async () => {
    try {
      setLoading(true); // Mulai loading
      // Ambil data dari API
      const ordersData = await getOrders();
      const revenueData = await getTotalRevenueEndpoint();

      // Hitung total pesanan
      const totalOrdersCount = ordersData.length;

      // Hitung total produk terjual
      const totalProductsCount = ordersData.reduce((total, order) => {
        const orderItemsCount = order.items.reduce((itemTotal, item) => {
          return itemTotal + item.quantity;
        }, 0);
        return total + orderItemsCount;
      }, 0);

      // Hitung pendapatan per bulan untuk grafik pertama
      const revenueByMonth: { [key: string]: number } = {};
      ordersData.forEach((order) => {
        const date = new Date(order.created_at);
        const month = date.toLocaleString("default", { month: "short", year: "numeric" });
        if (!revenueByMonth[month]) {
          revenueByMonth[month] = 0;
        }
        revenueByMonth[month] += order.total_price;
      });
      const formattedMonthlyData = Object.keys(revenueByMonth).map((key) => ({
        name: key,
        pendapatan: revenueByMonth[key],
      }));

      // Hitung jumlah produk terjual per kategori untuk grafik kedua
      const productsByCategory: { [key: string]: number } = {};
      ordersData.forEach((order) => {
        order.items.forEach((item) => {
          const category = item.product.kategori;
          if (!productsByCategory[category]) {
            productsByCategory[category] = 0;
          }
          productsByCategory[category] += item.quantity;
        });
      });
      const formattedCategoryData = Object.keys(productsByCategory).map((key) => ({
        name: key,
        jumlah: productsByCategory[key],
      }));

      // Hitung pendapatan per hari untuk grafik ketiga (LineChart)
      const revenueByDay: { [key: string]: number } = {};
      ordersData.forEach((order) => {
        const date = new Date(order.created_at);
        const day = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        if (!revenueByDay[day]) {
          revenueByDay[day] = 0;
        }
        revenueByDay[day] += order.total_price;
      });
      const formattedDailyData = Object.keys(revenueByDay)
        .sort()
        .map((key) => ({
          name: key,
          pendapatan: revenueByDay[key],
        }));

      // Perbarui state dengan data yang sudah dihitung
      setTotalOrders(totalOrdersCount);
      setTotalProductsSold(totalProductsCount);
      setTotalRevenue(revenueData);
      setMonthlyRevenueData(formattedMonthlyData);
      setProductsByCategoryData(formattedCategoryData);
      setDailyRevenueData(formattedDailyData);
      setAllOrders(ordersData); // Simpan semua data pesanan untuk tabel interaktif
      setFilteredOrders(ordersData); // Atur data filter awal sama dengan semua pesanan

      setLoading(false); // Selesai loading
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
      setError("Gagal memuat data dashboard. Silakan coba lagi.");
      setLoading(false); // Selesai loading dengan error
    }
  };

  // Fungsi untuk mencari pesanan per pelanggan
  const fetchCustomerOrders = () => {
    setIsCustomerDataLoading(true);
    setCustomerDataError(null);
    setCustomerOrderDetails(null);

    // Filter pesanan berdasarkan ID pelanggan yang dimasukkan
    const customerOrders = allOrders.filter((order) => order.customer_name?.toString().toLowerCase() === selectedCustomerNama.toLowerCase());

    if (customerOrders.length > 0) {
      // Hitung total produk dari pesanan pelanggan yang ditemukan
      const totalProducts = customerOrders.reduce((total, order) => {
        return total + order.items.length;
      }, 0);
      setCustomerOrderDetails({
        customer_name: selectedCustomerNama,
        totalProductsOrdered: totalProducts,
      });
    } else {
      setCustomerDataError("Tidak ada pesanan yang ditemukan untuk ID pelanggan ini.");
    }
    setIsCustomerDataLoading(false);
  };

  // Efek untuk memanggil fungsi pengambilan data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Efek untuk memfilter tabel pesanan saat query pencarian berubah
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = allOrders.filter((order) => order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(allOrders);
    }
  }, [searchQuery, allOrders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-teal-800 animate-pulse">Memuat data dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-teal-900 mb-10 tracking-wide">Dashboard Administrasi Toko</h1>

        {/* Ringkasan Metrik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Kartu Total Pesanan */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Pesanan</h2>
            <p className="text-5xl md:text-6xl font-bold text-teal-600 leading-tight">{totalOrders}</p>
          </div>

          {/* Kartu Jumlah Produk Terjual */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">Produk Terjual</h2>
            <p className="text-5xl md:text-6xl font-bold text-emerald-600 leading-tight">{totalProductsSold}</p>
          </div>

          {/* Kartu Total Pendapatan */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Pendapatan</h2>
            <p className="text-4xl md:text-5xl font-bold text-amber-600 leading-tight">Rp{totalRevenue.toLocaleString("id-ID")}</p>
          </div>
        </div>

        {/* Bagian Grafik */}
        <div className="space-y-8 lg:space-y-12">
          {/* Grafik Pendapatan Bulanan */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">Pendapatan Bulanan</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={monthlyRevenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis tickFormatter={(value) => `Rp${value.toLocaleString("id-ID")}`} stroke="#888" />
                <Tooltip formatter={(value) => [`Rp${(value as number).toLocaleString("id-ID")}`, "Pendapatan"]} />
                <Bar dataKey="pendapatan" fill="#14B8A6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grafik Produk Terjual per Kategori */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">Produk Terjual per Kategori</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={productsByCategoryData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#38B2AC" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grafik Tren Penjualan Harian */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">Tren Penjualan Harian</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={dailyRevenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis tickFormatter={(value) => `Rp${value.toLocaleString("id-ID")}`} stroke="#888" />
                <Tooltip formatter={(value) => [`Rp${(value as number).toLocaleString("id-ID")}`, "Pendapatan"]} />
                <Line type="monotone" dataKey="pendapatan" stroke="#065F46" strokeWidth={3} dot={{ stroke: "#065F46", strokeWidth: 2, r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bagian Pencarian Pelanggan */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">Cari Data Pelanggan</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Masukkan Nama Pelanggan"
              value={selectedCustomerNama}
              onChange={(e) => setSelectedCustomerNama(e.target.value)}
              className="w-full md:w-auto flex-grow p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
            <button onClick={fetchCustomerOrders} disabled={isCustomerDataLoading} className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl shadow-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400">
              {isCustomerDataLoading ? "Mencari..." : "Cari Pesanan"}
            </button>
          </div>
          {customerOrderDetails && (
            <div className="bg-teal-50 p-4 rounded-xl text-teal-800 font-medium text-center shadow">
              <p>
                ID Pelanggan: <strong>{customerOrderDetails.customer_name}</strong>
              </p>
              <p>
                Total Produk Dipesan: <strong>{customerOrderDetails.totalProductsOrdered}</strong>
              </p>
            </div>
          )}
          {customerDataError && (
            <div className="bg-red-50 p-4 rounded-xl text-red-800 font-medium text-center shadow">
              <p>{customerDataError}</p>
            </div>
          )}
        </div>

        {/* Bagian Tabel Pesanan Interaktif */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8 overflow-x-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">Semua Pesanan</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari berdasarkan ID Pesanan atau ID Produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>
          <div className="min-w-full">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">ID Pesanan</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Nama Pelanggan</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Tanggal</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Produk</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-800">{order.id}</td>
                      <td className="py-4 px-6 text-sm text-gray-800">{order.customer_name}</td>
                      <td className="py-4 px-6 text-sm text-gray-800">
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">{order.customer_email}</td>

                      <td className="py-4 px-6 text-sm text-gray-800">
                        <ol className="flex flex-col">
                          {order.items.map((nprd, index) => (
                            <li key={index} className="text-gray-800">
                              {nprd.product.nama}
                            </li>
                          ))}
                        </ol>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">Rp{order.total_price.toLocaleString("id-ID")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500 italic">
                      Tidak ada pesanan yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
