"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Play } from "lucide-react";

export default function HypothesisTestingDemo() {
  const [nullMean, setNullMean] = useState(50);
  const [alpha, setAlpha] = useState(0.05);
  const [sampleSize, setSampleSize] = useState(30);
  const [trueMean, setTrueMean] = useState(55);
  const [result, setResult] = useState<{
    sampleMean: number;
    zScore: number;
    pValue: number;
    reject: boolean;
  } | null>(null);

  const trueStdDev = 15;

  // Función de distribución acumulativa normal estándar (aproximación)
  const normalCDF = (z: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  };

  const generateSample = (size: number, mean: number): number[] => {
    return Array.from({ length: size }, () => {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return mean + z * trueStdDev;
    });
  };

  const runTest = () => {
    const sample = generateSample(sampleSize, trueMean);
    const sampleMean = sample.reduce((a, b) => a + b, 0) / sample.length;
    const standardError = trueStdDev / Math.sqrt(sampleSize);
    const zScore = (sampleMean - nullMean) / standardError;

    // P-valor (prueba de dos colas)
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
    const reject = pValue < alpha;

    setResult({ sampleMean, zScore, pValue, reject });
  };

  return (
    <div className="glass-effect p-8 rounded-2xl space-y-6">
      <div>
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Prueba de Hipótesis (Z-test)
        </h3>
        <p className="text-gray-600">
          Prueba si la media poblacional es diferente del valor hipotético.
        </p>
      </div>

      {/* Hypotheses */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 glass-effect rounded-xl">
          <h4 className="font-bold text-gray-800 mb-3">Hipótesis Nula (H₀)</h4>
          <p className="text-2xl font-bold text-blue-600">μ = {nullMean}</p>
          <p className="text-sm text-gray-600 mt-2">
            Asumimos que la media poblacional es {nullMean}
          </p>
        </div>

        <div className="p-6 glass-effect rounded-xl">
          <h4 className="font-bold text-gray-800 mb-3">Hipótesis Alternativa (H₁)</h4>
          <p className="text-2xl font-bold text-purple-600">μ ≠ {nullMean}</p>
          <p className="text-sm text-gray-600 mt-2">
            La media es diferente de {nullMean} (prueba de dos colas)
          </p>
        </div>
      </div>

      {/* Parameters */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-4 glass-effect rounded-xl space-y-3">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700">H₀: μ =</label>
            <span className="font-bold text-blue-600">{nullMean}</span>
          </div>
          <input
            type="range"
            min="40"
            max="60"
            value={nullMean}
            onChange={(e) => setNullMean(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="p-4 glass-effect rounded-xl space-y-3">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700">α (significancia):</label>
            <span className="font-bold text-blue-600">{alpha}</span>
          </div>
          <select
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="0.01">0.01 (1%)</option>
            <option value="0.05">0.05 (5%)</option>
            <option value="0.10">0.10 (10%)</option>
          </select>
        </div>

        <div className="p-4 glass-effect rounded-xl space-y-3">
          <div className="flex justify-between">
            <label className="font-semibold text-gray-700">Tamaño muestra:</label>
            <span className="font-bold text-blue-600">{sampleSize}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Hidden truth */}
      <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
        <h4 className="font-bold text-yellow-800 mb-2">
          🔍 Media Verdadera (oculta en la práctica): μ = {trueMean}
        </h4>
        <p className="text-sm text-gray-700 mb-2">
          Ajusta la media verdadera para simular diferentes escenarios:
        </p>
        <input
          type="range"
          min="40"
          max="60"
          value={trueMean}
          onChange={(e) => setTrueMean(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Run Test Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={runTest}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        <Play className="w-5 h-5" />
        Ejecutar Prueba de Hipótesis
      </motion.button>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="font-bold text-gray-800 text-xl">Resultados</h4>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <p className="text-xs font-semibold opacity-90 mb-1">Media Muestral</p>
              <p className="text-2xl font-bold">{result.sampleMean.toFixed(2)}</p>
              <p className="text-xs opacity-80">x̄</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <p className="text-xs font-semibold opacity-90 mb-1">Estadístico Z</p>
              <p className="text-2xl font-bold">{result.zScore.toFixed(3)}</p>
              <p className="text-xs opacity-80">distancia en desv. std</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <p className="text-xs font-semibold opacity-90 mb-1">P-valor</p>
              <p className="text-2xl font-bold">{result.pValue.toFixed(4)}</p>
              <p className="text-xs opacity-80">prob bajo H₀</p>
            </div>
          </div>

          {/* Decision */}
          <div className={`p-6 rounded-xl border-4 ${
            result.reject
              ? 'bg-red-50 border-red-500'
              : 'bg-green-50 border-green-500'
          }`}>
            <h4 className={`font-bold text-xl mb-3 ${
              result.reject ? 'text-red-800' : 'text-green-800'
            }`}>
              {result.reject ? '❌ Rechazamos H₀' : '✅ No Rechazamos H₀'}
            </h4>

            <div className="space-y-2 text-sm">
              <p className="font-semibold">
                P-valor ({result.pValue.toFixed(4)}) {result.reject ? '<' : '≥'} α ({alpha})
              </p>

              {result.reject ? (
                <>
                  <p className="text-gray-700">
                    <strong>Conclusión:</strong> Hay evidencia estadística suficiente para rechazar
                    la hipótesis nula. Los datos sugieren que la media poblacional es
                    diferente de {nullMean}.
                  </p>
                  <p className="text-gray-600 italic">
                    (La media verdadera era {trueMean}, ¡detectamos la diferencia!)
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-700">
                    <strong>Conclusión:</strong> No hay evidencia suficiente para rechazar
                    la hipótesis nula. Los datos son consistentes con μ = {nullMean}.
                  </p>
                  <p className="text-gray-600 italic">
                    {trueMean === nullMean
                      ? '(La media verdadera era efectivamente ' + trueMean + ')'
                      : '(La media verdadera era ' + trueMean + ', pero la diferencia no fue detectada - posible Error Tipo II)'
                    }
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Errors explanation */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 glass-effect rounded-xl">
              <h5 className="font-bold text-red-600 mb-2">Error Tipo I (α)</h5>
              <p className="text-sm text-gray-700">
                Rechazar H₀ cuando es verdadera. Nivel de significancia α = {alpha}
                es la probabilidad máxima de cometer este error.
              </p>
            </div>

            <div className="p-4 glass-effect rounded-xl">
              <h5 className="font-bold text-blue-600 mb-2">Error Tipo II (β)</h5>
              <p className="text-sm text-gray-700">
                No rechazar H₀ cuando es falsa. La potencia de la prueba (1-β)
                aumenta con el tamaño de muestra.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info */}
      <div className="p-4 glass-effect rounded-xl">
        <p className="text-sm text-gray-700">
          <strong>💡 P-valor:</strong> La probabilidad de obtener resultados tan extremos
          (o más) si H₀ fuera cierta. Si p-valor < α, rechazamos H₀. Es importante
          recordar que "no rechazar" no significa "aceptar" - solo que no hay evidencia
          suficiente para rechazar.
        </p>
      </div>
    </div>
  );
}
