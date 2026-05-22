type ProductProps = {
  product: any;
};

import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductCard({ product }: ProductProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="card-glass-hover overflow-hidden rounded-2xl">
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute top-4 left-4">
            <span className="badge-gold">New</span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-white mb-2 group-hover:text-[#C9A84C] transition-colors">
            {product.name}
          </h2>

          <p className="text-white/45 text-sm leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-[#C9A84C] text-xl font-semibold tracking-wide">
              ₹ {product.price}
            </p>

            <Link href={`/product/${product.id}`}>
              <span className="text-xs uppercase tracking-[0.2em] text-white/50 group-hover:text-[#C9A84C] transition-colors border-b border-transparent group-hover:border-[#C9A84C]/50 pb-0.5">
                View →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
