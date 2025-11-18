"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Eye, Maximize2, Minimize2, TrendingUp } from "lucide-react";

type Principle = "position" | "length" | "angle" | "area" | "color" | "shape";

export default function VisualizationPrinciples() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle>("position");

  const principles = [
    {
      id: "position" as Principle,
      title: "Posición",
      icon: TrendingUp,
      accuracy: "★★★★★",
      description: "La forma MÁS precisa de codificar datos cuantitativos",
      example: "Gráficos de dispersión, líneas"
    },
    {
      id: "length" as Principle,
      title: "Longitud",
      icon: Maximize2,
      accuracy: "★★★★☆",
      description: "Muy efectiva para comparaciones",
      example: "Gráficos de barras"
    },
    {
      id: "angle" as Principle,
      title: "Ángulo",
      icon: Eye,
      accuracy: "★★☆☆☆",
      description: "Difícil de estimar con precisión",
      example: "Gráficos de torta (pie charts)"
    },
    {
      id: "area" as Principle,
      title: "Área",
      icon: Minimize2,
      accuracy: "★★☆☆☆",
      description: "El cerebro subestima diferencias de área",
      example: "Bubble charts, tree maps"
    },
    {
      id: "color" as Principle,
      title: "Color (intensidad)",
      icon: Eye,
      accuracy: "★★★☆☆",
      description: "Buena para categorías, moderada para cantidades",
      example: "Mapas de calor"
    },
    {
      id: "shape" as Principle,
      title: "Forma",
      icon: Eye,
      accuracy: "★★★★☆",
      description: "Excelente para categorías, no para cantidades",
      example: "Diferentes marcadores en scatter plots"
    }
  ];

  useEffect(() => {
    drawVisualization();
  }, [selectedPrinciple]);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    switch (selectedPrinciple) {
      case "position":
        // Draw scatter plot showing position accuracy
        ctx.fillStyle = "#3b82f6";
        const values = [20, 35, 50, 65, 80];
        values.forEach((val, idx) => {
          const x = 100 + idx * 120;
          const y = canvas.height - 50 - val * 2;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fill();

          // Value label
          ctx.fillStyle = "#1f2937";
          ctx.font = "14px monospace";
          ctx.textAlign = "center";
          ctx.fillText(val.toString(), x, canvas.height - 20);
          ctx.fillStyle = "#3b82f6";
        });

        // Title
        ctx.fillStyle = "#1f2937";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Valores: 20, 35, 50, 65, 80", centerX, 30);
        ctx.fillText("¿Qué tan fácil es comparar?", centerX, 55);
        break;

      case "length":
        // Draw bars
        const barValues = [30, 55, 75, 45, 90];
        const barWidth = 80;
        const spacing = 20;

        barValues.forEach((val, idx) => {
          const x = 60 + idx * (barWidth + spacing);
          const height = val * 1.5;
          const y = canvas.height - 50 - height;

          ctx.fillStyle = "#10b981";
          ctx.fillRect(x, y, barWidth, height);

          // Value label
          ctx.fillStyle = "#1f2937";
          ctx.font = "14px monospace";
          ctx.textAlign = "center";
          ctx.fillText(val.toString(), x + barWidth / 2, canvas.height - 20);
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Valores: 30, 55, 75, 45, 90", centerX, 30);
        ctx.fillText("Las barras son fáciles de comparar", centerX, 55);
        break;

      case "angle":
        // Draw pie chart
        const pieValues = [30, 25, 20, 15, 10];
        const total = pieValues.reduce((a, b) => a + b, 0);
        const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

        let currentAngle = -Math.PI / 2;
        pieValues.forEach((val, idx) => {
          const sliceAngle = (val / total) * 2 * Math.PI;

          ctx.fillStyle = colors[idx];
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, 100, currentAngle, currentAngle + sliceAngle);
          ctx.closePath();
          ctx.fill();

          currentAngle += sliceAngle;
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("¿Cuál segmento es más grande?", centerX, 30);
        ctx.fillText("¡Es difícil comparar ángulos!", centerX, canvas.height - 20);
        break;

      case "area":
        // Draw circles with different areas
        const radii = [25, 35, 45, 30, 50];
        radii.forEach((radius, idx) => {
          const x = 80 + idx * 120;
          const y = centerY;

          ctx.fillStyle = "#f59e0b";
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;

          // Area label
          ctx.fillStyle = "#1f2937";
          ctx.font = "12px monospace";
          ctx.textAlign = "center";
          const area = Math.round(Math.PI * radius * radius);
          ctx.fillText(area.toString(), x, canvas.height - 20);
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Áreas (π×r²): 1963, 3848, 6362, 2827, 7854", centerX, 30);
        ctx.fillText("¿Puedes ordenarlas sin ver los números?", centerX, 55);
        break;

      case "color":
        // Draw color intensity
        const intensities = [0.2, 0.4, 0.6, 0.8, 1.0];
        intensities.forEach((intensity, idx) => {
          const x = 60 + idx * 120;
          const y = centerY - 40;

          ctx.fillStyle = `rgba(139, 92, 246, ${intensity})`;
          ctx.fillRect(x, y, 90, 80);

          // Value label
          ctx.fillStyle = "#1f2937";
          ctx.font = "14px monospace";
          ctx.textAlign = "center";
          ctx.fillText((intensity * 100).toFixed(0) + "%", x + 45, canvas.height - 20);
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Intensidades: 20%, 40%, 60%, 80%, 100%", centerX, 30);
        ctx.fillText("Moderadamente fácil de distinguir", centerX, 55);
        break;

      case "shape":
        // Draw different shapes
        const shapes = ["circle", "square", "triangle", "star", "diamond"];
        const shapeColors = ["#ef4444", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

        shapes.forEach((shape, idx) => {
          const x = 80 + idx * 120;
          const y = centerY;

          ctx.fillStyle = shapeColors[idx];

          if (shape === "circle") {
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, 2 * Math.PI);
            ctx.fill();
          } else if (shape === "square") {
            ctx.fillRect(x - 30, y - 30, 60, 60);
          } else if (shape === "triangle") {
            ctx.beginPath();
            ctx.moveTo(x, y - 35);
            ctx.lineTo(x - 35, y + 25);
            ctx.lineTo(x + 35, y + 25);
            ctx.closePath();
            ctx.fill();
          } else if (shape === "star") {
            drawStar(ctx, x, y, 5, 30, 15);
          } else if (shape === "diamond") {
            ctx.beginPath();
            ctx.moveTo(x, y - 35);
            ctx.lineTo(x + 25, y);
            ctx.lineTo(x, y + 35);
            ctx.lineTo(x - 25, y);
            ctx.closePath();
            ctx.fill();
          }
        });

        ctx.fillStyle = "#1f2937";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Formas diferentes son fáciles de distinguir", centerX, 30);
        ctx.fillText("Ideal para categorías, NO para cantidades", centerX, canvas.height - 20);
        break;
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  const selected = principles.find(p => p.id === selectedPrinciple)!;
  const Icon = selected.icon;

  return (
    <div className="space-y-6">
      {/* Principle Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {principles.map((principle) => {
          const PrincipleIcon = principle.icon;
          return (
            <button
              key={principle.id}
              onClick={() => setSelectedPrinciple(principle.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedPrinciple === principle.id
                  ? 'bg-purple-50 border-purple-500 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <PrincipleIcon className={`w-5 h-5 ${
                  selectedPrinciple === principle.id ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <span className="font-semibold text-gray-800">{principle.title}</span>
              </div>
              <div className="text-xs text-gray-600 mb-1">
                Precisión: {principle.accuracy}
              </div>
            </button>
          );
        })}
      </div>

      {/* Description */}
      <motion.div
        key={selectedPrinciple}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-purple-900 mb-2">{selected.title}</h3>
            <p className="text-purple-800 mb-2">{selected.description}</p>
            <div className="text-sm text-purple-700">
              <strong>Ejemplo:</strong> {selected.example}
            </div>
            <div className="text-sm text-purple-700 mt-1">
              <strong>Precisión:</strong> {selected.accuracy}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Canvas Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Demostración Visual</h3>
        <canvas
          ref={canvasRef}
          width={700}
          height={300}
          className="w-full border-2 border-gray-200 rounded-lg"
        />
      </div>

      {/* Cleveland & McGill Hierarchy */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <h3 className="font-bold text-blue-900 mb-3">
          Jerarquía de Efectividad (Cleveland & McGill, 1984)
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg">1.</span>
            <span><strong>Posición en escala común</strong> (scatter plot, line chart)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg">2.</span>
            <span><strong>Posición en escalas no alineadas</strong> (múltiples small multiples)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg">3.</span>
            <span><strong>Longitud, dirección, ángulo</strong> (bar charts)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg">4.</span>
            <span><strong>Área</strong> (bubble charts, tree maps)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg">5.</span>
            <span><strong>Volumen, curvatura</strong> (3D charts - ¡evitar!)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg">6.</span>
            <span><strong>Tonalidad, saturación</strong> (heat maps)</span>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-3">Lecciones Clave</h3>
        <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
          <li><strong>Usa posición cuando sea posible</strong> - es la forma más precisa</li>
          <li><strong>Las barras funcionan mejor que los pie charts</strong> - longitud &gt; ángulo</li>
          <li><strong>Evita codificar datos cuantitativos con área</strong> - es engañoso</li>
          <li><strong>Color es excelente para categorías</strong> - pero malo para magnitudes</li>
          <li><strong>Forma solo para categorías</strong> - nunca para cantidades</li>
          <li><strong>Evita 3D</strong> - añade complejidad sin mejorar comprensión</li>
        </ul>
      </div>
    </div>
  );
}
