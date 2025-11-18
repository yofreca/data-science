"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

type FunctionType = 'quadratic' | 'cubic' | 'sin' | 'exp';

const functions = {
  quadratic: {
    name: 'f(x) = x²',
    fn: (x: number) => x * x,
    derivative: (x: number) => 2 * x,
    derivativeName: "f'(x) = 2x",
    color: 'from-blue-500 to-cyan-500'
  },
  cubic: {
    name: 'f(x) = x³ - 3x',
    fn: (x: number) => x * x * x - 3 * x,
    derivative: (x: number) => 3 * x * x - 3,
    derivativeName: "f'(x) = 3x² - 3",
    color: 'from-purple-500 to-pink-500'
  },
  sin: {
    name: 'f(x) = sin(x)',
    fn: (x: number) => Math.sin(x),
    derivative: (x: number) => Math.cos(x),
    derivativeName: "f'(x) = cos(x)",
    color: 'from-green-500 to-emerald-500'
  },
  exp: {
    name: 'f(x) = eˣ/4',
    fn: (x: number) => Math.exp(x) / 4,
    derivative: (x: number) => Math.exp(x) / 4,
    derivativeName: "f'(x) = eˣ/4",
    color: 'from-orange-500 to-red-500'
  }
};

export default function DerivativeVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedFunction, setSelectedFunction] = useState<FunctionType>('quadratic');
  const [pointX, setPointX] = useState(1);
  const [showTangent, setShowTangent] = useState(true);
  const [showSecant, setShowSecant] = useState(false);
  const [h, setH] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const func = functions[selectedFunction];
  const y = func.fn(pointX);
  const slope = func.derivative(pointX);

  // Aproximación de la derivada con diferencia finita
  const approximateSlope = (func.fn(pointX + h) - func.fn(pointX)) / h;

  // Animación de h acercándose a 0
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setH((prev) => {
        const newH = prev * 0.95;
        if (newH < 0.01) {
          setIsAnimating(false);
          return 0.01;
        }
        return newH;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Dibujar en canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scaleX = 40;
    const scaleY = selectedFunction === 'exp' ? 20 : 30;

    // Grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * scaleX, 0);
      ctx.lineTo(centerX + i * scaleX, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scaleY);
      ctx.lineTo(width, centerY + i * scaleY);
      ctx.stroke();
    }

    // Ejes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Función principal
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -10; x <= 10; x += 0.1) {
      const y = func.fn(x);
      const screenX = centerX + x * scaleX;
      const screenY = centerY - y * scaleY;
      if (x === -10) ctx.moveTo(screenX, screenY);
      else ctx.lineTo(screenX, screenY);
    }
    ctx.stroke();

    // Punto en la curva
    const screenPointX = centerX + pointX * scaleX;
    const screenPointY = centerY - y * scaleY;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(screenPointX, screenPointY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(screenPointX, screenPointY, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Línea tangente (derivada real)
    if (showTangent) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      const tangentLeft = pointX - 3;
      const tangentRight = pointX + 3;
      const yLeft = y + slope * (tangentLeft - pointX);
      const yRight = y + slope * (tangentRight - pointX);
      ctx.moveTo(centerX + tangentLeft * scaleX, centerY - yLeft * scaleY);
      ctx.lineTo(centerX + tangentRight * scaleX, centerY - yRight * scaleY);
      ctx.stroke();
    }

    // Línea secante (aproximación)
    if (showSecant && h > 0.01) {
      const x2 = pointX + h;
      const y2 = func.fn(x2);
      const screenX2 = centerX + x2 * scaleX;
      const screenY2 = centerY - y2 * scaleY;

      // Punto secundario
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(screenX2, screenY2, 6, 0, Math.PI * 2);
      ctx.fill();

      // Línea secante
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(screenPointX, screenPointY);
      ctx.lineTo(screenX2, screenY2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Extensión de la secante
      const secantSlope = approximateSlope;
      ctx.strokeStyle = '#a855f7';
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const secLeft = pointX - 2;
      const secRight = pointX + h + 2;
      const ySecLeft = y + secantSlope * (secLeft - pointX);
      const ySecRight = y + secantSlope * (secRight - pointX);
      ctx.moveTo(centerX + secLeft * scaleX, centerY - ySecLeft * scaleY);
      ctx.lineTo(centerX + secRight * scaleX, centerY - ySecRight * scaleY);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Labels
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`x = ${pointX.toFixed(2)}`, screenPointX + 15, screenPointY - 20);
    ctx.fillText(`f(x) = ${y.toFixed(2)}`, screenPointX + 15, screenPointY - 5);

  }, [selectedFunction, pointX, showTangent, showSecant, h, slope, y]);

  return (
    <div className="glass-effect p-8 rounded-2xl space-y-6">
      <div>
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Visualización de Derivadas
        </h3>
        <p className="text-gray-600">
          La derivada representa la pendiente de la recta tangente. Observa cómo la
          secante (aproximación) se acerca a la tangente cuando h → 0.
        </p>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-xl p-4 shadow-inner">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full h-auto border border-gray-200 rounded"
        />
      </div>

      {/* Function Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(functions) as FunctionType[]).map((key) => {
          const fn = functions[key];
          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedFunction(key)}
              className={`p-3 rounded-xl text-center transition-all ${
                selectedFunction === key
                  ? `bg-gradient-to-br ${fn.color} text-white shadow-lg`
                  : 'glass-effect text-gray-700 hover:shadow-md'
              }`}
            >
              <p className="font-bold text-sm">{fn.name}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Position Control */}
        <div className="p-4 glass-effect rounded-xl space-y-3">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700">Posición x:</label>
            <span className="font-bold text-blue-600">{pointX.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={pointX}
            onChange={(e) => setPointX(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* h Control (for secant) */}
        <div className="p-4 glass-effect rounded-xl space-y-3">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700">Incremento h:</label>
            <span className="font-bold text-purple-600">{h.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="2"
            step="0.01"
            value={h}
            onChange={(e) => {
              setH(parseFloat(e.target.value));
              setIsAnimating(false);
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Toggle Options */}
      <div className="flex gap-4 justify-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showTangent}
            onChange={(e) => setShowTangent(e.target.checked)}
            className="w-5 h-5 text-green-600"
          />
          <span className="font-semibold text-gray-700">
            Mostrar Tangente (derivada real)
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showSecant}
            onChange={(e) => setShowSecant(e.target.checked)}
            className="w-5 h-5 text-purple-600"
          />
          <span className="font-semibold text-gray-700">
            Mostrar Secante (aproximación)
          </span>
        </label>
      </div>

      {/* Derivative Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`p-6 rounded-xl bg-gradient-to-br ${func.color} text-white`}>
          <h4 className="font-bold mb-2">Derivada Exacta</h4>
          <p className="text-sm opacity-90 mb-2">{func.derivativeName}</p>
          <p className="text-3xl font-bold">
            f'({pointX.toFixed(2)}) = {slope.toFixed(3)}
          </p>
        </div>

        {showSecant && (
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <h4 className="font-bold mb-2">Aproximación (Diferencia Finita)</h4>
            <p className="text-sm opacity-90 mb-2">[f(x+h) - f(x)] / h</p>
            <p className="text-3xl font-bold">≈ {approximateSlope.toFixed(3)}</p>
            <p className="text-xs mt-2 opacity-80">
              Error: {Math.abs(slope - approximateSlope).toFixed(4)}
            </p>
          </div>
        )}
      </div>

      {/* Animate h → 0 */}
      {showSecant && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setH(2);
            setIsAnimating(true);
          }}
          disabled={isAnimating}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isAnimating ? (
            <>
              <Pause className="w-5 h-5" />
              Animando h → 0...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Animar: h → 0 (límite de la derivada)
            </>
          )}
        </motion.button>
      )}

      {/* Explanation */}
      <div className="p-4 glass-effect rounded-xl">
        <p className="text-sm text-gray-700">
          <strong>💡 Concepto:</strong> La derivada f'(x) es el límite de la pendiente
          de la secante cuando h → 0. Es decir: f'(x) = lim(h→0) [f(x+h) - f(x)] / h
          <br /><br />
          <strong className="text-green-600">Tangente verde:</strong> Pendiente = derivada exacta
          <br />
          <strong className="text-purple-600">Secante púrpura:</strong> Aproximación que mejora cuando h es pequeño
        </p>
      </div>
    </div>
  );
}
