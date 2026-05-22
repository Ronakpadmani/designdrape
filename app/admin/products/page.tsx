"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "@/services/productService";
import ProductImage from "@/components/ProductImage";
import ImageUpload from "@/components/ImageUpload";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
};

export default function AdminProductsPage() {
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      image: product.image || "",
      category: product.category || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price.trim()) {
      toast.error("Name and price are required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price.trim(),
      image: form.image.trim(),
      category: form.category.trim(),
      createdAt: new Date(),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success("Product updated");
      } else {
        await addProduct(payload);
        toast.success("Product added");
      }
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (product: any) => {
    if (!confirm(`Delete "${product.name}"?`)) return;

    try {
      await deleteProduct(product.id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
          <div>
            <p className="badge-gold mb-4">Catalogue</p>
            <h1 className="page-title">Admin Products</h1>
            <p className="page-subtitle mb-0">
              Create, edit, and delete products
            </p>
          </div>
          {!showForm && (
            <button type="button" onClick={openCreate} className="btn-primary">
              + Add Product
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="card-glass p-8 max-w-2xl space-y-5 mt-10"
          >
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-white">
              {editingId ? "Edit Product" : "New Product"}
            </h2>

            <input
              type="text"
              placeholder="Product Name *"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <textarea
              placeholder="Description"
              className="input-field resize-none"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Price *"
              className="input-field"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />

            <input
              type="text"
              placeholder="Category (e.g. Kurti, Blouse)"
              className="input-field"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />

            <ImageUpload
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
            />

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loading-screen mt-10">
            <div className="spinner" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="card-glass overflow-hidden group"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  {product.category && (
                    <span className="badge-gold text-[10px] mb-2">
                      {product.category}
                    </span>
                  )}
                  <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-white mb-2">
                    {product.name}
                  </h2>
                  <p className="text-white/45 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-[#C9A84C] text-xl font-semibold mb-4">
                    ₹ {product.price}
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="btn-secondary text-sm py-2.5 px-5"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="btn-danger text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
