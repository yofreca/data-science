"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Target } from "lucide-react";

interface Point {
  x: number;
  y: number;
  class: 0 | 1;
}

export default function LogisticRegressionDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [points, setPoints] = useState<Point[]>([
    // Class 0 (Red)
    { x: 20, y: 70, class: 0 },
    { x: 30, y: 80, class: 0 },
    { x: 25, y: 65, class: 0 },
    { x: 35, y: 75, class: 0 },
    { x: 40, y: 85, class: 0 },
    // Class 1 (Blue)
    { x: 70, y: 30, class: 1 },
    { x: 80, y: 20, class: 1 },
    { x: 75, y: 35, class: 1 },
    { x: 85, y: 25, class: 1 },
    { x: 90, y: 15, class: 1 }
  ]);

  const [selectedClass, setSelectedClass] = useState<0 | 1>(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    calculateMetrics();
    drawVisualization();
  }, [points]);

  const sigmoid = (z: number): number => {
    return 1 / (1 + Math.exp(-z));
  };

  const calculateMetrics = () => {
    if (points.length === 0) return;

    // Simple decision boundary: if x + y > 100, class 1, else class 0
    let correct = 0;
    points.forEach(point => {
      const predicted = (point.x + point.y > 100) ? 1 : 0;
      if (predicted === point.class) correct++;
    });

    setAccuracy(correct / points.length);
  };

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      const x = padding + (i / 5) * width;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }

    // Draw decision boundary (diagonal line)
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, padding);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw shaded regions
    ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, padding);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(canvas.width - padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw points
    points.forEach((point) => {
      const canvasX = padding + (point.x / 100) * width;
      const canvasY = canvas.height - padding - (point.y / 100) * height;

      ctx.fillStyle = point.class === 0 ? "#ef4444" : "#3b82f6";
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = point.class === 0 ? "#991b1b" : "#1e40af";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Labels
    ctx.fillStyle = "#1f2937";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";

    // X-axis labels
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * width;
      const value = (i / 5) * 100;
      ctx.fillText(value.toFixed(0), x, canvas.height - padding + 20);
    }

    // Y-axis labels
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const y = padding + ((5 - i) / 5) * height;
      const value = (i / 5) * 100;
      ctx.fillText(value.toFixed(0), padding - 10, y + 5);
    }

    // Class labels
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "left";
    ctx.fillText("Clase 0", 20, 30);

    ctx.fillStyle = "#3b82f6";
    ctx.textAlign = "right";
    ctx.fillText("Clase 1", canvas.width - 20, 30);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;

    if (clickX >= padding && clickX <= canvas.width - padding &&
        clickY >= padding && clickY <= canvas.height - padding) {
      const x = ((clickX - padding) / width) * 100;
      const y = ((canvas.height - padding - clickY) / height) * 100;

      setPoints([...points, { x, y, class: selectedClass }]);
    }
  };

  const resetPoints = () => {
    setPoints([
      { x: 20, y: 70, class: 0 },
      { x: 30, y: 80, class: 0 },
      { x: 25, y: 65, class: 0 },
      { x: 35, y: 75, class: 0 },
      { x: 40, y: 85, class: 0 },
      { x: 70, y: 30, class: 1 },
      { x: 80, y: 20, class: 1 },
      { x: 75, y: 35, class: 1 },
      { x: 85, y: 25, class: 1 },
      { x: 90, y: 15, class: 1 }
    ]);
  };

  const class0Count = points.filter(p => p.class === 0).length;
  const class1Count = points.filter(p => p.class === 1).length;

  return (
    <div className="space-y-6">
      {/* Class Selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedClass(0)}
          className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all ${
            selectedClass === 0
              ? 'bg-red-500 text-white shadow-lg scale-105'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          Agregar Clase 0 (Rojo)
          <div className="text-sm mt-1">Puntos: {class0Count}</div>
        </button>
        <button
          onClick={() => setSelectedClass(1)}
          className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all ${
            selectedClass === 1
              ? 'bg-blue-500 text-white shadow-lg scale-105'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          Agregar Clase 1 (Azul)
          <div className="text-sm mt-1">Puntos: {class1Count}</div>
        </button>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full border-2 border-gray-200 rounded-lg cursor-crosshair"
          onClick={handleCanvasClick}
        />
        <p className="text-sm text-gray-600 text-center mt-2">
          Haz clic en el gráfico para agregar puntos de la clase seleccionada
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-lg p-4">
          <div className="text-xs text-purple-600 font-semibold mb-1">Precisión</div>
          <div className="text-2xl font-bold text-purple-700">{(accuracy * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-lg p-4">
          <div className="text-xs text-green-600 font-semibold mb-1">Total Puntos</div>
          <div className="text-2xl font-bold text-green-700">{points.length}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-4">
          <div className="text-xs text-blue-600 font-semibold mb-1">Frontera</div>
          <div className="text-sm font-mono text-blue-700 mt-2">x + y = 100</div>
        </div>
      </div>

      {/* Sigmoid Function Explanation */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
        <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Función Sigmoid
        </h3>
        <div className="text-sm text-purple-800 mb-3">
          La regresión logística usa la función sigmoid para convertir cualquier valor en una probabilidad (0-1):
        </div>
        <div className="bg-white p-3 rounded font-mono text-sm text-purple-900">
          σ(z) = 1 / (1 + e^(-z))
        </div>
        <div className="text-sm text-purple-800 mt-3">
          • Si σ(z) ≥ 0.5 → Clase 1<br />
          • Si σ(z) &lt; 0.5 → Clase 0
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={resetPoints}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Resetear
        </button>
      </div>

      {/* Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (scikit-learn):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import numpy as np

# Datos
X = np.array([[20, 70], [30, 80], [25, 65], [70, 30], [80, 20]])
y = np.array([0, 0, 0, 1, 1])  # 0 = Clase 0, 1 = Clase 1

# Crear y entrenar el modelo
model = LogisticRegression()
model.fit(X, y)

# Predecir
y_pred = model.predict(X)
print(f"Precisión: {accuracy_score(y, y_pred):.2f}")

# Predecir probabilidades
probs = model.predict_proba([[50, 50]])
print(f"Probabilidad Clase 0: {probs[0][0]:.2f}")
print(f"Probabilidad Clase 1: {probs[0][1]:.2f}")

# Reporte detallado
print(classification_report(y, y_pred))`}
        </pre>
      </div>

      {/* Explanation */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-3">¿Cómo funciona la Clasificación Logística?</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">1.</span>
            <span>
              <strong>No es regresión lineal:</strong> Aunque se llama "regresión", es un clasificador
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">2.</span>
            <span>
              <strong>Función Sigmoid:</strong> Convierte valores lineales en probabilidades (0-1)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">3.</span>
            <span>
              <strong>Frontera de decisión:</strong> Línea púrpura que separa las clases
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">4.</span>
            <span>
              <strong>Uso típico:</strong> Spam/No Spam, Fraude/Legítimo, Sano/Enfermo
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
