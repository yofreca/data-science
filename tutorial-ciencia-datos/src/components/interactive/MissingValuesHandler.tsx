"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";

interface DataRow {
  id: number;
  nombre: string | null;
  edad: number | null;
  salario: number | null;
  ciudad: string | null;
}

type Strategy = "none" | "drop_rows" | "drop_columns" | "mean" | "median" | "mode" | "forward_fill" | "backward_fill";

export default function MissingValuesHandler() {
  const initialData: DataRow[] = [
    { id: 1, nombre: "Ana", edad: 28, salario: 45000, ciudad: "Madrid" },
    { id: 2, nombre: "Carlos", edad: null, salario: 52000, ciudad: "Barcelona" },
    { id: 3, nombre: "Elena", edad: 24, salario: null, ciudad: "Madrid" },
    { id: 4, nombre: null, edad: 42, salario: 65000, ciudad: "Valencia" },
    { id: 5, nombre: "Sofia", edad: 29, salario: 48000, ciudad: null },
    { id: 6, nombre: "Miguel", edad: null, salario: null, ciudad: "Madrid" },
    { id: 7, nombre: "Laura", edad: 26, salario: 42000, ciudad: "Valencia" },
    { id: 8, nombre: "Pablo", edad: 38, salario: 58000, ciudad: null }
  ];

  const [data, setData] = useState<DataRow[]>(initialData);
  const [strategy, setStrategy] = useState<Strategy>("none");

  const applyStrategy = (strat: Strategy) => {
    setStrategy(strat);
    let result = [...initialData];

    switch (strat) {
      case "drop_rows":
        // Eliminar filas con cualquier valor faltante
        result = result.filter(row =>
          row.nombre !== null && row.edad !== null && row.salario !== null && row.ciudad !== null
        );
        break;

      case "drop_columns":
        // Simular eliminación de columnas con muchos faltantes (en este caso, no eliminaremos nada)
        result = result;
        break;

      case "mean":
        // Imputar con media (solo numéricos)
        const edadMean = Math.round(
          result.filter(r => r.edad !== null).reduce((sum, r) => sum + r.edad!, 0) /
          result.filter(r => r.edad !== null).length
        );
        const salarioMean = Math.round(
          result.filter(r => r.salario !== null).reduce((sum, r) => sum + r.salario!, 0) /
          result.filter(r => r.salario !== null).length
        );
        result = result.map(row => ({
          ...row,
          edad: row.edad ?? edadMean,
          salario: row.salario ?? salarioMean
        }));
        break;

      case "median":
        // Imputar con mediana
        const edades = result.filter(r => r.edad !== null).map(r => r.edad!).sort((a, b) => a - b);
        const salarios = result.filter(r => r.salario !== null).map(r => r.salario!).sort((a, b) => a - b);
        const edadMedian = edades[Math.floor(edades.length / 2)];
        const salarioMedian = salarios[Math.floor(salarios.length / 2)];
        result = result.map(row => ({
          ...row,
          edad: row.edad ?? edadMedian,
          salario: row.salario ?? salarioMedian
        }));
        break;

      case "mode":
        // Imputar con moda (para categóricas)
        const ciudades = result.filter(r => r.ciudad !== null).map(r => r.ciudad!);
        const ciudadMode = ciudades.sort((a, b) =>
          ciudades.filter(v => v === a).length - ciudades.filter(v => v === b).length
        ).pop();
        result = result.map(row => ({
          ...row,
          ciudad: row.ciudad ?? ciudadMode
        }));
        break;

      case "forward_fill":
        // Forward fill - llenar con valor anterior
        let lastNombre: string | null = null;
        let lastEdad: number | null = null;
        let lastSalario: number | null = null;
        let lastCiudad: string | null = null;
        result = result.map(row => {
          const filled = {
            ...row,
            nombre: row.nombre ?? lastNombre,
            edad: row.edad ?? lastEdad,
            salario: row.salario ?? lastSalario,
            ciudad: row.ciudad ?? lastCiudad
          };
          lastNombre = row.nombre ?? lastNombre;
          lastEdad = row.edad ?? lastEdad;
          lastSalario = row.salario ?? lastSalario;
          lastCiudad = row.ciudad ?? lastCiudad;
          return filled;
        });
        break;

      case "backward_fill":
        // Backward fill - llenar con valor siguiente
        result = [...result].reverse();
        let nextNombre: string | null = null;
        let nextEdad: number | null = null;
        let nextSalario: number | null = null;
        let nextCiudad: string | null = null;
        result = result.map(row => {
          const filled = {
            ...row,
            nombre: row.nombre ?? nextNombre,
            edad: row.edad ?? nextEdad,
            salario: row.salario ?? nextSalario,
            ciudad: row.ciudad ?? nextCiudad
          };
          nextNombre = row.nombre ?? nextNombre;
          nextEdad = row.edad ?? nextEdad;
          nextSalario = row.salario ?? nextSalario;
          nextCiudad = row.ciudad ?? nextCiudad;
          return filled;
        }).reverse();
        break;

      default:
        result = initialData;
    }

    setData(result);
  };

  const countMissing = () => {
    return {
      total: initialData.reduce((count, row) =>
        count + (row.nombre === null ? 1 : 0) + (row.edad === null ? 1 : 0) +
        (row.salario === null ? 1 : 0) + (row.ciudad === null ? 1 : 0), 0
      ),
      nombre: initialData.filter(r => r.nombre === null).length,
      edad: initialData.filter(r => r.edad === null).length,
      salario: initialData.filter(r => r.salario === null).length,
      ciudad: initialData.filter(r => r.ciudad === null).length,
      rows: initialData.filter(r =>
        r.nombre === null || r.edad === null || r.salario === null || r.ciudad === null
      ).length
    };
  };

  const missing = countMissing();

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="text-xs text-red-600 font-semibold mb-1">Total Faltantes</div>
          <div className="text-2xl font-bold text-red-700">{missing.total}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-xs text-orange-600 font-semibold mb-1">nombre</div>
          <div className="text-xl font-bold text-orange-700">{missing.nombre}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-xs text-yellow-600 font-semibold mb-1">edad</div>
          <div className="text-xl font-bold text-yellow-700">{missing.edad}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-xs text-green-600 font-semibold mb-1">salario</div>
          <div className="text-xl font-bold text-green-700">{missing.salario}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-600 font-semibold mb-1">ciudad</div>
          <div className="text-xl font-bold text-blue-700">{missing.ciudad}</div>
        </div>
      </div>

      {/* Strategy Selector */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Selecciona una Estrategia
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => applyStrategy("none")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              strategy === "none"
                ? 'bg-gray-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sin cambios
          </button>
          <button
            onClick={() => applyStrategy("drop_rows")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              strategy === "drop_rows"
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Trash2 className="w-4 h-4 inline mr-1" />
            Eliminar Filas
          </button>
          <button
            onClick={() => applyStrategy("mean")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              strategy === "mean"
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Media
          </button>
          <button
            onClick={() => applyStrategy("median")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              strategy === "median"
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Mediana
          </button>
          <button
            onClick={() => applyStrategy("mode")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              strategy === "mode"
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Moda
          </button>
          <button
            onClick={() => applyStrategy("forward_fill")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              strategy === "forward_fill"
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Forward Fill
          </button>
          <button
            onClick={() => applyStrategy("backward_fill")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              strategy === "backward_fill"
                ? 'bg-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Backward Fill
          </button>
        </div>
      </div>

      {/* Code Display */}
      {strategy !== "none" && (
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-2">Código Pandas:</div>
          <code className="text-green-400 font-mono text-sm">
            {strategy === "drop_rows" && "df.dropna()  # Eliminar filas con valores faltantes"}
            {strategy === "drop_columns" && "df.dropna(axis=1)  # Eliminar columnas con valores faltantes"}
            {strategy === "mean" && "df.fillna(df.mean())  # Imputar con media"}
            {strategy === "median" && "df.fillna(df.median())  # Imputar con mediana"}
            {strategy === "mode" && "df.fillna(df.mode().iloc[0])  # Imputar con moda"}
            {strategy === "forward_fill" && "df.fillna(method='ffill')  # Forward fill"}
            {strategy === "backward_fill" && "df.fillna(method='bfill')  # Backward fill"}
          </code>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 flex items-center justify-between">
          <h3 className="font-bold">Dataset ({data.length} filas)</h3>
          {strategy !== "none" && (
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Estrategia: {strategy.replace('_', ' ')}
            </span>
          )}
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
                    ) : (
                      <span className="text-gray-800">{row.nombre}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.edad === null ? (
                      <span className="text-red-500 font-semibold">NaN</span>
                    ) : (
                      <span className="text-gray-800">{row.edad}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.salario === null ? (
                      <span className="text-red-500 font-semibold">NaN</span>
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

      {/* Strategy Guide */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          ¿Cuándo usar cada estrategia?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div>
            <strong>Eliminar filas:</strong> Cuando hay pocos faltantes (&lt;5%) y los datos son MCAR
          </div>
          <div>
            <strong>Media/Mediana:</strong> Para variables numéricas sin outliers extremos
          </div>
          <div>
            <strong>Moda:</strong> Para variables categóricas
          </div>
          <div>
            <strong>Forward/Backward Fill:</strong> Para series de tiempo ordenadas
          </div>
        </div>
      </div>
    </div>
  );
}
