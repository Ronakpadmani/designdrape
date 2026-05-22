"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { cartItems } = useCart();
  const { user, userData } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const linkClass =
    "relative text-white/55 text-sm tracking-widest uppercase font-normal hover:text-[#C9A84C] transition-colors duration-300 group";

  const NavLink = ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <Link href={href} className={linkClass} onClick={onClick}>
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#C9A84C]/15"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full border border-[#C9A84C]/40 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C] text-[11px] font-bold tracking-wider">
              DD
            </div>
            <span className="text-white font-light tracking-[0.18em] text-base md:text-lg uppercase">
              Design<span className="text-[#C9A84C] font-semibold">Drape</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/collections">Collections</NavLink>

            {user && userData?.role === "customer" && (
              <NavLink href="/orders">Orders</NavLink>
            )}

            {user && userData?.role === "admin" && (
              <>
                <NavLink href="/admin/customers">Customers</NavLink>
                <NavLink href="/admin/products">Products</NavLink>
                <NavLink href="/admin/orders">Orders</NavLink>
                <NavLink href="/admin/measurements">Measurements</NavLink>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {user && userData?.role === "customer" && (
            <Link href="/cart" className="relative group">
              <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 transition-all duration-300">
                <FaShoppingBag
                  size={15}
                  className="text-white/55 group-hover:text-[#C9A84C] transition-colors duration-300"
                />
              </div>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#C9A84C] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          {!user && (
            <>
              <Link
                href="/login"
                className="hidden sm:block text-white/55 text-sm tracking-widest uppercase hover:text-[#C9A84C] transition-colors px-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden sm:block bg-[#C9A84C] text-black text-sm font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-[#dbbe60] hover:shadow-[0_0_24px_rgba(201,168,76,0.35)] transition-all duration-300"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="hidden sm:block text-white/50 text-sm tracking-widest uppercase border border-white/10 px-5 py-2.5 rounded-full hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
            >
              Logout
            </button>
          )}

          <button
            type="button"
            className="lg:hidden w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/[0.06] bg-[#0a0a0a]/95 overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              <NavLink href="/" onClick={() => setMobileOpen(false)}>
                Home
              </NavLink>
              <NavLink href="/collections" onClick={() => setMobileOpen(false)}>
                Collections
              </NavLink>

              {user && userData?.role === "customer" && (
                <NavLink href="/orders" onClick={() => setMobileOpen(false)}>
                  Orders
                </NavLink>
              )}

              {user && userData?.role === "admin" && (
                <>
                  <NavLink
                    href="/admin/customers"
                    onClick={() => setMobileOpen(false)}
                  >
                    Customers
                  </NavLink>
                  <NavLink
                    href="/admin/products"
                    onClick={() => setMobileOpen(false)}
                  >
                    Products
                  </NavLink>
                  <NavLink
                    href="/admin/orders"
                    onClick={() => setMobileOpen(false)}
                  >
                    Orders
                  </NavLink>
                  <NavLink
                    href="/admin/measurements"
                    onClick={() => setMobileOpen(false)}
                  >
                    Measurements
                  </NavLink>
                </>
              )}

              {!user && (
                <div className="flex flex-col gap-3 pt-2 border-t border-white/[0.06]">
                  <Link
                    href="/login"
                    className="text-white/55 text-sm tracking-widest uppercase"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary text-center text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}

              {user && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="btn-danger w-full text-sm mt-2"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
