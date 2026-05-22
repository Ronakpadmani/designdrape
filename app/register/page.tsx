"use client";

import { useState } from "react";
import { registerUser } from "@/services/authService";
import toast from "react-hot-toast";
import AuthLayout from "@/components/AuthLayout";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerUser(name, email, password);

      toast.success("Registration Successful");

      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join DesignDrape for bespoke fashion experiences"
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
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary w-full mt-2">
          Create Account
        </button>
      </form>
    </AuthLayout>
  );
}
