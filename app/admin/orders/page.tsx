"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";
import { getCustomers } from "@/services/authService";
import ProductImage from "@/components/ProductImage";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Stitching: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Ready: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Delivered: "bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30",
};

function getCustomerLabel(
  order: any,
  customerMap: Record<string, { name: string; email: string; phoneNumber: string }>
) {
  if (order.customerName?.trim()) {
    return {
      name: order.customerName,
      email: order.customerEmail || "",
      phone: order.customerPhone || "",
    };
  }

  const c = customerMap[order.userId];
  if (c) {
    return {
      name: c.name,
      email: c.email,
      phone: c.phoneNumber || "",
    };
  }

  return {
    name: "Unknown customer",
    email: order.userId ? `ID: ${order.userId.slice(0, 8)}…` : "",
    phone: "",
  };
}

function OrderCard({
  order,
  customerMap,
  onStatusUpdate,
}: {
  order: any;
  customerMap: Record<string, { name: string; email: string; phoneNumber: string }>;
  onStatusUpdate: (orderId: string, status: string) => void;
}) {
  const customer = getCustomerLabel(order, customerMap);

  return (
    <div className="card-glass p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-white/[0.08]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-semibold uppercase shrink-0">
            {customer.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/35 mb-1">
              Customer
            </p>
            <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-white">
              {customer.name}
            </h3>
            {customer.email && (
              <p className="text-white/45 text-sm mt-1">{customer.email}</p>
            )}
            {customer.phone && (
              <p className="text-[#C9A84C]/80 text-sm mt-0.5">{customer.phone}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium border ${
              statusStyles[order.status] ??
              "bg-white/10 text-white/70 border-white/20"
            }`}
          >
            {order.status}
          </span>

          <select
            className="select-field w-auto min-w-[180px] py-2.5 text-sm"
            value={order.status}
            onChange={(e) => onStatusUpdate(order.id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Stitching">Stitching</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 mb-6 text-sm">
        <p className="text-white/50">
          <span className="text-white/30 uppercase tracking-wider text-xs mr-2 block mb-1">
            Order total
          </span>
          <strong className="text-[#C9A84C] text-lg">₹ {order.totalPrice}</strong>
        </p>
        <p className="text-white/50 flex-1 min-w-[200px]">
          <span className="text-white/30 uppercase tracking-wider text-xs mr-2 block mb-1">
            Delivery address
          </span>
          {order.address}
        </p>
      </div>

      <div className="divider-gold mb-6" />

      <p className="text-xs uppercase tracking-[0.2em] text-white/35 mb-3">
        Items ordered
      </p>
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
            <div className="flex-1">
              <h3 className="font-medium text-white">{item.name}</h3>
              <p className="text-[#C9A84C] text-sm">₹ {item.price}</p>
            </div>
            <p className="text-white/40 text-sm">Qty {item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customerMap, setCustomerMap] = useState<
    Record<string, { name: string; email: string; phoneNumber: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [showDelivered, setShowDelivered] = useState(false);

  const { activeOrders, deliveredOrders } = useMemo(() => {
    const active = orders.filter((o) => o.status !== "Delivered");
    const delivered = orders.filter((o) => o.status === "Delivered");
    return { activeOrders: active, deliveredOrders: delivered };
  }, [orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [orderData, customers] = await Promise.all([
        getAllOrders(),
        getCustomers(),
      ]);

      const map: Record<
        string,
        { name: string; email: string; phoneNumber: string }
      > = {};
      customers.forEach((c) => {
        map[c.uid] = {
          name: c.name,
          email: c.email || "",
          phoneNumber: c.phoneNumber || "",
        };
      });

      setCustomerMap(map);

      const toMs = (d: any) => {
        if (!d) return 0;
        if (typeof d.toDate === "function") return d.toDate().getTime();
        if (d.seconds) return d.seconds * 1000;
        return new Date(d).getTime();
      };

      setOrders(
        orderData.sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt))
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      if (status === "Delivered") {
        toast.success("Order marked delivered — moved to history");
      } else {
        toast.success("Status updated");
      }
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
        <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
          <div>
            <p className="badge-gold mb-4">Fulfillment</p>
            <h1 className="page-title">Admin Orders</h1>
            <p className="page-subtitle mb-0">
              Active orders only — delivered orders are hidden from this list
            </p>
          </div>
          {deliveredOrders.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDelivered(!showDelivered)}
              className="btn-secondary text-sm"
            >
              {showDelivered
                ? "Hide delivered"
                : `View delivered (${deliveredOrders.length})`}
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-screen mt-10">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <p className="text-white/40 text-sm mt-6 mb-4">
              <span className="text-[#C9A84C] font-semibold">
                {activeOrders.length}
              </span>{" "}
              active order{activeOrders.length !== 1 ? "s" : ""}
            </p>

            {activeOrders.length === 0 ? (
              <div className="card-glass p-12 text-center text-white/40">
                No active orders — all caught up.
              </div>
            ) : (
              <div className="space-y-6">
                {activeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    customerMap={customerMap}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}

            {showDelivered && deliveredOrders.length > 0 && (
              <div className="mt-14">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-white/70">
                    Delivered — History
                  </h2>
                  <div className="flex-1 divider-gold" />
                </div>
                <div className="space-y-6 opacity-90">
                  {deliveredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      customerMap={customerMap}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
                <p className="text-white/30 text-xs mt-6 text-center">
                  Change status back to Pending, Stitching, or Ready to move an
                  order back to the active list.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
