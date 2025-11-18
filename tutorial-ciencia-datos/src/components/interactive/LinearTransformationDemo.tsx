"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { RotateCcw, Play, Pause } from "lucide-react";

type Transformation = {
  name: string;
  matrix: [[number, number], [number, number]];
  description: string;
  color: string;
};

const transformations: Transformation[] = [
  {
    name: "Identidad",
    matrix: [[1, 0], [0, 1]],
    description: "No cambia nada (matriz identidad)",
    color: "from-gray-500 to-gray-700"
  },
  {
    name: "Escalar 2x",
    matrix: [[2, 0], [0, 2]],
    description: "Duplica el tamaño en todas direcciones",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Rotar 45°",
    matrix: [[0.707, -0.707], [0.707, 0.707]],
    description: "Rotación de 45 grados en sentido antihorario",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Reflexión X",
    matrix: [[1, 0], [0, -1]],
    description: "Refleja sobre el eje X (horizontal)",
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "Reflexión Y",
    matrix: [[-1, 0], [0, 1]],
    description: "Refleja sobre el eje Y (vertical)",
    color: "from-orange-500 to-red-500"
  },
  {
    name: "Shear X",
    matrix: [[1, 0.5], [0, 1]],
    description: "Deformación horizontal (shear)",
    color: "from-yellow-500 to-orange-500"
  }
];

export default function LinearTransformationDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTransform, setSelectedTransform] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Dibujar en canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40;

    // Dibujar grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      // Líneas verticales
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale, 0);
      ctx.lineTo(centerX + i * scale, height);
      ctx.stroke();

      // Líneas horizontales
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale);
      ctx.lineTo(width, centerY + i * scale);
      ctx.stroke();
    }

    // Dibujar ejes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    // Eje X
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    // Eje Y
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Matriz de transformación (interpolada si está animando)
    const transform = transformations[selectedTransform].matrix;
    const identity: [[number, number], [number, number]] = [[1, 0], [0, 1]];

    const currentMatrix: [[number, number], [number, number]] = [
      [
        identity[0][0] + (transform[0][0] - identity[0][0]) * progress,
        identity[0][1] + (transform[0][1] - identity[0][1]) * progress
      ],
      [
        identity[1][0] + (transform[1][0] - identity[1][0]) * progress,
        identity[1][1] + (transform[1][1] - identity[1][1]) * progress
      ]
    ];

    // Figura original (cuadrado)
    const square = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1]
    ];

    // Aplicar transformación
    const transformed = square.map(([x, y]) => {
      const newX = currentMatrix[0][0] * x + currentMatrix[0][1] * y;
      const newY = currentMatrix[1][0] * x + currentMatrix[1][1] * y;
      return [newX, newY];
    });

    // Dibujar figura original (semi-transparente)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    square.forEach(([x, y], i) => {
      const screenX = centerX + x * scale;
      const screenY = centerY - y * scale;
      if (i === 0) ctx.moveTo(screenX, screenY);
      else ctx.lineTo(screenX, screenY);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dibujar figura transformada
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#ec4899');

    ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    transformed.forEach(([x, y], i) => {
      const screenX = centerX + x * scale;
      const screenY = centerY - y * scale;
      if (i === 0) ctx.moveTo(screenX, screenY);
      else ctx.lineTo(screenX, screenY);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dibujar vectores base
    const drawVector = (x: number, y: number, color: string, label: string) => {
      const screenX = centerX + x * scale;
      const screenY = centerY - y * scale;

      // Línea
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(screenX, screenY);
      ctx.stroke();

      // Punta de flecha
      const angle = Math.atan2(-y, x);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(screenX, screenY);
      ctx.lineTo(
        screenX - 10 * Math.cos(angle - Math.PI / 6),
        screenY + 10 * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        screenX - 10 * Math.cos(angle + Math.PI / 6),
        screenY + 10 * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = color;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(label, screenX + 10, screenY - 10);
    };

    // Vector i (rojo)
    const iTransformed = [currentMatrix[0][0], currentMatrix[1][0]];
    drawVector(iTransformed[0], iTransformed[1], '#ef4444', 'î');

    // Vector j (verde)
    const jTransformed = [currentMatrix[0][1], currentMatrix[1][1]];
    drawVector(jTransformed[0], jTransformed[1], '#10b981', 'ĵ');

  }, [selectedTransform, progress]);

  // Animación
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          setIsAnimating(false);
          return 1;
        }
        return prev + 0.02;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleTransformSelect = (index: number) => {
    setSelectedTransform(index);
    setProgress(0);
    setIsAnimating(false);
  };

  const handleAnimate = () => {
    setProgress(0);
    setIsAnimating(true);
  };

  const handleReset = () => {
    setProgress(0);
    setIsAnimating(false);
  };

  const currentTransform = transformations[selectedTransform];

  return (
    <div className="glass-effect p-8 rounded-2xl space-y-6">
      <div>
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Transformaciones Lineales en 2D
        </h3>
        <p className="text-gray-600">
          Observa cómo diferentes matrices transforman el espacio. Los vectores base î y ĵ
          muestran cómo se mueven los ejes.
        </p>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-xl p-4 shadow-inner">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-auto border border-gray-200 rounded"
        />
      </div>

      {/* Transformation Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {transformations.map((transform, index) => (
          <motion.button
            key={transform.name}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleTransformSelect(index)}
            className={`p-4 rounded-xl text-left transition-all ${
              selectedTransform === index
                ? `bg-gradient-to-br ${transform.color} text-white shadow-lg`
                : 'glass-effect text-gray-700 hover:shadow-md'
            }`}
          >
            <p className="font-bold mb-1">{transform.name}</p>
            <p className={`text-xs ${selectedTransform === index ? 'text-white/90' : 'text-gray-600'}`}>
              {transform.description}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Matrix Display */}
      <div className="p-6 glass-effect rounded-xl">
        <h4 className="font-bold text-gray-800 mb-3">
          Matriz de Transformación:
        </h4>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-lg bg-gradient-to-br ${currentTransform.color}`}>
            <div className="grid grid-cols-2 gap-2">
              {currentTransform.matrix.map((row, i) =>
                row.map((val, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="w-16 h-12 flex items-center justify-center bg-white rounded text-gray-800 font-bold"
                  >
                    {val.toFixed(2)}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex-1 text-sm text-gray-700">
            <p><strong className="text-red-600">î</strong> (rojo): Vector base X transformado</p>
            <p><strong className="text-green-600">ĵ</strong> (verde): Vector base Y transformado</p>
            <p className="mt-2 text-xs">
              La matriz indica hacia dónde van los vectores base después de la transformación.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAnimate}
          disabled={isAnimating}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isAnimating ? (
            <>
              <Pause className="w-5 h-5" />
              Animando...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Animar Transformación
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Resetear
        </motion.button>
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progreso de transformación</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress * 100}%` }}
              className={`h-full bg-gradient-to-r ${currentTransform.color}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
