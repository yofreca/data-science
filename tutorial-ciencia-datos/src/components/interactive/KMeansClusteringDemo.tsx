"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RefreshCw, Layers } from "lucide-react";

interface Point {
  x: number;
  y: number;
  cluster: number;
}

interface Centroid {
  x: number;
  y: number;
}

export default function KMeansClusteringDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState(3);
  const [iteration, setIteration] = useState(0);
  const [points, setPoints] = useState<Point[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  useEffect(() => {
    generateRandomPoints();
  }, []);

  useEffect(() => {
    drawVisualization();
  }, [points, centroids, k]);

  const generateRandomPoints = () => {
    const newPoints: Point[] = [];
    for (let i = 0; i < 60; i++) {
      newPoints.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        cluster: 0
      });
    }
    setPoints(newPoints);
    
    // Initialize centroids randomly
    const newCentroids: Centroid[] = [];
    for (let i = 0; i < k; i++) {
      newCentroids.push({
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }
    setCentroids(newCentroids);
    setIteration(0);
  };

  const runKMeansStep = () => {
    // Assign points to nearest centroid
    const updatedPoints = points.map(point => {
      let minDist = Infinity;
      let nearestCluster = 0;

      centroids.forEach((centroid, idx) => {
        const dist = Math.sqrt(Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2));
        if (dist < minDist) {
          minDist = dist;
          nearestCluster = idx;
        }
      });

      return { ...point, cluster: nearestCluster };
    });

    // Update centroids
    const newCentroids = centroids.map((_, idx) => {
      const clusterPoints = updatedPoints.filter(p => p.cluster === idx);
      if (clusterPoints.length === 0) return centroids[idx];

      const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
      const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);

      return {
        x: sumX / clusterPoints.length,
        y: sumY / clusterPoints.length
      };
    });

    setPoints(updatedPoints);
    setCentroids(newCentroids);
    setIteration(iteration + 1);
  };

  const runFullKMeans = () => {
    setIsRunning(true);
    let currentIter = 0;
    const maxIter = 10;

    const interval = setInterval(() => {
      runKMeansStep();
      currentIter++;

      if (currentIter >= maxIter) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 500);
  };

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * width;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();

      const y = padding + (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw points
    points.forEach(point => {
      const canvasX = padding + (point.x / 100) * width;
      const canvasY = canvas.height - padding - (point.y / 100) * height;

      ctx.fillStyle = colors[point.cluster % colors.length];
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw centroids
    centroids.forEach((centroid, idx) => {
      const canvasX = padding + (centroid.x / 100) * width;
      const canvasY = canvas.height - padding - (centroid.y / 100) * height;

      ctx.fillStyle = colors[idx % colors.length];
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(canvasX, canvasY - 10);
      ctx.lineTo(canvasX - 8, canvasY + 10);
      ctx.lineTo(canvasX + 8, canvasY + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número de Clusters (K): {k}
          </label>
          <input
            type="range"
            min="2"
            max="5"
            value={k}
            onChange={(e) => {
              setK(parseInt(e.target.value));
              generateRandomPoints();
            }}
            className="w-full"
            disabled={isRunning}
          />
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Iteración</div>
          <div className="text-2xl font-bold text-purple-600">{iteration}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <canvas ref={canvasRef} width={700} height={400} className="w-full border-2 border-gray-200 rounded-lg" />
      </div>

      <div className="flex gap-3">
        <button
          onClick={runKMeansStep}
          disabled={isRunning}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold flex items-center gap-2"
        >
          Un Paso
        </button>
        <button
          onClick={runFullKMeans}
          disabled={isRunning}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-semibold flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Auto (10 pasos)
        </button>
        <button
          onClick={generateRandomPoints}
          disabled={isRunning}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors font-semibold flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Nuevos Puntos
        </button>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
        <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Algoritmo K-Means
        </h3>
        <ol className="space-y-2 text-sm text-purple-800">
          <li><strong>1.</strong> Inicializar K centroides aleatoriamente (triángulos)</li>
          <li><strong>2.</strong> Asignar cada punto al centroide más cercano</li>
          <li><strong>3.</strong> Recalcular centroides como promedio de su cluster</li>
          <li><strong>4.</strong> Repetir 2-3 hasta convergencia</li>
        </ol>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python:</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">{`from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# Entrenar K-Means
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(X)

# Visualizar
plt.scatter(X[:, 0], X[:, 1], c=clusters, cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], 
           kmeans.cluster_centers_[:, 1],
           marker='X', s=200, c='red')
plt.show()`}</pre>
      </div>
    </div>
  );
}
