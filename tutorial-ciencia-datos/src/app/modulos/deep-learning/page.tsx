import { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Zap, Network, Eye, MessageSquare } from "lucide-react";
import NeuralNetworkVisualizer from "@/components/interactive/NeuralNetworkVisualizer";
import ActivationFunctionsDemo from "@/components/interactive/ActivationFunctionsDemo";
import BackpropagationDemo from "@/components/interactive/BackpropagationDemo";
import CNNVisualizer from "@/components/interactive/CNNVisualizer";
import RNNSequenceDemo from "@/components/interactive/RNNSequenceDemo";
import Quiz from "@/components/common/Quiz";

export const metadata: Metadata = {
  title: "Módulo 8: Deep Learning | Tutorial de Ciencia de Datos",
  description: "Aprende sobre redes neuronales, funciones de activación, backpropagation, CNNs y RNNs con visualizaciones interactivas.",
};

const quizQuestions = [
  {
    question: "¿Qué es una función de activación en una red neuronal?",
    options: [
      "Una función que activa la red",
      "Una función no lineal que introduce no linealidad en la red",
      "Una función que desactiva neuronas",
      "Una función de costo"
    ],
    correctAnswer: 1,
    explanation: "Las funciones de activación introducen no linealidad en la red neuronal, permitiendo aprender patrones complejos. Sin ellas, múltiples capas lineales equivaldrían a una sola capa lineal."
  },
  {
    question: "¿Qué algoritmo se usa para entrenar redes neuronales?",
    options: [
      "Forward propagation",
      "K-means",
      "Backpropagation",
      "Gradient ascent"
    ],
    correctAnswer: 2,
    explanation: "Backpropagation (retropropagación) es el algoritmo que calcula gradientes usando la regla de la cadena y actualiza los pesos de la red para minimizar el error."
  },
  {
    question: "¿Qué tipo de red se usa típicamente para procesamiento de imágenes?",
    options: [
      "RNN (Recurrent Neural Network)",
      "CNN (Convolutional Neural Network)",
      "LSTM (Long Short-Term Memory)",
      "GAN (Generative Adversarial Network)"
    ],
    correctAnswer: 1,
    explanation: "Las CNN (Redes Neuronales Convolucionales) están diseñadas específicamente para datos con estructura de cuadrícula como imágenes, usando capas convolucionales que detectan características locales."
  },
  {
    question: "¿Cuál es la principal ventaja de las RNN?",
    options: [
      "Son más rápidas que las CNN",
      "Procesan secuencias y tienen memoria de estados anteriores",
      "No requieren backpropagation",
      "Son más simples que las redes feedforward"
    ],
    correctAnswer: 1,
    explanation: "Las RNN (Redes Neuronales Recurrentes) pueden procesar secuencias de longitud variable y mantener un estado oculto que actúa como 'memoria' de inputs anteriores, ideal para texto, series temporales, etc."
  },
  {
    question: "¿Qué problema resuelve la función de activación ReLU?",
    options: [
      "Overfitting",
      "Vanishing gradient",
      "Exploding gradient",
      "Underfitting"
    ],
    correctAnswer: 1,
    explanation: "ReLU (Rectified Linear Unit) ayuda a mitigar el problema del vanishing gradient que afectaba a funciones como sigmoid y tanh, permitiendo entrenar redes más profundas de manera más eficiente."
  }
];

