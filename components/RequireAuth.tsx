"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { loginUrl } from "@/lib/authPaths";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login first");
      router.replace(loginUrl(pathname));
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div className="loading-screen min-h-screen">
        <div className="spinner" />
        <p className="text-sm tracking-wide">Please sign in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
