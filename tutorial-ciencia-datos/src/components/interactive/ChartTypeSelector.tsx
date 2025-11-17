"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BarChart3, LineChart, PieChart, ScatterChart, TrendingUp, Activity } from "lucide-react";

type ChartType = "line" | "bar" | "scatter" | "histogram" | "boxplot" | "heatmap";

export default function ChartTypeSelector() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedType, setSelectedType] = useState<ChartType>("line");

  const sampleData = [45, 62, 58, 71, 65, 78, 85, 92, 88, 95];
  const categories = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"];

  const chartTypes = [
    {
      id: "line" as ChartType,
      name: "Gráfico de Líneas",
      icon: LineChart,
      color: "blue",
      useCase: "Tendencias temporales",
      when: "Para mostrar cambios a lo largo del tiempo",
      examples: "Precio de acciones, temperaturas, ventas mensuales"
    },
    {
      id: "bar" as ChartType,
      name: "Gráfico de Barras",
      icon: BarChart3,
      color: "green",
      useCase: "Comparaciones categóricas",
      when: "Para comparar valores entre categorías",
      examples: "Ventas por producto, población por país"
    },
    {
      id: "scatter" as ChartType,
      name: "Scatter Plot",
      icon: ScatterChart,
      color: "purple",
      useCase: "Relaciones entre variables",
      when: "Para mostrar correlación entre dos variables",
      examples: "Altura vs peso, precio vs calidad"
    },
    {
      id: "histogram" as ChartType,
      name: "Histograma",
      icon: Activity,
      color: "orange",
      useCase: "Distribución de datos",
      when: "Para ver la frecuencia de valores",
      examples: "Distribución de edades, calificaciones"
    },
    {
      id: "boxplot" as ChartType,
      name: "Box Plot",
      icon: TrendingUp,
      color: "pink",
      useCase: "Distribución y outliers",
      when: "Para comparar distribuciones y detectar outliers",
      examples: "Salarios por departamento, tiempos de respuesta"
    },
    {
      id: "heatmap" as ChartType,
      name: "Mapa de Calor",
      icon: PieChart,
      color: "cyan",
      useCase: "Datos matriciales",
      when: "Para mostrar patrones en matrices de datos",
      examples: "Correlaciones, actividad por hora/día"
    }
  ];

  useEffect(() => {
    drawChart();
  }, [selectedType]);

  const drawChart = () => {
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

    switch (selectedType) {
      case "line":
        drawLineChart(ctx, padding, width, height);
        break;
      case "bar":
        drawBarChart(ctx, padding, width, height);
        break;
      case "scatter":
        drawScatterPlot(ctx, padding, width, height);
        break;
      case "histogram":
        drawHistogram(ctx, padding, width, height);
        break;
      case "boxplot":
        drawBoxPlot(ctx, padding, width, height);
        break;
      case "heatmap":
        drawHeatmap(ctx, padding, width, height);
        break;
    }

    // Draw labels
    drawLabels(ctx, padding, width, height);
  };

  const drawLineChart = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    const canvasHeight = 400; // Total canvas height
    const points = sampleData.map((val, idx) => ({
      x: padding + (idx / (sampleData.length - 1)) * width,
      y: canvasHeight - padding - (val / 100) * height
    }));

    // Draw line
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Draw points
    ctx.fillStyle = "#3b82f6";
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawBarChart = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    const canvasHeight = 400; // Total canvas height
    const barWidth = width / sampleData.length - 10;

    sampleData.forEach((val, idx) => {
      const x = padding + (idx / sampleData.length) * width + 5;
      const barHeight = (val / 100) * height;
      const y = canvasHeight - padding - barHeight;

      ctx.fillStyle = "#10b981";
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);
    });
  };

  const drawScatterPlot = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    const canvasHeight = 400; // Total canvas height
    // Generate correlated data
    const scatterData = sampleData.map((val, idx) => ({
      x: padding + (idx / sampleData.length) * width + Math.random() * 30,
      y: canvasHeight - padding - (val / 100) * height + (Math.random() - 0.5) * 40
    }));

    ctx.fillStyle = "#8b5cf6";
    scatterData.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawHistogram = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    const canvasHeight = 400; // Total canvas height
    // Create histogram bins
    const bins = 8;
    const binCounts = new Array(bins).fill(0);

    sampleData.forEach(val => {
      const binIndex = Math.min(Math.floor((val / 100) * bins), bins - 1);
      binCounts[binIndex]++;
    });

    const maxCount = Math.max(...binCounts);
    const binWidth = width / bins;

    binCounts.forEach((count, idx) => {
      const x = padding + idx * binWidth;
      const barHeight = (count / maxCount) * height;
      const y = canvasHeight - padding - barHeight;

      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(x, y, binWidth - 2, barHeight);

      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, binWidth - 2, barHeight);
    });
  };

  const drawBoxPlot = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    const canvasHeight = 400; // Total canvas height
    const sorted = [...sampleData].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    const scale = (val: number) => canvasHeight - padding - (val / 100) * height;

    const centerX = padding + width / 2;
    const boxWidth = 150;

    // Draw box
    ctx.fillStyle = "#ec4899";
    ctx.fillRect(centerX - boxWidth / 2, scale(q3), boxWidth, scale(q1) - scale(q3));

    // Draw median line
    ctx.strokeStyle = "#be185d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - boxWidth / 2, scale(median));
    ctx.lineTo(centerX + boxWidth / 2, scale(median));
    ctx.stroke();

    // Draw whiskers
    ctx.strokeStyle = "#9333ea";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, scale(q3));
    ctx.lineTo(centerX, scale(max));
    ctx.moveTo(centerX, scale(q1));
    ctx.lineTo(centerX, scale(min));
    ctx.stroke();

    // Draw whisker caps
    ctx.beginPath();
    ctx.moveTo(centerX - 20, scale(min));
    ctx.lineTo(centerX + 20, scale(min));
    ctx.moveTo(centerX - 20, scale(max));
    ctx.lineTo(centerX + 20, scale(max));
    ctx.stroke();
  };

  const drawHeatmap = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    const rows = 6;
    const cols = 8;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const value = Math.random();
        const x = padding + j * cellWidth;
        const y = padding + i * cellHeight;

        // Color based on value
        const hue = 200 + value * 100; // Blue to purple
        ctx.fillStyle = `hsl(${hue}, 70%, ${50 + value * 20}%)`;
        ctx.fillRect(x, y, cellWidth - 2, cellHeight - 2);
      }
    }
  };

  const drawLabels = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    const canvasHeight = 400; // Total canvas height
    ctx.fillStyle = "#1f2937";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";

    if (selectedType === "line" || selectedType === "bar") {
      // X-axis labels (first, middle, last)
      ctx.fillText(categories[0], padding, canvasHeight - padding + 20);
      ctx.fillText(categories[4], padding + width / 2, canvasHeight - padding + 20);
      ctx.fillText(categories[9], padding + width, canvasHeight - padding + 20);
    }

    // Y-axis label
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("Valores", -canvasHeight / 2, padding - 35);
    ctx.restore();
  };

  const selected = chartTypes.find(t => t.id === selectedType)!;
  const Icon = selected.icon;

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {chartTypes.map((type) => {
          const TypeIcon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedType === type.id
                  ? `bg-${type.color}-50 border-${type.color}-500 shadow-lg`
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              style={selectedType === type.id ? {
                backgroundColor: `var(--${type.color}-50)`,
                borderColor: `var(--${type.color}-500)`
              } : {}}
            >
              <div className="flex items-center gap-2 mb-2">
                <TypeIcon className={`w-5 h-5 ${
                  selectedType === type.id ? `text-${type.color}-600` : 'text-gray-400'
                }`} />
                <span className="font-semibold text-gray-800 text-sm">{type.name}</span>
              </div>
              <div className="text-xs text-gray-600">{type.useCase}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Chart Info */}
      <motion.div
        key={selectedType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">{selected.name}</h3>
            <div className="space-y-1 text-sm text-blue-800">
              <div><strong>Cuándo usar:</strong> {selected.when}</div>
              <div><strong>Ejemplos:</strong> {selected.examples}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Canvas Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Visualización</h3>
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full border-2 border-gray-200 rounded-lg"
        />
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (Matplotlib):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{selectedType === "line" && `import matplotlib.pyplot as plt

plt.plot(categories, values, marker='o', linewidth=2)
plt.xlabel('Meses')
plt.ylabel('Valores')
plt.title('Tendencia Mensual')
plt.grid(True, alpha=0.3)
plt.show()`}

{selectedType === "bar" && `import matplotlib.pyplot as plt

plt.bar(categories, values, color='green', alpha=0.7)
plt.xlabel('Categorías')
plt.ylabel('Valores')
plt.title('Comparación por Categoría')
plt.xticks(rotation=45)
plt.show()`}

{selectedType === "scatter" && `import matplotlib.pyplot as plt

plt.scatter(x_values, y_values, alpha=0.6, s=100)
plt.xlabel('Variable X')
plt.ylabel('Variable Y')
plt.title('Relación entre X e Y')
plt.grid(True, alpha=0.3)
plt.show()`}

{selectedType === "histogram" && `import matplotlib.pyplot as plt

plt.hist(data, bins=8, color='orange', edgecolor='black')
plt.xlabel('Valores')
plt.ylabel('Frecuencia')
plt.title('Distribución de Datos')
plt.show()`}

{selectedType === "boxplot" && `import matplotlib.pyplot as plt

plt.boxplot(data, vert=True)
plt.ylabel('Valores')
plt.title('Box Plot - Distribución y Outliers')
plt.grid(True, alpha=0.3, axis='y')
plt.show()`}

{selectedType === "heatmap" && `import matplotlib.pyplot as plt
import seaborn as sns

sns.heatmap(matrix_data, annot=True, cmap='viridis')
plt.title('Mapa de Calor')
plt.show()`}
        </pre>
      </div>

      {/* Decision Tree */}
      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
        <h3 className="font-bold text-green-900 mb-3">Árbol de Decisión: ¿Qué gráfico usar?</h3>
        <div className="space-y-2 text-sm text-green-800">
          <div>📈 <strong>¿Datos temporales?</strong> → Gráfico de líneas</div>
          <div>📊 <strong>¿Comparar categorías?</strong> → Gráfico de barras</div>
          <div>🔵 <strong>¿Relación entre 2 variables?</strong> → Scatter plot</div>
          <div>📉 <strong>¿Distribución de 1 variable?</strong> → Histograma</div>
          <div>📦 <strong>¿Comparar distribuciones?</strong> → Box plot</div>
          <div>🎨 <strong>¿Matriz de datos?</strong> → Mapa de calor</div>
        </div>
      </div>
    </div>
  );
}
