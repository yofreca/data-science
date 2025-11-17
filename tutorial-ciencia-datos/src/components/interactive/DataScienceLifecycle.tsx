"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

const lifecycleSteps = [
  {
    id: 1,
    title: "Definición del Problema",
    description: "Entender qué problema queremos resolver y qué preguntas debemos responder",
    color: "from-blue-500 to-cyan-500",
    icon: "🎯"
  },
  {
    id: 2,
    title: "Recolección de Datos",
    description: "Obtener los datos necesarios de diversas fuentes: bases de datos, APIs, web scraping, etc.",
    color: "from-purple-500 to-pink-500",
    icon: "📥"
  },
  {
    id: 3,
    title: "Limpieza de Datos",
    description: "Procesar y limpiar los datos: manejar valores faltantes, outliers, duplicados",
    color: "from-green-500 to-emerald-500",
    icon: "🧹"
  },
  {
    id: 4,
    title: "Análisis Exploratorio (EDA)",
    description: "Explorar los datos para encontrar patrones, tendencias y relaciones",
    color: "from-yellow-500 to-orange-500",
    icon: "🔍"
  },
  {
    id: 5,
    title: "Modelado",
    description: "Crear y entrenar modelos de machine learning o estadísticos",
    color: "from-red-500 to-pink-500",
    icon: "🤖"
  },
  {
    id: 6,
    title: "Evaluación",
    description: "Validar el modelo y medir su rendimiento con métricas apropiadas",
    color: "from-indigo-500 to-purple-500",
    icon: "📊"
  },
  {
    id: 7,
    title: "Deployment",
    description: "Poner el modelo en producción para que pueda ser utilizado",
    color: "from-cyan-500 to-blue-500",
    icon: "🚀"
  },
  {
    id: 8,
    title: "Monitoreo",
    description: "Supervisar el rendimiento del modelo en producción y actualizarlo cuando sea necesario",
    color: "from-teal-500 to-green-500",
    icon: "👁️"
  }
];

export default function DataScienceLifecycle() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const handleNext = () => {
    const nextStep = (activeStep + 1) % lifecycleSteps.length;
    handleStepClick(nextStep);
  };

  const handlePrevious = () => {
    const prevStep = activeStep === 0 ? lifecycleSteps.length - 1 : activeStep - 1;
    handleStepClick(prevStep);
  };

  return (
    <div className="space-y-8">
      {/* Visual Lifecycle */}
      <div className="glass-effect p-8 rounded-2xl">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {lifecycleSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleStepClick(index)}
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-4 rounded-xl transition-all ${
                  activeStep === index
                    ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                    : "bg-white text-gray-700 hover:shadow-md"
                }`}
              >
                {/* Step Icon */}
                <div className="text-3xl mb-2">{step.icon}</div>

                {/* Step Number */}
                <div className="text-xs font-bold mb-1">PASO {step.id}</div>

                {/* Step Title */}
                <div className="text-sm font-semibold line-clamp-2">
                  {step.title}
                </div>

                {/* Completion Indicator */}
                {completedSteps.includes(index) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </motion.div>
                )}

                {/* Active Indicator */}
                {activeStep === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.div>

              {/* Arrow Connector */}
              {index < lifecycleSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <div className="text-gray-300 text-2xl">→</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Active Step Details */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-6 rounded-xl bg-gradient-to-br ${lifecycleSteps[activeStep].color} text-white`}
        >
          <div className="flex items-start gap-4">
            <div className="text-6xl">{lifecycleSteps[activeStep].icon}</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">
                {lifecycleSteps[activeStep].title}
              </h3>
              <p className="text-white/90 leading-relaxed">
                {lifecycleSteps[activeStep].description}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors"
            >
              ← Anterior
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="px-4 py-2 bg-white text-gray-800 hover:bg-white/90 rounded-lg font-semibold transition-colors"
            >
              Siguiente →
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="glass-effect p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Progreso de Exploración
          </span>
          <span className="text-sm font-bold gradient-text">
            {completedSteps.length}/{lifecycleSteps.length} pasos
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(completedSteps.length / lifecycleSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
          />
        </div>
      </div>
    </div>
  );
}
