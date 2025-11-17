"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

type ModelType = "underfit" | "good" | "overfit";

export default function ModelValidationDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelType, setModelType] = useState<ModelType>("good");

  const metrics = {
    underfit: { trainAcc: 65, testAcc: 63, complexity: 1 },
    good: { trainAcc: 92, testAcc: 89, complexity: 5 },
    overfit: { trainAcc: 99, testAcc: 72, complexity: 15 }
  };

  useEffect(() => {
    drawModel();
  }, [modelType]);

  const drawModel = () => {
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
    }

    // Generate data points
    const points: Array<{x: number, y: number}> = [];
    for (let i = 0; i < 20; i++) {
      const x = (i / 19) * 100;
      const y = 30 + 40 * Math.sin(x * 0.08) + (Math.random() - 0.5) * 15;
      points.push({ x, y });
    }

    // Draw points
    points.forEach(point => {
      const canvasX = padding + (point.x / 100) * width;
      const canvasY = canvas.height - padding - (point.y / 100) * height;

      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw model curve
    ctx.strokeStyle = modelType === "good" ? "#10b981" : "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x <= 100; x += 1) {
      const canvasX = padding + (x / 100) * width;
      let y;

      if (modelType === "underfit") {
        y = 50;
      } else if (modelType === "good") {
        y = 30 + 40 * Math.sin(x * 0.08);
      } else {
        y = 30 + 40 * Math.sin(x * 0.08) + 10 * Math.sin(x * 0.5) + 5 * Math.cos(x * 0.3);
      }

      const canvasY = canvas.height - padding - (y / 100) * height;

      if (x === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#1f2937";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Complejidad del Modelo", canvas.width / 2, canvas.height - 10);

    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Precision", -canvas.height / 2, 20);
    ctx.restore();
  };

  const currentMetrics = metrics[modelType];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setModelType("underfit")}
          className={`p-6 rounded-lg border-2 transition-all ${
            modelType === "underfit"
              ? 'bg-red-50 border-red-500 shadow-lg'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${modelType === "underfit" ? 'text-red-600' : 'text-gray-400'}`} />
          <div className="font-bold text-gray-800">Underfitting</div>
          <div className="text-xs text-gray-600 mt-1">Modelo muy simple</div>
        </button>

        <button
          onClick={() => setModelType("good")}
          className={`p-6 rounded-lg border-2 transition-all ${
            modelType === "good"
              ? 'bg-green-50 border-green-500 shadow-lg'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${modelType === "good" ? 'text-green-600' : 'text-gray-400'}`} />
          <div className="font-bold text-gray-800">Buen Ajuste</div>
          <div className="text-xs text-gray-600 mt-1">Balance ideal</div>
        </button>

        <button
          onClick={() => setModelType("overfit")}
          className={`p-6 rounded-lg border-2 transition-all ${
            modelType === "overfit"
              ? 'bg-orange-50 border-orange-500 shadow-lg'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${modelType === "overfit" ? 'text-orange-600' : 'text-gray-400'}`} />
          <div className="font-bold text-gray-800">Overfitting</div>
          <div className="text-xs text-gray-600 mt-1">Modelo muy complejo</div>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <canvas ref={canvasRef} width={700} height={400} className="w-full border-2 border-gray-200 rounded-lg" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-4">
          <div className="text-xs text-blue-600 font-semibold mb-1">Train Accuracy</div>
          <div className="text-2xl font-bold text-blue-700">{currentMetrics.trainAcc}%</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-lg p-4">
          <div className="text-xs text-purple-600 font-semibold mb-1">Test Accuracy</div>
          <div className="text-2xl font-bold text-purple-700">{currentMetrics.testAcc}%</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-lg p-4">
          <div className="text-xs text-green-600 font-semibold mb-1">Gap</div>
          <div className="text-2xl font-bold text-green-700">{currentMetrics.trainAcc - currentMetrics.testAcc}%</div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Codigo Python:</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">{`from sklearn.model_selection import cross_val_score, train_test_split

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Entrenar modelo
model.fit(X_train, y_train)

# Evaluar
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print(f"Train: {train_score:.2f}")
print(f"Test: {test_score:.2f}")
print(f"Gap: {train_score - test_score:.2f}")`}</pre>
      </div>
    </div>
  );
}
