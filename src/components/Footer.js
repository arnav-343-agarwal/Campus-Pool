// components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t bg-gradient-to-br from-slate-100 to-white shadow-inner">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        
        {/* Left Text */}
        <div className="text-center md:text-left mb-2 md:mb-0">
          © {new Date().getFullYear()} <span className="font-medium text-gray-800">PoolMate</span>. All rights reserved.
        </div>

        {/* Center Signature */}
        <div className="text-center font-medium text-gray-600">
          Crafted & Maintained by <span className="text-blue-700">Arnav Agarwal</span>
        </div>

        {/* Right Links (Optional) */}
        <div className="text-center md:text-right mt-2 md:mt-0 space-x-4">
          <Link
            href="https://github.com/arnav-343-agarwal"
            target="_blank"
            className="hover:underline hover:text-gray-700 transition"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/arnav-agarwal-b6334a247/"
            target="_blank"
            className="hover:underline hover:text-gray-700 transition"
          >
            LinkedIn
          </Link>
        </div>

      </div>
    </footer>
  );
}
