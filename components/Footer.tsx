import Link from "next/link";
import FooterQuickLinks from "@/components/FooterQuickLinks";

import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {

  return (

    <footer className="bg-black text-white border-t border-white/10">

      <div className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

        {/* BRAND */}

        <div>

          <h1 className="text-4xl font-bold mb-6">

            Design
            <span className="text-yellow-500">
              Drape
            </span>

          </h1>

          <p className="text-gray-400 leading-8">

            Premium fashion tailoring platform delivering luxury custom designs with elegance and perfect craftsmanship.

          </p>

        </div>


        {/* QUICK LINKS */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">

            Quick Links

          </h2>

          <FooterQuickLinks />

        </div>


        {/* CONTACT */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">

            Contact

          </h2>

          <div className="text-gray-400 space-y-4">

            <p>
              Ahmedabad, Gujarat
            </p>

            <p>
              dipali20@gmail.com
            </p>

            <p>
              +91 96385 20472
            </p>

          </div>

        </div>


        {/* SOCIAL */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">

            Follow Us

          </h2>

          <div className="flex gap-5">

            <a
  href="https://www.instagram.com/designdrape.in/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Follow DesignDrape on Instagram"
  className="bg-white/10 p-4 rounded-full hover:bg-yellow-500 hover:text-black transition cursor-pointer"
>
  <FaInstagram size={22} />
</a>

            <div className="bg-white/10 p-4 rounded-full hover:bg-yellow-500 hover:text-black transition cursor-pointer">

              <FaFacebookF size={22} />

            </div>

            <div className="bg-white/10 p-4 rounded-full hover:bg-yellow-500 hover:text-black transition cursor-pointer">

              <FaTwitter size={22} />

            </div>

            {/* <div className="bg-white/10 p-4 rounded-full hover:bg-yellow-500 hover:text-black transition cursor-pointer">

              <FaLinkedinIn size={22} />

            </div> */}

          </div>

        </div>

      </div>


      {/* BOTTOM */}

      <div className="border-t border-white/10 py-6 text-center text-gray-500">

        © 2026 DesignDrape. All Rights Reserved.

      </div>

    </footer>
  );
}
