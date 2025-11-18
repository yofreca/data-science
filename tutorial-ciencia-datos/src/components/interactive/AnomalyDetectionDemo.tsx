"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Play, Info } from "lucide-react";

type Transaction = {
  id: number;
  amount: number;
  time: number;  // Hour of day (0-23)
  isAnomaly: boolean;
};

export default function AnomalyDetectionDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [method, setMethod] = useState<"zscore" | "iqr">("zscore");
  const [threshold, setThreshold] = useState(3);
  const [transactions] = useState<Transaction[]>(() => {
    const data: Transaction[] = [];
    // Normal transactions (predefined to avoid hydration errors)
    const normalPoints = [
      { amount: 45, time: 10 }, { amount: 52, time: 14 }, { amount: 38, time: 9 },
      { amount: 48, time: 11 }, { amount: 55, time: 15 }, { amount: 42, time: 8 },
      { amount: 50, time: 12 }, { amount: 47, time: 13 }, { amount: 40, time: 10 },
      { amount: 53, time: 14 }, { amount: 44, time: 9 }, { amount: 49, time: 11 },
      { amount: 51, time: 13 }, { amount: 46, time: 12 }, { amount: 43, time: 10 },
      { amount: 54, time: 15 }, { amount: 41, time: 8 }, { amount: 48, time: 11 },
      { amount: 50, time: 14 }, { amount: 45, time: 9 }, { amount: 52, time: 12 },
      { amount: 47, time: 10 }, { amount: 49, time: 13 }, { amount: 44, time: 11 },
      { amount: 51, time: 14 }, { amount: 46, time: 9 }, { amount: 48, time: 12 }
    ];

    normalPoints.forEach((point, idx) => {
      data.push({
        id: idx + 1,
        amount: point.amount,
        time: point.time,
        isAnomaly: false
      });
    });

    // Anomalies (known outliers)
    const anomalies = [
      { amount: 250, time: 3 },   // Very high amount at unusual time
      { amount: 180, time: 23 },  // High amount late at night
      { amount: 5, time: 2 }      // Very low amount at unusual time
    ];

    anomalies.forEach((point, idx) => {
      data.push({
        id: normalPoints.length + idx + 1,
        amount: point.amount,
        time: point.time,
        isAnomaly: true
      });
    });

    return data;
  });

  const [detectedAnomalies, setDetectedAnomalies] = useState<number[]>([]);

  // Detect anomalies using selected method
  const detectAnomalies = () => {
    const amounts = transactions.map(t => t.amount);
    const detected: number[] = [];

    if (method === "zscore") {
      // Z-Score method
      const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
      const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
      const std = Math.sqrt(variance);

      transactions.forEach((t) => {
        const zScore = Math.abs((t.amount - mean) / std);
        if (zScore > threshold) {
          detected.push(t.id);
        }
      });
    } else if (method === "iqr") {
      // IQR method
      const sorted = [...amounts].sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      transactions.forEach((t) => {
        if (t.amount < lowerBound || t.amount > upperBound) {
          detected.push(t.id);
        }
      });
    }

    setDetectedAnomalies(detected);
  };

  useEffect(() => {
    detectAnomalies();
  }, [method, threshold]);

  // Draw scatter plot
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 800;
    const canvasHeight = 400;
    const padding = 50;
    const width = canvasWidth - 2 * padding;
    const height = canvasHeight - 2 * padding;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw axes
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvasHeight - padding);
    ctx.lineTo(canvasWidth - padding, canvasHeight - padding);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#1f2937";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Hora del Día", canvasWidth / 2, canvasHeight - padding + 30);

    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Monto ($)", -canvasHeight / 2, padding - 30);
    ctx.restore();

    // Scale
    const maxAmount = Math.max(...transactions.map(t => t.amount)) * 1.1;
    const maxTime = 24;

    // Draw points
    transactions.forEach((t) => {
      const x = padding + (t.time / maxTime) * width;
      const y = canvasHeight - padding - (t.amount / maxAmount) * height;

      const isDetected = detectedAnomalies.includes(t.id);
      const isActualAnomaly = t.isAnomaly;

      ctx.beginPath();
      ctx.arc(x, y, isDetected ? 8 : 5, 0, Math.PI * 2);

      if (isDetected && isActualAnomaly) {
        // True positive
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.strokeStyle = "#991b1b";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (isDetected && !isActualAnomaly) {
        // False positive
        ctx.fillStyle = "#f97316";
        ctx.fill();
        ctx.strokeStyle = "#9a3412";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (!isDetected && isActualAnomaly) {
        // False negative
        ctx.fillStyle = "#eab308";
        ctx.fill();
        ctx.strokeStyle = "#713f12";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // True negative (normal)
        ctx.fillStyle = "#10b981";
        ctx.fill();
        ctx.strokeStyle = "#065f46";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Grid lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let i = 0; i <= 24; i += 6) {
      const x = padding + (i / maxTime) * width;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvasHeight - padding);
      ctx.stroke();

      ctx.fillStyle = "#6b7280";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${i}h`, x, canvasHeight - padding + 15);
    }
    ctx.setLineDash([]);

  }, [transactions, detectedAnomalies]);

  // Calculate metrics
  const truePositives = transactions.filter(t => t.isAnomaly && detectedAnomalies.includes(t.id)).length;
  const falsePositives = transactions.filter(t => !t.isAnomaly && detectedAnomalies.includes(t.id)).length;
  const falseNegatives = transactions.filter(t => t.isAnomaly && !detectedAnomalies.includes(t.id)).length;
  const trueNegatives = transactions.filter(t => !t.isAnomaly && !detectedAnomalies.includes(t.id)).length;

  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

  return (
    <div className="space-y-6">
      {/* Info Panel */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-900">
            <p className="font-semibold mb-1">Detección de Fraude en Transacciones</p>
            <p className="text-yellow-800">
              Este sistema detecta transacciones sospechosas basándose en monto y hora.
              Rojo = Anomalía detectada correctamente, Verde = Normal, Naranja = Falsa alarma
            </p>
          </div>
        </div>
      </div>

      {/* Method Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Método de Detección</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex gap-3">
              {[
                { id: "zscore", name: "Z-Score" },
                { id: "iqr", name: "IQR (Interquartile Range)" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    method === m.id
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {method === "zscore" && (
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Umbral Z-Score: {threshold}σ
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Más sensible (1σ)</span>
                <span>Menos sensible (5σ)</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={detectAnomalies}
          className="mt-4 w-full px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Ejecutar Detección
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Transacciones - Scatter Plot</h3>
        <canvas ref={canvasRef} width={800} height={400} className="w-full" />

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-900"></div>
            <span>Anomalía Detectada (TP)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border border-green-900"></div>
            <span>Normal (TN)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-orange-900"></div>
            <span>Falsa Alarma (FP)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-yellow-900"></div>
            <span>No Detectada (FN)</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="text-sm text-green-700 font-semibold">Precision</div>
          <div className="text-2xl font-bold text-green-900">{(precision * 100).toFixed(0)}%</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-sm text-blue-700 font-semibold">Recall</div>
          <div className="text-2xl font-bold text-blue-900">{(recall * 100).toFixed(0)}%</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-sm text-purple-700 font-semibold">F1-Score</div>
          <div className="text-2xl font-bold text-purple-900">{(f1Score * 100).toFixed(0)}%</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
          <div className="text-sm text-yellow-700 font-semibold">Anomalías Detectadas</div>
          <div className="text-2xl font-bold text-yellow-900">{detectedAnomalies.length}</div>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Matriz de Confusión
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-2 border-gray-300 bg-gray-100"></th>
                <th className="p-3 border-2 border-gray-300 bg-green-100" colSpan={2}>Predicción</th>
              </tr>
              <tr>
                <th className="p-3 border-2 border-gray-300 bg-gray-100"></th>
                <th className="p-3 border-2 border-gray-300 bg-green-100">Normal</th>
                <th className="p-3 border-2 border-gray-300 bg-red-100">Anomalía</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="p-3 border-2 border-gray-300 bg-green-100">Actual: Normal</th>
                <td className="p-3 border-2 border-gray-300 text-center font-bold text-green-700 bg-green-50">
                  {trueNegatives} (TN)
                </td>
                <td className="p-3 border-2 border-gray-300 text-center font-bold text-orange-700 bg-orange-50">
                  {falsePositives} (FP)
                </td>
              </tr>
              <tr>
                <th className="p-3 border-2 border-gray-300 bg-red-100">Actual: Anomalía</th>
                <td className="p-3 border-2 border-gray-300 text-center font-bold text-yellow-700 bg-yellow-50">
                  {falseNegatives} (FN)
                </td>
                <td className="p-3 border-2 border-gray-300 text-center font-bold text-red-700 bg-red-50">
                  {truePositives} (TP)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (Scikit-learn):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from scipy import stats

# Cargar transacciones
df = pd.read_csv('transactions.csv')

# Método 1: Z-Score
def detect_anomalies_zscore(df, threshold=3):
    z_scores = np.abs(stats.zscore(df['amount']))
    anomalies = df[z_scores > threshold]
    return anomalies

# Método 2: IQR
def detect_anomalies_iqr(df):
    Q1 = df['amount'].quantile(0.25)
    Q3 = df['amount'].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    anomalies = df[(df['amount'] < lower) | (df['amount'] > upper)]
    return anomalies

# Método 3: Isolation Forest
model = IsolationForest(contamination=0.1, random_state=42)
df['anomaly'] = model.fit_predict(df[['amount', 'time']])
anomalies = df[df['anomaly'] == -1]

# Evaluar
from sklearn.metrics import classification_report
y_true = df['is_fraud']  # Ground truth
y_pred = df['anomaly'].apply(lambda x: 1 if x == -1 else 0)

print(classification_report(y_true, y_pred))

# One-Class SVM
from sklearn.svm import OneClassSVM
svm = OneClassSVM(nu=0.1, kernel='rbf', gamma='auto')
svm.fit(df[['amount', 'time']])
predictions = svm.predict(df[['amount', 'time']])`}
        </pre>
      </div>
    </div>
  );
}
