"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getCustomers,
  createCustomerByAdmin,
  updateCustomer,
  resetCustomerPin,
  deleteCustomer,
} from "@/services/authService";
import { formatPhoneDisplay } from "@/lib/phoneAuth";
import type { Customer } from "@/types";

const emptyForm = {
  name: "",
  phoneNumber: "",
  pin: "",
  newPin: "",
  address: "",
  notes: "",
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
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

  const openEdit = (customer: Customer) => {
    setEditingId(customer.uid);
    setForm({
      name: customer.name || "",
      phoneNumber: customer.phoneNumber || "",
      pin: "",
      newPin: "",
      address: customer.address || "",
      notes: customer.notes || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phoneNumber.trim()) {
      toast.error("Name and phone number are required");
      return;
    }

    try {
      if (editingId) {
        await updateCustomer(editingId, {
          name: form.name.trim(),
          phoneNumber: form.phoneNumber.trim(),
          address: form.address.trim(),
          notes: form.notes.trim(),
        });

        if (form.newPin.trim()) {
          await resetCustomerPin(editingId, form.newPin.trim());
          toast.success("Customer updated and PIN reset");
        } else {
          toast.success("Customer updated");
        }
      } else {
        if (!form.pin.trim()) {
          toast.error("PIN is required for new customers");
          return;
        }

        await createCustomerByAdmin({
          name: form.name.trim(),
          phoneNumber: form.phoneNumber.trim(),
          pin: form.pin.trim(),
          address: form.address.trim(),
          notes: form.notes.trim(),
        });
        toast.success("Customer created — they can login with phone + PIN");
      }

      resetForm();
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (
      !confirm(
        `Delete ${customer.name}? Their profile will be removed. (Firebase login may still exist.)`
      )
    ) {
      return;
    }

    try {
      await deleteCustomer(customer.uid);
      toast.success("Customer deleted");
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
          <div>
            <p className="badge-gold mb-4">Clients</p>
            <h1 className="page-title">Customers</h1>
            <p className="page-subtitle mb-0">
              Add customers with mobile + PIN so they can login and order online
            </p>
          </div>
          {!showForm && (
            <button type="button" onClick={openCreate} className="btn-primary">
              + Add Customer
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="card-glass p-8 md:p-10 space-y-5 mt-10 max-w-3xl"
          >
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-white">
              {editingId ? "Edit Customer" : "New Customer"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="input-field"
                  placeholder="10-digit mobile number"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                  }
                  disabled={!!editingId}
                  required
                />
                {editingId && (
                  <p className="text-white/30 text-xs mt-1">
                    Phone cannot be changed (used for login)
                  </p>
                )}
              </div>

              {!editingId ? (
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                    6-Digit PIN *
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    className="input-field"
                    placeholder="Set login PIN for customer"
                    value={form.pin}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pin: e.target.value.replace(/\D/g, "").slice(0, 6),
                      })
                    }
                    maxLength={6}
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                    New PIN (optional)
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    className="input-field"
                    placeholder="Reset to new 6-digit PIN"
                    value={form.newPin}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        newPin: e.target.value.replace(/\D/g, "").slice(0, 6),
                      })
                    }
                    maxLength={6}
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                  Notes
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Preferences, fitting notes…"
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" className="btn-primary">
                {editingId ? "Update Customer" : "Create Customer"}
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

        <div className="mt-10 space-y-4">
          {loading ? (
            <div className="loading-screen">
              <div className="spinner" />
            </div>
          ) : customers.length === 0 ? (
            <div className="card-glass p-12 text-center text-white/40">
              No customers yet. Add your first customer above.
            </div>
          ) : (
            customers.map((customer) => (
              <div
                key={customer.uid}
                className="card-glass p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-white">
                      {customer.name}
                    </h3>
                    <span className="badge-gold text-[10px]">Can login</span>
                    {customer.createdByAdmin && (
                      <span className="text-[10px] uppercase tracking-wider text-white/35 border border-white/10 px-2 py-0.5 rounded-full">
                        Shop account
                      </span>
                    )}
                  </div>
                  <p className="text-[#C9A84C] text-sm mt-1 font-medium">
                    {customer.phoneNumber
                      ? formatPhoneDisplay(customer.phoneNumber)
                      : "—"}
                  </p>
                  {customer.address && (
                    <p className="text-white/35 text-sm mt-1">
                      {customer.address}
                    </p>
                  )}
                  {customer.notes && (
                    <p className="text-white/30 text-xs mt-2 italic">
                      {customer.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(customer)}
                    className="btn-secondary text-sm py-2.5 px-5"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(customer)}
                    className="btn-danger text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
