"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface Module {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  href: string;
}

interface ModuleCardProps {
  module: Module;
  index: number;
}

export default function ModuleCard({ module, index }: ModuleCardProps) {
  const Icon = module.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={module.href}>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

          {/* Content */}
          <div className="relative p-6 space-y-4">
            {/* Icon */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
              <Icon className="w-7 h-7 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
              {module.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {module.description}
            </p>

            {/* Action */}
            <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all duration-300">
              <span>Explorar</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
            </div>

            {/* Module Number Badge */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
              {module.id}
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