export default function DeepLearningPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-12 h-12 text-purple-600" />
          <h1 className="text-5xl font-bold text-gray-900">
            Módulo 8: Deep Learning
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explora el fascinante mundo del aprendizaje profundo: redes neuronales,
          funciones de activación, backpropagation, y arquitecturas especializadas
          como CNNs y RNNs.
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
          href="/modulos/machine-learning"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          ← Módulo Anterior
        </Link>
        <Link
          href="/modulos"
          className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
        >
          Ver Todos los Módulos
        </Link>
      </motion.div>

      {/* Section 1: Neural Networks Basics */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Redes Neuronales Básicas
            </h2>
          </div>
          <p className="text-gray-700 text-lg">
            Las redes neuronales son modelos inspirados en el cerebro humano, compuestas
            por capas de neuronas conectadas. Cada neurona recibe inputs, aplica pesos,
            suma, y pasa el resultado por una función de activación.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Visualizador de Red Neuronal
          </h3>
          <p className="text-gray-600 mb-6">
            Explora cómo una red neuronal procesa información desde la capa de entrada
            hasta la capa de salida. Ajusta los pesos y observa cómo cambian las activaciones.
          </p>
          <NeuralNetworkVisualizer />
        </div>
      </motion.section>

      {/* Section 2: Activation Functions */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Funciones de Activación
            </h2>
          </div>
          <p className="text-gray-700 text-lg">
            Las funciones de activación introducen no linealidad en las redes neuronales,
            permitiéndoles aprender patrones complejos. Sin ellas, múltiples capas lineales
            equivaldrían a una sola transformación lineal.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Explorador de Funciones de Activación
          </h3>
          <p className="text-gray-600 mb-6">
            Compara diferentes funciones de activación (Sigmoid, Tanh, ReLU, Leaky ReLU)
            y sus derivadas. Observa sus características y casos de uso.
          </p>
          <ActivationFunctionsDemo />
        </div>
      </motion.section>

      {/* Section 3: Backpropagation */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Backpropagation (Retropropagación)
            </h2>
          </div>
          <p className="text-gray-700 text-lg">
            Backpropagation es el algoritmo fundamental para entrenar redes neuronales.
            Calcula gradientes usando la regla de la cadena, propagando el error desde
            la salida hacia atrás para actualizar los pesos de cada capa.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Visualización de Backpropagation
          </h3>
          <p className="text-gray-600 mb-6">
            Observa paso a paso cómo backpropagation calcula gradientes y actualiza
            pesos. Simula el entrenamiento de una red neuronal simple.
          </p>
          <BackpropagationDemo />
        </div>
      </motion.section>

      {/* Section 4: Convolutional Neural Networks */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              CNNs - Redes Convolucionales
            </h2>
          </div>
          <p className="text-gray-700 text-lg">
            Las CNNs están diseñadas para procesar datos con estructura de cuadrícula
            (imágenes). Usan capas convolucionales para detectar características locales
            como bordes, texturas y patrones complejos de manera jerárquica.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Visualizador de CNN
          </h3>
          <p className="text-gray-600 mb-6">
            Explora cómo funcionan las capas convolucionales, pooling y fully connected.
            Observa cómo los filtros detectan características en una imagen.
          </p>
          <CNNVisualizer />
        </div>
      </motion.section>

      {/* Section 5: Recurrent Neural Networks */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              RNNs - Redes Recurrentes
            </h2>
          </div>
          <p className="text-gray-700 text-lg">
            Las RNNs procesan secuencias manteniendo un estado oculto que actúa como
            memoria. Son ideales para texto, series temporales, audio y cualquier dato
            secuencial donde el orden importa.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Demostración de RNN con Secuencias
          </h3>
          <p className="text-gray-600 mb-6">
            Observa cómo una RNN procesa secuencias paso a paso, manteniendo estado
            entre pasos. Experimenta con predicción de secuencias.
          </p>
          <RNNSequenceDemo />
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
          title="Evalúa tu Conocimiento: Deep Learning"
        />
      </motion.section>

      {/* Key Concepts Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Conceptos Clave de Deep Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-2">Arquitecturas Básicas</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Feedforward: Flujo unidireccional</li>
              <li>• CNN: Datos espaciales (imágenes)</li>
              <li>• RNN/LSTM: Secuencias temporales</li>
              <li>• Transformer: Atención y paralelización</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-2">Componentes Clave</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Neuronas: Unidades computacionales</li>
              <li>• Pesos: Parámetros aprendibles</li>
              <li>• Activaciones: Introducen no linealidad</li>
              <li>• Loss function: Mide el error</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-2">Proceso de Entrenamiento</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Forward pass: Calcular predicciones</li>
              <li>• Loss calculation: Medir error</li>
              <li>• Backward pass: Calcular gradientes</li>
              <li>• Weight update: Optimizar parámetros</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-2">Desafíos Comunes</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Vanishing/Exploding gradients</li>
              <li>• Overfitting: Regularización necesaria</li>
              <li>• Costo computacional: GPUs/TPUs</li>
              <li>• Hiperparámetros: Tuning importante</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
