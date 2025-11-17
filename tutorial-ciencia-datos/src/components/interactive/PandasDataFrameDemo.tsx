"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Users, TrendingUp, BarChart3 } from "lucide-react";

interface DataRow {
  id: number;
  nombre: string;
  edad: number;
  ciudad: string;
  salario: number;
  departamento: string;
}

export default function PandasDataFrameDemo() {
  const initialData: DataRow[] = [
    { id: 1, nombre: "Ana", edad: 28, ciudad: "Madrid", salario: 45000, departamento: "IT" },
    { id: 2, nombre: "Carlos", edad: 35, ciudad: "Barcelona", salario: 52000, departamento: "Ventas" },
    { id: 3, nombre: "Elena", edad: 24, ciudad: "Madrid", salario: 38000, departamento: "IT" },
    { id: 4, nombre: "David", edad: 42, ciudad: "Valencia", salario: 65000, departamento: "Gerencia" },
    { id: 5, nombre: "Sofia", edad: 29, ciudad: "Barcelona", salario: 48000, departamento: "Marketing" },
    { id: 6, nombre: "Miguel", edad: 31, ciudad: "Madrid", salario: 51000, departamento: "Ventas" },
    { id: 7, nombre: "Laura", edad: 26, ciudad: "Valencia", salario: 42000, departamento: "IT" },
    { id: 8, nombre: "Pablo", edad: 38, ciudad: "Barcelona", salario: 58000, departamento: "Marketing" }
  ];

  const [data, setData] = useState<DataRow[]>(initialData);
  const [operation, setOperation] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterDept, setFilterDept] = useState<string>("all");
  const [minAge, setMinAge] = useState<number>(0);

  const applyOperation = (op: string) => {
    setOperation(op);
    let result = [...initialData];

    switch (op) {
      case "filter_madrid":
        result = initialData.filter(row => row.ciudad === "Madrid");
        break;
      case "filter_age":
        result = initialData.filter(row => row.edad > 30);
        break;
      case "sort_salary":
        result = [...initialData].sort((a, b) => b.salario - a.salario);
        break;
      case "filter_it":
        result = initialData.filter(row => row.departamento === "IT");
        break;
      case "custom":
        result = initialData.filter(row => {
          let match = true;
          if (filterCity !== "all") match = match && row.ciudad === filterCity;
          if (filterDept !== "all") match = match && row.departamento === filterDept;
          if (minAge > 0) match = match && row.edad >= minAge;
          return match;
        });
        break;
      default:
        result = initialData;
    }

    setData(result);
  };

  const calculateStats = () => {
    if (data.length === 0) return null;

    const avgAge = data.reduce((sum, row) => sum + row.edad, 0) / data.length;
    const avgSalary = data.reduce((sum, row) => sum + row.salario, 0) / data.length;
    const maxSalary = Math.max(...data.map(row => row.salario));
    const minSalary = Math.min(...data.map(row => row.salario));

    return { avgAge, avgSalary, maxSalary, minSalary };
  };

  const groupByDepartment = () => {
    const grouped: { [key: string]: { count: number; avgSalary: number } } = {};

    data.forEach(row => {
      if (!grouped[row.departamento]) {
        grouped[row.departamento] = { count: 0, avgSalary: 0 };
      }
      grouped[row.departamento].count++;
    });

    Object.keys(grouped).forEach(dept => {
      const deptRows = data.filter(row => row.departamento === dept);
      grouped[dept].avgSalary = deptRows.reduce((sum, row) => sum + row.salario, 0) / deptRows.length;
    });

    return grouped;
  };

  const stats = calculateStats();
  const groupedData = groupByDepartment();

  return (
    <div className="space-y-6">
      {/* Operation Selector */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Operaciones de DataFrame
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={() => applyOperation("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === "all"
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ver Todo
          </button>
          <button
            onClick={() => applyOperation("filter_madrid")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === "filter_madrid"
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Filtrar Madrid
          </button>
          <button
            onClick={() => applyOperation("filter_age")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === "filter_age"
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Edad &gt; 30
          </button>
          <button
            onClick={() => applyOperation("sort_salary")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === "sort_salary"
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ordenar Salario
          </button>
          <button
            onClick={() => applyOperation("filter_it")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === "filter_it"
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Solo IT
          </button>
          <button
            onClick={() => setOperation("custom")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === "custom"
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Filtro Custom
          </button>
        </div>

        {/* Custom Filter Panel */}
        {operation === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 bg-white rounded-lg border-2 border-purple-200"
          >
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros Personalizados
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <select
                  value={filterCity}
                  onChange={(e) => {
                    setFilterCity(e.target.value);
                    applyOperation("custom");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">Todas</option>
                  <option value="Madrid">Madrid</option>
                  <option value="Barcelona">Barcelona</option>
                  <option value="Valencia">Valencia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select
                  value={filterDept}
                  onChange={(e) => {
                    setFilterDept(e.target.value);
                    applyOperation("custom");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="IT">IT</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Gerencia">Gerencia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad Mínima: {minAge}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={minAge}
                  onChange={(e) => {
                    setMinAge(parseInt(e.target.value));
                    applyOperation("custom");
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Code Preview */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Pandas equivalente:</div>
        <code className="text-green-400 font-mono text-sm">
          {operation === "all" && "df"}
          {operation === "filter_madrid" && "df[df['ciudad'] == 'Madrid']"}
          {operation === "filter_age" && "df[df['edad'] > 30]"}
          {operation === "sort_salary" && "df.sort_values('salario', ascending=False)"}
          {operation === "filter_it" && "df[df['departamento'] == 'IT']"}
          {operation === "custom" && `df[(df['ciudad'] == '${filterCity}') & (df['edad'] >= ${minAge})]`}
        </code>
      </div>

      {/* DataFrame Display */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-purple-600 text-white px-6 py-3 flex items-center justify-between">
          <h3 className="font-bold">DataFrame ({data.length} filas)</h3>
          <Users className="w-5 h-5" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Edad</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ciudad</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Salario</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Departamento</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-gray-200 hover:bg-purple-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-600">{row.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.edad}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.ciudad}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">€{row.salario.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.departamento === "IT" ? "bg-blue-100 text-blue-800" :
                      row.departamento === "Ventas" ? "bg-green-100 text-green-800" :
                      row.departamento === "Marketing" ? "bg-purple-100 text-purple-800" :
                      "bg-orange-100 text-orange-800"
                    }`}>
                      {row.departamento}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="text-sm opacity-90 mb-1">Edad Promedio</div>
            <div className="text-2xl font-bold">{stats.avgAge.toFixed(1)}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="text-sm opacity-90 mb-1">Salario Promedio</div>
            <div className="text-2xl font-bold">€{Math.round(stats.avgSalary).toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <div className="text-sm opacity-90 mb-1">Salario Máximo</div>
            <div className="text-2xl font-bold">€{stats.maxSalary.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-4">
            <div className="text-sm opacity-90 mb-1">Salario Mínimo</div>
            <div className="text-2xl font-bold">€{stats.minSalary.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Group By */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Agrupación por Departamento
        </h3>
        <div className="text-xs text-gray-500 mb-3 font-mono">
          df.groupby('departamento').agg({'{'}
            'nombre': 'count', 'salario': 'mean'
          {'}'})
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(groupedData).map(([dept, stats]) => (
            <div key={dept} className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
              <div className="font-bold text-purple-900 mb-2">{dept}</div>
              <div className="text-sm text-gray-700">
                <div>Empleados: <span className="font-semibold">{stats.count}</span></div>
                <div>Salario Avg: <span className="font-semibold">€{Math.round(stats.avgSalary).toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
