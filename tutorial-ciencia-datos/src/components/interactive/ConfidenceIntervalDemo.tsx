"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function ConfidenceIntervalDemo() {
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [sampleSize, setSampleSize] = useState(30);
  const [intervals, setIntervals] = useState<Array<{ lower: number; upper: number; containsMean: boolean }>>([]);
  const [numIntervals, setNumIntervals] = useState(20);

  const trueMean = 50; // Media poblacional verdadera
  const trueStdDev = 15; // Desviación estándar poblacional

  // Z-scores para diferentes niveles de confianza
  const getZScore = (confidence: number) => {
    if (confidence === 90) return 1.645;
    if (confidence === 95) return 1.96;
    if (confidence === 99) return 2.576;
    return 1.96;
  };

  const generateSample = (size: number): number[] => {
    // Generar muestra normal
    return Array.from({ length: size }, () => {
      // Box-Muller transform para generar números normales
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return trueMean + z * trueStdDev;
    });
  };

  const calculateConfidenceInterval = (sample: number[]) => {
    const mean = sample.reduce((a, b) => a + b, 0) / sample.length;
    const stdDev = Math.sqrt(
      sample.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (sample.length - 1)
    );
    const standardError = stdDev / Math.sqrt(sample.length);
    const zScore = getZScore(confidenceLevel);
    const margin = zScore * standardError;

    return {
      lower: mean - margin,
      upper: mean + margin,
      containsMean: mean - margin <= trueMean && trueMean <= mean + margin
    };
  };

  const runSimulation = () => {
    const newIntervals = [];
    for (let i = 0; i < numIntervals; i++) {
      const sample = generateSample(sampleSize);
      const interval = calculateConfidenceInterval(sample);
      newIntervals.push(interval);
    }
    setIntervals(newIntervals);
  };

  const reset = () => {
    setIntervals([]);
  };

  const countContaining = intervals.filter(i => i.containsMean).length;
  const percentage = intervals.length > 0
    ? (countContaining / intervals.length) * 100
    : 0;

  return (
    <div className="glass-effect p-8 rounded-2xl space-y-6">
      <div>
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Simulador de Intervalos de Confianza
        </h3>
        <p className="text-gray-600">
          Observa cómo aproximadamente el {confidenceLevel}% de los intervalos
          contienen la media verdadera (μ = {trueMean}).
        </p>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-4 glass-effect rounded-xl space-y-3">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700">Nivel de confianza:</label>
            <span className="font-bold text-blue-600">{confidenceLevel}%</span>
          </div>
          <select
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="90">90%</option>
            <option value="95">95%</option>
            <option value="99">99%</option>
          </select>
        </div>

        <div className="p-4 glass-effect rounded-xl space-y-3">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700">Tamaño de muestra:</label>
            <span className="font-bold text-blue-600">{sampleSize}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="p-4 glass-effect rounded-xl space-y-3">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700">Num. intervalos:</label>
            <span className="font-bold text-blue-600">{numIntervals}</span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            step="10"
            value={numIntervals}
            onChange={(e) => setNumIntervals(parseInt(e.target.value))}
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
          className="btn-primary flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Generar Intervalos
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

      {/* Visualization */}
      {intervals.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-gray-800">
            Intervalos de Confianza Generados
          </h4>

          <div className="bg-white p-6 rounded-xl">
            {/* True mean line */}
            <div className="relative mb-4">
              <div className="absolute left-1/2 w-0.5 h-full bg-red-500 z-10" style={{ transform: 'translateX(-50%)' }} />
              <p className="absolute left-1/2 -top-6 transform -translate-x-1/2 text-xs font-bold text-red-600">
                μ = {trueMean}
              </p>
            </div>

            {/* Intervals */}
            <div className="space-y-2">
              {intervals.map((interval, i) => {
                const range = 100; // visual range
                const center = trueMean;
                const leftPercent = ((interval.lower - (center - range / 2)) / range) * 100;
                const widthPercent = ((interval.upper - interval.lower) / range) * 100;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative h-6"
                  >
                    <div
                      className={`absolute h-2 rounded-full ${
                        interval.containsMean
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        left: `${Math.max(0, Math.min(100, leftPercent))}%`,
                        width: `${Math.max(0, Math.min(100, widthPercent))}%`,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                    {/* Endpoints */}
                    <div
                      className={`absolute w-2 h-2 rounded-full ${
                        interval.containsMean ? 'bg-green-700' : 'bg-red-700'
                      }`}
                      style={{
                        left: `${Math.max(0, Math.min(100, leftPercent))}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                    <div
                      className={`absolute w-2 h-2 rounded-full ${
                        interval.containsMean ? 'bg-green-700' : 'bg-red-700'
                      }`}
                      style={{
                        left: `${Math.max(0, Math.min(100, leftPercent + widthPercent))}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <p className="text-xs font-semibold opacity-90 mb-1">Contienen μ</p>
              <p className="text-3xl font-bold">{countContaining}</p>
              <p className="text-xs opacity-80">intervalos verdes</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-white">
              <p className="text-xs font-semibold opacity-90 mb-1">No contienen μ</p>
              <p className="text-3xl font-bold">{intervals.length - countContaining}</p>
              <p className="text-xs opacity-80">intervalos rojos</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <p className="text-xs font-semibold opacity-90 mb-1">Porcentaje</p>
              <p className="text-3xl font-bold">{percentage.toFixed(1)}%</p>
              <p className="text-xs opacity-80">esperado: {confidenceLevel}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
        <h4 className="font-bold text-gray-800 mb-3">
          ✨ Interpretación
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong className="text-green-600">Verde:</strong> Intervalo contiene la media verdadera (μ = {trueMean})
          </p>
          <p>
            <strong className="text-red-600">Rojo:</strong> Intervalo NO contiene la media verdadera
          </p>
          <p className="mt-3">
            <strong>IC del {confidenceLevel}%:</strong> Esperamos que aproximadamente el {confidenceLevel}%
            de los intervalos contengan μ. ¡Observa que el porcentaje real se acerca a esto!
          </p>
          <p className="italic mt-3">
            En la práctica, solo calculamos UN intervalo y confiamos en que tiene {confidenceLevel}%
            de probabilidad de contener el parámetro verdadero.
          </p>
        </div>
      </div>
    </div>
  );
}
