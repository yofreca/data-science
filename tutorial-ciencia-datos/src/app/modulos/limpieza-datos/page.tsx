"use client";

import { motion } from "framer-motion";
import { Brush, Database, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import DataTypesExplorer from "@/components/interactive/DataTypesExplorer";
import MissingValuesHandler from "@/components/interactive/MissingValuesHandler";
import OutlierDetector from "@/components/interactive/OutlierDetector";
import NormalizationDemo from "@/components/interactive/NormalizationDemo";
import DataCleaningPipeline from "@/components/interactive/DataCleaningPipeline";
import { useState } from "react";

export default function LimpiezaDatosPage() {
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const quizQuestions = [
    {
      question: "¿Cuál es el método más común para manejar valores faltantes en datos numéricos?",
      options: ["Eliminar todas las filas", "Imputación con la media/mediana", "Dejar los valores vacíos", "Convertir a string"],
      correct: "Imputación con la media/mediana"
    },
    {
      question: "¿Qué método detecta outliers usando la distancia de 1.5*IQR?",
      options: ["Z-Score", "Boxplot/IQR", "Percentiles", "Media"],
      correct: "Boxplot/IQR"
    },
    {
      question: "¿Cuál es la diferencia entre normalización y estandarización?",
      options: [
        "Son lo mismo",
        "Normalización escala a [0,1], estandarización a media=0 y std=1",
        "Normalización es mejor siempre",
        "Estandarización solo funciona con datos positivos"
      ],
      correct: "Normalización escala a [0,1], estandarización a media=0 y std=1"
    },
    {
      question: "¿Cuándo es apropiado eliminar filas con valores faltantes?",
      options: [
        "Siempre",
        "Nunca",
        "Cuando el porcentaje es pequeño (<5%) y los datos son MCAR",
        "Solo con datos categóricos"
      ],
      correct: "Cuando el porcentaje es pequeño (<5%) y los datos son MCAR"
    },
    {
      question: "¿Qué técnica NO es apropiada para detectar outliers?",
      options: ["Z-Score", "IQR", "Boxplot", "Ordenar alfabéticamente"],
      correct: "Ordenar alfabéticamente"
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
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full mb-4">
          <Brush className="w-5 h-5" />
          <span className="font-semibold">Módulo 5</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Limpieza y Manipulación de Datos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          El 80% del tiempo en ciencia de datos se dedica a limpiar datos - aprende a hacerlo bien
        </p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-lg mb-12"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-800 mb-2">¿Por qué es tan importante?</h3>
            <p className="text-gray-700 text-sm">
              Los datos del mundo real están sucios: valores faltantes, outliers, formatos inconsistentes,
              duplicados... Un buen científico de datos debe dominar las técnicas de limpieza para obtener
              resultados confiables.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section 1: Tipos de Datos */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Tipos de Datos</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Explorador de Tipos de Datos</h3>
          <p className="text-gray-600 mb-6">
            Entiende los diferentes tipos de datos y cómo detectarlos automáticamente.
          </p>
          <DataTypesExplorer />
        </div>
      </motion.section>

      {/* Section 2: Valores Faltantes */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-orange-600" />
          <h2 className="text-3xl font-bold text-gray-800">Valores Faltantes</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Manejador de Valores Faltantes</h3>
          <p className="text-gray-600 mb-6">
            Aprende diferentes estrategias: eliminación, imputación simple, y técnicas avanzadas.
          </p>
          <MissingValuesHandler />
        </div>
      </motion.section>

      {/* Section 3: Outliers */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">Detección de Outliers</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Detector de Outliers</h3>
          <p className="text-gray-600 mb-6">
            Identifica valores atípicos con Z-Score, IQR y visualización con boxplots.
          </p>
          <OutlierDetector />
        </div>
      </motion.section>

      {/* Section 4: Normalización */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Normalización y Estandarización</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Demo de Transformaciones</h3>
          <p className="text-gray-600 mb-6">
            Compara Min-Max Scaling, Z-Score Standardization y otras transformaciones.
          </p>
          <NormalizationDemo />
        </div>
      </motion.section>

      {/* Section 5: Pipeline Completo */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <Brush className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Pipeline de Limpieza</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Flujo Completo de Limpieza</h3>
          <p className="text-gray-600 mb-6">
            Aplica todas las técnicas en un pipeline paso a paso con un dataset real.
          </p>
          <DataCleaningPipeline />
        </div>
      </motion.section>

      {/* Quiz */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8" />
            Quiz de Limpieza de Datos
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
            className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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
                  ? "¡Perfecto! Dominas la limpieza de datos 🎉"
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
          href="/modulos/programacion"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          ← Módulo Anterior
        </a>
        <a
          href="/modulos/visualizacion"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors font-semibold"
        >
          Siguiente Módulo →
        </a>
      </motion.div>
    </div>
  );
}
