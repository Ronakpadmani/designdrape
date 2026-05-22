"use client";

import { useState, useEffect, Suspense } from "react";
import { loginUser, getUserRole } from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);

    if (searchParams.get("registered") === "1") {
      toast.success("Registration complete. Please sign in.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await loginUser(email, password);
      toast.success("Login Successful");

      const uid = userCredential.user.uid;
      const userData = await getUserRole(uid);
      const redirect = searchParams.get("redirect");

      if (userData?.role === "admin") {
        router.push("/admin");
      } else if (redirect && redirect.startsWith("/")) {
        router.push(redirect);
      } else {
        router.push("/");
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
            required
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
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full mt-2">
          Sign In
        </button>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="loading-screen min-h-screen">
          <div className="spinner" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
