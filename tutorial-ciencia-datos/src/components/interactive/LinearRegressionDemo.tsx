"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw, TrendingUp } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

export default function LinearRegressionDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [points, setPoints] = useState<Point[]>([
    { x: 20, y: 30 },
    { x: 40, y: 45 },
    { x: 60, y: 55 },
    { x: 80, y: 70 },
    { x: 100, y: 85 }
  ]);

  const [slope, setSlope] = useState(0);
  const [intercept, setIntercept] = useState(0);
  const [r2, setR2] = useState(0);
  const [mse, setMse] = useState(0);

  useEffect(() => {
    calculateRegression();
    drawVisualization();
  }, [points]);

  const calculateRegression = () => {
    if (points.length < 2) return;

    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

    // Calculate slope (m) and intercept (b)
    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    setSlope(m);
    setIntercept(b);

    // Calculate R²
    const yMean = sumY / n;
    const ssTot = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
    const ssRes = points.reduce((sum, p) => {
      const yPred = m * p.x + b;
      return sum + Math.pow(p.y - yPred, 2);
    }, 0);
    const r2Value = 1 - (ssRes / ssTot);
    setR2(r2Value);

    // Calculate MSE
    const mseValue = ssRes / n;
    setMse(mseValue);
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

    // Draw regression line
    if (points.length >= 2) {
      const x1 = 0;
      const y1 = slope * x1 + intercept;
      const x2 = 100;
      const y2 = slope * x2 + intercept;

      const canvasX1 = padding + (x1 / 100) * width;
      const canvasY1 = canvas.height - padding - (y1 / 100) * height;
      const canvasX2 = padding + (x2 / 100) * width;
      const canvasY2 = canvas.height - padding - (y2 / 100) * height;

      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvasX1, canvasY1);
      ctx.lineTo(canvasX2, canvasY2);
      ctx.stroke();
    }

    // Draw points
    points.forEach((point) => {
      const canvasX = padding + (point.x / 100) * width;
      const canvasY = canvas.height - padding - (point.y / 100) * height;

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 6, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = "#991b1b";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw residual lines
      if (points.length >= 2) {
        const yPred = slope * point.x + intercept;
        const predCanvasY = canvas.height - padding - (yPred / 100) * height;

        ctx.strokeStyle = "#fca5a5";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(canvasX, canvasY);
        ctx.lineTo(canvasX, predCanvasY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
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

    // Axis titles
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("X", canvas.width / 2, canvas.height - 10);

    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Y", -canvas.height / 2, 20);
    ctx.restore();
  };

  const addRandomPoint = () => {
    const newPoint = {
      x: Math.random() * 100,
      y: Math.random() * 100
    };
    setPoints([...points, newPoint]);
  };

  const resetPoints = () => {
    setPoints([
      { x: 20, y: 30 },
      { x: 40, y: 45 },
      { x: 60, y: 55 },
      { x: 80, y: 70 },
      { x: 100, y: 85 }
    ]);
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

      setPoints([...points, { x, y }]);
    }
  };

  return (
    <div className="space-y-6">
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
          Haz clic en el gráfico para agregar puntos
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-4">
          <div className="text-xs text-blue-600 font-semibold mb-1">Pendiente (m)</div>
          <div className="text-2xl font-bold text-blue-700">{slope.toFixed(3)}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-lg p-4">
          <div className="text-xs text-green-600 font-semibold mb-1">Intercepto (b)</div>
          <div className="text-2xl font-bold text-green-700">{intercept.toFixed(3)}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-lg p-4">
          <div className="text-xs text-purple-600 font-semibold mb-1">R² Score</div>
          <div className="text-2xl font-bold text-purple-700">{r2.toFixed(3)}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300 rounded-lg p-4">
          <div className="text-xs text-orange-600 font-semibold mb-1">MSE</div>
          <div className="text-2xl font-bold text-orange-700">{mse.toFixed(2)}</div>
        </div>
      </div>

      {/* Equation */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Ecuación de la Recta
        </h3>
        <div className="text-2xl font-mono text-blue-800">
          y = {slope.toFixed(3)}x + {intercept.toFixed(3)}
        </div>
        <div className="text-sm text-blue-700 mt-2">
          R² = {r2.toFixed(3)} (Cuanto más cerca de 1, mejor ajuste)
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={addRandomPoint}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Punto Aleatorio
        </button>
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
{`from sklearn.linear_model import LinearRegression
import numpy as np

# Datos
X = np.array([[20], [40], [60], [80], [100]])
y = np.array([30, 45, 55, 70, 85])

# Crear y entrenar el modelo
model = LinearRegression()
model.fit(X, y)

# Coeficientes
print(f"Pendiente: {model.coef_[0]:.3f}")
print(f"Intercepto: {model.intercept_:.3f}")

# R² score
r2 = model.score(X, y)
print(f"R²: {r2:.3f}")

# Predecir
y_pred = model.predict([[50]])
print(f"Predicción para X=50: {y_pred[0]:.2f}")`}
        </pre>
      </div>

      {/* Explanation */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-3">¿Cómo funciona?</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">1.</span>
            <span>
              <strong>Ecuación:</strong> y = mx + b (m = pendiente, b = intercepto)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">2.</span>
            <span>
              <strong>Objetivo:</strong> Minimizar la suma de errores cuadráticos (MSE)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">3.</span>
            <span>
              <strong>R² Score:</strong> Mide qué tan bien se ajusta la línea (0-1, mejor cerca de 1)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">4.</span>
            <span>
              <strong>Residuos:</strong> Líneas punteadas rojas muestran el error de cada punto
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
