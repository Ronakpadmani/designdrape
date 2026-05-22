"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Stitching: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Ready: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Delivered: "bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const data = await getAllOrders();
    setOrders(data);
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Status Updated");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="page-shell">
      <div className="page-container">
        <p className="badge-gold mb-4">Fulfillment</p>
        <h1 className="page-title">Admin Orders</h1>
        <p className="page-subtitle">Manage and update customer order status</p>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card-glass p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <span
                  className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium border ${
                    statusStyles[order.status] ??
                    "bg-white/10 text-white/70 border-white/20"
                  }`}
                >
                  {order.status}
                </span>

                <select
                  className="input-field w-auto min-w-[160px] py-2.5 text-sm cursor-pointer"
                  value={order.status}
                  onChange={(e) =>
                    handleStatusUpdate(order.id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Stitching">Stitching</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-8 mb-6 text-sm">
                <p className="text-white/50">
                  <span className="text-white/30 uppercase tracking-wider text-xs mr-2">
                    Total
                  </span>
                  <strong className="text-[#C9A84C] text-lg">
                    ₹ {order.totalPrice}
                  </strong>
                </p>
                <p className="text-white/50">
                  <span className="text-white/30 uppercase tracking-wider text-xs mr-2">
                    Address
                  </span>
                  {order.address}
                </p>
              </div>

              <div className="divider-gold mb-6" />

              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-white/10"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-[#C9A84C] text-sm">₹ {item.price}</p>
                    </div>
                    <p className="text-white/40 text-sm">Qty {item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
