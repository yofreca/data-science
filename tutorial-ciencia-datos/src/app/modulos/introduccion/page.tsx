"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, TrendingUp, Users, Database } from "lucide-react";
import Link from "next/link";
import DataScienceLifecycle from "@/components/interactive/DataScienceLifecycle";
import RolesComparison from "@/components/interactive/RolesComparison";
import InteractiveQuiz from "@/components/interactive/InteractiveQuiz";

export default function IntroduccionPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <Link href="/modulos">
          <motion.div
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver a Módulos</span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              Módulo 1: Introducción a la Ciencia de Datos
            </h1>
            <p className="text-gray-600 mt-2">
              Descubre qué es la ciencia de datos y cómo funciona
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section 1: ¿Qué es la Ciencia de Datos? */}
      <Section
        title="¿Qué es la Ciencia de Datos?"
        icon={TrendingUp}
        color="from-blue-500 to-cyan-500"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Definición</h3>
            <p className="text-gray-700 leading-relaxed">
              La <strong>ciencia de datos</strong> es un campo interdisciplinario que utiliza
              métodos científicos, procesos, algoritmos y sistemas para extraer conocimiento
              e información de datos estructurados y no estructurados.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-4"
          >
            <InfoCard
              emoji="🔍"
              title="Análisis"
              description="Explorar y entender los datos"
            />
            <InfoCard
              emoji="🤖"
              title="Machine Learning"
              description="Crear modelos predictivos"
            />
            <InfoCard
              emoji="📊"
              title="Visualización"
              description="Comunicar hallazgos"
            />
          </motion.div>
        </div>
      </Section>

      {/* Section 2: Roles en Ciencia de Datos */}
      <Section
        title="Roles Profesionales"
        icon={Users}
        color="from-purple-500 to-pink-500"
      >
        <RolesComparison />
      </Section>

      {/* Section 3: Ciclo de Vida de un Proyecto */}
      <Section
        title="Ciclo de Vida de un Proyecto de Datos"
        icon={Database}
        color="from-green-500 to-emerald-500"
      >
        <DataScienceLifecycle />
      </Section>

      {/* Interactive Quiz */}
      <Section
        title="Pon a Prueba tu Conocimiento"
        icon={BookOpen}
        color="from-orange-500 to-red-500"
      >
        <InteractiveQuiz
          questions={[
            {
              question: "¿Cuál es el primer paso en el ciclo de vida de un proyecto de datos?",
              options: [
                "Modelado",
                "Definición del problema",
                "Visualización",
                "Deployment"
              ],
              correctAnswer: 1,
              explanation: "La definición del problema es crucial para entender qué queremos lograr."
            },
            {
              question: "¿Qué rol se enfoca principalmente en la infraestructura de datos?",
              options: [
                "Data Analyst",
                "Data Scientist",
                "Data Engineer",
                "ML Engineer"
              ],
              correctAnswer: 2,
              explanation: "El Data Engineer construye y mantiene la infraestructura de datos."
            }
          ]}
        />
      </Section>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-between items-center pt-12 border-t border-gray-200"
      >
        <Link href="/modulos">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Módulos
          </motion.button>
        </Link>

        <Link href="/modulos/matematicas">
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 btn-primary"
          >
            Siguiente: Matemáticas
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  color,
  children
}: {
  title: string;
  icon: any;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

function InfoCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass-effect p-6 rounded-xl text-center space-y-3 cursor-pointer"
    >
      <div className="text-4xl">{emoji}</div>
      <h4 className="font-bold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
}
