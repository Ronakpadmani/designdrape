"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/services/orderService";
import RequireAuth from "@/components/RequireAuth";
import ProductImage from "@/components/ProductImage";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Stitching: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Ready: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Delivered: "bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30",
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    if (!user) return;
    const data = await getUserOrders(user.uid);
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <RequireAuth>
    <div className="page-shell">
      <div className="page-container">
        <p className="badge-gold mb-4">Order History</p>
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track your bespoke tailoring orders</p>

        {orders.length === 0 ? (
          <div className="card-glass p-12 text-center text-white/40">
            <p>No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card-glass p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35 mb-1">
                      Order Status
                    </p>
                    <span
                      className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium border ${
                        statusStyles[order.status] ??
                        "bg-white/10 text-white/70 border-white/20"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35 mb-1">
                      Total
                    </p>
                    <p className="font-[family-name:var(--font-cormorant)] text-2xl text-[#C9A84C] font-semibold">
                      ₹ {order.totalPrice}
                    </p>
                  </div>
                </div>

                <p className="text-white/50 text-sm mb-6">
                  <span className="text-white/35 uppercase tracking-wider text-xs mr-2">
                    Address
                  </span>
                  {order.address}
                </p>

                <div className="divider-gold mb-6" />

                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                    >
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">
                          {item.name}
                        </h3>
                        <p className="text-[#C9A84C] text-sm mt-0.5">
                          ₹ {item.price}
                        </p>
                      </div>
                      <p className="text-white/40 text-sm shrink-0">
                        Qty {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </RequireAuth>
  );
}
