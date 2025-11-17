"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, GitBranch, Layers, Target, CheckCircle } from "lucide-react";
import LinearRegressionDemo from "@/components/interactive/LinearRegressionDemo";
import LogisticRegressionDemo from "@/components/interactive/LogisticRegressionDemo";
import DecisionTreeVisualizer from "@/components/interactive/DecisionTreeVisualizer";
import KMeansClusteringDemo from "@/components/interactive/KMeansClusteringDemo";
import ModelValidationDemo from "@/components/interactive/ModelValidationDemo";
import { useState } from "react";

export default function MachineLearningPage() {
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const quizQuestions = [
    {
      question: "¿Qué algoritmo usarías para predecir el precio de una casa?",
      options: ["Regresión Lineal", "K-Means", "Clasificación Logística", "PCA"],
      correct: "Regresión Lineal"
    },
    {
      question: "¿Cuál es el problema principal del overfitting?",
      options: [
        "El modelo es muy simple",
        "El modelo memoriza datos de entrenamiento y no generaliza",
        "El modelo es muy rápido",
        "El modelo no aprende nada"
      ],
      correct: "El modelo memoriza datos de entrenamiento y no generaliza"
    },
    {
      question: "¿Qué técnica se usa para evaluar modelos de forma robusta?",
      options: ["Entrenar solo una vez", "Cross-validation", "Usar todos los datos para entrenar", "Ignorar métricas"],
      correct: "Cross-validation"
    },
    {
      question: "¿K-Means es un algoritmo de aprendizaje...?",
      options: ["Supervisado", "No supervisado", "Reforzado", "Semi-supervisado"],
      correct: "No supervisado"
    },
    {
      question: "¿Qué métrica es apropiada para clasificación binaria desbalanceada?",
      options: ["Accuracy", "F1-Score o AUC-ROC", "R²", "MSE"],
      correct: "F1-Score o AUC-ROC"
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
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full mb-4">
          <Brain className="w-5 h-5" />
          <span className="font-semibold">Módulo 7</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Machine Learning Clásico
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Aprende los algoritmos fundamentales que transforman datos en predicciones
        </p>
      </motion.div>

      {/* ML Types Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
          <Target className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">Supervisado</h3>
          <p className="text-sm text-blue-800">
            Aprendemos de datos etiquetados para hacer predicciones
          </p>
          <div className="mt-3 text-xs text-blue-700">
            Ejemplos: Regresión, Clasificación
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-6">
          <Layers className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-purple-900 mb-2">No Supervisado</h3>
          <p className="text-sm text-purple-800">
            Encontramos patrones ocultos en datos sin etiquetas
          </p>
          <div className="mt-3 text-xs text-purple-700">
            Ejemplos: Clustering, PCA
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
          <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-bold text-green-900 mb-2">Validación</h3>
          <p className="text-sm text-green-800">
            Evaluamos qué tan bien generaliza nuestro modelo
          </p>
          <div className="mt-3 text-xs text-green-700">
            Ejemplos: Cross-validation, Métricas
          </div>
        </div>
      </motion.div>

      {/* Section 1: Regresión Lineal */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Regresión Lineal</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Predicción de Valores Continuos</h3>
          <p className="text-gray-600 mb-6">
            Aprende cómo encontrar la mejor línea que se ajusta a tus datos para hacer predicciones.
          </p>
          <LinearRegressionDemo />
        </div>
      </motion.section>

      {/* Section 2: Clasificación Logística */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Clasificación Logística</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Clasificación Binaria</h3>
          <p className="text-gray-600 mb-6">
            Predice categorías (Sí/No, Spam/No Spam) usando regresión logística.
          </p>
          <LogisticRegressionDemo />
        </div>
      </motion.section>

      {/* Section 3: Árboles de Decisión */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <GitBranch className="w-8 h-8 text-orange-600" />
          <h2 className="text-3xl font-bold text-gray-800">Árboles de Decisión</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Decisiones Basadas en Reglas</h3>
          <p className="text-gray-600 mb-6">
            Visualiza cómo los árboles dividen el espacio de decisión paso a paso.
          </p>
          <DecisionTreeVisualizer />
        </div>
      </motion.section>

      {/* Section 4: K-Means Clustering */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">K-Means Clustering</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Agrupamiento No Supervisado</h3>
          <p className="text-gray-600 mb-6">
            Descubre grupos naturales en tus datos sin etiquetas previas.
          </p>
          <KMeansClusteringDemo />
        </div>
      </motion.section>

      {/* Section 5: Validación de Modelos */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="w-8 h-8 text-pink-600" />
          <h2 className="text-3xl font-bold text-gray-800">Validación y Métricas</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Evalúa tus Modelos</h3>
          <p className="text-gray-600 mb-6">
            Aprende sobre overfitting, underfitting, y cómo medir el rendimiento correctamente.
          </p>
          <ModelValidationDemo />
        </div>
      </motion.section>

      {/* Quiz */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8" />
            Quiz de Machine Learning
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
                  ? "¡Perfecto! Dominas Machine Learning 🎉"
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
          href="/modulos/visualizacion"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          ← Módulo Anterior
        </a>
        <a
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
        >
          Volver al Inicio
        </a>
      </motion.div>
    </div>
  );
}
