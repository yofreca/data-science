"use client";

import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp, Palette, CheckCircle, Eye } from "lucide-react";
import VisualizationPrinciples from "@/components/interactive/VisualizationPrinciples";
import ChartTypeSelector from "@/components/interactive/ChartTypeSelector";
import ColorTheoryDemo from "@/components/interactive/ColorTheoryDemo";
import InteractivePlotBuilder from "@/components/interactive/InteractivePlotBuilder";
import ChartComparison from "@/components/interactive/ChartComparison";
import { useState } from "react";

export default function VisualizacionPage() {
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const quizQuestions = [
    {
      question: "¿Qué tipo de gráfico es mejor para mostrar la evolución de una variable en el tiempo?",
      options: ["Gráfico de barras", "Gráfico de líneas", "Gráfico de torta", "Histograma"],
      correct: "Gráfico de líneas"
    },
    {
      question: "¿Cuál es el problema principal de usar gráficos de torta (pie charts)?",
      options: [
        "Son difíciles de crear",
        "Los humanos son malos comparando ángulos",
        "No se pueden colorear",
        "Solo funcionan con 2 categorías"
      ],
      correct: "Los humanos son malos comparando ángulos"
    },
    {
      question: "¿Qué paleta de colores es apropiada para personas con daltonismo?",
      options: [
        "Rojo-Verde intenso",
        "Viridis o ColorBrewer",
        "Solo tonos de rojo",
        "Colores aleatorios"
      ],
      correct: "Viridis o ColorBrewer"
    },
    {
      question: "¿Para qué sirve un boxplot?",
      options: [
        "Mostrar tendencias temporales",
        "Comparar proporciones",
        "Visualizar distribución y outliers",
        "Mostrar correlaciones"
      ],
      correct: "Visualizar distribución y outliers"
    },
    {
      question: "¿Cuál es la regla de oro del data-ink ratio de Edward Tufte?",
      options: [
        "Usar muchos colores",
        "Maximizar la tinta que muestra datos vs decoración",
        "Siempre usar 3D",
        "Incluir muchas leyendas"
      ],
      correct: "Maximizar la tinta que muestra datos vs decoración"
    }
  ];

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  const correctAnswers = quizQuestions.filter(
    (q, idx) => quizAnswers[idx] === q.correct
  ).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full mb-4">
          <BarChart3 className="w-5 h-5" />
          <span className="font-semibold">Módulo 6</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Visualización de Datos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Una imagen vale más que mil datos - aprende a comunicar insights de forma efectiva
        </p>
      </motion.div>

      {/* Quote Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg mb-12"
      >
        <div className="flex items-start gap-3">
          <Eye className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-gray-700 italic mb-2">
              "The greatest value of a picture is when it forces us to notice what we never expected to see."
            </p>
            <p className="text-sm text-gray-600">— John Tukey, pionero de la visualización de datos</p>
          </div>
        </div>
      </motion.div>

      {/* Section 1: Principios de Visualización */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Principios de Diseño Visual</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Fundamentos de Percepción Visual</h3>
          <p className="text-gray-600 mb-6">
            El cerebro humano procesa información visual de formas específicas. Aprende los principios fundamentales.
          </p>
          <VisualizationPrinciples />
        </div>
      </motion.section>

      {/* Section 2: Tipos de Gráficos */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Tipos de Gráficos</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Selector de Gráficos Interactivo</h3>
          <p className="text-gray-600 mb-6">
            Explora diferentes tipos de visualizaciones y aprende cuándo usar cada una.
          </p>
          <ChartTypeSelector />
        </div>
      </motion.section>

      {/* Section 3: Teoría del Color */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-8 h-8 text-pink-600" />
          <h2 className="text-3xl font-bold text-gray-800">Teoría del Color</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Paletas de Colores</h3>
          <p className="text-gray-600 mb-6">
            Los colores comunican información. Aprende a elegir paletas efectivas y accesibles.
          </p>
          <ColorTheoryDemo />
        </div>
      </motion.section>

      {/* Section 4: Constructor Interactivo */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Constructor de Gráficos</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Crea tu Propia Visualización</h3>
          <p className="text-gray-600 mb-6">
            Experimenta con datos reales y crea gráficos personalizados paso a paso.
          </p>
          <InteractivePlotBuilder />
        </div>
      </motion.section>

      {/* Section 5: Comparación */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="w-8 h-8 text-orange-600" />
          <h2 className="text-3xl font-bold text-gray-800">Buenas vs Malas Prácticas</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Comparación de Visualizaciones</h3>
          <p className="text-gray-600 mb-6">
            Los mismos datos pueden contarse de forma muy diferente. Aprende qué hacer y qué evitar.
          </p>
          <ChartComparison />
        </div>
      </motion.section>

      {/* Quiz */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8" />
            Quiz de Visualización
          </h2>

          <div className="space-y-6">
            {quizQuestions.map((q, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <p className="font-semibold mb-4 text-lg">{idx + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={option}
                        checked={quizAnswers[idx] === option}
                        onChange={(e) =>
                          setQuizAnswers({ ...quizAnswers, [idx]: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
                {showResults && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    quizAnswers[idx] === q.correct
                      ? 'bg-green-500/20 border border-green-300'
                      : 'bg-red-500/20 border border-red-300'
                  }`}>
                    {quizAnswers[idx] === q.correct ? (
                      <p className="font-semibold">¡Correcto! ✓</p>
                    ) : (
                      <p className="font-semibold">
                        Incorrecto. La respuesta correcta es: {q.correct}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleQuizSubmit}
            className="mt-8 bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Verificar Respuestas
          </button>

          {showResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-6"
            >
              <p className="text-2xl font-bold">
                Resultado: {correctAnswers} de {quizQuestions.length} correctas
              </p>
              <p className="text-lg mt-2">
                {correctAnswers === quizQuestions.length
                  ? "¡Perfecto! Dominas la visualización de datos 🎉"
                  : correctAnswers >= 3
                  ? "¡Buen trabajo! Sigue practicando 👍"
                  : "Revisa el material y vuelve a intentarlo 📚"}
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mt-12 mb-8"
      >
        <a
          href="/modulos/limpieza-datos"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          ← Módulo Anterior
        </a>
        <a
          href="/modulos/machine-learning"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold"
        >
          Siguiente Módulo →
        </a>
      </motion.div>
    </div>
  );
}
