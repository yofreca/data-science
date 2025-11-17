"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Eye, AlertCircle } from "lucide-react";

type PaletteType = "sequential" | "diverging" | "qualitative" | "colorblind";

export default function ColorTheoryDemo() {
  const [selectedPalette, setSelectedPalette] = useState<PaletteType>("sequential");

  const palettes = {
    sequential: {
      name: "Secuencial",
      description: "Para datos ordenados de bajo a alto",
      colors: ["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1e3a8a"],
      useCase: "Mapas de calor, densidad, concentración",
      examples: "Temperatura (frío a caliente), población (baja a alta)"
    },
    diverging: {
      name: "Divergente",
      description: "Para datos con punto medio significativo",
      colors: ["#b91c1c", "#ef4444", "#f3f4f6", "#60a5fa", "#1e40af"],
      useCase: "Datos con valor neutral o medio importante",
      examples: "Cambio de temperatura (+/-), correlaciones (-1 a +1)"
    },
    qualitative: {
      name: "Cualitativa",
      description: "Para categorías sin orden",
      colors: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"],
      useCase: "Diferentes categorías, grupos, clases",
      examples: "Países, productos, departamentos"
    },
    colorblind: {
      name: "Accesible (Colorblind-safe)",
      description: "Paleta segura para personas con daltonismo",
      colors: ["#0173b2", "#de8f05", "#029e73", "#cc78bc", "#ca9161"],
      useCase: "Cualquier visualización pública",
      examples: "Todas las visualizaciones profesionales"
    }
  };

  const colorblindTypes = [
    {
      name: "Visión Normal",
      description: "Visión de color completa",
      percentage: "~92%"
    },
    {
      name: "Deuteranopia",
      description: "Dificultad con verde (más común)",
      percentage: "~5%"
    },
    {
      name: "Protanopia",
      description: "Dificultad con rojo",
      percentage: "~2%"
    },
    {
      name: "Tritanopia",
      description: "Dificultad con azul (raro)",
      percentage: "~0.001%"
    }
  ];

  const selected = palettes[selectedPalette];

  return (
    <div className="space-y-6">
      {/* Palette Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(palettes).map(([key, palette]) => (
          <button
            key={key}
            onClick={() => setSelectedPalette(key as PaletteType)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedPalette === key
                ? 'bg-purple-50 border-purple-500 shadow-lg'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-800 mb-2 text-sm">{palette.name}</div>
            <div className="flex gap-1 mb-2">
              {palette.colors.slice(0, 5).map((color, idx) => (
                <div
                  key={idx}
                  className="h-6 flex-1 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Palette Info */}
      <motion.div
        key={selectedPalette}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <Palette className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-purple-900 mb-2">{selected.name}</h3>
            <p className="text-purple-800 mb-2">{selected.description}</p>
            <div className="text-sm text-purple-700">
              <div><strong>Caso de uso:</strong> {selected.useCase}</div>
              <div><strong>Ejemplos:</strong> {selected.examples}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Color Palette Display */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Paleta Completa</h3>
        <div className="space-y-3">
          {selected.colors.map((color, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4"
            >
              <div
                className="w-24 h-12 rounded-lg shadow-md border-2 border-gray-200"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <div className="font-mono text-sm text-gray-700">{color}</div>
                <div className="text-xs text-gray-500">
                  Color {idx + 1} de {selected.colors.length}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Data Visualization Example */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Ejemplo de Visualización</h3>
        <div className="space-y-2">
          {selected.colors.map((color, idx) => {
            // Use predefined values instead of Math.random() to avoid hydration errors
            const predefinedWidths = [85, 72, 93, 65, 88, 79];
            const width = predefinedWidths[idx % predefinedWidths.length];
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">Categoría {idx + 1}</div>
                <div
                  className="h-8 rounded transition-all duration-300"
                  style={{
                    backgroundColor: color,
                    width: `${width}%`
                  }}
                />
                <div className="text-sm text-gray-500 font-mono">{width}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Colorblind Information */}
      {selectedPalette === "colorblind" && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Tipos de Daltonismo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {colorblindTypes.map((type, idx) => (
              <div key={idx} className="bg-white p-3 rounded">
                <div className="font-semibold text-blue-900">{type.name}</div>
                <div className="text-blue-700 text-xs">{type.description}</div>
                <div className="text-blue-600 text-xs mt-1">Población: {type.percentage}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (Matplotlib/Seaborn):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{selectedPalette === "sequential" && `import matplotlib.pyplot as plt
import seaborn as sns

# Paleta secuencial built-in
sns.set_palette("Blues")

# O personalizada
colors = ["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1e3a8a"]
sns.set_palette(colors)

# Usar en heatmap
sns.heatmap(data, cmap='Blues', annot=True)`}

{selectedPalette === "diverging" && `import matplotlib.pyplot as plt
import seaborn as sns

# Paleta divergente built-in
sns.set_palette("RdBu_r")

# O personalizada
colors = ["#b91c1c", "#ef4444", "#f3f4f6", "#60a5fa", "#1e40af"]
sns.set_palette(colors)

# Usar en heatmap con centro
sns.heatmap(correlation_matrix, cmap='RdBu_r', center=0)`}

{selectedPalette === "qualitative" && `import matplotlib.pyplot as plt
import seaborn as sns

# Paleta cualitativa built-in
sns.set_palette("Set2")

# O personalizada
colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"]
sns.set_palette(colors)

# Usar en gráfico de barras
plt.bar(categories, values, color=colors)`}

{selectedPalette === "colorblind" && `import matplotlib.pyplot as plt
import seaborn as sns

# Usar paleta segura para daltonismo
sns.set_palette("colorblind")

# O usar paletas específicas
# Viridis (excelente para daltonismo)
plt.imshow(data, cmap='viridis')

# ColorBrewer paletas seguras
sns.color_palette("Set2")  # Cualitativa
sns.color_palette("RdYlBu")  # Divergente`}
        </pre>
      </div>

      {/* Best Practices */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-green-600" />
          Mejores Prácticas
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Usa paletas accesibles</strong> - Considera daltonismo (~8% de hombres)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Limita colores</strong> - Máximo 6-7 categorías distinguibles</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Usa herramientas</strong> - ColorBrewer, Viridis son científicamente probadas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">✗</span>
            <span><strong>Evita rojo-verde</strong> - Problema para deuteranopia (daltonismo más común)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">✗</span>
            <span><strong>Evita rainbow</strong> - No es perceptualmente uniforme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">✗</span>
            <span><strong>No uses color solo</strong> - Combina con forma, tamaño, o etiquetas</span>
          </li>
        </ul>
      </div>

      {/* Popular Palettes Reference */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Paletas Populares Recomendadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Matplotlib/Seaborn:</h4>
            <ul className="space-y-1 text-gray-600 list-disc list-inside">
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">viridis</code> - Secuencial, colorblind-safe</li>
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">plasma</code> - Secuencial</li>
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">RdBu</code> - Divergente</li>
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">Set2</code> - Cualitativa</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">ColorBrewer:</h4>
            <ul className="space-y-1 text-gray-600 list-disc list-inside">
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">YlOrRd</code> - Secuencial</li>
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">RdYlGn</code> - Divergente</li>
              <li><code className="bg-gray-100 px-2 py-0.5 rounded">Paired</code> - Cualitativa</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
