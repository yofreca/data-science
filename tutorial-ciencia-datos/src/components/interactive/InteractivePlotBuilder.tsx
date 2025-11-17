"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, BarChart3, RefreshCw } from "lucide-react";

export default function InteractivePlotBuilder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [chartType, setChartType] = useState<"bar" | "line" | "scatter">("bar");
  const [dataPoints, setDataPoints] = useState<{label: string; value: number}[]>([
    { label: "A", value: 45 },
    { label: "B", value: 62 },
    { label: "C", value: 58 },
    { label: "D", value: 71 }
  ]);
  const [title, setTitle] = useState("Mi Gráfico");
  const [xLabel, setXLabel] = useState("Categorías");
  const [yLabel, setYLabel] = useState("Valores");
  const [color, setColor] = useState("#3b82f6");
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    drawChart();
  }, [chartType, dataPoints, title, xLabel, yLabel, color, showGrid]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding - 40; // Extra space for title

    // Draw title
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 30);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + 40 + (i / 5) * height;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }
    }

    // Draw axes
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding + 40);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw Y-axis label
    ctx.save();
    ctx.fillStyle = "#374151";
    ctx.font = "14px sans-serif";
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(yLabel, -(canvas.height / 2), 20);
    ctx.restore();

    // Draw X-axis label
    ctx.fillStyle = "#374151";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(xLabel, canvas.width / 2, canvas.height - 10);

    if (dataPoints.length === 0) return;

    const maxValue = Math.max(...dataPoints.map(d => d.value), 1);

    if (chartType === "bar") {
      const barWidth = width / dataPoints.length - 10;
      dataPoints.forEach((point, idx) => {
        const x = padding + (idx / dataPoints.length) * width + 5;
        const barHeight = (point.value / maxValue) * height;
        const y = canvas.height - padding - barHeight;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);

        // Label
        ctx.fillStyle = "#374151";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(point.label, x + barWidth / 2, canvas.height - padding + 20);

        // Value on top
        ctx.fillText(point.value.toString(), x + barWidth / 2, y - 5);
      });
    } else if (chartType === "line") {
      const points = dataPoints.map((point, idx) => ({
        x: padding + (idx / (dataPoints.length - 1 || 1)) * width,
        y: canvas.height - padding - (point.value / maxValue) * height
      }));

      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Draw points
      points.forEach((p, idx) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Labels
        ctx.fillStyle = "#374151";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(dataPoints[idx].label, p.x, canvas.height - padding + 20);
      });
    } else if (chartType === "scatter") {
      dataPoints.forEach((point, idx) => {
        const x = padding + (idx / (dataPoints.length - 1 || 1)) * width;
        const y = canvas.height - padding - (point.value / maxValue) * height;

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Labels
        ctx.fillStyle = "#374151";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(point.label, x, canvas.height - padding + 20);
      });
    }
  };

  const addDataPoint = () => {
    const newLabel = String.fromCharCode(65 + dataPoints.length); // A, B, C, ...
    setDataPoints([...dataPoints, { label: newLabel, value: Math.floor(Math.random() * 100) }]);
  };

  const removeDataPoint = (idx: number) => {
    setDataPoints(dataPoints.filter((_, i) => i !== idx));
  };

  const updateDataPoint = (idx: number, field: "label" | "value", value: string | number) => {
    const updated = [...dataPoints];
    updated[idx] = { ...updated[idx], [field]: value };
    setDataPoints(updated);
  };

  const randomizeData = () => {
    setDataPoints(dataPoints.map(p => ({ ...p, value: Math.floor(Math.random() * 100) })));
  };

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setChartType("bar")}
          className={`px-4 py-3 rounded-lg font-semibold transition-all ${
            chartType === "bar"
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Barras
        </button>
        <button
          onClick={() => setChartType("line")}
          className={`px-4 py-3 rounded-lg font-semibold transition-all ${
            chartType === "line"
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Líneas
        </button>
        <button
          onClick={() => setChartType("scatter")}
          className={`px-4 py-3 rounded-lg font-semibold transition-all ${
            chartType === "scatter"
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Dispersión
        </button>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Título del Gráfico</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Etiqueta Eje X</label>
          <input
            type="text"
            value={xLabel}
            onChange={(e) => setXLabel(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Etiqueta Eje Y</label>
          <input
            type="text"
            value={yLabel}
            onChange={(e) => setYLabel(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Show Grid Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="showGrid"
          checked={showGrid}
          onChange={(e) => setShowGrid(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="showGrid" className="text-sm font-semibold text-gray-700">
          Mostrar cuadrícula
        </label>
      </div>

      {/* Data Points */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Puntos de Datos</h3>
          <div className="flex gap-2">
            <button
              onClick={randomizeData}
              className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Aleatorizar
            </button>
            <button
              onClick={addDataPoint}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {dataPoints.map((point, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg">
              <input
                type="text"
                value={point.label}
                onChange={(e) => updateDataPoint(idx, "label", e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
                placeholder="Label"
              />
              <input
                type="number"
                value={point.value}
                onChange={(e) => updateDataPoint(idx, "value", parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
                placeholder="Valor"
              />
              <button
                onClick={() => removeDataPoint(idx)}
                className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full border-2 border-gray-200 rounded-lg"
        />
      </div>

      {/* Export Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python para replicar:</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import matplotlib.pyplot as plt

# Datos
labels = [${dataPoints.map(p => `"${p.label}"`).join(", ")}]
values = [${dataPoints.map(p => p.value).join(", ")}]

# Crear gráfico
${chartType === "bar" ? "plt.bar(labels, values, color='" + color + "')" :
  chartType === "line" ? "plt.plot(labels, values, marker='o', color='" + color + "', linewidth=2)" :
  "plt.scatter(range(len(labels)), values, color='" + color + "', s=100, alpha=0.7)"}

plt.xlabel("${xLabel}")
plt.ylabel("${yLabel}")
plt.title("${title}")
${showGrid ? "plt.grid(True, alpha=0.3)" : ""}
plt.show()`}
        </pre>
      </div>
    </div>
  );
}
