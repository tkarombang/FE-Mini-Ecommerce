export type Product = {
  id: number;
  nama: string;
  price: number;
  deskripsi: string;
  kategori: string;
  stok: number;
  rating: number;
  image: string;
};

export const products: Product[] = [
  {
    id: 4,
    nama: "Laptop ASUS ROG",
    price: 15000000,
    deskripsi: "Laptop gaming dengan performa tinggi",
    kategori: "Elektronik",
    stok: 10,
    rating: 4.5,
    image: "/assets/laptop-asus-rog.jpg",
  },
  {
    id: 5,
    nama: "Smartphone Samsung Galaxy",
    price: 8000000,
    deskripsi: "Smartphone dengan kamera terbaik",
    kategori: "Elektronik",
    stok: 20,
    rating: 4.7,
    image: "/assets/samsung-galaxy.jpg",
  },
  {
    id: 6,
    nama: "Kamera Canon EOS",
    price: 12000000,
    deskripsi: "Kamera DSLR untuk fotografi profesional",
    kategori: "Elektronik",
    stok: 5,
    rating: 4.6,
    image: "/assets/camera-canon.jpg",
  },
  {
    id: 7,
    nama: "RK Tactichal Keyboard",
    price: 12000000,
    deskripsi: "Keyboard mekanikal dengan pencahayaan RGB yang halus dan responsif.",
    kategori: "Aksesoris Komputer",
    stok: 5,
    rating: 4.6,
    image: "/assets/keyboard.jpg",
  },
  {
    id: 8,
    nama: "Headphone Sony WH-1000XM4",
    price: 4500000,
    deskripsi: "Headphone peredam bising terbaik untuk pengalaman audio premium.",
    kategori: "Aksesoris Komputer",
    stok: 25,
    rating: 4.9,
    image: "/assets/headphone-sony.jpg",
  },
  {
    id: 9,
    nama: "Smartwatch Apple Watch",
    price: 7500000,
    deskripsi: "Smartwatch multifungsi dengan fitur kesehatan dan notifikasi.",
    kategori: "Perangkat Wearable",
    stok: 30,
    rating: 4.7,
    image: "/assets/smartwatch.jpg",
  },
  {
    id: 10,
    nama: "Fitbit Charge",
    price: 2500000,
    deskripsi: "Pelacak kebugaran dengan GPS terintegrasi dan monitor detak jantung.",
    kategori: "Perangkat Wearable",
    stok: 50,
    rating: 4.4,
    image: "/assets/fitbit.jpg",
  },
  {
    id: 11,
    nama: "Xiaomi Smart Band",
    price: 600000,
    deskripsi: "Smart band dengan layar AMOLED yang cerah dan masa pakai baterai lama.",
    kategori: "Perangkat Wearable",
    stok: 100,
    rating: 4.6,
    image: "/assets/xiaomi-band.jpg",
  },
];
