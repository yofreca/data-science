"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

type ActivationFunction = {
  id: string;
  name: string;
  formula: string;
  description: string;
  range: string;
  useCases: string[];
  pros: string[];
  cons: string[];
  fn: (x: number) => number;
  derivative: (x: number) => number;
};

export default function ActivationFunctionsDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const derivCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedFunc, setSelectedFunc] = useState("relu");
  const [showDerivative, setShowDerivative] = useState(false);

  const activationFunctions: Record<string, ActivationFunction> = {
    sigmoid: {
      id: "sigmoid",
      name: "Sigmoid",
      formula: "σ(x) = 1 / (1 + e^(-x))",
      description: "Squash input to range (0, 1). Suave y diferenciable.",
      range: "(0, 1)",
      useCases: ["Output layer para probabilidades binarias", "Redes neuronales clásicas"],
      pros: ["Salida interpretable como probabilidad", "Suave y diferenciable"],
      cons: ["Vanishing gradient", "No centrado en cero", "Costoso computacionalmente"],
      fn: (x) => 1 / (1 + Math.exp(-x)),
      derivative: (x) => {
        const s = 1 / (1 + Math.exp(-x));
        return s * (1 - s);
      }
    },
    tanh: {
      id: "tanh",
      name: "Tanh (Tangente Hiperbólica)",
      formula: "tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))",
      description: "Similar a sigmoid pero centrada en cero. Rango (-1, 1).",
      range: "(-1, 1)",
      useCases: ["Hidden layers en RNNs", "Cuando necesitas valores centrados en 0"],
      pros: ["Centrado en cero", "Más fuerte que sigmoid", "Suave"],
      cons: ["Vanishing gradient", "Costoso computacionalmente"],
      fn: (x) => Math.tanh(x),
      derivative: (x) => {
        const t = Math.tanh(x);
        return 1 - t * t;
      }
    },
    relu: {
      id: "relu",
      name: "ReLU (Rectified Linear Unit)",
      formula: "ReLU(x) = max(0, x)",
      description: "La más popular. Simple, rápida, y mitiga vanishing gradient.",
      range: "[0, ∞)",
      useCases: ["Hidden layers en CNNs", "Mayoría de redes profundas", "Default choice"],
      pros: ["Simple y rápida", "No vanishing gradient", "Sparse activation"],
      cons: ["Dying ReLU (neuronas muertas)", "No diferenciable en x=0", "Unbounded"],
      fn: (x) => Math.max(0, x),
      derivative: (x) => x > 0 ? 1 : 0
    },
    leaky_relu: {
      id: "leaky_relu",
      name: "Leaky ReLU",
      formula: "LeakyReLU(x) = max(0.01x, x)",
      description: "Versión de ReLU que permite pequeño gradiente negativo.",
      range: "(-∞, ∞)",
      useCases: ["Cuando ReLU causa dying neurons", "Alternativa a ReLU"],
      pros: ["No dying ReLU", "Simple", "Permite gradientes negativos"],
      cons: ["Hiperparámetro alpha a ajustar", "No siempre mejor que ReLU"],
      fn: (x) => x > 0 ? x : 0.01 * x,
      derivative: (x) => x > 0 ? 1 : 0.01
    }
  };

  const selected = activationFunctions[selectedFunc];

  // Draw activation function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 800;
    const canvasHeight = 300;
    const padding = 40;
    const width = canvasWidth - 2 * padding;
    const height = canvasHeight - 2 * padding;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw axes
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvasHeight / 2);
    ctx.lineTo(canvasWidth - padding, canvasHeight / 2);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvasHeight - padding);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#4b5563";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("x", canvasWidth - padding + 15, canvasHeight / 2 + 5);
    ctx.fillText("f(x)", padding, padding - 10);

    // Grid lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue;
      const x = padding + (i + 5) * (width / 10);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvasHeight - padding);
      ctx.stroke();

      const y = canvasHeight / 2 - i * (height / 10);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvasWidth - padding, y);
      ctx.stroke();
    }

    // Draw function
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let px = 0; px <= width; px += 1) {
      const x = (px / width) * 10 - 5; // Range: -5 to 5
      const y = selected.fn(x);
      const canvasX = padding + px;
      const canvasY = canvasHeight / 2 - y * (height / 10);

      if (px === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    // Draw point at x=0
    const y0 = selected.fn(0);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(padding + width / 2, canvasHeight / 2 - y0 * (height / 10), 5, 0, Math.PI * 2);
    ctx.fill();

  }, [selected, canvasRef]);

  // Draw derivative
  useEffect(() => {
    if (!showDerivative) return;

    const canvas = derivCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 800;
    const canvasHeight = 300;
    const padding = 40;
    const width = canvasWidth - 2 * padding;
    const height = canvasHeight - 2 * padding;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw axes
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvasHeight / 2);
    ctx.lineTo(canvasWidth - padding, canvasHeight / 2);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvasHeight - padding);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#4b5563";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("x", canvasWidth - padding + 15, canvasHeight / 2 + 5);
    ctx.fillText("f'(x)", padding, padding - 10);

    // Grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue;
      const x = padding + (i + 5) * (width / 10);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvasHeight - padding);
      ctx.stroke();

      const y = canvasHeight / 2 - i * (height / 10);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvasWidth - padding, y);
      ctx.stroke();
    }

    // Draw derivative
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let px = 0; px <= width; px += 1) {
      const x = (px / width) * 10 - 5;
      const dy = selected.derivative(x);
      const canvasX = padding + px;
      const canvasY = canvasHeight / 2 - dy * (height / 2); // Scale for visibility

      if (px === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

  }, [selected, showDerivative, derivCanvasRef]);

  return (
    <div className="space-y-6">
      {/* Function Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.values(activationFunctions).map((func) => (
          <button
            key={func.id}
            onClick={() => setSelectedFunc(func.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedFunc === func.id
                ? 'bg-purple-50 border-purple-500 shadow-lg'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-800 mb-1">{func.name}</div>
            <div className="text-xs text-gray-600">{func.range}</div>
          </button>
        ))}
      </div>

      {/* Function Info */}
      <motion.div
        key={selectedFunc}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-purple-900 mb-2">{selected.name}</h3>
            <p className="text-purple-800 mb-3">{selected.description}</p>
            <div className="bg-white p-3 rounded font-mono text-sm text-purple-900 mb-3">
              {selected.formula}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-green-700 mb-1">Ventajas:</div>
                <ul className="list-disc list-inside text-purple-700 space-y-1">
                  {selected.pros.map((pro, idx) => (
                    <li key={idx}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-red-700 mb-1">Desventajas:</div>
                <ul className="list-disc list-inside text-purple-700 space-y-1">
                  {selected.cons.map((con, idx) => (
                    <li key={idx}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Canvas - Activation Function */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
        <h3 className="font-bold text-gray-800 mb-4">Gráfica de Activación</h3>
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full"
        />
      </div>

      {/* Toggle Derivative */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowDerivative(!showDerivative)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            showDerivative
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {showDerivative ? 'Ocultar Derivada' : 'Mostrar Derivada f\'(x)'}
        </button>
      </div>

      {/* Canvas - Derivative */}
      {showDerivative && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-lg border-2 border-green-200 p-4"
        >
          <h3 className="font-bold text-gray-800 mb-4">Derivada (Gradiente)</h3>
          <canvas
            ref={derivCanvasRef}
            width={800}
            height={300}
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-3">
            La derivada es crucial para backpropagation. Un gradiente cercano a 0
            (vanishing gradient) hace que el aprendizaje sea muy lento.
          </p>
        </motion.div>
      )}

      {/* Use Cases */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-3">Casos de Uso</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {selected.useCases.map((useCase, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        <h3 className="font-bold text-gray-800 mb-4">Comparación de Funciones</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Función</th>
              <th className="p-3 text-left">Rango</th>
              <th className="p-3 text-left">Vanishing Gradient</th>
              <th className="p-3 text-left">Velocidad</th>
              <th className="p-3 text-left">Uso Común</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3 font-semibold">Sigmoid</td>
              <td className="p-3">(0, 1)</td>
              <td className="p-3 text-red-600">Sí</td>
              <td className="p-3 text-orange-600">Lenta</td>
              <td className="p-3">Output binario</td>
            </tr>
            <tr className="border-t bg-gray-50">
              <td className="p-3 font-semibold">Tanh</td>
              <td className="p-3">(-1, 1)</td>
              <td className="p-3 text-red-600">Sí</td>
              <td className="p-3 text-orange-600">Lenta</td>
              <td className="p-3">RNNs</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-semibold">ReLU</td>
              <td className="p-3">[0, ∞)</td>
              <td className="p-3 text-green-600">No</td>
              <td className="p-3 text-green-600">Rápida</td>
              <td className="p-3">Hidden layers (default)</td>
            </tr>
            <tr className="border-t bg-gray-50">
              <td className="p-3 font-semibold">Leaky ReLU</td>
              <td className="p-3">(-∞, ∞)</td>
              <td className="p-3 text-green-600">No</td>
              <td className="p-3 text-green-600">Rápida</td>
              <td className="p-3">Alternativa a ReLU</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (PyTorch):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import torch
import torch.nn as nn

# Funciones de activación en PyTorch
x = torch.tensor([-2.0, -1.0, 0.0, 1.0, 2.0])

# Sigmoid
sigmoid = nn.Sigmoid()
output = sigmoid(x)  # [0.1192, 0.2689, 0.5, 0.7311, 0.8808]

# Tanh
tanh = nn.Tanh()
output = tanh(x)  # [-0.9640, -0.7616, 0, 0.7616, 0.9640]

# ReLU
relu = nn.ReLU()
output = relu(x)  # [0, 0, 0, 1, 2]

# Leaky ReLU
leaky_relu = nn.LeakyReLU(negative_slope=0.01)
output = leaky_relu(x)  # [-0.02, -0.01, 0, 1, 2]

# En un modelo
class MyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(10, 20)
        self.relu = nn.ReLU()  # ← Función de activación
        self.fc2 = nn.Linear(20, 1)

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.fc2(x)
        return x`}
        </pre>
      </div>
    </div>
  );
}
