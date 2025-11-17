"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Check, AlertCircle } from "lucide-react";

type Example = "pie_vs_bar" | "3d_vs_2d" | "truncated_vs_full" | "bad_colors";

export default function ChartComparison() {
  const badCanvasRef = useRef<HTMLCanvasElement>(null);
  const goodCanvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedExample, setSelectedExample] = useState<Example>("pie_vs_bar");

  const examples = [
    {
      id: "pie_vs_bar" as Example,
      title: "Pie Chart vs Bar Chart",
      badTitle: "❌ Gráfico de Torta (Pie Chart)",
      goodTitle: "✓ Gráfico de Barras",
      problem: "Difícil comparar ángulos con precisión",
      solution: "Las barras son más fáciles de comparar"
    },
    {
      id: "3d_vs_2d" as Example,
      title: "3D vs 2D",
      badTitle: "❌ Gráfico 3D",
      goodTitle: "✓ Gráfico 2D",
      problem: "El 3D distorsiona la percepción y dificulta la lectura",
      solution: "2D es más claro y preciso"
    },
    {
      id: "truncated_vs_full" as Example,
      title: "Eje Truncado vs Completo",
      badTitle: "❌ Eje Y Truncado",
      goodTitle: "✓ Eje Y Completo",
      problem: "Exagera diferencias pequeñas",
      solution: "Muestra la escala completa para contexto"
    },
    {
      id: "bad_colors" as Example,
      title: "Colores Problemáticos vs Accesibles",
      badTitle: "❌ Rojo-Verde",
      goodTitle: "✓ Colores Accesibles",
      problem: "Problemático para daltonismo (8% de hombres)",
      solution: "Usa paletas colorblind-safe"
    }
  ];

  const data = [30, 25, 20, 15, 10];
  const labels = ["A", "B", "C", "D", "E"];

  useEffect(() => {
    drawComparison();
  }, [selectedExample]);

  const drawComparison = () => {
    drawBadExample();
    drawGoodExample();
  };

  const drawBadExample = () => {
    const canvas = badCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    switch (selectedExample) {
      case "pie_vs_bar":
        // Draw pie chart
        const total = data.reduce((a, b) => a + b, 0);
        const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];
        let currentAngle = -Math.PI / 2;

        data.forEach((val, idx) => {
          const sliceAngle = (val / total) * 2 * Math.PI;

          ctx.fillStyle = colors[idx];
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, 80, currentAngle, currentAngle + sliceAngle);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();

          currentAngle += sliceAngle;
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("¿Qué segmento es mayor: B o C?", centerX, canvas.height - 10);
        break;

      case "3d_vs_2d":
        // Draw 3D-style bars (perspective)
        const barWidth = 50;
        const spacing = 20;

        data.forEach((val, idx) => {
          const x = 50 + idx * (barWidth + spacing);
          const height = val * 2;
          const y = canvas.height - 40 - height;

          // 3D effect (front face)
          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(x, y, barWidth, height);

          // 3D effect (top)
          ctx.fillStyle = "#60a5fa";
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 10, y - 10);
          ctx.lineTo(x + barWidth + 10, y - 10);
          ctx.lineTo(x + barWidth, y);
          ctx.closePath();
          ctx.fill();

          // 3D effect (side)
          ctx.fillStyle = "#2563eb";
          ctx.beginPath();
          ctx.moveTo(x + barWidth, y);
          ctx.lineTo(x + barWidth + 10, y - 10);
          ctx.lineTo(x + barWidth + 10, y + height - 10);
          ctx.lineTo(x + barWidth, y + height);
          ctx.closePath();
          ctx.fill();
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("El 3D confunde la percepción", centerX, canvas.height - 10);
        break;

      case "truncated_vs_full":
        // Draw bars with truncated Y-axis (starts at 20, not 0)
        const truncatedMin = 20;
        const barWidthT = 50;
        const spacingT = 20;
        const dataT = [25, 27, 26, 28, 29];

        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 30);
        ctx.lineTo(40, canvas.height - 40);
        ctx.lineTo(canvas.width - 40, canvas.height - 40);
        ctx.stroke();

        dataT.forEach((val, idx) => {
          const x = 60 + idx * (barWidthT + spacingT);
          const height = ((val - truncatedMin) / (30 - truncatedMin)) * (canvas.height - 80);
          const y = canvas.height - 40 - height;

          ctx.fillStyle = "#ef4444";
          ctx.fillRect(x, y, barWidthT, height);
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("30", 35, 35);
        ctx.fillText("20", 35, canvas.height - 40);
        ctx.textAlign = "center";
        ctx.fillText("¡Eje Y empieza en 20!", centerX, canvas.height - 10);
        break;

      case "bad_colors":
        // Draw bars with red-green (bad for colorblind)
        const barWidthC = 60;
        const spacingC = 15;
        const badColors = ["#dc2626", "#ef4444", "#f87171", "#86efac", "#22c55e"];

        badColors.forEach((color, idx) => {
          const x = 40 + idx * (barWidthC + spacingC);
          const height = data[idx] * 2;
          const y = canvas.height - 40 - height;

          ctx.fillStyle = color;
          ctx.fillRect(x, y, barWidthC, height);
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Rojo-Verde: malo para daltonismo", centerX, canvas.height - 10);
        break;
    }
  };

  const drawGoodExample = () => {
    const canvas = goodCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;

    switch (selectedExample) {
      case "pie_vs_bar":
        // Draw bar chart
        const barWidth = 50;
        const spacing = 20;

        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 30);
        ctx.lineTo(40, canvas.height - 40);
        ctx.lineTo(canvas.width - 40, canvas.height - 40);
        ctx.stroke();

        data.forEach((val, idx) => {
          const x = 60 + idx * (barWidth + spacing);
          const height = val * 2;
          const y = canvas.height - 40 - height;

          ctx.fillStyle = "#10b981";
          ctx.fillRect(x, y, barWidth, height);

          ctx.fillStyle = "#1f2937";
          ctx.font = "12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(labels[idx], x + barWidth / 2, canvas.height - 25);
          ctx.fillText(val.toString(), x + barWidth / 2, y - 5);
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("¡Fácil comparar!", centerX, canvas.height - 10);
        break;

      case "3d_vs_2d":
        // Draw simple 2D bars
        const barWidth2D = 50;
        const spacing2D = 20;

        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 30);
        ctx.lineTo(40, canvas.height - 40);
        ctx.lineTo(canvas.width - 40, canvas.height - 40);
        ctx.stroke();

        data.forEach((val, idx) => {
          const x = 60 + idx * (barWidth2D + spacing2D);
          const height = val * 2;
          const y = canvas.height - 40 - height;

          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(x, y, barWidth2D, height);
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Simple y claro", centerX, canvas.height - 10);
        break;

      case "truncated_vs_full":
        // Draw bars with full Y-axis (starts at 0)
        const barWidthF = 50;
        const spacingF = 20;
        const dataF = [25, 27, 26, 28, 29];

        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 30);
        ctx.lineTo(40, canvas.height - 40);
        ctx.lineTo(canvas.width - 40, canvas.height - 40);
        ctx.stroke();

        dataF.forEach((val, idx) => {
          const x = 60 + idx * (barWidthF + spacingF);
          const height = (val / 30) * (canvas.height - 80);
          const y = canvas.height - 40 - height;

          ctx.fillStyle = "#10b981";
          ctx.fillRect(x, y, barWidthF, height);
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("30", 35, 35);
        ctx.fillText("0", 35, canvas.height - 40);
        ctx.textAlign = "center";
        ctx.fillText("Eje Y completo (0-30)", centerX, canvas.height - 10);
        break;

      case "bad_colors":
        // Draw bars with colorblind-safe palette
        const barWidthG = 60;
        const spacingG = 15;
        const goodColors = ["#0173b2", "#de8f05", "#029e73", "#cc78bc", "#ca9161"];

        goodColors.forEach((color, idx) => {
          const x = 40 + idx * (barWidthG + spacingG);
          const height = data[idx] * 2;
          const y = canvas.height - 40 - height;

          ctx.fillStyle = color;
          ctx.fillRect(x, y, barWidthG, height);
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Paleta colorblind-safe", centerX, canvas.height - 10);
        break;
    }
  };

  const selected = examples.find(e => e.id === selectedExample)!;

  return (
    <div className="space-y-6">
      {/* Example Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setSelectedExample(example.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedExample === example.id
                ? 'bg-blue-50 border-blue-500 shadow-lg'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-800 text-sm">{example.title}</div>
          </button>
        ))}
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bad Example */}
        <motion.div
          key={`bad-${selectedExample}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-50 border-2 border-red-300 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <X className="w-6 h-6 text-red-600" />
            <h3 className="font-bold text-red-900">{selected.badTitle}</h3>
          </div>
          <canvas
            ref={badCanvasRef}
            width={350}
            height={250}
            className="w-full bg-white rounded-lg mb-4"
          />
          <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <strong>Problema:</strong> {selected.problem}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Good Example */}
        <motion.div
          key={`good-${selectedExample}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-green-50 border-2 border-green-300 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-green-900">{selected.goodTitle}</h3>
          </div>
          <canvas
            ref={goodCanvasRef}
            width={350}
            height={250}
            className="w-full bg-white rounded-lg mb-4"
          />
          <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <strong>Solución:</strong> {selected.solution}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Guidelines */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-4">Reglas de Oro de la Visualización</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Maximiza data-ink ratio</strong> - Menos decoración, más datos
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Usa barras en lugar de pies</strong> - Mejor para comparación
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Evita 3D</strong> - Distorsiona datos sin aportar valor
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Ejes desde cero</strong> - Especialmente para barras
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Paletas accesibles</strong> - Piensa en daltonismo
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Títulos descriptivos</strong> - Explica qué muestra el gráfico
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
