"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, BookOpen, Home, Info, Award } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Módulos", href: "/modulos", icon: BookOpen },
    { name: "Acerca de", href: "/about", icon: Info },
    { name: "Progreso", href: "/progreso", icon: Award },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass-effect"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">
                Data Science Tutorial
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 space-y-2"
          >
            {menuItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
