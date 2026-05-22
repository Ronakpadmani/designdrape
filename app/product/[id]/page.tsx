"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { getSingleProduct } from "@/services/productService";
import { loginUrl } from "@/lib/authPaths";
import ProductImage from "@/components/ProductImage";

type ProductType = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string;
};

export default function ProductDetailsPage() {
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view products");
      router.replace(loginUrl(`/product/${id}`));
    }
  }, [user, authLoading, id, router]);

  useEffect(() => {
    if (!id || !user) return;

    const fetchProduct = async () => {
      setLoading(true);
      const data = await getSingleProduct(id);
      setProduct(data as ProductType);
      setLoading(false);
    };

    fetchProduct();
  }, [id, user]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login first");
      router.push(loginUrl(`/product/${id}`));
      return;
    }

    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    toast.success("Added To Cart");
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="loading-screen min-h-screen">
        <div className="spinner" />
        <p className="text-sm tracking-wide">Redirecting to login…</p>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="loading-screen min-h-screen">
        <div className="spinner" />
        <p className="text-sm tracking-wide">Loading product…</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] aspect-[3/4] md:aspect-auto md:min-h-[520px]">
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/40 to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col justify-center">
            {product.category && (
              <p className="badge-gold mb-5 w-fit">{product.category}</p>
            )}

            <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-5 leading-tight">
              {product.name}
            </h1>

            <p className="text-white/50 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <p className="font-[family-name:var(--font-cormorant)] text-4xl text-[#C9A84C] font-semibold mb-8">
              ₹ {product.price}
            </p>

            <div className="divider-gold mb-8" />

            <button
              onClick={handleAddToCart}
              className="btn-primary w-full sm:w-auto"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
