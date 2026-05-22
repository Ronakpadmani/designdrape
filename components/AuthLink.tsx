"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { loginUrl } from "@/lib/authPaths";

type AuthLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** If true, user must be logged in (default). Home/collections stay public when false. */
  requireAuth?: boolean;
};

export default function AuthLink({
  href,
  children,
  className = "",
  requireAuth = true,
}: AuthLinkProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!requireAuth || loading) return;

    if (!user) {
      e.preventDefault();
      toast.error("Please login first");
      router.push(loginUrl(href));
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
