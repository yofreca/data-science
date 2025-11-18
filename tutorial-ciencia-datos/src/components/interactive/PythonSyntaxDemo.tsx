"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Code, RefreshCw } from "lucide-react";

interface CodeExample {
  title: string;
  code: string;
  description: string;
}

export default function PythonSyntaxDemo() {
  const examples: CodeExample[] = [
    {
      title: "Variables y Tipos",
      code: `# Variables en Python
nombre = "Data Science"
edad = 25
altura = 1.75
es_estudiante = True

print(f"Nombre: {nombre}")
print(f"Edad: {edad}")
print(f"Altura: {altura}m")
print(f"Es estudiante: {es_estudiante}")`,
      description: "Python es dinámicamente tipado - no necesitas declarar tipos"
    },
    {
      title: "Estructuras de Control",
      code: `# If-Else
temperatura = 22

if temperatura > 30:
    print("Hace calor")
elif temperatura > 20:
    print("Clima agradable")
else:
    print("Hace frio")

# For loop
for i in range(5):
    print(f"Iteracion {i}")`,
      description: "Control de flujo con if-else y bucles"
    },
    {
      title: "Funciones",
      code: `# Definir funciones
def saludar(nombre):
    return f"Hola, {nombre}!"

def calcular_promedio(numeros):
    return sum(numeros) / len(numeros)

print(saludar("Cientifico de Datos"))
notas = [85, 90, 78, 92, 88]
print(f"Promedio: {calcular_promedio(notas)}")`,
      description: "Las funciones organizan código reutilizable"
    },
    {
      title: "Listas y Comprensiones",
      code: `# Listas
frutas = ["manzana", "banana", "naranja"]
numeros = [1, 2, 3, 4, 5]

# List comprehension
cuadrados = [x**2 for x in numeros]
pares = [x for x in numeros if x % 2 == 0]

print(f"Frutas: {frutas}")
print(f"Cuadrados: {cuadrados}")
print(f"Pares: {pares}")`,
      description: "List comprehensions son concisas y eficientes"
    },
    {
      title: "Diccionarios",
      code: `# Diccionarios (key-value)
estudiante = {
    "nombre": "Ana",
    "edad": 23,
    "carrera": "Data Science",
    "notas": [85, 90, 88]
}

print(f"Nombre: {estudiante['nombre']}")
print(f"Carrera: {estudiante['carrera']}")
print(f"Promedio: {sum(estudiante['notas'])/len(estudiante['notas'])}")`,
      description: "Diccionarios almacenan pares clave-valor"
    }
  ];

  const [selectedExample, setSelectedExample] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const executeCode = () => {
    setIsRunning(true);
    setOutput([]);

    // Simular ejecución del código
    setTimeout(() => {
      const results = simulatePythonExecution(examples[selectedExample].code);
      setOutput(results);
      setIsRunning(false);
    }, 500);
  };

  const simulatePythonExecution = (code: string): string[] => {
    const results: string[] = [];

    // Simulación básica de ejecución de Python
    if (selectedExample === 0) {
      results.push("Nombre: Data Science");
      results.push("Edad: 25");
      results.push("Altura: 1.75m");
      results.push("Es estudiante: True");
    } else if (selectedExample === 1) {
      results.push("Clima agradable");
      results.push("Iteracion 0");
      results.push("Iteracion 1");
      results.push("Iteracion 2");
      results.push("Iteracion 3");
      results.push("Iteracion 4");
    } else if (selectedExample === 2) {
      results.push("Hola, Cientifico de Datos!");
      results.push("Promedio: 86.6");
    } else if (selectedExample === 3) {
      results.push("Frutas: ['manzana', 'banana', 'naranja']");
      results.push("Cuadrados: [1, 4, 9, 16, 25]");
      results.push("Pares: [2, 4]");
    } else if (selectedExample === 4) {
      results.push("Nombre: Ana");
      results.push("Carrera: Data Science");
      results.push("Promedio: 87.66666666666667");
    }

    return results;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Code Editor */}
      <div className="space-y-4">
        {/* Example Selector */}
        <div className="flex flex-wrap gap-2">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedExample(idx);
                setOutput([]);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedExample === idx
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-900">
            <strong>Concepto:</strong> {examples[selectedExample].description}
          </p>
        </div>

        {/* Code Display */}
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-400">
              <Code className="w-4 h-4" />
              <span className="text-xs">Python</span>
            </div>
            <button
              onClick={executeCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="text-xs font-semibold">Ejecutar</span>
            </button>
          </div>

          <pre className="text-gray-100 overflow-x-auto">
            <code>{examples[selectedExample].code}</code>
          </pre>
        </div>
      </div>

      {/* Right: Output */}
      <div className="space-y-4">
        <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 h-full min-h-[400px]">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-300">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm font-semibold text-gray-600">Output</span>
          </div>

          {output.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Presiona "Ejecutar" para ver el resultado</p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-sm space-y-1"
            >
              {output.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-gray-800"
                >
                  {line}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <h4 className="font-semibold text-purple-900 mb-2">💡 Tips de Python</h4>
          <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
            <li>Python usa indentación para definir bloques de código</li>
            <li>Las variables no necesitan declaración de tipo</li>
            <li>f-strings (f"...") facilitan la interpolación de strings</li>
            <li>List comprehensions son más rápidas que bucles for tradicionales</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
