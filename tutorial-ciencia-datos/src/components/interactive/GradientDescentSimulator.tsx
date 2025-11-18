"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

export default function GradientDescentSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [learningRate, setLearningRate] = useState(0.1);
  const [iterations, setIterations] = useState(0);
  const [currentPoint, setCurrentPoint] = useState<Point>({ x: 8, y: 0 });
  const [path, setPath] = useState<Point[]>([{ x: 8, y: 0 }]);
  const [loss, setLoss] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Función de costo: f(x) = x^2
  const costFunction = (x: number): number => {
    return x * x;
  };

  // Derivada: f'(x) = 2x
  const gradient = (x: number): number => {
    return 2 * x;
  };

  // Paso de descenso del gradiente
  const gradientDescentStep = () => {
    const grad = gradient(currentPoint.x);
    const newX = currentPoint.x - learningRate * grad;
    const newY = costFunction(newX);
    const newPoint = { x: newX, y: newY };

    setCurrentPoint(newPoint);
    setPath((prev) => [...prev, newPoint]);
    setLoss(newY);
    setIterations((prev) => prev + 1);

    // Detener si converge
    if (Math.abs(newX) < 0.01) {
      setIsPlaying(false);
    }
  };

  // Animación
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      gradientDescentStep();
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, currentPoint, learningRate]);

  // Dibujar en canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height - 50;
    const scale = 20;

    // Dibujar ejes
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Dibujar función de costo
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -10; x <= 10; x += 0.1) {
      const screenX = centerX + x * scale;
      const y = costFunction(x);
      const screenY = centerY - y * scale / 4;
      if (x === -10) {
        ctx.moveTo(screenX, screenY);
      } else {
        ctx.lineTo(screenX, screenY);
      }
    }
    ctx.stroke();

    // Dibujar camino del gradiente
    if (path.length > 1) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      path.forEach((point, index) => {
        const screenX = centerX + point.x * scale;
        const screenY = centerY - point.y * scale / 4;
        if (index === 0) {
          ctx.moveTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Dibujar puntos del camino
      path.forEach((point, index) => {
        const screenX = centerX + point.x * scale;
        const screenY = centerY - point.y * scale / 4;
        ctx.fillStyle = index === path.length - 1 ? "#ef4444" : "#f59e0b";
        ctx.beginPath();
        ctx.arc(screenX, screenY, index === path.length - 1 ? 8 : 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Dibujar punto actual
    const currentScreenX = centerX + currentPoint.x * scale;
    const currentScreenY = centerY - currentPoint.y * scale / 4;

    // Punto con pulsación
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(currentScreenX, currentScreenY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(currentScreenX, currentScreenY, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Dibujar vector gradiente
    if (iterations > 0) {
      const grad = gradient(currentPoint.x);
      const arrowLength = 30;
      const arrowX = -grad * arrowLength / Math.abs(grad);

      ctx.strokeStyle = "#10b981";
      ctx.fillStyle = "#10b981";
      ctx.lineWidth = 3;

      // Línea del vector
      ctx.beginPath();
      ctx.moveTo(currentScreenX, currentScreenY);
      ctx.lineTo(currentScreenX + arrowX, currentScreenY);
      ctx.stroke();

      // Punta de flecha
      const angle = arrowX > 0 ? 0 : Math.PI;
      ctx.beginPath();
      ctx.moveTo(currentScreenX + arrowX, currentScreenY);
      ctx.lineTo(currentScreenX + arrowX - 10 * Math.cos(angle - Math.PI / 6), currentScreenY - 10 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(currentScreenX + arrowX - 10 * Math.cos(angle + Math.PI / 6), currentScreenY - 10 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }

  }, [currentPoint, path, iterations]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPoint({ x: 8, y: 0 });
    setPath([{ x: 8, y: 0 }]);
    setIterations(0);
    setLoss(costFunction(8));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      <div className="glass-effect p-8 rounded-2xl">
        {/* Explicación */}
        <div className="mb-6 space-y-2">
          <h3 className="text-2xl font-bold gradient-text">
            Simulador de Descenso del Gradiente
          </h3>
          <p className="text-gray-600">
            Observa cómo el algoritmo encuentra el mínimo de la función f(x) = x²
            ajustando iterativamente el valor de x en dirección opuesta al gradiente.
          </p>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-xl p-4 shadow-inner mb-6">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-auto border border-gray-200 rounded"
          />
        </div>

        {/* Métricas */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Iteraciones"
            value={iterations.toString()}
            color="from-blue-500 to-cyan-500"
          />
          <MetricCard
            label="Posición X"
            value={currentPoint.x.toFixed(4)}
            color="from-purple-500 to-pink-500"
          />
          <MetricCard
            label="Loss"
            value={loss.toFixed(4)}
            color="from-green-500 to-emerald-500"
          />
          <MetricCard
            label="Gradiente"
            value={gradient(currentPoint.x).toFixed(4)}
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-lg ${
                isPlaying
                  ? "bg-gradient-to-r from-orange-500 to-red-500"
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {iterations > 0 ? "Continuar" : "Iniciar"}
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700 shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Reiniciar
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-6 py-3 glass-effect rounded-lg font-semibold text-gray-700"
          >
            <Settings className="w-5 h-5" />
            Configuración
          </motion.button>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200"
            >
              <h4 className="font-bold text-gray-800 mb-4">Parámetros</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Learning Rate (α): {learningRate.toFixed(3)}
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    disabled={isPlaying}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Lento</span>
                    <span>Rápido</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>💡 Tip:</strong> Un learning rate muy alto puede hacer que el
                    algoritmo "rebote" y no converja. Un learning rate muy bajo hará que
                    la convergencia sea muy lenta.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leyenda */}
        <div className="mt-6 p-4 glass-effect rounded-xl">
          <h4 className="font-bold text-gray-800 mb-3 text-sm">Leyenda:</h4>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-700">Función de costo f(x) = x²</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-gray-700">Camino del descenso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Posición actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-green-500"></div>
              <span className="text-gray-700">Vector gradiente (dirección)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${color} text-white`}>
      <div className="text-xs font-semibold opacity-90 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
