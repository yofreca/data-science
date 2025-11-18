"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Hash, Type, Calendar, Check, AlertCircle } from "lucide-react";

interface DataSample {
  column: string;
  samples: any[];
  detectedType: string;
  pythonType: string;
  icon: any;
  color: string;
  description: string;
}

export default function DataTypesExplorer() {
  const dataSamples: DataSample[] = [
    {
      column: "edad",
      samples: [25, 30, 28, 45, 33, 29],
      detectedType: "int64",
      pythonType: "int",
      icon: Hash,
      color: "blue",
      description: "Números enteros sin decimales"
    },
    {
      column: "salario",
      samples: [45000.50, 52000.75, 38000.00, 65000.25],
      detectedType: "float64",
      pythonType: "float",
      icon: Hash,
      color: "green",
      description: "Números con decimales (punto flotante)"
    },
    {
      column: "nombre",
      samples: ["Ana", "Carlos", "Elena", "David"],
      detectedType: "object",
      pythonType: "str",
      icon: Type,
      color: "purple",
      description: "Texto (strings)"
    },
    {
      column: "fecha_ingreso",
      samples: ["2020-01-15", "2019-06-20", "2021-03-10"],
      detectedType: "datetime64",
      pythonType: "datetime",
      icon: Calendar,
      color: "orange",
      description: "Fechas y timestamps"
    },
    {
      column: "es_activo",
      samples: [true, false, true, true, false],
      detectedType: "bool",
      pythonType: "bool",
      icon: Check,
      color: "pink",
      description: "Valores booleanos (True/False)"
    },
    {
      column: "categoria",
      samples: ["A", "B", "A", "C", "B", "A"],
      detectedType: "category",
      pythonType: "str (categorical)",
      icon: Type,
      color: "cyan",
      description: "Texto con valores limitados (categórica)"
    }
  ];

  const [selectedType, setSelectedType] = useState<number>(0);
  const [showCode, setShowCode] = useState(false);

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; border: string; hover: string } } = {
      blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", hover: "hover:bg-blue-100" },
      green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", hover: "hover:bg-green-100" },
      purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", hover: "hover:bg-purple-100" },
      orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", hover: "hover:bg-orange-100" },
      pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200", hover: "hover:bg-pink-100" },
      cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", hover: "hover:bg-cyan-100" }
    };
    return colors[color];
  };

  const selected = dataSamples[selectedType];
  const Icon = selected.icon;
  const colorClasses = getColorClasses(selected.color);

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {dataSamples.map((sample, idx) => {
          const SampleIcon = sample.icon;
          const sampleColors = getColorClasses(sample.color);
          return (
            <button
              key={idx}
              onClick={() => setSelectedType(idx)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedType === idx
                  ? `${sampleColors.bg} ${sampleColors.border} shadow-lg scale-105`
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <SampleIcon className={`w-4 h-4 ${selectedType === idx ? sampleColors.text : 'text-gray-400'}`} />
                <span className={`font-mono text-sm font-semibold ${
                  selectedType === idx ? sampleColors.text : 'text-gray-600'
                }`}>
                  {sample.detectedType}
                </span>
              </div>
              <div className="text-xs text-gray-500">{sample.column}</div>
            </button>
          );
        })}
      </div>

      {/* Detailed View */}
      <motion.div
        key={selectedType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colorClasses.bg} border-2 ${colorClasses.border} rounded-xl p-6`}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Icon className={`w-6 h-6 ${colorClasses.text}`} />
              <h3 className="text-2xl font-bold text-gray-800">{selected.column}</h3>
            </div>
            <p className="text-gray-600">{selected.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Tipo Pandas:</div>
            <div className={`font-mono font-bold ${colorClasses.text}`}>{selected.detectedType}</div>
            <div className="text-sm text-gray-500 mt-2">Tipo Python:</div>
            <div className={`font-mono text-sm ${colorClasses.text}`}>{selected.pythonType}</div>
          </div>
        </div>

        {/* Data Samples */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-700 mb-3">Muestras de Datos:</h4>
          <div className="flex flex-wrap gap-2">
            {selected.samples.map((sample, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`px-4 py-2 ${colorClasses.bg} border ${colorClasses.border} rounded-lg font-mono text-sm`}
              >
                {typeof sample === 'boolean' ? (sample ? 'True' : 'False') : String(sample)}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Code Toggle */}
        <button
          onClick={() => setShowCode(!showCode)}
          className={`px-4 py-2 ${colorClasses.text} ${colorClasses.hover} rounded-lg font-semibold transition-colors text-sm`}
        >
          {showCode ? '▼' : '▶'} Mostrar código Python
        </button>

        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 bg-gray-900 rounded-lg p-4"
          >
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import pandas as pd

# Detectar tipo de datos
df['${selected.column}'].dtype
# Output: ${selected.detectedType}

# Convertir tipo de datos
df['${selected.column}'] = df['${selected.column}'].astype('${selected.detectedType}')

# Verificar tipos de todas las columnas
df.dtypes

# Info completa del DataFrame
df.info()`}
            </pre>
          </motion.div>
        )}
      </motion.div>

      {/* Type Conversion Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Guía de Conversión de Tipos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">A numérico:</h4>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
              pd.to_numeric(df['col'], errors='coerce')
            </code>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">A datetime:</h4>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
              pd.to_datetime(df['col'])
            </code>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">A string:</h4>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
              df['col'].astype(str)
            </code>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">A categórica:</h4>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
              df['col'].astype('category')
            </code>
          </div>
        </div>
      </div>

      {/* Common Issues */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          Problemas Comunes
        </h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Números leídos como strings por comas o símbolos de moneda</li>
          <li>Fechas en formatos inconsistentes (DD/MM/YYYY vs MM/DD/YYYY)</li>
          <li>Valores booleanos como "Si"/"No" en lugar de True/False</li>
          <li>Espacios en blanco que Pandas interpreta como strings</li>
          <li>Tipos object para columnas que deberían ser category (más eficiente)</li>
        </ul>
      </div>
    </div>
  );
}
