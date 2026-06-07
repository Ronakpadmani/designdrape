"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, logoutUser } from "@/services/authService";
import { normalizePhone } from "@/lib/phoneAuth";
import toast from "react-hot-toast";
import AuthLayout from "@/components/AuthLayout";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin !== confirmPin) {
      toast.error("PIN and Confirm PIN do not match");
      return;
    }

    try {
      await registerUser(name, phone, pin);

      await logoutUser();

      toast.success("Account created! Please sign in.");

      const normalized = normalizePhone(phone) || phone;
      router.push(
        `/login?redirect=${encodeURIComponent("/")}&registered=1&phone=${encodeURIComponent(normalized)}`
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Register with your mobile number and a 6-digit PIN"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkLabel="Sign in"
    >
      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
            6-Digit PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            placeholder="Create 6-digit PIN"
            className="input-field"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            pattern="\d{6}"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
            Confirm PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            placeholder="Re-enter 6-digit PIN"
            className="input-field"
            value={confirmPin}
            onChange={(e) =>
              setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            pattern="\d{6}"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full mt-2">
          Create Account
        </button>
      </form>
    </AuthLayout>
  );
}
