"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { placeOrder } from "@/services/orderService";
import RequireAuth from "@/components/RequireAuth";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { user, userData } = useAuth();
  const [address, setAddress] = useState("");

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please Login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is Empty");
      return;
    }

    try {
      await placeOrder({
        userId: user.uid,
        customerName: userData?.name || user.displayName || "Customer",
        customerEmail: userData?.email || user.email || "",
        customerPhone: userData?.phoneNumber || "",
        items: cartItems,
        address,
        totalPrice,
        status: "Pending",
        createdAt: new Date(),
      });

      toast.success("Order Placed Successfully");
      clearCart();

      router.push("/orders");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <RequireAuth>
    <div className="page-shell">
      <div className="page-container max-w-3xl">
        <p className="badge-gold mb-4">Secure Checkout</p>
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">
          Enter your delivery details to complete your order
        </p>

        <div className="card-glass p-8 md:p-10 space-y-8">
          <div className="flex justify-between items-baseline pb-6 border-b border-white/[0.08]">
            <span className="text-white/50">Order Total</span>
            <span className="font-[family-name:var(--font-cormorant)] text-4xl text-[#C9A84C] font-semibold">
              ₹ {totalPrice}
            </span>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
              Shipping Address
            </label>
            <textarea
              placeholder="Full address including city, state, and pin code"
              className="input-field resize-none"
              rows={5}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button onClick={handlePlaceOrder} className="btn-primary w-full">
            Place Order
          </button>
        </div>
      </div>
    </div>
    </RequireAuth>
  );
}
