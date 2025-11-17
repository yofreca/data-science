"use client";

import { motion } from "framer-motion";
import { Code, Database, GitBranch, Terminal, CheckCircle } from "lucide-react";
import PythonSyntaxDemo from "@/components/interactive/PythonSyntaxDemo";
import DataStructuresVisualizer from "@/components/interactive/DataStructuresVisualizer";
import PandasDataFrameDemo from "@/components/interactive/PandasDataFrameDemo";
import SQLQueryBuilder from "@/components/interactive/SQLQueryBuilder";
import GitFlowVisualizer from "@/components/interactive/GitFlowVisualizer";
import { useState } from "react";

export default function ProgramacionPage() {
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const quizQuestions = [
    {
      question: "¿Cuál es la estructura de datos más eficiente para búsquedas rápidas en Python?",
      options: ["Lista", "Tupla", "Diccionario", "String"],
      correct: "Diccionario"
    },
    {
      question: "¿Qué comando SQL se usa para combinar datos de dos tablas?",
      options: ["MERGE", "JOIN", "COMBINE", "UNION"],
      correct: "JOIN"
    },
    {
      question: "¿Qué comando de Git se usa para crear una nueva rama?",
      options: ["git new", "git branch", "git create", "git fork"],
      correct: "git branch"
    },
    {
      question: "¿Qué librería de Python es fundamental para análisis de datos tabulares?",
      options: ["NumPy", "Pandas", "Matplotlib", "Scikit-Learn"],
      correct: "Pandas"
    },
    {
      question: "¿Qué operación SQL se usa para filtrar filas?",
      options: ["SELECT", "WHERE", "FILTER", "HAVING"],
      correct: "WHERE"
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
          <Code className="w-5 h-5" />
          <span className="font-semibold">Módulo 4</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Programación para Ciencia de Datos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Domina Python, SQL y Git - las herramientas esenciales del científico de datos
        </p>
      </motion.div>

      {/* Section 1: Python Básico */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <Terminal className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Python: Sintaxis y Estructuras</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Simulador de Código Python</h3>
          <p className="text-gray-600 mb-6">
            Experimenta con código Python en tiempo real. Prueba diferentes sintaxis y ve los resultados.
          </p>
          <PythonSyntaxDemo />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Visualizador de Estructuras de Datos</h3>
          <p className="text-gray-600 mb-6">
            Explora cómo funcionan las listas, diccionarios, sets y tuplas en Python.
          </p>
          <DataStructuresVisualizer />
        </div>
      </motion.section>

      {/* Section 2: Pandas */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-8 h-8 text-pink-600" />
          <h2 className="text-3xl font-bold text-gray-800">Pandas: Análisis de Datos</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Simulador de DataFrame</h3>
          <p className="text-gray-600 mb-6">
            Aprende a manipular DataFrames con operaciones comunes: filtrado, agrupación, y más.
          </p>
          <PandasDataFrameDemo />
        </div>
      </motion.section>

      {/* Section 3: SQL */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">SQL: Bases de Datos</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Constructor de Queries SQL</h3>
          <p className="text-gray-600 mb-6">
            Practica SELECT, JOIN, WHERE y GROUP BY con una base de datos interactiva.
          </p>
          <SQLQueryBuilder />
        </div>
      </motion.section>

      {/* Section 4: Git */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-6">
          <GitBranch className="w-8 h-8 text-orange-600" />
          <h2 className="text-3xl font-bold text-gray-800">Git: Control de Versiones</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Visualizador de Flujo Git</h3>
          <p className="text-gray-600 mb-6">
            Entiende commits, branches y merges con animaciones interactivas.
          </p>
          <GitFlowVisualizer />
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
            Quiz de Programación
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
                      <span>{option}</span>
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
                  ? "¡Perfecto! Dominas la programación para ciencia de datos 🎉"
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
          href="/modulos/estadistica"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          ← Módulo Anterior
        </a>
        <a
          href="/modulos/limpieza-datos"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold"
        >
          Siguiente Módulo →
        </a>
      </motion.div>
    </div>
  );
}
