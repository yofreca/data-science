"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";

export default function DecisionTreeVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawTree();
  }, []);

  const drawTree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Root node
    drawNode(ctx, 350, 50, "Edad > 30?", "#3b82f6");
    
    // Level 1
    drawLine(ctx, 350, 80, 200, 150);
    drawLine(ctx, 350, 80, 500, 150);
    drawNode(ctx, 200, 150, "Salario > 50k?", "#10b981");
    drawNode(ctx, 500, 150, "Clase: Alto", "#ef4444", true);

    // Level 2
    drawLine(ctx, 200, 180, 100, 250);
    drawLine(ctx, 200, 180, 300, 250);
    drawNode(ctx, 100, 250, "Clase: Bajo", "#ef4444", true);
    drawNode(ctx, 300, 250, "Clase: Medio", "#ef4444", true);

    // Labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px sans-serif";
    ctx.fillText("Sí", 270, 110);
    ctx.fillText("No", 430, 110);
    ctx.fillText("Sí", 140, 210);
    ctx.fillText("No", 250, 210);
  };

  const drawNode = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string, isLeaf = false) => {
    ctx.fillStyle = isLeaf ? `${color}20` : `${color}10`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(x - 70, y, 140, 30, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1f2937";
    ctx.font = isLeaf ? "bold 12px sans-serif" : "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 19);
  };

  const drawLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <canvas ref={canvasRef} width={700} height={320} className="w-full" />
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
        <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          ¿Cómo funciona?
        </h3>
        <ul className="space-y-2 text-sm text-orange-800">
          <li>• <strong>Nodos de decisión:</strong> Preguntas sobre características</li>
          <li>• <strong>Hojas:</strong> Predicciones finales (clase o valor)</li>
          <li>• <strong>Ventajas:</strong> Fácil de interpretar y visualizar</li>
          <li>• <strong>Desventajas:</strong> Propenso a overfitting</li>
        </ul>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python:</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">{`from sklearn.tree import DecisionTreeClassifier
import matplotlib.pyplot as plt
from sklearn import tree

# Entrenar
model = DecisionTreeClassifier(max_depth=3)
model.fit(X_train, y_train)

# Visualizar
tree.plot_tree(model, filled=True)
plt.show()`}</pre>
      </div>
    </div>
  );
}
