"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCustomers } from "@/services/authService";
import {
  getAllMeasurements,
  saveMeasurement,
  updateMeasurement,
  deleteMeasurement,
} from "@/services/measurementService";
import LengthSection from "@/components/measurements/LengthSection";
import {
  EMPTY_MEASUREMENT,
  MEASUREMENT_FIELDS,
  NECK_FIELDS,
  TOTAL_MEASUREMENT_SLOT_COUNT,
  normalizeMeasurementForm,
  countFilledFields,
  countFilledGarmentLengths,
  getGarmentLengthDisplayEntries,
  type Customer,
  type Measurement,
  type MeasurementFieldConfig,
  type MeasurementFormState,
  type GarmentLengths,
} from "@/types";

function FieldGrid({
  fields,
  form,
  onChange,
}: {
  fields: MeasurementFieldConfig[];
  form: MeasurementFormState;
  onChange: (key: keyof MeasurementFormState, value: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {fields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
            {label}
          </label>
          <input
            type="text"
            className="input-field"
            placeholder={placeholder}
            value={form[key] as string}
            onChange={(e) => onChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

function DisplayFields({
  m,
  fields,
}: {
  m: MeasurementFormState;
  fields: MeasurementFieldConfig[];
}) {
  return (
    <>
      {fields.map(({ key, label }) =>
        m[key]?.toString().trim() ? (
          <div
            key={key}
            className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2"
          >
            <p className="text-[10px] uppercase tracking-wider text-white/35">
              {label}
            </p>
            <p className="text-[#C9A84C] font-medium text-sm mt-0.5">
              {m[key]}
            </p>
          </div>
        ) : null
      )}
    </>
  );
}

function DisplayGarmentLengths({ lengths }: { lengths?: GarmentLengths }) {
  const entries = getGarmentLengthDisplayEntries(lengths);

  return (
    <>
      {entries.map(({ label, value }) => (
        <div
          key={`${label}-${value}`}
          className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2"
        >
          <p className="text-[10px] uppercase tracking-wider text-white/35">
            {label}
          </p>
          <p className="text-[#C9A84C] font-medium text-sm mt-0.5">{value}</p>
        </div>
      ))}
    </>
  );
}

export default function AdminMeasurementsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MeasurementFormState>({
    ...EMPTY_MEASUREMENT,
  });
  const [lengthDefaultOpen, setLengthDefaultOpen] = useState(false);

  const customerMap = Object.fromEntries(
    customers.map((c) => [c.uid, c.name])
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [customerData, measurementData] = await Promise.all([
        getCustomers(),
        getAllMeasurements(),
      ]);
      setCustomers(customerData);
      setMeasurements(measurementData);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ ...EMPTY_MEASUREMENT, garmentLengths: { ...EMPTY_MEASUREMENT.garmentLengths } });
    setEditingId(null);
    setLengthDefaultOpen(false);
    setShowForm(false);
  };

  const openCreate = () => {
    setForm({ ...EMPTY_MEASUREMENT, garmentLengths: { ...EMPTY_MEASUREMENT.garmentLengths } });
    setEditingId(null);
    setLengthDefaultOpen(false);
    setShowForm(true);
  };

  const openEdit = (m: Measurement) => {
    const normalized = normalizeMeasurementForm(m);
    setEditingId(m.id);
    setForm(normalized);
    setLengthDefaultOpen(
      countFilledGarmentLengths(normalized.garmentLengths) > 0
    );
    setShowForm(true);
  };

  const handleFieldChange = (
    key: keyof MeasurementFormState,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleGarmentLengthChange = (
    key: keyof GarmentLengths,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      garmentLengths: { ...prev.garmentLengths, [key]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.userId) {
      toast.error("Please select a customer");
      return;
    }

    const payload = {
      ...form,
      updatedByAdmin: true,
    };

    try {
      if (editingId) {
        await updateMeasurement(editingId, payload);
        toast.success("Measurement updated");
      } else {
        await saveMeasurement(payload);
        toast.success("Measurement created");
      }
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (m: Measurement) => {
    const name = customerMap[m.userId] || "this customer";
    if (!confirm(`Delete measurement record for ${name}?`)) return;

    try {
      await deleteMeasurement(m.id);
      toast.success("Measurement deleted");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
          <div>
            <p className="badge-gold mb-4">Fittings</p>
            <h1 className="page-title">Measurements</h1>
            <p className="page-subtitle mb-0">
              Create, edit, and manage customer measurements
            </p>
          </div>
          {!showForm && (
            <button type="button" onClick={openCreate} className="btn-primary">
              + Add Measurement
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="card-glass p-8 md:p-10 space-y-8 mt-10"
          >
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-white">
              {editingId ? "Edit Measurement" : "New Measurement"}
            </h2>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                Customer *
              </label>
              <select
                className="select-field max-w-md"
                value={form.userId}
                onChange={(e) => handleFieldChange("userId", e.target.value)}
                required
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.uid} value={c.uid}>
                    {c.name}
                    {c.phoneNumber ? ` — ${c.phoneNumber}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-[#C9A84C]">
                Body Measurements
              </h3>
              <FieldGrid
                fields={MEASUREMENT_FIELDS}
                form={form}
                onChange={handleFieldChange}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-[#C9A84C]">
                Neck
              </h3>
              <p className="text-white/35 text-sm -mt-2">
                Front and back neck depth — used for blouses, kurtis, and shirts.
              </p>
              <FieldGrid
                fields={NECK_FIELDS}
                form={form}
                onChange={handleFieldChange}
              />
            </div>

            <LengthSection
              key={`${editingId ?? "new"}-${lengthDefaultOpen}`}
              garmentLengths={form.garmentLengths}
              onChange={handleGarmentLengthChange}
              defaultOpen={lengthDefaultOpen}
            />

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                Notes
              </label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Special fitting instructions, fabric notes…"
                value={form.notes}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? "Update" : "Save Measurement"}
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
          ) : measurements.length === 0 ? (
            <div className="card-glass p-12 text-center text-white/40">
              No measurements yet.
            </div>
          ) : (
            measurements.map((m) => {
              const normalized = normalizeMeasurementForm(m);

              return (
                <div key={m.id} className="card-glass p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-white">
                        {customerMap[m.userId] || "Unknown customer"}
                      </h3>
                      <p className="text-white/35 text-xs mt-1 uppercase tracking-wider">
                        {countFilledFields(normalized)} of{" "}
                        {TOTAL_MEASUREMENT_SLOT_COUNT} fields recorded
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(m)}
                        className="btn-secondary text-sm py-2.5 px-5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m)}
                        className="btn-danger text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    <DisplayFields m={normalized} fields={MEASUREMENT_FIELDS} />
                    <DisplayFields m={normalized} fields={NECK_FIELDS} />
                    <DisplayGarmentLengths lengths={normalized.garmentLengths} />
                  </div>

                  {normalized.notes?.trim() && (
                    <p className="text-white/40 text-sm mt-4 border-t border-white/[0.06] pt-4">
                      <span className="text-white/30 uppercase text-xs tracking-wider mr-2">
                        Notes
                      </span>
                      {normalized.notes}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
