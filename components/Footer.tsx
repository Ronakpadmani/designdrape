import Link from "next/link";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-white border-t border-[#C9A84C]/15 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-16">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#C9A84C]/40 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-bold tracking-wider">
                DD
              </div>
              <span className="text-white font-light tracking-[0.15em] uppercase">
                Design<span className="text-[#C9A84C] font-semibold">Drape</span>
              </span>
            </Link>
            <p className="text-white/40 leading-relaxed text-sm">
              Premium fashion tailoring platform delivering luxury custom designs
              with elegance and perfect craftsmanship.
            </p>
            <div className="flex gap-3 pt-2">
              {[FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all duration-300 cursor-pointer"
                  >
                    <Icon size={15} />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h2 className="font-[family-name:var(--font-cormorant)] text-xl text-white">
              Quick Links
            </h2>
            <div className="flex flex-col gap-3 text-white/45 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/orders", label: "Orders" },
                { href: "/cart", label: "Cart" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#C9A84C] transition-colors duration-300 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h2 className="font-[family-name:var(--font-cormorant)] text-xl text-white">
              Contact
            </h2>
            <div className="text-white/45 text-sm space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#C9A84C] mt-0.5 shrink-0" />
                <p>Ahmedabad, Gujarat, India</p>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#C9A84C] shrink-0" />
                <a
                  href="mailto:support@designdrape.com"
                  className="hover:text-[#C9A84C] transition-colors"
                >
                  support@designdrape.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-[#C9A84C] shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-[#C9A84C] transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <h2 className="font-[family-name:var(--font-cormorant)] text-xl text-white">
              Newsletter
            </h2>
            <p className="text-white/40 text-sm">
              Subscribe for exclusive offers and fashion updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="input-field rounded-r-none border-r-0 flex-1"
              />
              <button className="btn-primary rounded-l-none px-5">
                <FaPaperPlane size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="divider-gold mb-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-white/35 text-sm">
          <p>© 2024 DesignDrape. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">
              Privacy
            </Link>
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">
              Terms
            </Link>
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">
              Shipping
            </Link>
          </div>
          <p>
            Crafted with <span className="text-[#C9A84C]">♥</span> for fashion
          </p>
        </div>
      </div>
    </footer>
  );
}
