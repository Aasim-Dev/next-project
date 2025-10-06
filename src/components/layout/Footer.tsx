// src/components/layout/Footer.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Camera, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on dashboard pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/seller") || pathname?.startsWith("/buyer")) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="text-2xl font-bold text-white mb-4 inline-block">
              📸 PhotoHire
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Connecting professional photographers with clients worldwide. Find the perfect photographer for your next project.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="text-sm">f</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                <span className="text-sm">𝕏</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                <span className="text-sm">in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/register?role=buyer" className="hover:text-white transition-colors">For Clients</Link></li>
              <li><Link href="/register?role=seller" className="hover:text-white transition-colors">For Photographers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/wedding" className="hover:text-white transition-colors">Wedding Photography</Link></li>
              <li><Link href="/services/portrait" className="hover:text-white transition-colors">Portrait Photography</Link></li>
              <li><Link href="/services/event" className="hover:text-white transition-colors">Event Photography</Link></li>
              <li><Link href="/services/commercial" className="hover:text-white transition-colors">Commercial Photography</Link></li>
              <li><Link href="/services/product" className="hover:text-white transition-colors">Product Photography</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-500 flex-shrink-0 mt-1" />
                <span>123 Photography Street<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-blue-500 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <a href="mailto:info@photohire.com" className="hover:text-white transition-colors">info@photohire.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} PhotoHire. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}