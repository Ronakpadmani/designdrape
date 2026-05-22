"use client";

import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { logoutUser } from "@/services/authService";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout Successful");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen min-h-screen">
        <div className="spinner" />
        <p className="text-sm tracking-wide">Loading…</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="page-shell">
        <div className="page-container max-w-2xl">
          <p className="badge-gold mb-4">Account</p>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your profile at a glance</p>

          {user ? (
            <div className="card-glass p-8 md:p-10 space-y-6">
              <div className="flex items-center gap-5 pb-6 border-b border-white/[0.08]">
                <div className="w-16 h-16 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] text-2xl font-semibold uppercase">
                  {user.email?.charAt(0) ?? "U"}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Signed in as
                  </p>
                  <p className="text-white text-lg mt-1">{user.email}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/35 mb-2">
                  User ID
                </p>
                <p className="text-white/60 text-sm font-mono break-all bg-white/[0.03] px-4 py-3 rounded-xl border border-white/[0.06]">
                  {user.uid}
                </p>
              </div>

              <button onClick={handleLogout} className="btn-danger mt-2">
                Logout
              </button>
            </div>
          ) : (
            <p className="text-white/50">User not logged in</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
