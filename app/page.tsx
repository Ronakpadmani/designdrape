"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/services/productService";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="bg-[#050505] min-h-screen text-white overflow-hidden">
      <section className="relative h-screen flex items-center px-8 md:px-24 pt-32">
        <img
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600"
          alt="fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-[#050505]/40" />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute top-40 left-20 w-72 h-72 bg-[#C9A84C]/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#C9A84C]/8 blur-[120px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl"
        >
          <p className="uppercase tracking-[0.35em] text-[#C9A84C] text-xs mb-6">
            Premium Tailoring
          </p>

          <h1 className="font-[family-name:var(--font-cormorant)] text-6xl md:text-8xl font-semibold leading-[1.05] mb-8">
            Fashion
            <br />
            Meets
            <span className="text-[#C9A84C] italic"> Elegance</span>
          </h1>

          <p className="text-lg md:text-xl text-white/55 leading-relaxed mb-10 max-w-2xl">
            Experience luxury custom tailoring with modern fashion aesthetics,
            premium craftsmanship, and perfect fitting.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/collections" className="btn-primary px-10 py-4 text-base">
              Explore Collection
            </Link>
            <Link href="/collections" className="btn-secondary px-10 py-4 text-base">
              View Designs
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#C9A84C]/50 to-transparent" />
        </div>
      </section>

      <section id="trending" className="page-container px-8 py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="badge-gold mb-5">Curated</p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl font-semibold mb-4">
            Trending Collection
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            Crafted for elegance, designed for perfection.
          </p>
          <Link
            href="/collections"
            className="inline-block mt-8 text-sm uppercase tracking-[0.2em] text-[#C9A84C] hover:text-[#dbbe60] transition-colors"
          >
            View all designs →
          </Link>
          <div className="divider-gold max-w-xs mx-auto mt-10" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-white/40">
            <div className="spinner mx-auto mb-4" />
            <p className="tracking-wide">Loading collection…</p>
          </div>
        )}
      </section>
    </main>
  );
}
