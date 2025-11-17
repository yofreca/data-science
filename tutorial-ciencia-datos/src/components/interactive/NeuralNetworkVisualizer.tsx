"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Info } from "lucide-react";

type LayerConfig = {
  neurons: number;
  name: string;
};

export default function NeuralNetworkVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layers] = useState<LayerConfig[]>([
    { neurons: 3, name: "Input" },
    { neurons: 4, name: "Hidden 1" },
    { neurons: 4, name: "Hidden 2" },
    { neurons: 2, name: "Output" }
  ]);
  const [activations, setActivations] = useState<number[][]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(0);

  // Initialize activations
  useEffect(() => {
    const initialActivations = layers.map(layer =>
      Array(layer.neurons).fill(0)
    );
    setActivations(initialActivations);
  }, [layers]);

  // Draw network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activations.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 800;
    const canvasHeight = 400;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const layerSpacing = canvasWidth / (layers.length + 1);

    // Draw connections first (behind neurons)
    for (let i = 0; i < layers.length - 1; i++) {
      const x1 = layerSpacing * (i + 1);
      const x2 = layerSpacing * (i + 2);
      const layer1 = layers[i];
      const layer2 = layers[i + 1];

      const neuronSpacing1 = canvasHeight / (layer1.neurons + 1);
      const neuronSpacing2 = canvasHeight / (layer2.neurons + 1);

      for (let j = 0; j < layer1.neurons; j++) {
        for (let k = 0; k < layer2.neurons; k++) {
          const y1 = neuronSpacing1 * (j + 1);
          const y2 = neuronSpacing2 * (k + 1);

          // Connection opacity based on current animation state
          const isActive = i < currentLayer;
          ctx.strokeStyle = isActive ? "rgba(147, 51, 234, 0.3)" : "rgba(200, 200, 200, 0.2)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }

    // Draw neurons
    layers.forEach((layer, layerIdx) => {
      const x = layerSpacing * (layerIdx + 1);
      const neuronSpacing = canvasHeight / (layer.neurons + 1);

      layer.neurons;
      for (let neuronIdx = 0; neuronIdx < layer.neurons; neuronIdx++) {
        const y = neuronSpacing * (neuronIdx + 1);
        const activation = activations[layerIdx]?.[neuronIdx] || 0;
        const isActive = layerIdx <= currentLayer;

        // Neuron circle
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);

        // Color based on activation
        if (isActive) {
          const intensity = Math.min(255, Math.floor(activation * 255));
          ctx.fillStyle = `rgb(${intensity}, ${Math.floor(intensity * 0.4)}, ${255 - intensity})`;
        } else {
          ctx.fillStyle = "#f3f4f6";
        }
        ctx.fill();
        ctx.strokeStyle = isActive ? "#9333ea" : "#d1d5db";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Activation value
        if (isActive && activation > 0) {
          ctx.fillStyle = "#1f2937";
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.fillText(activation.toFixed(2), x, y + 4);
        }
      }

      // Layer label
      ctx.fillStyle = "#4b5563";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(layer.name, x, canvasHeight - 10);
    });

  }, [layers, activations, currentLayer]);

  const forwardPass = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentLayer(0);

    // Set random input activations
    const newActivations = [...activations];
    newActivations[0] = newActivations[0].map(() => Math.random());
    setActivations(newActivations);

    // Animate through layers
    for (let i = 1; i < layers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentLayer(i);

      // Simple activation calculation (weighted sum + sigmoid)
      const prevLayerActivations = newActivations[i - 1];
      newActivations[i] = newActivations[i].map(() => {
        const sum = prevLayerActivations.reduce((acc, val) =>
          acc + val * (Math.random() * 2 - 1), 0
        );
        return 1 / (1 + Math.exp(-sum)); // Sigmoid
      });
      setActivations([...newActivations]);
    }

    setIsAnimating(false);
  };

  const reset = () => {
    setCurrentLayer(0);
    const resetActivations = layers.map(layer =>
      Array(layer.neurons).fill(0)
    );
    setActivations(resetActivations);
  };

  return (
    <div className="space-y-6">
      {/* Info Panel */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-900">
            <p className="font-semibold mb-1">Arquitectura de la Red</p>
            <p className="text-purple-800">
              Esta red tiene {layers.length} capas: 1 de entrada ({layers[0].neurons} neuronas),
              {layers.length - 2} ocultas (4 neuronas cada una), y 1 de salida ({layers[layers.length - 1].neurons} neuronas).
              Los colores muestran la activación: azul (baja) a rojo (alta).
            </p>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full"
        />
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={forwardPass}
          disabled={isAnimating}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            isAnimating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          <Play className="w-5 h-5" />
          {isAnimating ? 'Procesando...' : 'Forward Pass'}
        </button>
        <button
          onClick={reset}
          disabled={isAnimating}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-sm text-blue-700 font-semibold">Total Capas</div>
          <div className="text-2xl font-bold text-blue-900">{layers.length}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-sm text-purple-700 font-semibold">Total Neuronas</div>
          <div className="text-2xl font-bold text-purple-900">
            {layers.reduce((sum, l) => sum + l.neurons, 0)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg">
          <div className="text-sm text-pink-700 font-semibold">Capa Actual</div>
          <div className="text-2xl font-bold text-pink-900">
            {currentLayer < layers.length ? layers[currentLayer].name : '-'}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="text-sm text-green-700 font-semibold">Conexiones</div>
          <div className="text-2xl font-bold text-green-900">
            {layers.slice(0, -1).reduce((sum, layer, idx) =>
              sum + layer.neurons * layers[idx + 1].neurons, 0
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-3">Cómo Funciona</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="font-bold text-purple-600">1.</span>
            <span><strong>Input Layer:</strong> Recibe los datos de entrada (ej: píxeles de imagen, features)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-purple-600">2.</span>
            <span><strong>Hidden Layers:</strong> Capas intermedias que aprenden representaciones abstractas</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-purple-600">3.</span>
            <span><strong>Connections:</strong> Cada neurona está conectada a todas las de la siguiente capa (fully connected)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-purple-600">4.</span>
            <span><strong>Weights:</strong> Cada conexión tiene un peso que se aprende durante entrenamiento</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-purple-600">5.</span>
            <span><strong>Activation:</strong> Cada neurona aplica una función de activación (aquí: sigmoid)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-purple-600">6.</span>
            <span><strong>Output Layer:</strong> Produce la predicción final (ej: clasificación, regresión)</span>
          </div>
        </div>
      </div>

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (PyTorch):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import torch
import torch.nn as nn

class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Linear(3, 4)   # Input -> Hidden1
        self.layer2 = nn.Linear(4, 4)   # Hidden1 -> Hidden2
        self.layer3 = nn.Linear(4, 2)   # Hidden2 -> Output
        self.activation = nn.Sigmoid()

    def forward(self, x):
        x = self.activation(self.layer1(x))
        x = self.activation(self.layer2(x))
        x = self.activation(self.layer3(x))
        return x

# Uso
model = NeuralNetwork()
input_data = torch.randn(1, 3)  # Batch size 1, 3 features
output = model(input_data)
print(f"Output: {output}")`}
        </pre>
      </div>
    </div>
  );
}
