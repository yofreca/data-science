import { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban, BarChart3, Star, MessageCircle, TrendingDown, AlertTriangle } from "lucide-react";
import ExploratoryDataAnalysis from "@/components/interactive/ExploratoryDataAnalysis";
import RecommendationSystemDemo from "@/components/interactive/RecommendationSystemDemo";
import SentimentAnalysisDemo from "@/components/interactive/SentimentAnalysisDemo";
import ChurnPredictionDemo from "@/components/interactive/ChurnPredictionDemo";
import AnomalyDetectionDemo from "@/components/interactive/AnomalyDetectionDemo";
import Quiz from "@/components/common/Quiz";

export const metadata: Metadata = {
  title: "Módulo 9: Proyectos Reales | Tutorial de Ciencia de Datos",
  description: "Explora proyectos prácticos de ciencia de datos: EDA, sistemas de recomendación, análisis de sentimientos, predicción de churn y detección de anomalías.",
};

const quizQuestions = [
  {
    question: "¿Cuál es el primer paso en cualquier proyecto de ciencia de datos?",
    options: [
      "Entrenar el modelo",
      "Análisis Exploratorio de Datos (EDA)",
      "Deployment",
      "Limpieza de datos"
    ],
    correctAnswer: 1,
    explanation: "El EDA (Exploratory Data Analysis) es crucial para entender los datos antes de cualquier modelado. Ayuda a identificar patrones, outliers, correlaciones y guía las decisiones de preprocesamiento."
  },
  {
    question: "¿Qué técnica usa un sistema de recomendación basado en contenido?",
    options: [
      "Busca usuarios similares",
      "Compara características de los items",
      "Usa clustering k-means",
      "Predice valores futuros"
    ],
    correctAnswer: 1,
    explanation: "Los sistemas basados en contenido (content-based) recomiendan items similares a los que el usuario ya le gustaron, comparando características de los items (género, categoría, descripción, etc.)."
  },
  {
    question: "En análisis de sentimientos, ¿qué es un falso positivo?",
    options: [
      "Clasificar como positivo algo que es negativo",
      "Clasificar como negativo algo que es positivo",
      "No detectar sentimiento",
      "Detectar sentimiento neutral"
    ],
    correctAnswer: 0,
    explanation: "Un falso positivo ocurre cuando el modelo clasifica un texto negativo como positivo. Es importante monitorear estos errores para evaluar el desempeño del modelo."
  },
  {
    question: "¿Qué métrica es más importante para predecir churn?",
    options: [
      "Accuracy",
      "Recall (sensibilidad)",
      "Precisión",
      "F1-Score"
    ],
    correctAnswer: 1,
    explanation: "En predicción de churn, el Recall es crítico porque queremos identificar la mayor cantidad posible de clientes que se irán (verdaderos positivos), incluso si significa algunos falsos positivos. Perder un cliente es costoso."
  },
  {
    question: "¿Qué método es común para detectar anomalías?",
    options: [
      "Regresión lineal",
      "Decision trees",
      "Isolation Forest o Z-score",
      "K-means clustering"
    ],
    correctAnswer: 2,
    explanation: "Isolation Forest y métodos estadísticos como Z-score son muy efectivos para detección de anomalías. Isolation Forest aísla outliers en árboles, mientras que Z-score identifica puntos fuera de N desviaciones estándar."
  }
];

