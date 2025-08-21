"use client";

// import { createOrder } from "@/service/orderService";
import { useCartStore } from "@/store/cartStore";
// import { CreateOrderDTO, Order } from "@/types/orders";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items) as CartItem[];
  const clearCart = useCartStore((state) => state.clearCart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-teal-700">Halaman Cart</h1>

      {items.length === 0 ? (
        <p className="text-amber-500 text-center font-bold text-5xl">Silahkan Berbelanja</p>
      ) : (
        <div className="space-y-4 flex flex-col ">
          <div className="container space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center border-b-2 border-b-teal-600 border-r-teal-600 border-r-2 p-4 rounded-lg shadow-sm">
                <Image src={item.image} alt={item.nama} width={60} height={60} className="object-cover rounded-mb mb-4" priority />

                <div className="ml-4 flex-1">
                  <h2 className="font-semibold">{item.nama}</h2>
                  <p className="text-sm text-stone-500">Rp{item.price.toLocaleString("id-ID")}</p>
                </div>

                <div className="flex items-center space-x-1 relative">
                  <button onClick={() => decreaseQty(item.id)} className="px-3 py-1 bg-stone-200 hover:bg-stone-400 text-lime-700 cursor-pointer rounded transition">
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => addToCart(item)} className="px-3 py-1 bg-stone-200 hover:bg-stone-400 text-lime-700 cursor-pointer rounded transition">
                    +
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-4 bg-teal-600 hover:bg-teal-800 absolute -top-12 -right-6 text-stone-50 text-xs px-3 py-2 rounded-full transition">
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Total: Rp{totalPrice.toLocaleString("id-ID")}</h2>

            <div>
              <button onClick={clearCart} className="ml-4 bg-rose-600 hover:bg-rose-700 py-2 px-4 text-stone-100 cursor-pointer rounded transition">
                Clear
              </button>
              <button onClick={() => router.push("/checkoutForm")} className="ml-4 bg-teal-600 hover:bg-teal-800 py-2 px-4 text-stone-100 cursor-pointer rounded transition">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
