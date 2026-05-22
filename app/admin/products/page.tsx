"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addProduct, getProducts } from "@/services/productService";

export default function AdminProductsPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addProduct({
        name,
        description,
        price,
        image,
        createdAt: new Date(),
      });

      toast.success("Product Added");

      setName("");
      setDescription("");
      setPrice("");
      setImage("");

      fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="page-shell">
      <div className="page-container">
        <p className="badge-gold mb-4">Catalogue</p>
        <h1 className="page-title">Admin Products</h1>
        <p className="page-subtitle">Add and manage your product collection</p>

        <form
          onSubmit={handleSubmit}
          className="card-glass p-8 max-w-2xl space-y-5 mb-16"
        >
          <input
            type="text"
            placeholder="Product Name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="input-field resize-none"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="text"
            placeholder="Price"
            className="input-field"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="text"
            placeholder="Image URL"
            className="input-field"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <button type="submit" className="btn-primary">
            Add Product
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="card-glass overflow-hidden group"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-white mb-2">
                  {product.name}
                </h2>
                <p className="text-white/45 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-[#C9A84C] text-xl font-semibold">
                  ₹ {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
