"use client";

import { useState, useEffect, Suspense } from "react";
import { loginUser, loginAdmin, getUserRole } from "@/services/authService";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";

function LoginForm() {
  const [mode, setMode] = useState<"customer" | "admin">("customer");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const phoneParam = searchParams.get("phone");
    if (phoneParam) setPhone(phoneParam);

    if (searchParams.get("registered") === "1") {
      toast.success("Registration complete. Please sign in.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential =
        mode === "admin"
          ? await loginAdmin(email, password)
          : await loginUser(phone, pin);

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
      subtitle={
        mode === "customer"
          ? "Sign in with your mobile number and PIN"
          : "Admin sign in with email and password"
      }
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkLabel="Create one"
    >
      <form onSubmit={handleLogin} className="space-y-5">
        {mode === "customer" ? (
          <>
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
                placeholder="••••••"
                className="input-field"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                pattern="\d{6}"
                required
              />
            </div>

            <p className="text-white/35 text-xs text-center">
              Forgot PIN? Contact DesignDrape shop to reset.
            </p>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
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
          </>
        )}

        <button type="submit" className="btn-primary w-full mt-2">
          Sign In
        </button>

        <button
          type="button"
          onClick={() =>
            setMode((m) => (m === "customer" ? "admin" : "customer"))
          }
          className="w-full text-center text-xs text-white/40 hover:text-[#C9A84C] transition-colors"
        >
          {mode === "customer"
            ? "Admin login with email →"
            : "← Customer login with phone"}
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
