"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/services/productService";

export default function CollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-shell">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="badge-gold mb-4">Our Designs</p>
          <h1 className="page-title">Collections</h1>
          <p className="page-subtitle mb-0 mx-auto max-w-xl">
            Explore every design in our catalogue. Sign in to view details and
            add to cart.
          </p>
          <div className="divider-gold max-w-xs mx-auto mt-10" />
        </motion.div>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <p className="text-sm tracking-wide">Loading designs…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="card-glass p-12 text-center text-white/40">
            No designs available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
