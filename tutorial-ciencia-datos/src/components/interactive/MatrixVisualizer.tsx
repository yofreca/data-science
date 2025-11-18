"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

type Matrix = number[][];

export default function MatrixVisualizer() {
  const [matrixA, setMatrixA] = useState<Matrix>([
    [2, 1],
    [1, 3]
  ]);

  const [matrixB, setMatrixB] = useState<Matrix>([
    [1, 0],
    [0, 1]
  ]);

  const [showResult, setShowResult] = useState(false);

  // Multiplicación de matrices
  const multiplyMatrices = (a: Matrix, b: Matrix): Matrix => {
    const result: Matrix = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < a[0].length; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  };

  const resultMatrix = multiplyMatrices(matrixA, matrixB);

  const handleRandomize = () => {
    const randomMatrix = (): Matrix => [
      [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)],
      [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)]
    ];
    setMatrixA(randomMatrix());
    setMatrixB(randomMatrix());
    setShowResult(false);
  };

  const handleCellChange = (matrix: 'A' | 'B', i: number, j: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const setter = matrix === 'A' ? setMatrixA : setMatrixB;
    const current = matrix === 'A' ? matrixA : matrixB;

    const newMatrix = current.map((row, ri) =>
      row.map((cell, ci) => (ri === i && ci === j ? numValue : cell))
    );
    setter(newMatrix);
    setShowResult(false);
  };

  return (
    <div className="glass-effect p-8 rounded-2xl space-y-6">
      <div>
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Multiplicación de Matrices
        </h3>
        <p className="text-gray-600">
          Modifica los valores y observa cómo cambia el resultado. La multiplicación
          de matrices es fundamental en machine learning.
        </p>
      </div>

      {/* Matrices Display */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {/* Matrix A */}
        <div className="space-y-2">
          <p className="text-center font-bold text-gray-700">Matriz A</p>
          <MatrixDisplay
            matrix={matrixA}
            color="from-purple-500 to-pink-500"
            editable
            onChange={(i, j, v) => handleCellChange('A', i, j, v)}
          />
        </div>

        {/* Multiply Symbol */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl font-bold text-gray-400"
        >
          ×
        </motion.div>

        {/* Matrix B */}
        <div className="space-y-2">
          <p className="text-center font-bold text-gray-700">Matriz B</p>
          <MatrixDisplay
            matrix={matrixB}
            color="from-blue-500 to-cyan-500"
            editable
            onChange={(i, j, v) => handleCellChange('B', i, j, v)}
          />
        </div>

        {/* Equals Symbol */}
        <div className="text-4xl font-bold text-gray-400">=</div>

        {/* Result Matrix */}
        <div className="space-y-2">
          <p className="text-center font-bold text-gray-700">Resultado</p>
          <MatrixDisplay
            matrix={resultMatrix}
            color="from-green-500 to-emerald-500"
            highlight={showResult}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowResult(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Calcular Resultado
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRandomize}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Valores Aleatorios
        </motion.button>
      </div>

      {/* Explanation */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-green-50 border-2 border-green-500 rounded-xl"
        >
          <h4 className="font-bold text-green-800 mb-3">
            ✨ Cálculo Paso a Paso
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Elemento [0,0]:</strong> ({matrixA[0][0]} × {matrixB[0][0]}) + ({matrixA[0][1]} × {matrixB[1][0]}) = {resultMatrix[0][0]}
            </p>
            <p>
              <strong>Elemento [0,1]:</strong> ({matrixA[0][0]} × {matrixB[0][1]}) + ({matrixA[0][1]} × {matrixB[1][1]}) = {resultMatrix[0][1]}
            </p>
            <p>
              <strong>Elemento [1,0]:</strong> ({matrixA[1][0]} × {matrixB[0][0]}) + ({matrixA[1][1]} × {matrixB[1][0]}) = {resultMatrix[1][0]}
            </p>
            <p>
              <strong>Elemento [1,1]:</strong> ({matrixA[1][0]} × {matrixB[0][1]}) + ({matrixA[1][1]} × {matrixB[1][1]}) = {resultMatrix[1][1]}
            </p>
          </div>
        </motion.div>
      )}

      {/* Info */}
      <div className="p-4 glass-effect rounded-xl">
        <p className="text-sm text-gray-700">
          <strong>💡 Aplicación en ML:</strong> En redes neuronales, cada capa realiza
          una multiplicación de matrices entre los pesos (W) y las entradas (X), seguida
          de una función de activación: Y = activation(W × X + b)
        </p>
      </div>
    </div>
  );
}

function MatrixDisplay({
  matrix,
  color,
  editable = false,
  onChange,
  highlight = false
}: {
  matrix: Matrix;
  color: string;
  editable?: boolean;
  onChange?: (i: number, j: number, value: string) => void;
  highlight?: boolean;
}) {
  return (
    <motion.div
      animate={highlight ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${color} ${highlight ? 'ring-4 ring-yellow-400' : ''}`}
    >
      <div className="grid grid-cols-2 gap-3">
        {matrix.map((row, i) =>
          row.map((cell, j) => (
            <motion.div
              key={`${i}-${j}`}
              whileHover={editable ? { scale: 1.1 } : {}}
              className="relative"
            >
              {editable ? (
                <input
                  type="number"
                  value={cell}
                  onChange={(e) => onChange?.(i, j, e.target.value)}
                  className="w-16 h-16 text-center text-2xl font-bold bg-white text-gray-800 rounded-lg shadow-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center text-2xl font-bold bg-white text-gray-800 rounded-lg shadow-lg">
                  {cell}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
