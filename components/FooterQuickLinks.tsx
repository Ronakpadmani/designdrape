"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthLink from "@/components/AuthLink";

type LinkItem = {
  href: string;
  label: string;
  requireAuth?: boolean;
};

const publicLinks: LinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
];

const customerLinks: LinkItem[] = [
  { href: "/orders", label: "Orders", requireAuth: true },
  { href: "/cart", label: "Cart", requireAuth: true },
  { href: "/dashboard", label: "Dashboard", requireAuth: true },
];

const adminLinks: LinkItem[] = [
  { href: "/admin", label: "Admin Dashboard" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/measurements", label: "Measurements" },
];

export default function FooterQuickLinks() {
  const { user, userData, loading } = useAuth();

  let links: LinkItem[] = [...publicLinks];

  if (loading) {
    return (
      <div className="flex flex-col gap-4 text-gray-500 text-sm">
        {publicLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-yellow-500 transition w-fit"
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  }

  if (user) {
    if (userData?.role === "admin") {
      links = [...publicLinks, ...adminLinks];
    } else {
      links = [...publicLinks, ...customerLinks];
    }
  } else {
    links = [...publicLinks, ...customerLinks];
  }

  return (
    <div className="flex flex-col gap-4 text-gray-400">
      {links.map((link) =>
        link.requireAuth ? (
          <AuthLink
            key={link.href}
            href={link.href}
            className="hover:text-yellow-500 transition w-fit"
          >
            {link.label}
          </AuthLink>
        ) : (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-yellow-500 transition w-fit"
          >
            {link.label}
          </Link>
        )
      )}
    </div>
  );
}
