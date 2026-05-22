"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import ProductImage from "@/components/ProductImage";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  return (
    <RequireAuth>
    <div className="page-shell">
      <div className="page-container">
        <p className="badge-gold mb-4">Your Bag</p>
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">
          Review your selections before checkout
        </p>

        {cartItems.length === 0 ? (
          <div className="card-glass p-12 md:p-16 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 text-2xl text-white/30">
              —
            </div>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-white/40 text-sm mb-8">
              Discover our collection and add something you love.
            </p>
            <Link href="/collections" className="btn-primary">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="card-glass p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-5">
                    <div className="relative shrink-0 overflow-hidden rounded-xl w-28 h-28 border border-white/10">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="font-[family-name:var(--font-cormorant)] text-xl text-white">
                        {item.name}
                      </h2>
                      <p className="text-[#C9A84C] font-semibold mt-1">
                        ₹ {item.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-[#C9A84C] hover:bg-white/[0.06] rounded-lg transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-[#C9A84C] hover:bg-white/[0.06] rounded-lg transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn-danger text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-glass p-8 h-fit sticky top-32">
              <h2 className="text-xs uppercase tracking-[0.25em] text-white/40 mb-6">
                Order Summary
              </h2>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-white/50">Subtotal</span>
                <span className="text-white/80">
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="divider-gold my-6" />
              <div className="flex justify-between items-baseline mb-8">
                <span className="text-white/50">Total</span>
                <span className="font-[family-name:var(--font-cormorant)] text-3xl text-[#C9A84C] font-semibold">
                  ₹ {totalPrice}
                </span>
              </div>
              <Link href="/checkout" className="btn-primary w-full text-center block">
                Proceed To Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
    </RequireAuth>
  );
}
