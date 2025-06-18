// src/components/Footer.tsx
"use client";

import { Facebook, Twitter, Instagram, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#f2f0ec] border-t border-[#033060] mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-[#033060] mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#033060]" />
                <span className="text-[#033060]">info@libraryzone.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#033060]" />
                <span className="text-[#033060]">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold text-[#033060] mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[#033060] hover:text-opacity-80 transition-colors duration-300"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-[#033060] hover:text-opacity-80 transition-colors duration-300"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-[#033060] hover:text-opacity-80 transition-colors duration-300"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-[#033060] mb-4">About LibraryZone</h3>
            <p className="text-[#033060]">
              LibraryZone is a digital-first library management system designed to give you seamless access to books and resources.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-[#033060]">
          © {new Date().getFullYear()} LibraryZone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
