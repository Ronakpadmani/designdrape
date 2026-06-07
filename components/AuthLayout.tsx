import Link from "next/link";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkLabel: string;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkLabel,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558171813-4c088faeab42?q=80&w=1600"
          alt="fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#050505]/75" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#C9A84C]/15 blur-[120px] rounded-full" />

        <div className="relative z-10 flex flex-col justify-center min-h-screen w-full pt-28 pb-16 px-12 xl:px-16">
          <div className="space-y-8 max-w-lg">
            <p className="uppercase tracking-[0.35em] text-[#C9A84C] text-xs">
              Bespoke Tailoring
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-5xl xl:text-6xl font-semibold text-white leading-[1.15]">
              Where elegance
              <br />
              meets precision
            </h2>
          </div>

          <p className="absolute bottom-8 left-12 xl:left-16 text-white/35 text-sm tracking-wide">
            © DesignDrape — Premium Fashion Tailoring
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 pt-28 pb-16 bg-[#050505]">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-white mb-2">
              {title}
            </h1>
            <p className="text-white/45">{subtitle}</p>
          </div>

          <div className="card-glass p-8 md:p-10">{children}</div>

          <p className="text-center text-white/40 text-sm mt-8">
            {footerText}{" "}
            <Link
              href={footerLink}
              className="text-[#C9A84C] hover:text-[#dbbe60] transition-colors"
            >
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
