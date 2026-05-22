"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUsers } from "@/services/authService";
import { saveMeasurement } from "@/services/measurementService";

export default function AdminMeasurementsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [length, setLength] = useState("");

  const fetchUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await saveMeasurement({
        userId: selectedUser,
        chest,
        waist,
        shoulder,
        length,
        updatedByAdmin: true,
        createdAt: new Date(),
      });

      toast.success("Measurements Saved");

      setSelectedUser("");
      setChest("");
      setWaist("");
      setShoulder("");
      setLength("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="page-shell">
      <div className="page-container max-w-2xl">
        <p className="badge-gold mb-4">Fittings</p>
        <h1 className="page-title">Measurements</h1>
        <p className="page-subtitle">
          Record precise measurements for your customers
        </p>

        <form onSubmit={handleSave} className="card-glass p-8 md:p-10 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
              Customer
            </label>
            <select
              className="input-field cursor-pointer"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select Customer</option>
              {users.map((user) => (
                <option key={user.id} value={user.uid}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                Chest
              </label>
              <input
                type="text"
                placeholder="e.g. 38"
                className="input-field"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                Waist
              </label>
              <input
                type="text"
                placeholder="e.g. 32"
                className="input-field"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                Shoulder
              </label>
              <input
                type="text"
                placeholder="e.g. 16"
                className="input-field"
                value={shoulder}
                onChange={(e) => setShoulder(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                Length
              </label>
              <input
                type="text"
                placeholder="e.g. 42"
                className="input-field"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full sm:w-auto">
            Save Measurements
          </button>
        </form>
      </div>
    </div>
  );
}
