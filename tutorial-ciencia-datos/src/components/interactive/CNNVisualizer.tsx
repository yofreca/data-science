"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Eye, Layers, Grid3x3, Info } from "lucide-react";

type Layer = {
  type: "conv" | "pool" | "fc";
  name: string;
  size: { width: number; height: number; depth: number };
  filters?: number;
};

export default function CNNVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [filterView, setFilterView] = useState(0);

  const architecture: Layer[] = [
    { type: "conv", name: "Input Image", size: { width: 28, height: 28, depth: 1 } },
    { type: "conv", name: "Conv Layer 1", size: { width: 26, height: 26, depth: 16 }, filters: 16 },
    { type: "pool", name: "MaxPool 1", size: { width: 13, height: 13, depth: 16 } },
    { type: "conv", name: "Conv Layer 2", size: { width: 11, height: 11, depth: 32 }, filters: 32 },
    { type: "pool", name: "MaxPool 2", size: { width: 5, height: 5, depth: 32 } },
    { type: "fc", name: "Flatten", size: { width: 800, height: 1, depth: 1 } },
    { type: "fc", name: "FC Layer", size: { width: 128, height: 1, depth: 1 } },
    { type: "fc", name: "Output", size: { width: 10, height: 1, depth: 1 } }
  ];

  // Draw architecture
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 1000;
    const canvasHeight = 400;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const startX = 50;
    const spacing = 120;

    architecture.forEach((layer, idx) => {
      const x = startX + idx * spacing;
      const isSelected = idx === selectedLayer;

      // Draw layer based on type
      if (layer.type === "conv" || layer.type === "pool") {
        // Draw as 3D-ish box
        const boxWidth = Math.min(80, layer.size.width * 2);
        const boxHeight = Math.min(80, layer.size.height * 2);
        const depth = Math.min(20, layer.size.depth);

        // Back face (depth)
        ctx.fillStyle = isSelected ? "#bfdbfe" : "#e5e7eb";
        ctx.fillRect(x + depth, 150 - boxHeight/2 - depth, boxWidth, boxHeight);

        // Side face
        ctx.fillStyle = isSelected ? "#93c5fd" : "#d1d5db";
        ctx.beginPath();
        ctx.moveTo(x + depth + boxWidth, 150 - boxHeight/2 - depth);
        ctx.lineTo(x + boxWidth, 150 - boxHeight/2);
        ctx.lineTo(x + boxWidth, 150 + boxHeight/2);
        ctx.lineTo(x + depth + boxWidth, 150 + boxHeight/2 - depth);
        ctx.closePath();
        ctx.fill();

        // Front face
        ctx.fillStyle = isSelected ? "#60a5fa" : "#f3f4f6";
        ctx.fillRect(x, 150 - boxHeight/2, boxWidth, boxHeight);

        // Border
        ctx.strokeStyle = isSelected ? "#2563eb" : "#9ca3af";
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.strokeRect(x, 150 - boxHeight/2, boxWidth, boxHeight);

        // Label dimensions
        ctx.fillStyle = "#1f2937";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(
          `${layer.size.width}x${layer.size.height}x${layer.size.depth}`,
          x + boxWidth/2,
          150 + boxHeight/2 + 15
        );

      } else if (layer.type === "fc") {
        // Draw as vertical line with circles
        const height = 60;
        const neurons = Math.min(10, layer.size.width);

        for (let i = 0; i < neurons; i++) {
          const y = 150 - height/2 + (i / (neurons - 1)) * height;
          ctx.beginPath();
          ctx.arc(x + 15, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? "#60a5fa" : "#d1d5db";
          ctx.fill();
          ctx.strokeStyle = isSelected ? "#2563eb" : "#9ca3af";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = "#1f2937";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${layer.size.width}`, x + 15, 150 + height/2 + 15);
      }

      // Layer name
      ctx.fillStyle = isSelected ? "#1f2937" : "#6b7280";
      ctx.font = isSelected ? "bold 11px sans-serif" : "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(layer.name, x + 40, 250);

      // Draw connection to next layer
      if (idx < architecture.length - 1) {
        ctx.strokeStyle = "#d1d5db";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 85, 150);
        ctx.lineTo(x + 115, 150);
        ctx.stroke();

        // Arrow
        ctx.beginPath();
        ctx.moveTo(x + 115, 150);
        ctx.lineTo(x + 110, 145);
        ctx.moveTo(x + 115, 150);
        ctx.lineTo(x + 110, 155);
        ctx.stroke();
      }
    });

  }, [selectedLayer]);

  // Generate sample filter visualization
  const generateFilter = (size: number) => {
    const filter = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Predefined patterns for different filters
        const patterns = [
          // Vertical edge detector
          [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
          // Horizontal edge detector
          [[-1, -1, -1], [0, 0, 0], [1, 1, 1]],
          // Diagonal edge detector
          [[1, 0, -1], [0, 1, 0], [-1, 0, 1]],
          // Blur
          [[0.11, 0.11, 0.11], [0.11, 0.11, 0.11], [0.11, 0.11, 0.11]]
        ];
        const pattern = patterns[filterView % patterns.length];
        if (i < pattern.length && j < pattern[i].length) {
          row.push(pattern[i][j]);
        } else {
          row.push(0);
        }
      }
      filter.push(row);
    }
    return filter;
  };

  const filterSize = 3;
  const filter = generateFilter(filterSize);

  return (
    <div className="space-y-6">
      {/* Info Panel */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-orange-900">
            <p className="font-semibold mb-1">Arquitectura CNN</p>
            <p className="text-orange-800">
              Esta CNN típica para clasificación de imágenes (ej: MNIST) incluye capas
              convolucionales para detectar características, pooling para reducir dimensionalidad,
              y fully connected para clasificación final.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Visualization */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 overflow-x-auto">
        <h3 className="font-bold text-gray-800 mb-4">Arquitectura de la Red</h3>
        <canvas
          ref={canvasRef}
          width={1000}
          height={400}
          className="w-full"
        />
      </div>

      {/* Layer Selector */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {architecture.map((layer, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedLayer(idx)}
            className={`p-3 rounded-lg border-2 transition-all text-xs ${
              selectedLayer === idx
                ? 'bg-blue-50 border-blue-500 shadow-lg'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-800 mb-1">Capa {idx}</div>
            <div className="text-gray-600">{layer.name}</div>
          </button>
        ))}
      </div>

      {/* Selected Layer Details */}
      <motion.div
        key={selectedLayer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6"
      >
        <div className="flex items-start gap-3">
          <Layers className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">{architecture[selectedLayer].name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-blue-800">Tipo:</div>
                <div className="text-blue-700">
                  {architecture[selectedLayer].type === "conv" && "Convolutional"}
                  {architecture[selectedLayer].type === "pool" && "MaxPooling"}
                  {architecture[selectedLayer].type === "fc" && "Fully Connected"}
                </div>
              </div>
              <div>
                <div className="font-semibold text-blue-800">Dimensiones:</div>
                <div className="text-blue-700 font-mono">
                  {architecture[selectedLayer].size.width} x {architecture[selectedLayer].size.height} x {architecture[selectedLayer].size.depth}
                </div>
              </div>
              <div>
                <div className="font-semibold text-blue-800">Parámetros:</div>
                <div className="text-blue-700 font-mono">
                  {architecture[selectedLayer].filters
                    ? `${architecture[selectedLayer].filters} filtros`
                    : architecture[selectedLayer].size.width}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Convolutional Filter Visualization */}
      {(architecture[selectedLayer].type === "conv") && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Grid3x3 className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-gray-800">Filtro Convolucional (Kernel)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Filter Matrix */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Matriz del Filtro ({filterSize}x{filterSize})</h4>
              <div className="inline-block bg-gray-50 p-4 rounded-lg">
                {filter.map((row, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    {row.map((val, j) => (
                      <div
                        key={j}
                        className="w-16 h-16 flex items-center justify-center border-2 border-gray-300 rounded font-mono text-sm font-bold"
                        style={{
                          backgroundColor: val > 0
                            ? `rgba(34, 197, 94, ${Math.abs(val)})`
                            : val < 0
                            ? `rgba(239, 68, 68, ${Math.abs(val)})`
                            : '#f3f4f6'
                        }}
                      >
                        {val.toFixed(1)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                {["Vertical", "Horizontal", "Diagonal", "Blur"].map((name, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFilterView(idx)}
                    className={`px-3 py-2 rounded text-xs font-semibold transition-all ${
                      filterView === idx
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Cómo Funciona</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-900 mb-1">Convolución</div>
                  <div className="text-blue-800">
                    El filtro se desliza sobre la imagen, multiplicando valores elemento
                    a elemento y sumando el resultado. Esto detecta características específicas.
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-semibold text-green-900 mb-1">Valores Positivos (Verde)</div>
                  <div className="text-green-800">
                    Responden fuertemente a píxeles brillantes en esa posición.
                  </div>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <div className="font-semibold text-red-900 mb-1">Valores Negativos (Rojo)</div>
                  <div className="text-red-800">
                    Responden fuertemente a píxeles oscuros, creando contraste.
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-semibold text-purple-900 mb-1">Detección de Bordes</div>
                  <div className="text-purple-800">
                    Los filtros verticales/horizontales detectan bordes en esas direcciones.
                    Múltiples filtros aprenden diferentes características.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layer Type Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Grid3x3 className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-purple-900">Convolutional Layer</h3>
          </div>
          <ul className="text-sm text-purple-800 space-y-2">
            <li>• Aplica múltiples filtros a la imagen</li>
            <li>• Detecta características locales (bordes, texturas)</li>
            <li>• Comparte pesos → menos parámetros</li>
            <li>• Preserva estructura espacial</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-blue-900">Pooling Layer</h3>
          </div>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Reduce dimensionalidad (downsampling)</li>
            <li>• MaxPool: toma valor máximo de región</li>
            <li>• Invarianza a pequeñas traslaciones</li>
            <li>• No tiene parámetros entrenables</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-900">Fully Connected</h3>
          </div>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• Cada neurona conectada a todas anteriores</li>
            <li>• Combina características para clasificación</li>
            <li>• Típicamente al final de la red</li>
            <li>• Muchos parámetros</li>
          </ul>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="text-sm text-orange-700 font-semibold">Total Capas</div>
          <div className="text-2xl font-bold text-orange-900">{architecture.length}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-sm text-purple-700 font-semibold">Conv Layers</div>
          <div className="text-2xl font-bold text-purple-900">
            {architecture.filter(l => l.type === "conv").length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-sm text-blue-700 font-semibold">Pooling Layers</div>
          <div className="text-2xl font-bold text-blue-900">
            {architecture.filter(l => l.type === "pool").length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="text-sm text-green-700 font-semibold">FC Layers</div>
          <div className="text-2xl font-bold text-green-900">
            {architecture.filter(l => l.type === "fc").length}
          </div>
        </div>
      </div>

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (PyTorch):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import torch
import torch.nn as nn

class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        # Convolutional layers
        self.conv1 = nn.Conv2d(1, 16, kernel_size=3)   # 28x28x1 -> 26x26x16
        self.pool1 = nn.MaxPool2d(2)                   # 26x26x16 -> 13x13x16
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3)  # 13x13x16 -> 11x11x32
        self.pool2 = nn.MaxPool2d(2)                   # 11x11x32 -> 5x5x32

        # Fully connected layers
        self.fc1 = nn.Linear(5 * 5 * 32, 128)
        self.fc2 = nn.Linear(128, 10)
        self.relu = nn.ReLU()

    def forward(self, x):
        # Conv block 1
        x = self.relu(self.conv1(x))
        x = self.pool1(x)

        # Conv block 2
        x = self.relu(self.conv2(x))
        x = self.pool2(x)

        # Flatten
        x = x.view(-1, 5 * 5 * 32)

        # Fully connected
        x = self.relu(self.fc1(x))
        x = self.fc2(x)
        return x

# Uso
model = CNN()
input_image = torch.randn(1, 1, 28, 28)  # Batch, Channels, H, W
output = model(input_image)
print(f"Output shape: {output.shape}")  # [1, 10]`}
        </pre>
      </div>
    </div>
  );
}
