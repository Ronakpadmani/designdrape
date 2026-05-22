"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { getSingleProduct } from "@/services/productService";

type ProductType = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
};

export default function ProductDetailsPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<ProductType | null>(null);

  const fetchProduct = async () => {
    const data = await getSingleProduct(id);
    setProduct(data as ProductType);
  };

  const handleAddToCart = () => {
    if (!product) {
      console.log("NO PRODUCT");
      return;
    }

    console.log("ADDING:", product);

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    toast.success("Added To Cart");
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!product) {
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
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/40 to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col justify-center">
            <p className="badge-gold mb-5 w-fit">{product.category}</p>

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

            <button onClick={handleAddToCart} className="btn-primary w-full sm:w-auto">
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
