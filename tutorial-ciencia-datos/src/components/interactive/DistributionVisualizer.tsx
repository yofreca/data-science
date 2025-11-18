"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

type DistributionType = 'normal' | 'uniform' | 'binomial' | 'exponential';

const distributions = {
  normal: {
    name: 'Normal (Gaussiana)',
    description: 'Curva de campana simétrica',
    color: 'from-blue-500 to-cyan-500'
  },
  uniform: {
    name: 'Uniforme',
    description: 'Todos los valores tienen igual probabilidad',
    color: 'from-green-500 to-emerald-500'
  },
  binomial: {
    name: 'Binomial',
    description: 'N ensayos con probabilidad p de éxito',
    color: 'from-purple-500 to-pink-500'
  },
  exponential: {
    name: 'Exponencial',
    description: 'Tiempo entre eventos (ej: llegadas)',
    color: 'from-orange-500 to-red-500'
  }
};

export default function DistributionVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [distributionType, setDistributionType] = useState<DistributionType>('normal');

  // Parámetros
  const [mean, setMean] = useState(50);
  const [stdDev, setStdDev] = useState(15);
  const [n, setN] = useState(20);
  const [p, setP] = useState(0.5);
  const [lambda, setLambda] = useState(0.5);

  // Función de densidad normal
  const normalPDF = (x: number, mu: number, sigma: number) => {
    const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
    return coefficient * Math.exp(exponent);
  };

  // Función binomial
  const binomialPMF = (k: number, n: number, p: number) => {
    const coefficient = factorial(n) / (factorial(k) * factorial(n - k));
    return coefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
  };

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  // Función exponencial
  const exponentialPDF = (x: number, lambda: number) => {
    if (x < 0) return 0;
    return lambda * Math.exp(-lambda * x);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Ejes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Dibujar distribución
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    const dist = distributions[distributionType];
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#8b5cf6');

    ctx.strokeStyle = gradient;
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 3;

    if (distributionType === 'normal') {
      // Normal distribution
      ctx.beginPath();
      const xMin = mean - 4 * stdDev;
      const xMax = mean + 4 * stdDev;
      let maxY = 0;

      // Find max for scaling
      for (let x = xMin; x <= xMax; x += 0.1) {
        const y = normalPDF(x, mean, stdDev);
        if (y > maxY) maxY = y;
      }

      for (let x = xMin; x <= xMax; x += 0.5) {
        const y = normalPDF(x, mean, stdDev);
        const screenX = padding + ((x - xMin) / (xMax - xMin)) * graphWidth;
        const screenY = height - padding - (y / maxY) * graphHeight;

        if (x === xMin) {
          ctx.moveTo(screenX, height - padding);
          ctx.lineTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
      ctx.lineTo(width - padding, height - padding);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.stroke();

    } else if (distributionType === 'uniform') {
      // Uniform distribution
      ctx.fillRect(padding, padding, graphWidth, graphHeight);
      ctx.globalAlpha = 1;
      ctx.strokeRect(padding, padding, graphWidth, graphHeight);

    } else if (distributionType === 'binomial') {
      // Binomial distribution
      let maxProb = 0;
      const probs: number[] = [];
      for (let k = 0; k <= n; k++) {
        const prob = binomialPMF(k, n, p);
        probs.push(prob);
        if (prob > maxProb) maxProb = prob;
      }

      const barWidth = graphWidth / (n + 1);
      probs.forEach((prob, k) => {
        const x = padding + k * barWidth;
        const barHeight = (prob / maxProb) * graphHeight;
        const y = height - padding - barHeight;

        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
        ctx.globalAlpha = 1;
        ctx.strokeRect(x, y, barWidth * 0.8, barHeight);
        ctx.globalAlpha = 0.3;
      });

    } else if (distributionType === 'exponential') {
      // Exponential distribution
      ctx.beginPath();
      const xMax = 10;
      let maxY = exponentialPDF(0, lambda);

      for (let x = 0; x <= xMax; x += 0.1) {
        const y = exponentialPDF(x, lambda);
        const screenX = padding + (x / xMax) * graphWidth;
        const screenY = height - padding - (y / maxY) * graphHeight;

        if (x === 0) {
          ctx.moveTo(screenX, height - padding);
          ctx.lineTo(screenX, screenY);
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
      ctx.lineTo(width - padding, height - padding);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.stroke();
    }

  }, [distributionType, mean, stdDev, n, p, lambda]);

  return (
    <div className="glass-effect p-8 rounded-2xl space-y-6">
      <div>
        <h3 className="text-2xl font-bold gradient-text mb-2">
          Visualizador de Distribuciones
        </h3>
        <p className="text-gray-600">
          Explora diferentes distribuciones de probabilidad y ajusta sus parámetros.
        </p>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-xl p-4 shadow-inner">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full h-auto border border-gray-200 rounded"
        />
      </div>

      {/* Distribution Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(distributions) as DistributionType[]).map((key) => {
          const dist = distributions[key];
          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDistributionType(key)}
              className={`p-4 rounded-xl text-left transition-all ${
                distributionType === key
                  ? `bg-gradient-to-br ${dist.color} text-white shadow-lg`
                  : 'glass-effect text-gray-700 hover:shadow-md'
              }`}
            >
              <p className="font-bold text-sm mb-1">{dist.name}</p>
              <p className={`text-xs ${distributionType === key ? 'text-white/90' : 'text-gray-600'}`}>
                {dist.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Parameters */}
      <div className="grid md:grid-cols-2 gap-6">
        {distributionType === 'normal' && (
          <>
            <ParameterSlider
              label="Media (μ)"
              value={mean}
              onChange={setMean}
              min={0}
              max={100}
              step={1}
            />
            <ParameterSlider
              label="Desviación Estándar (σ)"
              value={stdDev}
              onChange={setStdDev}
              min={1}
              max={30}
              step={1}
            />
          </>
        )}

        {distributionType === 'binomial' && (
          <>
            <ParameterSlider
              label="Número de ensayos (n)"
              value={n}
              onChange={setN}
              min={5}
              max={50}
              step={1}
            />
            <ParameterSlider
              label="Probabilidad de éxito (p)"
              value={p}
              onChange={setP}
              min={0}
              max={1}
              step={0.05}
            />
          </>
        )}

        {distributionType === 'exponential' && (
          <ParameterSlider
            label="Tasa (λ)"
            value={lambda}
            onChange={setLambda}
            min={0.1}
            max={2}
            step={0.1}
          />
        )}
      </div>

      {/* Info */}
      <div className="p-4 glass-effect rounded-xl">
        {distributionType === 'normal' && (
          <p className="text-sm text-gray-700">
            <strong>📊 Normal:</strong> La distribución más importante en estadística.
            Muchos fenómenos naturales siguen esta distribución. El 68% de los datos
            están dentro de 1σ de la media, 95% dentro de 2σ, y 99.7% dentro de 3σ.
          </p>
        )}
        {distributionType === 'uniform' && (
          <p className="text-sm text-gray-700">
            <strong>📊 Uniforme:</strong> Todos los valores tienen la misma probabilidad.
            Ejemplo: lanzar un dado justo, seleccionar un número aleatorio entre 0 y 1.
          </p>
        )}
        {distributionType === 'binomial' && (
          <p className="text-sm text-gray-700">
            <strong>📊 Binomial:</strong> Modela el número de éxitos en n ensayos
            independientes con probabilidad p. Ejemplo: número de caras en 10 lanzamientos
            de moneda (n=10, p=0.5).
          </p>
        )}
        {distributionType === 'exponential' && (
          <p className="text-sm text-gray-700">
            <strong>📊 Exponencial:</strong> Modela el tiempo entre eventos en un
            proceso de Poisson. Ejemplo: tiempo entre llegadas de clientes, tiempo
            de vida de componentes electrónicos.
          </p>
        )}
      </div>
    </div>
  );
}

function ParameterSlider({
  label,
  value,
  onChange,
  min,
  max,
  step
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div className="p-4 glass-effect rounded-xl space-y-2">
      <div className="flex justify-between">
        <label className="font-semibold text-gray-700">{label}</label>
        <span className="font-bold text-blue-600">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
