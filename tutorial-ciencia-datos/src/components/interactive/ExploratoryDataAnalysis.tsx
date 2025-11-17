"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

type DataPoint = {
  id: number;
  age: number;
  income: number;
  purchaseAmount: number;
  satisfaction: number;
  region: string;
};

export default function ExploratoryDataAnalysis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const corrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedView, setSelectedView] = useState<"distribution" | "correlation">("distribution");
  const [selectedVariable, setSelectedVariable] = useState<"age" | "income" | "purchaseAmount" | "satisfaction">("purchaseAmount");

  // Generate synthetic dataset
  const generateData = (): DataPoint[] => {
    const regions = ["Norte", "Sur", "Este", "Oeste"];
    const data: DataPoint[] = [];

    // Use predefined seed values to avoid hydration errors
    const seedValues = [
      { age: 25, income: 35000, purchase: 120, satisfaction: 7.2 },
      { age: 42, income: 68000, purchase: 450, satisfaction: 8.5 },
      { age: 31, income: 52000, purchase: 280, satisfaction: 6.8 },
      { age: 55, income: 95000, purchase: 720, satisfaction: 9.1 },
      { age: 28, income: 41000, purchase: 195, satisfaction: 7.5 },
      { age: 47, income: 73000, purchase: 510, satisfaction: 8.2 },
      { age: 33, income: 58000, purchase: 340, satisfaction: 7.8 },
      { age: 61, income: 110000, purchase: 890, satisfaction: 9.5 },
      { age: 29, income: 45000, purchase: 220, satisfaction: 7.1 },
      { age: 38, income: 62000, purchase: 380, satisfaction: 8.0 },
      { age: 44, income: 71000, purchase: 490, satisfaction: 8.3 },
      { age: 26, income: 38000, purchase: 150, satisfaction: 6.9 },
      { age: 52, income: 88000, purchase: 650, satisfaction: 8.9 },
      { age: 35, income: 60000, purchase: 360, satisfaction: 7.9 },
      { age: 41, income: 67000, purchase: 430, satisfaction: 8.4 },
      { age: 30, income: 49000, purchase: 250, satisfaction: 7.3 },
      { age: 58, income: 98000, purchase: 780, satisfaction: 9.2 },
      { age: 27, income: 40000, purchase: 180, satisfaction: 7.0 },
      { age: 46, income: 75000, purchase: 530, satisfaction: 8.6 },
      { age: 34, income: 56000, purchase: 320, satisfaction: 7.7 }
    ];

    for (let i = 0; i < 20; i++) {
      const seed = seedValues[i];
      data.push({
        id: i + 1,
        age: seed.age,
        income: seed.income,
        purchaseAmount: seed.purchase,
        satisfaction: seed.satisfaction,
        region: regions[i % 4]
      });
    }

    return data;
  };

  const [dataset] = useState<DataPoint[]>(generateData());

  // Calculate statistics
  const calculateStats = (variable: keyof Pick<DataPoint, "age" | "income" | "purchaseAmount" | "satisfaction">) => {
    const values = dataset.map(d => d[variable]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues[Math.floor(sortedValues.length / 2)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);

    return { mean, median, min, max, std };
  };

  const stats = calculateStats(selectedVariable);

  // Draw distribution histogram
  useEffect(() => {
    if (selectedView !== "distribution") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 600;
    const canvasHeight = 300;
    const padding = 50;
    const width = canvasWidth - 2 * padding;
    const height = canvasHeight - 2 * padding;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Get data for selected variable
    const values = dataset.map(d => d[selectedVariable]);

    // Create bins
    const bins = 8;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    const binCounts = Array(bins).fill(0);

    values.forEach(val => {
      const binIndex = Math.min(Math.floor((val - min) / binWidth), bins - 1);
      binCounts[binIndex]++;
    });

    const maxCount = Math.max(...binCounts);

    // Draw axes
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvasHeight - padding);
    ctx.lineTo(canvasWidth - padding, canvasHeight - padding);
    ctx.stroke();

    // Draw bars
    const barWidth = width / bins;
    binCounts.forEach((count, idx) => {
      const barHeight = (count / maxCount) * height;
      const x = padding + idx * barWidth;
      const y = canvasHeight - padding - barHeight;

      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      ctx.strokeStyle = "#1e40af";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y, barWidth - 4, barHeight);

      // Frequency label
      if (count > 0) {
        ctx.fillStyle = "#1f2937";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(count.toString(), x + barWidth / 2, y - 5);
      }
    });

    // Draw mean line
    const meanX = padding + ((stats.mean - min) / (max - min)) * width;
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(meanX, padding);
    ctx.lineTo(meanX, canvasHeight - padding);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = "#1f2937";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Frecuencia", padding - 35, padding - 10);

    // X-axis labels
    ctx.fillText(min.toFixed(0), padding, canvasHeight - padding + 20);
    ctx.fillText(max.toFixed(0), canvasWidth - padding, canvasHeight - padding + 20);

    // Mean label
    ctx.fillStyle = "#ef4444";
    ctx.font = "11px sans-serif";
    ctx.fillText(`Media: ${stats.mean.toFixed(1)}`, meanX, padding - 5);

  }, [dataset, selectedVariable, selectedView, stats]);

  // Draw correlation matrix
  useEffect(() => {
    if (selectedView !== "correlation") return;

    const canvas = corrCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 600;
    const canvasHeight = 600;
    const padding = 100;
    const size = canvasWidth - 2 * padding;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const variables: (keyof Pick<DataPoint, "age" | "income" | "purchaseAmount" | "satisfaction">)[] =
      ["age", "income", "purchaseAmount", "satisfaction"];

    // Calculate correlation matrix
    const correlations: number[][] = [];
    for (let i = 0; i < variables.length; i++) {
      correlations[i] = [];
      for (let j = 0; j < variables.length; j++) {
        const var1 = dataset.map(d => d[variables[i]]);
        const var2 = dataset.map(d => d[variables[j]]);

        const mean1 = var1.reduce((a, b) => a + b, 0) / var1.length;
        const mean2 = var2.reduce((a, b) => a + b, 0) / var2.length;

        const covariance = var1.reduce((sum, val, idx) =>
          sum + (val - mean1) * (var2[idx] - mean2), 0
        ) / var1.length;

        const std1 = Math.sqrt(var1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / var1.length);
        const std2 = Math.sqrt(var2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / var2.length);

        const correlation = covariance / (std1 * std2);
        correlations[i][j] = correlation;
      }
    }

    const cellSize = size / variables.length;

    // Draw cells
    for (let i = 0; i < variables.length; i++) {
      for (let j = 0; j < variables.length; j++) {
        const corr = correlations[i][j];
        const x = padding + j * cellSize;
        const y = padding + i * cellSize;

        // Color based on correlation
        const intensity = Math.abs(corr);
        const color = corr > 0
          ? `rgba(34, 197, 94, ${intensity})`  // Green for positive
          : `rgba(239, 68, 68, ${intensity})`;  // Red for negative

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize, cellSize);

        // Border
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellSize, cellSize);

        // Correlation value
        ctx.fillStyle = intensity > 0.5 ? "#fff" : "#1f2937";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(corr.toFixed(2), x + cellSize / 2, y + cellSize / 2);
      }
    }

    // Labels
    const varLabels = ["Edad", "Ingresos", "Compra", "Satisfacción"];
    ctx.fillStyle = "#1f2937";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";

    // Column labels
    varLabels.forEach((label, idx) => {
      ctx.save();
      ctx.translate(padding + idx * cellSize + cellSize / 2, padding - 15);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });

    // Row labels
    ctx.textAlign = "right";
    varLabels.forEach((label, idx) => {
      ctx.fillText(label, padding - 10, padding + idx * cellSize + cellSize / 2);
    });

  }, [dataset, selectedView]);

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setSelectedView("distribution")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedView === "distribution"
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Distribuciones
        </button>
        <button
          onClick={() => setSelectedView("correlation")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedView === "correlation"
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Correlaciones
        </button>
      </div>

      {/* Distribution View */}
      {selectedView === "distribution" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Variable Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: "age", name: "Edad", icon: Users },
              { id: "income", name: "Ingresos", icon: DollarSign },
              { id: "purchaseAmount", name: "Monto Compra", icon: TrendingUp },
              { id: "satisfaction", name: "Satisfacción", icon: BarChart3 }
            ].map((variable) => {
              const Icon = variable.icon;
              return (
                <button
                  key={variable.id}
                  onClick={() => setSelectedVariable(variable.id as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedVariable === variable.id
                      ? 'bg-blue-50 border-blue-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold text-gray-800 text-sm">{variable.name}</div>
                </button>
              );
            })}
          </div>

          {/* Histogram */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4">
              Distribución de {selectedVariable === "age" ? "Edad" :
                              selectedVariable === "income" ? "Ingresos" :
                              selectedVariable === "purchaseAmount" ? "Monto de Compra" :
                              "Satisfacción"}
            </h3>
            <canvas ref={canvasRef} width={600} height={300} className="w-full" />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="text-sm text-blue-700 font-semibold">Media</div>
              <div className="text-2xl font-bold text-blue-900">{stats.mean.toFixed(1)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="text-sm text-purple-700 font-semibold">Mediana</div>
              <div className="text-2xl font-bold text-purple-900">{stats.median.toFixed(1)}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <div className="text-sm text-green-700 font-semibold">Desv. Est.</div>
              <div className="text-2xl font-bold text-green-900">{stats.std.toFixed(1)}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
              <div className="text-sm text-orange-700 font-semibold">Mínimo</div>
              <div className="text-2xl font-bold text-orange-900">{stats.min.toFixed(1)}</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
              <div className="text-sm text-red-700 font-semibold">Máximo</div>
              <div className="text-2xl font-bold text-red-900">{stats.max.toFixed(1)}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Correlation View */}
      {selectedView === "correlation" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
            <p className="text-sm text-purple-900">
              <strong>Matriz de Correlación:</strong> Muestra cómo las variables se relacionan entre sí.
              Verde = correlación positiva (aumentan juntas), Rojo = correlación negativa (una aumenta, otra disminuye).
              Valores cercanos a 1 o -1 indican relación fuerte.
            </p>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Matriz de Correlación de Pearson</h3>
            <div className="flex justify-center">
              <canvas ref={corrCanvasRef} width={600} height={600} className="max-w-full" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Dataset Sample */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Muestra del Dataset (primeras 5 filas)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Edad</th>
                <th className="p-2 text-left">Ingresos</th>
                <th className="p-2 text-left">Monto Compra</th>
                <th className="p-2 text-left">Satisfacción</th>
                <th className="p-2 text-left">Región</th>
              </tr>
            </thead>
            <tbody>
              {dataset.slice(0, 5).map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-2">{row.id}</td>
                  <td className="p-2">{row.age}</td>
                  <td className="p-2">${row.income.toLocaleString()}</td>
                  <td className="p-2">${row.purchaseAmount}</td>
                  <td className="p-2">{row.satisfaction.toFixed(1)}/10</td>
                  <td className="p-2">{row.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">Total: {dataset.length} registros</p>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-3">Insights del EDA</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Distribución de edad:</strong> Los clientes tienen entre 25-61 años, con concentración en 30-50 años</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Correlación Ingresos-Compra:</strong> Positiva fuerte - a mayores ingresos, mayores compras</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Satisfacción:</strong> Alta en general (6.8-9.5/10), con mejor satisfacción en compras más grandes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>Segmentación regional:</strong> Distribución uniforme entre las 4 regiones</span>
          </li>
        </ul>
      </div>

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (Pandas + Seaborn):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Cargar datos
df = pd.read_csv('sales_data.csv')

# Estadísticas descriptivas
print(df.describe())
print(df.info())

# Distribución de variables
plt.figure(figsize=(12, 8))
df[['age', 'income', 'purchase_amount', 'satisfaction']].hist(bins=20)
plt.tight_layout()
plt.show()

# Matriz de correlación
correlation_matrix = df[['age', 'income', 'purchase_amount', 'satisfaction']].corr()
plt.figure(figsize=(10, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='RdYlGn', center=0,
            square=True, linewidths=1)
plt.title('Matriz de Correlación')
plt.show()

# Boxplots para detectar outliers
plt.figure(figsize=(12, 6))
df.boxplot(column=['age', 'income', 'purchase_amount', 'satisfaction'])
plt.xticks(rotation=45)
plt.show()

# Análisis por región
df.groupby('region').agg({
    'purchase_amount': ['mean', 'median', 'count'],
    'satisfaction': 'mean'
})`}
        </pre>
      </div>
    </div>
  );
}
