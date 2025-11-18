"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Plus, Minus, X as Multiply } from "lucide-react";

type Vector = [number, number];

export default function VectorVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vectorA, setVectorA] = useState<Vector>([3, 2]);
  const [vectorB, setVectorB] = useState<Vector>([1, 3]);
  const [operation, setOperation] = useState<'add' | 'subtract' | 'dot'>('add');
  const [scalar, setScalar] = useState(2);

  // Operaciones vectoriales
  const addVectors = (a: Vector, b: Vector): Vector => [a[0] + b[0], a[1] + b[1]];
  const subtractVectors = (a: Vector, b: Vector): Vector => [a[0] - b[0], a[1] - b[1]];
  const dotProduct = (a: Vector, b: Vector): number => a[0] * b[0] + a[1] * b[1];
  const scaleVector = (v: Vector, s: number): Vector => [v[0] * s, v[1] * s];
  const magnitude = (v: Vector): number => Math.sqrt(v[0] * v[0] + v[1] * v[1]);

  const resultVector = operation === 'add'
    ? addVectors(vectorA, vectorB)
    : operation === 'subtract'
    ? subtractVectors(vectorA, vectorB)
    : vectorA; // For dot product, we don't need a result vector

  const dotProductValue = dotProduct(vectorA, vectorB);

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
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * scale, 0);
      ctx.lineTo(centerX + i * scale, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, centerY + i * scale);
      ctx.lineTo(width, centerY + i * scale);
      ctx.stroke();
    }

    // Dibujar ejes
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Función para dibujar vector
    const drawVector = (
      v: Vector,
      color: string,
      label: string,
      fromPoint: Vector = [0, 0],
      dashed: boolean = false
    ) => {
      const startX = centerX + fromPoint[0] * scale;
      const startY = centerY - fromPoint[1] * scale;
      const endX = centerX + (fromPoint[0] + v[0]) * scale;
      const endY = centerY - (fromPoint[1] + v[1]) * scale;

      // Línea del vector
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      if (dashed) {
        ctx.setLineDash([5, 5]);
      }
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Punta de flecha
      const angle = Math.atan2(-(v[1]), v[0]);
      const arrowLength = 12;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - Math.PI / 6),
        endY + arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + Math.PI / 6),
        endY + arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = color;
      ctx.font = 'bold 16px sans-serif';
      const labelX = endX + 15;
      const labelY = endY - 10;
      ctx.fillText(label, labelX, labelY);
    };

    // Dibujar según la operación
    if (operation === 'add') {
      // Vector A (azul)
      drawVector(vectorA, '#3b82f6', 'A');
      // Vector B desde el final de A (púrpura, punteado)
      drawVector(vectorB, '#a855f7', 'B', vectorA, true);
      // Vector resultado (verde)
      drawVector(resultVector, '#10b981', 'A + B');
    } else if (operation === 'subtract') {
      // Vector A (azul)
      drawVector(vectorA, '#3b82f6', 'A');
      // Vector B (púrpura)
      drawVector(vectorB, '#a855f7', 'B');
      // Vector resultado (naranja)
      drawVector(resultVector, '#f97316', 'A - B');
    } else {
      // Dot product visualization
      // Vector A (azul)
      drawVector(vectorA, '#3b82f6', 'A');
      // Vector B (púrpura)
      drawVector(vectorB, '#a855f7', 'B');

      // Proyección de A sobre B
      const bMag = magnitude(vectorB);
      const proj = dotProductValue / (bMag * bMag);
      const projection: Vector = [vectorB[0] * proj, vectorB[1] * proj];

      // Dibujar proyección (línea punteada desde A hasta la proyección)
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(centerX + vectorA[0] * scale, centerY - vectorA[1] * scale);
      ctx.lineTo(centerX + projection[0] * scale, centerY - projection[1] * scale);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [vectorA, vectorB, operation, resultVector]);

  return (
    <div className="glass-effect p-8 rounded-2xl space-y-6">
      <div>
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Operaciones Vectoriales
        </h3>
        <p className="text-gray-600">
          Experimenta con vectores y observa las operaciones de suma, resta y producto punto.
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

      {/* Operation Selector */}
      <div className="flex gap-3 justify-center">
        <OperationButton
          icon={<Plus />}
          label="Suma (A + B)"
          active={operation === 'add'}
          onClick={() => setOperation('add')}
          color="from-green-500 to-emerald-500"
        />
        <OperationButton
          icon={<Minus />}
          label="Resta (A - B)"
          active={operation === 'subtract'}
          onClick={() => setOperation('subtract')}
          color="from-orange-500 to-red-500"
        />
        <OperationButton
          icon={<Multiply />}
          label="Producto Punto (A · B)"
          active={operation === 'dot'}
          onClick={() => setOperation('dot')}
          color="from-purple-500 to-pink-500"
        />
      </div>

      {/* Vector Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Vector A */}
        <div className="p-4 glass-effect rounded-xl">
          <h4 className="font-bold text-blue-600 mb-3">Vector A</h4>
          <div className="space-y-3">
            <VectorSlider
              label="X"
              value={vectorA[0]}
              onChange={(v) => setVectorA([v, vectorA[1]])}
              color="blue"
            />
            <VectorSlider
              label="Y"
              value={vectorA[1]}
              onChange={(v) => setVectorA([vectorA[0], v])}
              color="blue"
            />
          </div>
          <div className="mt-3 text-sm text-gray-600">
            A = ({vectorA[0].toFixed(1)}, {vectorA[1].toFixed(1)})
            <br />
            |A| = {magnitude(vectorA).toFixed(2)}
          </div>
        </div>

        {/* Vector B */}
        <div className="p-4 glass-effect rounded-xl">
          <h4 className="font-bold text-purple-600 mb-3">Vector B</h4>
          <div className="space-y-3">
            <VectorSlider
              label="X"
              value={vectorB[0]}
              onChange={(v) => setVectorB([v, vectorB[1]])}
              color="purple"
            />
            <VectorSlider
              label="Y"
              value={vectorB[1]}
              onChange={(v) => setVectorB([vectorB[0], v])}
              color="purple"
            />
          </div>
          <div className="mt-3 text-sm text-gray-600">
            B = ({vectorB[0].toFixed(1)}, {vectorB[1].toFixed(1)})
            <br />
            |B| = {magnitude(vectorB).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
        <h4 className="font-bold text-gray-800 mb-2">Resultado:</h4>
        {operation === 'add' && (
          <p className="text-lg">
            <strong className="text-green-600">A + B</strong> = ({resultVector[0].toFixed(1)}, {resultVector[1].toFixed(1)})
            <br />
            <span className="text-sm text-gray-600">
              Magnitud: {magnitude(resultVector).toFixed(2)}
            </span>
          </p>
        )}
        {operation === 'subtract' && (
          <p className="text-lg">
            <strong className="text-orange-600">A - B</strong> = ({resultVector[0].toFixed(1)}, {resultVector[1].toFixed(1)})
            <br />
            <span className="text-sm text-gray-600">
              Magnitud: {magnitude(resultVector).toFixed(2)}
            </span>
          </p>
        )}
        {operation === 'dot' && (
          <div>
            <p className="text-lg">
              <strong className="text-purple-600">A · B</strong> = {dotProductValue.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              El producto punto mide qué tan "alineados" están los vectores.
              <br />
              • Positivo: apuntan en direcciones similares
              <br />
              • Cero: son perpendiculares
              <br />
              • Negativo: apuntan en direcciones opuestas
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 glass-effect rounded-xl">
        <p className="text-sm text-gray-700">
          <strong>💡 Aplicación en ML:</strong> Los vectores representan datos (features).
          La suma combina información, la resta calcula diferencias, y el producto punto
          mide similitud (usado en sistemas de recomendación y búsqueda semántica).
        </p>
      </div>
    </div>
  );
}

function OperationButton({
  icon,
  label,
  active,
  onClick,
  color
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
        active
          ? `bg-gradient-to-r ${color} text-white shadow-lg`
          : 'glass-effect text-gray-700 hover:shadow-md'
      }`}
    >
      {icon}
      {label}
    </motion.button>
  );
}

function VectorSlider({
  label,
  value,
  onChange,
  color
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-sm font-semibold text-gray-700">{label}:</label>
        <span className={`text-sm font-bold text-${color}-600`}>{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min="-5"
        max="5"
        step="0.5"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
