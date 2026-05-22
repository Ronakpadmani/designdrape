"use client";

import { useState } from "react";
import { loginUser } from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/services/authService";
import AuthLayout from "@/components/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await loginUser(email, password);

      toast.success("Login Successful");

      const uid = userCredential.user.uid;

      const userData = await getUserRole(uid);

      if (userData?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your tailoring journey"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkLabel="Create one"
    >
      <form onSubmit={handleLogin} className="space-y-5">
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
          Sign In
        </button>
      </form>
    </AuthLayout>
  );
}
