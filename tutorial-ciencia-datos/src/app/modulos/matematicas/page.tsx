"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Brain, Calculator, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import MatrixVisualizer from "@/components/interactive/MatrixVisualizer";
import LinearTransformationDemo from "@/components/interactive/LinearTransformationDemo";
import VectorVisualizer from "@/components/interactive/VectorVisualizer";
import GradientDescentSimulator from "@/components/interactive/GradientDescentSimulator";
import ProbabilitySimulator from "@/components/interactive/ProbabilitySimulator";
import DerivativeVisualizer from "@/components/interactive/DerivativeVisualizer";
import InteractiveQuiz from "@/components/interactive/InteractiveQuiz";

export default function MatematicasPage() {
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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              Módulo 2: Fundamentos Matemáticos
            </h1>
            <p className="text-gray-600 mt-2">
              Álgebra lineal, cálculo y probabilidad de forma visual e interactiva
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section 1: Álgebra Lineal */}
      <Section
        title="Álgebra Lineal"
        icon={Calculator}
        color="from-purple-500 to-pink-500"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ¿Por qué Álgebra Lineal en Data Science?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              El álgebra lineal es el lenguaje fundamental del machine learning. Los datos
              se representan como vectores y matrices, y las operaciones que realizamos sobre
              ellos son transformaciones lineales.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <InfoCard
                emoji="📊"
                title="Datasets"
                description="Cada fila es un vector, la tabla completa es una matriz"
              />
              <InfoCard
                emoji="🧮"
                title="Modelos ML"
                description="Multiplicación de matrices para hacer predicciones"
              />
              <InfoCard
                emoji="🎯"
                title="Optimización"
                description="Calcular gradientes para mejorar modelos"
              />
            </div>
          </motion.div>

          {/* Vector Visualizer */}
          <VectorVisualizer />

          {/* Matrix Visualizer */}
          <MatrixVisualizer />

          {/* Linear Transformation */}
          <LinearTransformationDemo />
        </div>
      </Section>

      {/* Section 2: Cálculo */}
      <Section
        title="Cálculo y Optimización"
        icon={TrendingUp}
        color="from-green-500 to-emerald-500"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Cálculo en Machine Learning
            </h3>
            <p className="text-gray-700 leading-relaxed">
              El cálculo nos permite encontrar la mejor solución a un problema de optimización.
              Las derivadas nos indican la dirección para mejorar nuestro modelo, y el descenso
              del gradiente es el algoritmo fundamental para entrenar redes neuronales.
            </p>
          </motion.div>

          {/* Derivative Visualizer */}
          <DerivativeVisualizer />

          {/* Gradient Descent (ya creado) */}
          <GradientDescentSimulator />
        </div>
      </Section>

      {/* Section 3: Probabilidad */}
      <Section
        title="Probabilidad y Estadística"
        icon={Zap}
        color="from-blue-500 to-cyan-500"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Probabilidad: La Ciencia de la Incertidumbre
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              La probabilidad nos permite cuantificar la incertidumbre. En data science,
              usamos probabilidad para hacer predicciones, entender la confianza en nuestros
              resultados, y modelar fenómenos aleatorios.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoCard
                emoji="🎲"
                title="Ley de Grandes Números"
                description="Con más datos, las estimaciones convergen al valor real"
              />
              <InfoCard
                emoji="📈"
                title="Teorema del Límite Central"
                description="Las medias de muestras siguen distribución normal"
              />
            </div>
          </motion.div>

          {/* Probability Simulator (ya creado) */}
          <ProbabilitySimulator />
        </div>
      </Section>

      {/* Quiz Final */}
      <Section
        title="Evalúa tu Conocimiento"
        icon={Brain}
        color="from-orange-500 to-red-500"
      >
        <InteractiveQuiz
          questions={[
            {
              question: "¿Qué representa cada fila en una matriz de datos?",
              options: [
                "Una característica (feature)",
                "Una observación o ejemplo",
                "Un modelo de ML",
                "Un parámetro"
              ],
              correctAnswer: 1,
              explanation: "Cada fila representa una observación o ejemplo en nuestro dataset. Las columnas son las características (features)."
            },
            {
              question: "¿Para qué usamos el descenso del gradiente?",
              options: [
                "Para visualizar datos",
                "Para limpiar datasets",
                "Para optimizar/entrenar modelos",
                "Para crear gráficos"
              ],
              correctAnswer: 2,
              explanation: "El descenso del gradiente es un algoritmo de optimización usado para encontrar los parámetros óptimos que minimizan la función de costo."
            },
            {
              question: "¿Qué indica una derivada positiva?",
              options: [
                "La función está decreciendo",
                "La función está creciendo",
                "La función es constante",
                "La función tiene un mínimo"
              ],
              correctAnswer: 1,
              explanation: "Una derivada positiva indica que la función está creciendo en ese punto. Si queremos minimizar, debemos movernos en dirección opuesta."
            },
            {
              question: "En el lanzamiento de una moneda justa, después de 1000 lanzamientos, esperamos:",
              options: [
                "Exactamente 500 caras",
                "Aproximadamente 50% caras",
                "Siempre más caras que cruces",
                "Un patrón predecible"
              ],
              correctAnswer: 1,
              explanation: "Por la Ley de Grandes Números, esperamos que el porcentaje converja a 50%, pero el número exacto puede variar."
            },
            {
              question: "¿Qué es una transformación lineal?",
              options: [
                "Cualquier cambio en los datos",
                "Una función que preserva suma y multiplicación escalar",
                "Solo rotaciones",
                "Solo escalados"
              ],
              correctAnswer: 1,
              explanation: "Una transformación lineal preserva las operaciones de suma vectorial y multiplicación por escalar. Incluye rotaciones, escalados, reflexiones, etc."
            }
          ]}
        />
      </Section>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-effect p-8 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🎓 Resumen del Módulo
        </h3>
        <div className="space-y-3 text-gray-700">
          <p>✅ <strong>Álgebra Lineal:</strong> Vectores, matrices, transformaciones lineales</p>
          <p>✅ <strong>Cálculo:</strong> Derivadas, gradientes, optimización</p>
          <p>✅ <strong>Probabilidad:</strong> Distribuciones, ley de grandes números</p>
          <p className="mt-4 text-sm italic">
            Estos fundamentos son esenciales para entender cómo funcionan los algoritmos de machine learning.
            ¡Ahora estás listo para profundizar en estadística y programación!
          </p>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-between items-center pt-12 border-t border-gray-200"
      >
        <Link href="/modulos/introduccion">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Anterior: Introducción
          </motion.button>
        </Link>

        <Link href="/modulos/estadistica">
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 btn-primary"
          >
            Siguiente: Estadística
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
