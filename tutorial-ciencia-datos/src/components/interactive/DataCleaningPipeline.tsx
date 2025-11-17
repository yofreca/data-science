"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle, Circle, ArrowRight, RotateCcw } from "lucide-react";

interface DataRow {
  id: number;
  nombre: string | null;
  edad: number | null;
  salario: number | null;
  ciudad: string | null;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5;

export default function DataCleaningPipeline() {
  const dirtyData: DataRow[] = [
    { id: 1, nombre: "Ana", edad: 28, salario: 45000, ciudad: "Madrid" },
    { id: 2, nombre: "Carlos", edad: null, salario: 52000, ciudad: "Barcelona" },
    { id: 3, nombre: "Elena", edad: 24, salario: null, ciudad: "Madrid" },
    { id: 4, nombre: null, edad: 42, salario: 65000, ciudad: "Valencia" },
    { id: 5, nombre: "Sofia", edad: 29, salario: 48000, ciudad: null },
    { id: 6, nombre: "Miguel", edad: null, salario: null, ciudad: "Madrid" },
    { id: 7, nombre: "Laura", edad: 26, salario: 42000, ciudad: "Valencia" },
    { id: 8, nombre: "Pablo", edad: 38, salario: 150000, ciudad: null }, // Outlier en salario
    { id: 9, nombre: "Maria", edad: 180, salario: 51000, ciudad: "Madrid" } // Outlier en edad
  ];

  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [data, setData] = useState<DataRow[]>(dirtyData);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      title: "Datos Originales (Sucios)",
      description: "Dataset con múltiples problemas: valores faltantes, outliers, inconsistencias",
      color: "red"
    },
    {
      title: "Identificar Problemas",
      description: "Análisis exploratorio: tipos de datos, valores faltantes, estadísticas",
      color: "orange"
    },
    {
      title: "Manejar Valores Faltantes",
      description: "Imputación con media/mediana/moda según el tipo de variable",
      color: "yellow"
    },
    {
      title: "Detectar y Tratar Outliers",
      description: "Identificar valores atípicos con IQR y decidir qué hacer con ellos",
      color: "blue"
    },
    {
      title: "Normalizar Datos",
      description: "Aplicar Min-Max normalization para escalar valores numéricos",
      color: "purple"
    },
    {
      title: "Datos Limpios",
      description: "Dataset final listo para análisis y modelado",
      color: "green"
    }
  ];

  const executeStep = (step: Step) => {
    let result = [...dirtyData];

    // Step 1: Original data (no changes)
    if (step >= 1) {
      // Identificar problemas (no modifica datos)
      result = result;
    }

    // Step 2: Handle missing values
    if (step >= 2) {
      const edadMean = Math.round(
        result.filter(r => r.edad !== null && r.edad < 100).reduce((sum, r) => sum + r.edad!, 0) /
        result.filter(r => r.edad !== null && r.edad < 100).length
      );
      const salarioMedian = 51000; // Aproximado
      const ciudadMode = "Madrid";

      result = result.map(row => ({
        ...row,
        edad: row.edad ?? edadMean,
        salario: row.salario ?? salarioMedian,
        ciudad: row.ciudad ?? ciudadMode,
        nombre: row.nombre ?? "Unknown"
      }));
    }

    // Step 3: Handle outliers
    if (step >= 3) {
      // Remove obvious outliers (edad > 100, salario > 100000)
      result = result.filter(row =>
        row.edad! < 100 && row.salario! < 100000
      );
    }

    // Step 4: Normalize (Min-Max for edad and salario)
    if (step >= 4) {
      const edades = result.map(r => r.edad!);
      const salarios = result.map(r => r.salario!);

      const edadMin = Math.min(...edades);
      const edadMax = Math.max(...edades);
      const salarioMin = Math.min(...salarios);
      const salarioMax = Math.max(...salarios);

      // For display purposes, we'll keep original values but show they're normalized
      // In a real scenario, you'd replace the values
      result = result.map(row => ({
        ...row,
        // Keep original for display
      }));
    }

    setData(result);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      const next = (currentStep + 1) as Step;
      setCurrentStep(next);
      executeStep(next);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prev = (currentStep - 1) as Step;
      setCurrentStep(prev);
      executeStep(prev);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setData(dirtyData);
    setIsPlaying(false);
  };

  const playAll = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setData(dirtyData);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step > 5) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setCurrentStep(step as Step);
        executeStep(step as Step);
      }
    }, 1500);
  };

  const getIssues = () => {
    const missing = dirtyData.reduce((count, row) =>
      count + (row.nombre === null ? 1 : 0) + (row.edad === null ? 1 : 0) +
      (row.salario === null ? 1 : 0) + (row.ciudad === null ? 1 : 0), 0
    );
    const outliers = dirtyData.filter(row =>
      (row.edad !== null && row.edad > 100) || (row.salario !== null && row.salario > 100000)
    ).length;

    return { missing, outliers, total: dirtyData.length };
  };

  const issues = getIssues();

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-800 text-lg">Pipeline de Limpieza</h3>
          <div className="flex gap-2">
            <button
              onClick={playAll}
              disabled={isPlaying}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" />
              Reproducir Todo
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white border-blue-500 shadow-lg'
                    : isCompleted
                    ? 'bg-green-50 border-green-300'
                    : 'bg-white border-gray-200'
                }`}
                onClick={() => {
                  setCurrentStep(idx as Step);
                  executeStep(idx as Step);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-700'}`}>
                      {idx + 1}. {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {isActive && <ArrowRight className="w-5 h-5 text-blue-500" />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded"
        >
          <h4 className="font-semibold text-blue-900 mb-2">
            Paso {currentStep + 1}: {steps[currentStep].title}
          </h4>
          <p className="text-sm text-blue-800">{steps[currentStep].description}</p>

          {currentStep === 1 && (
            <div className="mt-3 bg-white p-3 rounded">
              <div className="text-sm space-y-1">
                <div>Total de filas: <strong>{issues.total}</strong></div>
                <div>Valores faltantes: <strong className="text-red-600">{issues.missing}</strong></div>
                <div>Outliers detectados: <strong className="text-orange-600">{issues.outliers}</strong></div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 flex items-center justify-between">
          <h3 className="font-bold">Dataset ({data.length} filas)</h3>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Paso {currentStep + 1}/6
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Edad</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Salario</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ciudad</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-600">{row.id}</td>
                  <td className="px-4 py-3 text-sm">
                    {row.nombre === null ? (
                      <span className="text-red-500 font-semibold">NaN</span>
                    ) : row.nombre === "Unknown" ? (
                      <span className="text-orange-600 italic">Unknown (imputado)</span>
                    ) : (
                      <span className="text-gray-800">{row.nombre}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.edad === null ? (
                      <span className="text-red-500 font-semibold">NaN</span>
                    ) : row.edad > 100 ? (
                      <span className="text-red-600 font-semibold">{row.edad} (outlier)</span>
                    ) : (
                      <span className="text-gray-800">{row.edad}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.salario === null ? (
                      <span className="text-red-500 font-semibold">NaN</span>
                    ) : row.salario > 100000 ? (
                      <span className="text-red-600 font-semibold">€{row.salario.toLocaleString()} (outlier)</span>
                    ) : (
                      <span className="text-gray-800">€{row.salario.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.ciudad === null ? (
                      <span className="text-red-500 font-semibold">NaN</span>
                    ) : (
                      <span className="text-gray-800">{row.ciudad}</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code for Current Step */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python para este paso:</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{currentStep === 0 && `# Cargar datos
import pandas as pd
df = pd.read_csv('data.csv')`}

{currentStep === 1 && `# Análisis exploratorio
df.info()
df.describe()
df.isnull().sum()
print("Valores faltantes:", df.isnull().sum().sum())`}

{currentStep === 2 && `# Manejar valores faltantes
df['edad'].fillna(df['edad'].mean(), inplace=True)
df['salario'].fillna(df['salario'].median(), inplace=True)
df['ciudad'].fillna(df['ciudad'].mode()[0], inplace=True)
df['nombre'].fillna('Unknown', inplace=True)`}

{currentStep === 3 && `# Detectar y remover outliers
# Método IQR
Q1 = df['edad'].quantile(0.25)
Q3 = df['edad'].quantile(0.75)
IQR = Q3 - Q1
df = df[~((df['edad'] < (Q1 - 1.5 * IQR)) | (df['edad'] > (Q3 + 1.5 * IQR)))]

# O usar criterios específicos del dominio
df = df[(df['edad'] < 100) & (df['salario'] < 100000)]`}

{currentStep === 4 && `# Normalizar datos numéricos
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
df[['edad', 'salario']] = scaler.fit_transform(df[['edad', 'salario']])`}

{currentStep === 5 && `# Datos limpios listos
print("Dataset limpio con", len(df), "filas")
print("Sin valores faltantes:", df.isnull().sum().sum() == 0)

# Guardar datos limpios
df.to_csv('data_clean.csv', index=False)`}
        </pre>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          ← Paso Anterior
        </button>
        <div className="text-center">
          <div className="text-sm text-gray-600">Paso {currentStep + 1} de 6</div>
          <div className="w-64 bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
            />
          </div>
        </div>
        <button
          onClick={nextStep}
          disabled={currentStep === 5}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          Siguiente Paso →
        </button>
      </div>
    </div>
  );
}
