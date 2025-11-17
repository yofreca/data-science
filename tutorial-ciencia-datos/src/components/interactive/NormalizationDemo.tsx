"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Maximize2, Minimize2 } from "lucide-react";

type Technique = "none" | "minmax" | "zscore" | "robust" | "log";

export default function NormalizationDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const originalData = [
    { feature: "Edad", values: [25, 30, 28, 45, 33, 29, 35, 27] },
    { feature: "Salario", values: [45000, 52000, 48000, 65000, 51000, 47000, 55000, 46000] },
    { feature: "Experiencia", values: [2, 5, 3, 15, 7, 4, 8, 3] }
  ];

  const [technique, setTechnique] = useState<Technique>("none");
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [transformedData, setTransformedData] = useState<number[]>([]);

  useEffect(() => {
    applyTransformation();
  }, [technique, selectedFeature]);

  useEffect(() => {
    drawDistribution();
  }, [transformedData]);

  const applyTransformation = () => {
    const values = originalData[selectedFeature].values;

    let transformed: number[] = [];

    switch (technique) {
      case "none":
        transformed = values;
        break;

      case "minmax":
        // Min-Max Normalization: (x - min) / (max - min)
        const min = Math.min(...values);
        const max = Math.max(...values);
        transformed = values.map(v => (v - min) / (max - min));
        break;

      case "zscore":
        // Z-Score Standardization: (x - mean) / std
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        const std = Math.sqrt(variance);
        transformed = values.map(v => (v - mean) / std);
        break;

      case "robust":
        // Robust Scaling: (x - median) / IQR
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q2 = sorted[Math.floor(sorted.length * 0.5)]; // median
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        transformed = values.map(v => (v - q2) / iqr);
        break;

      case "log":
        // Log Transformation
        transformed = values.map(v => Math.log(v + 1)); // +1 to avoid log(0)
        break;
    }

    setTransformedData(transformed);
  };

  const drawDistribution = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const values = transformedData.length > 0 ? transformedData : originalData[selectedFeature].values;
    const padding = 50;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;

    // Calculate histogram
    const bins = 10;
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const binWidth = (maxVal - minVal) / bins;

    const histogram = new Array(bins).fill(0);
    values.forEach(v => {
      const binIndex = Math.min(Math.floor((v - minVal) / binWidth), bins - 1);
      histogram[binIndex]++;
    });

    const maxCount = Math.max(...histogram);

    // Draw axes
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw bars
    const barWidth = width / bins;
    histogram.forEach((count, i) => {
      const barHeight = (count / maxCount) * height;
      const x = padding + i * barWidth;
      const y = canvas.height - padding - barHeight;

      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(x, y, barWidth - 2, barHeight);

      ctx.strokeStyle = "#1e40af";
      ctx.strokeRect(x, y, barWidth - 2, barHeight);
    });

    // Draw labels
    ctx.fillStyle = "#1f2937";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";

    // X-axis labels
    for (let i = 0; i <= bins; i += 2) {
      const x = padding + (i / bins) * width;
      const value = minVal + (i / bins) * (maxVal - minVal);
      ctx.fillText(value.toFixed(1), x, canvas.height - padding + 20);
    }

    // Y-axis label
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("Frecuencia", -canvas.height / 2, padding - 30);
    ctx.restore();
  };

  const getStats = () => {
    const values = transformedData.length > 0 ? transformedData : originalData[selectedFeature].values;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { mean, std, min, max };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Feature Selector */}
      <div className="grid grid-cols-3 gap-3">
        {originalData.map((feature, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedFeature(idx)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedFeature === idx
                ? 'bg-blue-50 border-blue-500 shadow-lg'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-800">{feature.feature}</div>
            <div className="text-xs text-gray-500 mt-1">
              Rango: {Math.min(...feature.values)} - {Math.max(...feature.values)}
            </div>
          </button>
        ))}
      </div>

      {/* Technique Selector */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Selecciona Técnica de Transformación
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={() => setTechnique("none")}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              technique === "none"
                ? 'bg-gray-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setTechnique("minmax")}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              technique === "minmax"
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Minimize2 className="w-4 h-4 inline mr-1" />
            Min-Max
          </button>
          <button
            onClick={() => setTechnique("zscore")}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              technique === "zscore"
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-1" />
            Z-Score
          </button>
          <button
            onClick={() => setTechnique("robust")}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              technique === "robust"
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Robust
          </button>
          <button
            onClick={() => setTechnique("log")}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              technique === "log"
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Maximize2 className="w-4 h-4 inline mr-1" />
            Log
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-600 font-semibold mb-1">Media</div>
          <div className="text-xl font-bold text-blue-700">{stats.mean.toFixed(2)}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-600 font-semibold mb-1">Std Dev</div>
          <div className="text-xl font-bold text-green-700">{stats.std.toFixed(2)}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-xs text-purple-600 font-semibold mb-1">Mínimo</div>
          <div className="text-xl font-bold text-purple-700">{stats.min.toFixed(2)}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="text-xs text-orange-600 font-semibold mb-1">Máximo</div>
          <div className="text-xl font-bold text-orange-700">{stats.max.toFixed(2)}</div>
        </div>
      </div>

      {/* Distribution Plot */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Distribución de Datos</h3>
        <canvas
          ref={canvasRef}
          width={700}
          height={300}
          className="w-full"
        />
      </div>

      {/* Data Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Datos Originales</h4>
          <div className="space-y-2">
            {originalData[selectedFeature].values.map((val, idx) => (
              <div key={idx} className="bg-white px-3 py-2 rounded border border-gray-200 font-mono text-sm">
                {val.toLocaleString()}
              </div>
            ))}
          </div>
        </div>

        {/* Transformed */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Datos Transformados</h4>
          <div className="space-y-2">
            {transformedData.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white px-3 py-2 rounded border border-blue-300 font-mono text-sm"
              >
                {val.toFixed(4)}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python:</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{technique === "none" && "# Sin transformación\ndata = df['feature']"}

{technique === "minmax" && `# Min-Max Normalization (0-1)
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
normalized = scaler.fit_transform(df[['feature']])`}

{technique === "zscore" && `# Z-Score Standardization
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
standardized = scaler.fit_transform(df[['feature']])`}

{technique === "robust" && `# Robust Scaling (resistente a outliers)
from sklearn.preprocessing import RobustScaler
scaler = RobustScaler()
scaled = scaler.fit_transform(df[['feature']])`}

{technique === "log" && `# Log Transformation
import numpy as np
transformed = np.log(df['feature'] + 1)`}
        </pre>
      </div>

      {/* Technique Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">Min-Max Normalization</h4>
          <p className="text-sm text-blue-800 mb-2">
            Escala valores entre 0 y 1. Fórmula: (x - min) / (max - min)
          </p>
          <div className="text-xs text-blue-700">
            <strong>Usa cuando:</strong> Necesitas valores en rango [0,1], redes neuronales
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-2">Z-Score Standardization</h4>
          <p className="text-sm text-green-800 mb-2">
            Media=0, Std=1. Fórmula: (x - μ) / σ
          </p>
          <div className="text-xs text-green-700">
            <strong>Usa cuando:</strong> Algoritmos asumen normalidad (SVM, regresión logística)
          </div>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <h4 className="font-semibold text-purple-900 mb-2">Robust Scaling</h4>
          <p className="text-sm text-purple-800 mb-2">
            Usa mediana e IQR. Fórmula: (x - median) / IQR
          </p>
          <div className="text-xs text-purple-700">
            <strong>Usa cuando:</strong> Hay muchos outliers que quieres preservar
          </div>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-2">Log Transformation</h4>
          <p className="text-sm text-orange-800 mb-2">
            Reduce skewness. Fórmula: log(x + 1)
          </p>
          <div className="text-xs text-orange-700">
            <strong>Usa cuando:</strong> Datos con distribución exponencial o alta asimetría
          </div>
        </div>
      </div>
    </div>
  );
}