export default function ProyectosRealesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <FolderKanban className="w-12 h-12 text-indigo-600" />
          <h1 className="text-5xl font-bold text-gray-900">
            Módulo 9: Proyectos Reales
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Aplica todo lo aprendido en proyectos prácticos de ciencia de datos:
          desde análisis exploratorio hasta sistemas de recomendación, sentiment analysis,
          predicción de churn y detección de anomalías.
        </p>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 flex gap-4 justify-center flex-wrap"
      >
        <Link
          href="/modulos/deep-learning"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          ← Módulo Anterior
        </Link>
        <Link
          href="/modulos"
          className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
        >
          Ver Todos los Módulos
        </Link>
      </motion.div>

      {/* Section 1: Exploratory Data Analysis */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Análisis Exploratorio de Datos (EDA)
            </h2>
          </div>
          <p className="text-gray-700 text-lg">
            El EDA es el primer paso crucial en cualquier proyecto. Permite entender
            la estructura de los datos, identificar patrones, detectar outliers,
            y descubrir relaciones entre variables antes de construir modelos.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            EDA Interactivo - Dataset de Ventas
          </h3>
          <p className="text-gray-600 mb-6">
            Explora un dataset simulado de ventas. Visualiza distribuciones,
            correlaciones, y obtén insights clave para tomar decisiones basadas en datos.
          </p>
          <ExploratoryDataAnalysis />
        </div>
      </motion.section>

      {/* Section 2: Recommendation System */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Sistema de Recomendación
            </h2>
          </div>
          <p className="text-gray-700 text-lg">
            Los sistemas de recomendación son fundamentales en e-commerce, streaming,
            y redes sociales. Usan filtrado colaborativo o basado en contenido para
            sugerir items relevantes a los usuarios.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Sistema de Recomendación de Películas
          </h3>
          <p className="text-gray-600 mb-6">
            Simula un sistema de recomendación basado en similitud de contenido.
            Selecciona películas que te gustan y obtén recomendaciones personalizadas.
          </p>
          <RecommendationSystemDemo />
        </div>
      </motion.section>

      {/* Section 3: Sentiment Analysis */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Análisis de Sentimientos
            </h2>
          </div>
          <p className="text-gray-700 text-lg">
            El análisis de sentimientos extrae opiniones de texto (reviews, tweets, comentarios).
            Usa NLP para clasificar texto como positivo, negativo o neutral,
            ayudando a empresas a entender la percepción de sus productos.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Clasificador de Sentimientos
          </h3>
          <p className="text-gray-600 mb-6">
            Analiza el sentimiento de reviews de productos. El modelo usa
            palabras clave y patrones lingüísticos para clasificar opiniones.
          </p>
          <SentimentAnalysisDemo />
        </div>
      </motion.section>

      {/* Section 4: Churn Prediction */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Predicción de Churn (Abandono de Clientes)
            </h2>
          </div>
          <p className="text-gray-700 text-lg">
            Predecir qué clientes abandonarán el servicio es crítico para retención.
            Modelos de ML identifican patrones de comportamiento que indican riesgo
            de churn, permitiendo intervención proactiva.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Modelo de Predicción de Churn
          </h3>
          <p className="text-gray-600 mb-6">
            Analiza características de clientes (tenure, uso, quejas) para predecir
            probabilidad de churn. Identifica factores de riesgo clave.
          </p>
          <ChurnPredictionDemo />
        </div>
      </motion.section>

      {/* Section 5: Anomaly Detection */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Detección de Anomalías
            </h2>
          </div>
          <p className="text-gray-700 text-lg">
            La detección de anomalías identifica patrones inusuales en datos:
            fraude en transacciones, fallas en sistemas, comportamiento anómalo.
            Es crucial para seguridad, mantenimiento predictivo y control de calidad.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Sistema de Detección de Anomalías
          </h3>
          <p className="text-gray-600 mb-6">
            Detecta transacciones fraudulentas usando métodos estadísticos
            y machine learning. Visualiza puntos normales vs anómalos.
          </p>
          <AnomalyDetectionDemo />
        </div>
      </motion.section>

      {/* Quiz */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <Quiz
          questions={quizQuestions}
          title="Evalúa tu Conocimiento: Proyectos Reales"
        />
      </motion.section>

      {/* Project Workflow Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Flujo de Trabajo en Proyectos de Data Science
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-indigo-900 mb-3">Fase 1: Preparación</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Definir problema de negocio</li>
              <li>• Recolectar y explorar datos (EDA)</li>
              <li>• Limpiar y preprocesar datos</li>
              <li>• Feature engineering</li>
              <li>• Dividir train/test sets</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-indigo-900 mb-3">Fase 2: Modelado</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Seleccionar algoritmos candidatos</li>
              <li>• Entrenar modelos baseline</li>
              <li>• Hyperparameter tuning</li>
              <li>• Validación cruzada</li>
              <li>• Evaluar métricas relevantes</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-indigo-900 mb-3">Fase 3: Deployment</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Testing en producción</li>
              <li>• Crear API/servicio</li>
              <li>• Monitoreo de performance</li>
              <li>• Reentrenamiento periódico</li>
              <li>• Documentación y reporting</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
