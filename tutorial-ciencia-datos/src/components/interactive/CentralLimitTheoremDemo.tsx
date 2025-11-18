"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function CentralLimitTheoremDemo() {
  const [sampleSize, setSampleSize] = useState(30);
  const [numSamples, setNumSamples] = useState(100);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Generar datos de distribución no-normal (uniforme)
  const generateUniformSample = (size: number): number[] => {
    return Array.from({ length: size }, () => Math.random() * 100);
  };

  const runSimulation = () => {
    setIsRunning(true);
    const means: number[] = [];

    for (let i = 0; i < numSamples; i++) {
      const sample = generateUniformSample(sampleSize);
      const mean = sample.reduce((a, b) => a + b, 0) / sample.length;
      means.push(mean);
    }

    setSampleMeans(means);
    setIsRunning(false);
  };

  const reset = () => {
    setSampleMeans([]);
  };

  // Calcular estadísticas de las medias
  const meanOfMeans = sampleMeans.length > 0
    ? sampleMeans.reduce((a, b) => a + b, 0) / sampleMeans.length
    : 0;

  const stdDevOfMeans = sampleMeans.length > 0
    ? Math.sqrt(
        sampleMeans.reduce((sum, val) => sum + Math.pow(val - meanOfMeans, 2), 0) /
        sampleMeans.length
      )
    : 0;

  // Crear histograma
  const bins = 20;
  const minMean = Math.min(...sampleMeans, 40);
  const maxMean = Math.max(...sampleMeans, 60);
  const binWidth = (maxMean - minMean) / bins;

  const histogram = Array(bins).fill(0);
  sampleMeans.forEach(mean => {
    const binIndex = Math.min(
      Math.floor((mean - minMean) / binWidth),
      bins - 1
    );
    if (binIndex >= 0) histogram[binIndex]++;
  });

  const maxCount = Math.max(...histogram, 1);

  return (
    <div className="glass-effect p-8 rounded-2xl space-y-6">
      <div>
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Demostración del Teorema del Límite Central
        </h3>
        <p className="text-gray-600">
          Observa cómo las medias de muestras forman una distribución normal,
          sin importar que los datos originales sean uniformes.
        </p>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 glass-effect rounded-xl space-y-3">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700">Tamaño de muestra:</label>
            <span className="font-bold text-blue-600">{sampleSize}</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            disabled={isRunning}
            className="w-full"
          />
        </div>

        <div className="p-4 glass-effect rounded-xl space-y-3">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700">Número de muestras:</label>
            <span className="font-bold text-blue-600">{numSamples}</span>
          </div>
          <input
            type="range"
            min="50"
            max="500"
            step="50"
            value={numSamples}
            onChange={(e) => setNumSamples(parseInt(e.target.value))}
            disabled={isRunning}
            className="w-full"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runSimulation}
          disabled={isRunning}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Play className="w-5 h-5" />
          {isRunning ? 'Ejecutando...' : 'Ejecutar Simulación'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Resetear
        </motion.button>
      </div>

      {/* Histogram */}
      {sampleMeans.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-gray-800">
            Distribución de las Medias Muestrales
          </h4>

          <div className="bg-white p-6 rounded-xl">
            <div className="flex items-end justify-center gap-1 h-64">
              {histogram.map((count, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${(count / maxCount) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                  className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                  style={{ width: `${100 / bins}%` }}
                />
              ))}
            </div>

            {/* Overlay normal curve hint */}
            <div className="text-center mt-4 text-sm text-gray-600">
              <p>¡La distribución se parece cada vez más a una campana normal! 🔔</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <p className="text-xs font-semibold opacity-90 mb-1">Media de Medias</p>
              <p className="text-2xl font-bold">{meanOfMeans.toFixed(2)}</p>
              <p className="text-xs opacity-80">Esperado: ~50</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <p className="text-xs font-semibold opacity-90 mb-1">Desv. Std de Medias</p>
              <p className="text-2xl font-bold">{stdDevOfMeans.toFixed(2)}</p>
              <p className="text-xs opacity-80">Error estándar</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <p className="text-xs font-semibold opacity-90 mb-1">Muestras</p>
              <p className="text-2xl font-bold">{sampleMeans.length}</p>
              <p className="text-xs opacity-80">medias calculadas</p>
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
        <h4 className="font-bold text-gray-800 mb-3">
          ✨ ¿Qué estamos viendo?
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            1. <strong>Datos originales:</strong> Distribución uniforme (0-100)
          </p>
          <p>
            2. <strong>Proceso:</strong> Tomamos {numSamples} muestras de tamaño {sampleSize}
          </p>
          <p>
            3. <strong>Resultado:</strong> Las medias forman una distribución NORMAL (campana)
          </p>
          <p className="mt-3 italic">
            <strong>Teorema del Límite Central:</strong> Sin importar la distribución original,
            las medias de muestras grandes tienden a seguir una distribución normal.
            Esto es fundamental para hacer inferencias estadísticas.
          </p>
        </div>
      </div>
    </div>
  );
}
