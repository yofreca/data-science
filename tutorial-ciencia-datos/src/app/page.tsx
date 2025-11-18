"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Brain, Code, LineChart, Sparkles, ArrowRight } from "lucide-react";
import AnimatedHero from "@/components/interactive/AnimatedHero";
import ModuleCard from "@/components/ui/ModuleCard";

const modules = [
  {
    id: 1,
    title: "Introducción a la Ciencia de Datos",
    description: "Descubre qué es la ciencia de datos y su ciclo de vida",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    href: "/modulos/introduccion"
  },
  {
    id: 2,
    title: "Fundamentos Matemáticos",
    description: "Álgebra lineal, cálculo y probabilidad de forma visual",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    href: "/modulos/matematicas"
  },
  {
    id: 3,
    title: "Programación para Ciencia de Datos",
    description: "Python, Pandas, NumPy y más",
    icon: Code,
    color: "from-green-500 to-emerald-500",
    href: "/modulos/programacion"
  },
  {
    id: 4,
    title: "Machine Learning Clásico",
    description: "Aprende algoritmos de ML de forma interactiva",
    icon: LineChart,
    color: "from-orange-500 to-red-500",
    href: "/modulos/machine-learning"
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <AnimatedHero />

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center space-y-8"
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-500 w-8 h-8" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Características del Tutorial
          </h2>
          <Sparkles className="text-yellow-500 w-8 h-8" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon="🎨"
            title="Altamente Visual"
            description="Animaciones y gráficos interactivos para cada concepto"
          />
          <FeatureCard
            icon="🎮"
            title="Gamificación"
            description="Aprende jugando con quizzes y desafíos interactivos"
          />
          <FeatureCard
            icon="🚀"
            title="Proyectos Reales"
            description="Construye tu portafolio con proyectos del mundo real"
          />
        </div>
      </motion.section>

      {/* Modules Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Explora los Módulos
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))}
        </div>

        <div className="text-center pt-8">
          <Link href="/modulos">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 mx-auto"
            >
              Ver Todos los Módulos
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center space-y-6 shadow-2xl"
      >
        <h2 className="text-4xl font-bold">¿Listo para comenzar?</h2>
        <p className="text-xl max-w-2xl mx-auto opacity-90">
          Inicia tu viaje en la ciencia de datos con nuestro tutorial interactivo y visual
        </p>
        <Link href="/modulos/introduccion">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Comenzar Ahora
          </motion.button>
        </Link>
      </motion.section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
