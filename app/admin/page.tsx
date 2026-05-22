"use client";

import Link from "next/link";

const adminLinks = [
  { href: "/admin/products", label: "Products", desc: "Manage catalogue" },
  { href: "/admin/orders", label: "Orders", desc: "Track & update orders" },
  { href: "/admin/measurements", label: "Measurements", desc: "Customer fittings" },
];

export default function AdminPage() {
  return (
    <div className="page-shell">
      <div className="page-container">
        <p className="badge-gold mb-4">Administration</p>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Welcome back — manage your atelier</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="card-glass-hover p-8 group block"
            >
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-white group-hover:text-[#C9A84C] transition-colors mb-2">
                {link.label}
              </h2>
              <p className="text-white/40 text-sm">{link.desc}</p>
              <span className="inline-block mt-6 text-xs uppercase tracking-[0.2em] text-white/30 group-hover:text-[#C9A84C] transition-colors">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
