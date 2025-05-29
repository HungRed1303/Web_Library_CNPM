"use client"

import { Facebook, Twitter, Instagram, Phone, Mail } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-pink-500/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-pink-400 neon-text-small mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-pink-400" />
                <span className="text-gray-300">info@libraryzone.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-pink-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold text-pink-400 neon-text-small mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-pink-400 neon-text-small mb-4">About LibraryZone</h3>
            <p className="text-gray-300">
              LibraryZone is a digital-first library management system designed to give you seamless access to books and resources.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} LibraryZone. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer