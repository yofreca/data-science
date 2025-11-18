"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BarChart3, TrendingUp } from "lucide-react";

type Method = "zscore" | "iqr" | "percentile";

export default function OutlierDetector() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [data, setData] = useState<number[]>([
    45, 52, 48, 51, 49, 47, 50, 46, 53, 48,
    51, 49, 47, 52, 50, 48, 120, 46, 49, 51  // 120 es un outlier obvio
  ]);

  const [method, setMethod] = useState<Method>("iqr");
  const [zScoreThreshold, setZScoreThreshold] = useState(2);
  const [outliers, setOutliers] = useState<number[]>([]);

  useEffect(() => {
    detectOutliers();
    drawBoxPlot();
  }, [method, zScoreThreshold, data]);

  const calculateStats = () => {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = data.reduce((sum, val) => sum + val, 0) / n;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const std = Math.sqrt(variance);

    const q1Index = Math.floor(n * 0.25);
    const q2Index = Math.floor(n * 0.5);
    const q3Index = Math.floor(n * 0.75);

    const q1 = sorted[q1Index];
    const q2 = sorted[q2Index]; // median
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;

    return { mean, std, q1, q2, q3, iqr, min: sorted[0], max: sorted[n - 1] };
  };

  const detectOutliers = () => {
    const stats = calculateStats();
    let detected: number[] = [];

    if (method === "zscore") {
      // Z-Score method
      detected = data.filter(val => {
        const zScore = Math.abs((val - stats.mean) / stats.std);
        return zScore > zScoreThreshold;
      });
    } else if (method === "iqr") {
      // IQR method
      const lowerBound = stats.q1 - 1.5 * stats.iqr;
      const upperBound = stats.q3 + 1.5 * stats.iqr;
      detected = data.filter(val => val < lowerBound || val > upperBound);
    } else if (method === "percentile") {
      // Percentile method (valores fuera del 5th y 95th percentile)
      const sorted = [...data].sort((a, b) => a - b);
      const p5 = sorted[Math.floor(sorted.length * 0.05)];
      const p95 = sorted[Math.floor(sorted.length * 0.95)];
      detected = data.filter(val => val < p5 || val > p95);
    }

    setOutliers(detected);
  };

  const drawBoxPlot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const stats = calculateStats();
    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    const centerY = canvas.height / 2;

    // Scale
    const dataMin = stats.min;
    const dataMax = stats.max;
    const scale = (val: number) => padding + ((val - dataMin) / (dataMax - dataMin)) * width;

    // Draw axis
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, centerY - 40);
    ctx.lineTo(padding, centerY + 40);
    ctx.moveTo(padding, centerY);
    ctx.lineTo(canvas.width - padding, centerY);
    ctx.lineTo(canvas.width - padding, centerY);
    ctx.stroke();

    // Draw box (Q1 to Q3)
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(scale(stats.q1), centerY - 30, scale(stats.q3) - scale(stats.q1), 60);

    // Draw median line
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(scale(stats.q2), centerY - 30);
    ctx.lineTo(scale(stats.q2), centerY + 30);
    ctx.stroke();

    // Draw whiskers
    const lowerWhisker = stats.q1 - 1.5 * stats.iqr;
    const upperWhisker = stats.q3 + 1.5 * stats.iqr;
    const lowerWhiskerValue = Math.max(stats.min, lowerWhisker);
    const upperWhiskerValue = Math.min(stats.max, upperWhisker);

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scale(lowerWhiskerValue), centerY);
    ctx.lineTo(scale(stats.q1), centerY);
    ctx.moveTo(scale(stats.q3), centerY);
    ctx.lineTo(scale(upperWhiskerValue), centerY);
    ctx.stroke();

    // Draw whisker caps
    ctx.beginPath();
    ctx.moveTo(scale(lowerWhiskerValue), centerY - 15);
    ctx.lineTo(scale(lowerWhiskerValue), centerY + 15);
    ctx.moveTo(scale(upperWhiskerValue), centerY - 15);
    ctx.lineTo(scale(upperWhiskerValue), centerY + 15);
    ctx.stroke();

    // Draw data points
    data.forEach(val => {
      const x = scale(val);
      const isOutlier = outliers.includes(val);

      ctx.fillStyle = isOutlier ? "#ef4444" : "#10b981";
      ctx.beginPath();
      ctx.arc(x, centerY + 80, isOutlier ? 6 : 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = "#1f2937";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";

    ctx.fillText(stats.min.toFixed(0), scale(stats.min), centerY - 50);
    ctx.fillText("Q1: " + stats.q1.toFixed(0), scale(stats.q1), centerY - 50);
    ctx.fillText("Median: " + stats.q2.toFixed(0), scale(stats.q2), centerY - 50);
    ctx.fillText("Q3: " + stats.q3.toFixed(0), scale(stats.q3), centerY - 50);
    ctx.fillText(stats.max.toFixed(0), scale(stats.max), centerY - 50);
  };

  const addRandomValue = () => {
    const newVal = Math.random() > 0.7 ? Math.floor(Math.random() * 100 + 100) : Math.floor(Math.random() * 10 + 45);
    setData([...data, newVal]);
  };

  const resetData = () => {
    setData([45, 52, 48, 51, 49, 47, 50, 46, 53, 48, 51, 49, 47, 52, 50, 48, 120, 46, 49, 51]);
  };

  const removeOutliers = () => {
    setData(data.filter(val => !outliers.includes(val)));
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Method Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setMethod("iqr")}
          className={`p-4 rounded-lg border-2 transition-all ${
            method === "iqr"
              ? 'bg-blue-50 border-blue-500 shadow-lg'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <BarChart3 className={`w-6 h-6 mx-auto mb-2 ${method === "iqr" ? 'text-blue-600' : 'text-gray-400'}`} />
          <div className="font-semibold text-gray-800">IQR Method</div>
          <div className="text-xs text-gray-500 mt-1">Q1 - 1.5*IQR, Q3 + 1.5*IQR</div>
        </button>

        <button
          onClick={() => setMethod("zscore")}
          className={`p-4 rounded-lg border-2 transition-all ${
            method === "zscore"
              ? 'bg-green-50 border-green-500 shadow-lg'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${method === "zscore" ? 'text-green-600' : 'text-gray-400'}`} />
          <div className="font-semibold text-gray-800">Z-Score</div>
          <div className="text-xs text-gray-500 mt-1">|Z| &gt; threshold</div>
        </button>

        <button
          onClick={() => setMethod("percentile")}
          className={`p-4 rounded-lg border-2 transition-all ${
            method === "percentile"
              ? 'bg-purple-50 border-purple-500 shadow-lg'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <AlertTriangle className={`w-6 h-6 mx-auto mb-2 ${method === "percentile" ? 'text-purple-600' : 'text-gray-400'}`} />
          <div className="font-semibold text-gray-800">Percentile</div>
          <div className="text-xs text-gray-500 mt-1">&lt;P5 o &gt;P95</div>
        </button>
      </div>

      {/* Z-Score Threshold (only visible when Z-Score is selected) */}
      {method === "zscore" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-green-50 border-2 border-green-200 rounded-lg p-4"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Umbral Z-Score: {zScoreThreshold}
          </label>
          <input
            type="range"
            min="1"
            max="4"
            step="0.5"
            value={zScoreThreshold}
            onChange={(e) => setZScoreThreshold(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 (más sensible)</span>
            <span>4 (menos sensible)</span>
          </div>
        </motion.div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-600 font-semibold mb-1">Media</div>
          <div className="text-xl font-bold text-blue-700">{stats.mean.toFixed(1)}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-600 font-semibold mb-1">Std Dev</div>
          <div className="text-xl font-bold text-green-700">{stats.std.toFixed(1)}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-xs text-purple-600 font-semibold mb-1">IQR</div>
          <div className="text-xl font-bold text-purple-700">{stats.iqr.toFixed(1)}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-xs text-red-600 font-semibold mb-1">Outliers</div>
          <div className="text-xl font-bold text-red-700">{outliers.length}</div>
        </div>
      </div>

      {/* Box Plot */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Box Plot con Outliers</h3>
        <canvas
          ref={canvasRef}
          width={700}
          height={250}
          className="w-full"
        />
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Valores normales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Outliers detectados</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={addRandomValue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Agregar Valor Aleatorio
        </button>
        <button
          onClick={resetData}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        >
          Resetear Datos
        </button>
        <button
          onClick={removeOutliers}
          disabled={outliers.length === 0}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          Eliminar Outliers ({outliers.length})
        </button>
      </div>

      {/* Code Display */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python:</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{method === "iqr" && `# IQR Method
Q1 = df['column'].quantile(0.25)
Q3 = df['column'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR
outliers = df[(df['column'] < lower_bound) | (df['column'] > upper_bound)]`}

{method === "zscore" && `# Z-Score Method
from scipy import stats
z_scores = np.abs(stats.zscore(df['column']))
outliers = df[z_scores > ${zScoreThreshold}]`}

{method === "percentile" && `# Percentile Method
p5 = df['column'].quantile(0.05)
p95 = df['column'].quantile(0.95)
outliers = df[(df['column'] < p5) | (df['column'] > p95)]`}
        </pre>
      </div>

      {/* Outliers List */}
      {outliers.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Outliers Detectados ({outliers.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {outliers.map((val, idx) => (
              <span key={idx} className="px-3 py-1 bg-red-200 text-red-800 rounded-full font-mono text-sm">
                {val}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="font-semibold text-blue-900 mb-2">¿Qué hacer con los outliers?</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Investigar si son errores de medición o datos legítimos</li>
          <li>Considerar transformaciones (log, sqrt) para reducir su impacto</li>
          <li>Usar modelos robustos a outliers (ej: Huber regression)</li>
          <li>Eliminar solo si hay justificación clara</li>
          <li>Mantener registro de decisiones tomadas</li>
        </ul>
      </div>
    </div>
  );
}
