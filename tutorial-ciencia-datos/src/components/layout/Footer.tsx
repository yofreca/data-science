"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-effect mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 gradient-text">
              Sobre el Tutorial
            </h3>
            <p className="text-gray-600 text-sm">
              Tutorial interactivo y animado para aprender ciencia de datos desde
              cero hasta nivel avanzado.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 gradient-text">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/modulos" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Todos los Módulos
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="/progreso" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Mi Progreso
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-4 gradient-text">
              Síguenos
            </h3>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            Hecho con <Heart className="w-4 h-4 text-red-500 animate-pulse" /> para apasionados de los datos
            © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
