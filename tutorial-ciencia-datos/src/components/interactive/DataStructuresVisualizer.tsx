"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Search, Lock } from "lucide-react";

type DataStructureType = "list" | "dict" | "set" | "tuple";

export default function DataStructuresVisualizer() {
  const [activeType, setActiveType] = useState<DataStructureType>("list");

  // List state
  const [listData, setListData] = useState<string[]>(["Python", "Java", "C++"]);
  const [listInput, setListInput] = useState("");

  // Dictionary state
  const [dictData, setDictData] = useState<{[key: string]: string}>({
    "nombre": "Ana",
    "edad": "25",
    "ciudad": "Madrid"
  });
  const [dictKey, setDictKey] = useState("");
  const [dictValue, setDictValue] = useState("");

  // Set state
  const [setData, setSetData] = useState<Set<string>>(new Set(["Python", "SQL", "Git"]));
  const [setInput, setSetInput] = useState("");

  // Tuple state (inmutable)
  const [tupleData] = useState<string[]>(["x", "y", "z"]);

  const addToList = () => {
    if (listInput.trim()) {
      setListData([...listData, listInput]);
      setListInput("");
    }
  };

  const removeFromList = (index: number) => {
    setListData(listData.filter((_, i) => i !== index));
  };

  const addToDict = () => {
    if (dictKey.trim() && dictValue.trim()) {
      setDictData({ ...dictData, [dictKey]: dictValue });
      setDictKey("");
      setDictValue("");
    }
  };

  const removeFromDict = (key: string) => {
    const newDict = { ...dictData };
    delete newDict[key];
    setDictData(newDict);
  };

  const addToSet = () => {
    if (setInput.trim()) {
      const newSet = new Set(setData);
      newSet.add(setInput);
      setSetData(newSet);
      setSetInput("");
    }
  };

  const removeFromSet = (item: string) => {
    const newSet = new Set(setData);
    newSet.delete(item);
    setSetData(newSet);
  };

  const structures = [
    { type: "list" as DataStructureType, name: "Lista", color: "bg-blue-500", icon: "[]" },
    { type: "dict" as DataStructureType, name: "Diccionario", color: "bg-green-500", icon: "{}" },
    { type: "set" as DataStructureType, name: "Set", color: "bg-purple-500", icon: "{}" },
    { type: "tuple" as DataStructureType, name: "Tupla", color: "bg-orange-500", icon: "()" }
  ];

  return (
    <div className="space-y-6">
      {/* Structure Selector */}
      <div className="flex flex-wrap gap-3">
        {structures.map(({ type, name, color, icon }) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeType === type
                ? `${color} text-white shadow-lg scale-105`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="font-mono mr-2">{icon}</span>
            {name}
          </button>
        ))}
      </div>

      {/* Info Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 rounded-lg">
        {activeType === "list" && (
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Lista (list)</h4>
            <p className="text-sm text-gray-700">
              ✓ Ordenada | ✓ Mutable | ✓ Permite duplicados | Acceso por índice
            </p>
            <code className="text-xs bg-white px-2 py-1 rounded mt-2 inline-block">
              mi_lista = ["a", "b", "c"]
            </code>
          </div>
        )}
        {activeType === "dict" && (
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Diccionario (dict)</h4>
            <p className="text-sm text-gray-700">
              ✓ No ordenado (Python 3.7+: orden de inserción) | ✓ Mutable | ✗ Keys únicas | Acceso por clave
            </p>
            <code className="text-xs bg-white px-2 py-1 rounded mt-2 inline-block">
              mi_dict = {"{"}\"clave\": \"valor\"{"}"}
            </code>
          </div>
        )}
        {activeType === "set" && (
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Set (set)</h4>
            <p className="text-sm text-gray-700">
              ✗ No ordenado | ✓ Mutable | ✗ No permite duplicados | Operaciones de conjuntos
            </p>
            <code className="text-xs bg-white px-2 py-1 rounded mt-2 inline-block">
              mi_set = {"{"}\"a\", \"b\", \"c\"{"}"}
            </code>
          </div>
        )}
        {activeType === "tuple" && (
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Tupla (tuple)</h4>
            <p className="text-sm text-gray-700">
              ✓ Ordenada | ✗ Inmutable | ✓ Permite duplicados | Más rápida que lista
            </p>
            <code className="text-xs bg-white px-2 py-1 rounded mt-2 inline-block">
              mi_tupla = ("a", "b", "c")
            </code>
          </div>
        )}
      </div>

      {/* Visualization Area */}
      <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* LIST */}
          {activeType === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={listInput}
                  onChange={(e) => setListInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToList()}
                  placeholder="Agregar elemento..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={addToList}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </div>

              <div className="space-y-3">
                {listData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg border-2 border-blue-200"
                  >
                    <div className="bg-blue-500 text-white w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold">
                      {index}
                    </div>
                    <div className="flex-1 font-mono text-gray-800">{item}</div>
                    <button
                      onClick={() => removeFromList(index)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* DICTIONARY */}
          {activeType === "dict" && (
            <motion.div
              key="dict"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={dictKey}
                  onChange={(e) => setDictKey(e.target.value)}
                  placeholder="Clave..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={dictValue}
                  onChange={(e) => setDictValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToDict()}
                  placeholder="Valor..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                />
                <button
                  onClick={addToDict}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(dictData).map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 bg-green-50 p-4 rounded-lg border-2 border-green-200"
                  >
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-mono font-bold">
                      {key}
                    </div>
                    <div className="text-gray-500 text-xl">→</div>
                    <div className="flex-1 font-mono text-gray-800 bg-white px-4 py-2 rounded-lg border border-gray-300">
                      {value}
                    </div>
                    <button
                      onClick={() => removeFromDict(key)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SET */}
          {activeType === "set" && (
            <motion.div
              key="set"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={setInput}
                  onChange={(e) => setSetInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addToSet()}
                  placeholder="Agregar elemento (duplicados se ignoran)..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={addToSet}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {Array.from(setData).map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-3 bg-purple-50 px-6 py-3 rounded-full border-2 border-purple-200"
                  >
                    <div className="font-mono text-gray-800 font-semibold">{item}</div>
                    <button
                      onClick={() => removeFromSet(item)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <p className="text-sm text-purple-900">
                  <strong>Nota:</strong> Los sets automáticamente eliminan duplicados.
                  Intenta agregar un elemento que ya existe.
                </p>
              </div>
            </motion.div>
          )}

          {/* TUPLE */}
          {activeType === "tuple" && (
            <motion.div
              key="tuple"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded flex items-start gap-3">
                <Lock className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <p className="font-semibold text-orange-900 mb-1">Estructura Inmutable</p>
                  <p className="text-sm text-orange-800">
                    Las tuplas no pueden ser modificadas después de su creación.
                    Son ideales para datos que no deben cambiar.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {tupleData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 bg-orange-50 p-4 rounded-lg border-2 border-orange-200"
                  >
                    <div className="bg-orange-500 text-white w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold">
                      {index}
                    </div>
                    <div className="flex-1 font-mono text-gray-800">{item}</div>
                    <Lock className="w-5 h-5 text-orange-500" />
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Casos de uso de Tuplas:</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Coordenadas: (x, y, z)</li>
                  <li>Fechas: (dia, mes, año)</li>
                  <li>Configuraciones que no deben cambiar</li>
                  <li>Claves de diccionarios (las listas no pueden ser claves)</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Comparación Rápida</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4">Característica</th>
              <th className="text-center py-3 px-4 bg-blue-50">Lista</th>
              <th className="text-center py-3 px-4 bg-green-50">Diccionario</th>
              <th className="text-center py-3 px-4 bg-purple-50">Set</th>
              <th className="text-center py-3 px-4 bg-orange-50">Tupla</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 font-semibold">Ordenada</td>
              <td className="text-center py-3 px-4">✓</td>
              <td className="text-center py-3 px-4">✓*</td>
              <td className="text-center py-3 px-4">✗</td>
              <td className="text-center py-3 px-4">✓</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 font-semibold">Mutable</td>
              <td className="text-center py-3 px-4">✓</td>
              <td className="text-center py-3 px-4">✓</td>
              <td className="text-center py-3 px-4">✓</td>
              <td className="text-center py-3 px-4">✗</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 font-semibold">Duplicados</td>
              <td className="text-center py-3 px-4">✓</td>
              <td className="text-center py-3 px-4">✗ (keys)</td>
              <td className="text-center py-3 px-4">✗</td>
              <td className="text-center py-3 px-4">✓</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold">Acceso</td>
              <td className="text-center py-3 px-4">Índice</td>
              <td className="text-center py-3 px-4">Clave</td>
              <td className="text-center py-3 px-4">Iteración</td>
              <td className="text-center py-3 px-4">Índice</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">* Python 3.7+ mantiene orden de inserción</p>
      </div>
    </div>
  );
}
