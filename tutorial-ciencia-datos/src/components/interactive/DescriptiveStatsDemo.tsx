"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";

export default function DescriptiveStatsDemo() {
  const [dataset, setDataset] = useState<number[]>([12, 15, 18, 20, 22, 25, 28, 30, 35, 40]);
  const [newValue, setNewValue] = useState("");

  // Cálculos estadísticos
  const mean = dataset.length > 0
    ? dataset.reduce((a, b) => a + b, 0) / dataset.length
    : 0;

  const median = () => {
    if (dataset.length === 0) return 0;
    const sorted = [...dataset].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };

  const mode = () => {
    if (dataset.length === 0) return null;
    const frequency: { [key: number]: number } = {};
    dataset.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);
    return maxFreq > 1 ? modes : null;
  };

  const variance = () => {
    if (dataset.length === 0) return 0;
    const avg = mean;
    return dataset.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / dataset.length;
  };

  const stdDev = Math.sqrt(variance());
  const min = dataset.length > 0 ? Math.min(...dataset) : 0;
  const max = dataset.length > 0 ? Math.max(...dataset) : 0;
  const range = max - min;

  // Quartiles
  const quartile = (q: number) => {
    if (dataset.length === 0) return 0;
    const sorted = [...dataset].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  };

  const q1 = quartile(0.25);
  const q3 = quartile(0.75);
  const iqr = q3 - q1;

  const handleAddValue = () => {
    const val = parseFloat(newValue);
    if (!isNaN(val)) {
      setDataset([...dataset, val]);
      setNewValue("");
    }
  };

  const handleRemoveValue = (index: number) => {
    setDataset(dataset.filter((_, i) => i !== index));
  };

  const handleGenerateRandom = () => {
    const randomData = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 100)
    );
    setDataset(randomData);
  };

  const modeValues = mode();

  return (
    <div className="glass-effect p-8 rounded-2xl space-y-6">
      <div>
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Calculadora de Estadística Descriptiva
        </h3>
        <p className="text-gray-600">
          Agrega valores y observa cómo cambian las métricas estadísticas en tiempo real.
        </p>
      </div>

      {/* Data Input */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Values */}
        <div className="p-6 glass-effect rounded-xl space-y-4">
          <h4 className="font-bold text-gray-800">Agregar Datos</h4>

          <div className="flex gap-2">
            <input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
              placeholder="Ingresa un número"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddValue}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateRandom}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generar Datos Aleatorios
          </motion.button>
        </div>

        {/* Current Dataset */}
        <div className="p-6 glass-effect rounded-xl">
          <h4 className="font-bold text-gray-800 mb-3">
            Dataset ({dataset.length} valores)
          </h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {dataset.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No hay datos aún</p>
            ) : (
              dataset.map((val, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-2 bg-white rounded group hover:bg-red-50"
                >
                  <span className="font-mono">{val}</span>
                  <button
                    onClick={() => handleRemoveValue(index)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          label="Media (μ)"
          value={mean.toFixed(2)}
          description="Promedio de todos los valores"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          label="Mediana"
          value={median().toFixed(2)}
          description="Valor central (50º percentil)"
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          label="Moda"
          value={modeValues ? modeValues.join(", ") : "N/A"}
          description="Valor(es) más frecuente(s)"
          color="from-green-500 to-emerald-500"
        />
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          label="Desv. Estándar (σ)"
          value={stdDev.toFixed(2)}
          description="Medida de dispersión"
          color="from-orange-500 to-red-500"
        />
        <StatCard
          label="Varianza (σ²)"
          value={variance().toFixed(2)}
          description="Dispersión al cuadrado"
          color="from-yellow-500 to-orange-500"
        />
        <StatCard
          label="Rango"
          value={range.toFixed(2)}
          description="Max - Min"
          color="from-pink-500 to-rose-500"
        />
        <StatCard
          label="IQR"
          value={iqr.toFixed(2)}
          description="Q3 - Q1 (rango intercuartil)"
          color="from-indigo-500 to-purple-500"
        />
      </div>

      {/* Box Plot Representation */}
      {dataset.length > 0 && (
        <div className="p-6 glass-effect rounded-xl">
          <h4 className="font-bold text-gray-800 mb-4">Diagrama de Caja (Box Plot)</h4>
          <div className="relative h-24 bg-white rounded-lg p-4">
            <div className="relative h-full">
              {/* Scale */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs text-gray-500">
                <span>{min.toFixed(0)}</span>
                <span>{max.toFixed(0)}</span>
              </div>

              {/* Box plot */}
              <div className="relative h-12 mt-2">
                {/* Whisker izquierdo */}
                <div
                  className="absolute h-1 bg-gray-400"
                  style={{
                    left: '0%',
                    width: `${((q1 - min) / (max - min)) * 100}%`,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />

                {/* Caja */}
                <div
                  className="absolute h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded border-2 border-blue-600"
                  style={{
                    left: `${((q1 - min) / (max - min)) * 100}%`,
                    width: `${((q3 - q1) / (max - min)) * 100}%`
                  }}
                >
                  {/* Mediana */}
                  <div
                    className="absolute h-full w-1 bg-red-600"
                    style={{
                      left: `${((median() - q1) / (q3 - q1)) * 100}%`
                    }}
                  />
                </div>

                {/* Whisker derecho */}
                <div
                  className="absolute h-1 bg-gray-400"
                  style={{
                    left: `${((q3 - min) / (max - min)) * 100}%`,
                    width: `${((max - q3) / (max - min)) * 100}%`,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2 text-xs text-center">
            <div>
              <p className="font-bold text-gray-700">Min</p>
              <p className="text-gray-600">{min.toFixed(1)}</p>
            </div>
            <div>
              <p className="font-bold text-gray-700">Q1</p>
              <p className="text-gray-600">{q1.toFixed(1)}</p>
            </div>
            <div>
              <p className="font-bold text-red-600">Mediana</p>
              <p className="text-gray-600">{median().toFixed(1)}</p>
            </div>
            <div>
              <p className="font-bold text-gray-700">Q3</p>
              <p className="text-gray-600">{q3.toFixed(1)}</p>
            </div>
            <div>
              <p className="font-bold text-gray-700">Max</p>
              <p className="text-gray-600">{max.toFixed(1)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 glass-effect rounded-xl">
        <p className="text-sm text-gray-700">
          <strong>💡 Interpretación:</strong> La media te da el "centro" promedio, pero
          puede verse afectada por valores extremos (outliers). La mediana es más robusta.
          La desviación estándar mide qué tan dispersos están los datos alrededor de la media.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  color
}: {
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${color} text-white`}
    >
      <p className="text-xs font-semibold opacity-90 mb-1">{label}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-80">{description}</p>
    </motion.div>
  );
}
