"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, Code, LineChart, Database, BarChart3, Network, Rocket, Shield, Briefcase, Award, Globe } from "lucide-react";
import ModuleCard from "@/components/ui/ModuleCard";

const allModules = [
  {
    id: 1,
    title: "Introducción a la Ciencia de Datos",
    description: "Descubre qué es la ciencia de datos, roles profesionales y el ciclo de vida completo de un proyecto",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    href: "/modulos/introduccion"
  },
  {
    id: 2,
    title: "Fundamentos Matemáticos",
    description: "Álgebra lineal, cálculo y probabilidad con visualizaciones interactivas y animadas",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    href: "/modulos/matematicas"
  },
  {
    id: 3,
    title: "Estadística Fundamental",
    description: "Aprende estadística descriptiva, inferencial, pruebas de hipótesis y más",
    icon: BarChart3,
    color: "from-green-500 to-emerald-500",
    href: "/modulos/estadistica"
  },
  {
    id: 4,
    title: "Programación para Ciencia de Datos",
    description: "Python, Pandas, NumPy, Matplotlib y SQL de forma práctica e interactiva",
    icon: Code,
    color: "from-yellow-500 to-orange-500",
    href: "/modulos/programacion"
  },
  {
    id: 5,
    title: "Limpieza y Manipulación de Datos",
    description: "Técnicas para limpiar, transformar y preparar datos para análisis",
    icon: Database,
    color: "from-red-500 to-pink-500",
    href: "/modulos/limpieza-datos"
  },
  {
    id: 6,
    title: "Visualización de Datos",
    description: "Crea gráficos impactantes y dashboards interactivos con las mejores librerías",
    icon: LineChart,
    color: "from-indigo-500 to-purple-500",
    href: "/modulos/visualizacion"
  },
  {
    id: 7,
    title: "Machine Learning Clásico",
    description: "Algoritmos supervisados y no supervisados con simuladores interactivos",
    icon: Network,
    color: "from-orange-500 to-red-500",
    href: "/modulos/machine-learning"
  },
  {
    id: 8,
    title: "Deep Learning",
    description: "Redes neuronales, CNN, RNN y transformers de forma visual y práctica",
    icon: Rocket,
    color: "from-cyan-500 to-blue-500",
    href: "/modulos/deep-learning"
  },
  {
    id: 9,
    title: "Desarrollo de Proyectos Reales",
    description: "Estructura, documenta y despliega proyectos completos de ciencia de datos",
    icon: Briefcase,
    color: "from-teal-500 to-green-500",
    href: "/modulos/proyectos"
  },
  {
    id: 10,
    title: "Herramientas de Software Modernas",
    description: "Git, Docker, entornos virtuales, cloud computing y MLOps básico",
    icon: Globe,
    color: "from-violet-500 to-purple-500",
    href: "/modulos/herramientas"
  },
  {
    id: 11,
    title: "Buenas Prácticas y Ética",
    description: "Sesgos, privacidad, interpretabilidad y documentación profesional",
    icon: Shield,
    color: "from-rose-500 to-red-500",
    href: "/modulos/etica"
  },
  {
    id: 12,
    title: "Construcción de Portafolio",
    description: "Crea un portafolio profesional que te destaque en el mercado laboral",
    icon: Award,
    color: "from-amber-500 to-yellow-500",
    href: "/modulos/portafolio"
  },
];

export default function ModulosPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-bold gradient-text">
          Todos los Módulos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Un camino completo y estructurado para convertirte en científico de datos.
          Cada módulo incluye teoría, práctica, animaciones y ejercicios interactivos.
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-effect p-6 rounded-2xl max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Tu Progreso General</span>
          <span className="text-sm font-bold gradient-text">0/12 Módulos</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "0%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
          />
        </div>
      </motion.div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allModules.map((module, index) => (
          <ModuleCard key={module.id} module={module} index={index} />
        ))}
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center py-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          ¿Listo para comenzar tu viaje?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Empieza con el módulo de introducción y avanza a tu propio ritmo.
          Todo el contenido está diseñado para facilitar tu aprendizaje.
        </p>
        <motion.a
          href="/modulos/introduccion"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block btn-primary"
        >
          Comenzar con Módulo 1
        </motion.a>
      </motion.div>
    </div>
  );
}
