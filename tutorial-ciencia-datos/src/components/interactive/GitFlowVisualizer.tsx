"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, GitCommit, GitMerge, Play, RotateCcw } from "lucide-react";

interface Commit {
  id: string;
  branch: string;
  message: string;
  x: number;
  y: number;
  color: string;
}

type Scenario = "basic" | "branch" | "merge" | "conflict";

export default function GitFlowVisualizer() {
  const [scenario, setScenario] = useState<Scenario>("basic");
  const [step, setStep] = useState(0);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scenarios = {
    basic: {
      title: "Commits Básicos",
      description: "Secuencia simple de commits en la rama main",
      steps: [
        { commits: [{ id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" }], command: "git init && git commit -m 'Initial commit'" },
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Add feature", x: 200, y: 150, color: "#3b82f6" }
        ], command: "git commit -m 'Add feature'" },
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Add feature", x: 200, y: 150, color: "#3b82f6" },
          { id: "c3", branch: "main", message: "Fix bug", x: 300, y: 150, color: "#3b82f6" }
        ], command: "git commit -m 'Fix bug'" }
      ]
    },
    branch: {
      title: "Crear Branch",
      description: "Crear y trabajar en una nueva rama",
      steps: [
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Main work", x: 200, y: 150, color: "#3b82f6" }
        ], command: "git commit -m 'Main work'" },
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Main work", x: 200, y: 150, color: "#3b82f6" }
        ], command: "git branch feature" },
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Main work", x: 200, y: 150, color: "#3b82f6" },
          { id: "c3", branch: "feature", message: "Feature work", x: 300, y: 100, color: "#10b981" }
        ], command: "git checkout feature && git commit -m 'Feature work'" },
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Main work", x: 200, y: 150, color: "#3b82f6" },
          { id: "c3", branch: "feature", message: "Feature work", x: 300, y: 100, color: "#10b981" },
          { id: "c4", branch: "feature", message: "More features", x: 400, y: 100, color: "#10b981" }
        ], command: "git commit -m 'More features'" }
      ]
    },
    merge: {
      title: "Merge Branches",
      description: "Fusionar rama feature con main",
      steps: [
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Main work", x: 200, y: 150, color: "#3b82f6" },
          { id: "c3", branch: "feature", message: "Feature work", x: 300, y: 100, color: "#10b981" }
        ], command: "Estado inicial con dos ramas" },
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Main work", x: 200, y: 150, color: "#3b82f6" },
          { id: "c3", branch: "feature", message: "Feature work", x: 300, y: 100, color: "#10b981" },
          { id: "c4", branch: "main", message: "Hotfix", x: 300, y: 150, color: "#3b82f6" }
        ], command: "git checkout main && git commit -m 'Hotfix'" },
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Main work", x: 200, y: 150, color: "#3b82f6" },
          { id: "c3", branch: "feature", message: "Feature work", x: 300, y: 100, color: "#10b981" },
          { id: "c4", branch: "main", message: "Hotfix", x: 300, y: 150, color: "#3b82f6" },
          { id: "c5", branch: "main", message: "Merge feature", x: 400, y: 150, color: "#8b5cf6" }
        ], command: "git merge feature" }
      ]
    },
    conflict: {
      title: "Conflicto de Merge",
      description: "Resolver conflictos al fusionar",
      steps: [
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Edit file.txt", x: 200, y: 150, color: "#3b82f6" }
        ], command: "git commit -m 'Edit file.txt'" },
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Edit file.txt", x: 200, y: 150, color: "#3b82f6" },
          { id: "c3", branch: "feature", message: "Edit same file", x: 300, y: 100, color: "#10b981" }
        ], command: "git checkout -b feature && git commit -m 'Edit same file'" },
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Edit file.txt", x: 200, y: 150, color: "#3b82f6" },
          { id: "c3", branch: "feature", message: "Edit same file", x: 300, y: 100, color: "#10b981" },
          { id: "c4", branch: "main", message: "Update file.txt", x: 300, y: 150, color: "#3b82f6" }
        ], command: "git checkout main && git commit -m 'Update file.txt'" },
        { commits: [
          { id: "c1", branch: "main", message: "Initial commit", x: 100, y: 150, color: "#3b82f6" },
          { id: "c2", branch: "main", message: "Edit file.txt", x: 200, y: 150, color: "#3b82f6" },
          { id: "c3", branch: "feature", message: "Edit same file", x: 300, y: 100, color: "#10b981" },
          { id: "c4", branch: "main", message: "Update file.txt", x: 300, y: 150, color: "#3b82f6" },
          { id: "c5", branch: "main", message: "Resolve conflict", x: 400, y: 150, color: "#ef4444" }
        ], command: "git merge feature (CONFLICT!) -> fix -> git commit" }
      ]
    }
  };

  useEffect(() => {
    if (scenarios[scenario].steps[step]) {
      setCommits(scenarios[scenario].steps[step].commits);
    }
  }, [scenario, step]);

  useEffect(() => {
    drawGraph();
  }, [commits]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;

    for (let i = 0; i < commits.length - 1; i++) {
      const curr = commits[i];
      const next = commits[i + 1];

      // Only draw line if next commit is in same branch or if it's a merge
      if (curr.branch === next.branch || next.message.includes("Merge") || next.message.includes("conflict")) {
        ctx.beginPath();
        ctx.moveTo(curr.x, curr.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
    }

    // Draw branch lines
    const featureCommits = commits.filter(c => c.branch === "feature");
    if (featureCommits.length > 0) {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      const mainCommit = commits.find(c => c.branch === "main" && c.x === 200);
      if (mainCommit && featureCommits.length > 0) {
        ctx.beginPath();
        ctx.moveTo(mainCommit.x, mainCommit.y);
        ctx.lineTo(featureCommits[0].x, featureCommits[0].y);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }
  };

  const nextStep = () => {
    if (step < scenarios[scenario].steps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const playAnimation = () => {
    setIsPlaying(true);
    setStep(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= scenarios[scenario].steps.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setStep(currentStep);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => { setScenario("basic"); reset(); }}
          className={`px-4 py-3 rounded-lg font-medium transition-all ${
            scenario === "basic"
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <GitCommit className="w-5 h-5 mx-auto mb-1" />
          Commits
        </button>
        <button
          onClick={() => { setScenario("branch"); reset(); }}
          className={`px-4 py-3 rounded-lg font-medium transition-all ${
            scenario === "branch"
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <GitBranch className="w-5 h-5 mx-auto mb-1" />
          Branch
        </button>
        <button
          onClick={() => { setScenario("merge"); reset(); }}
          className={`px-4 py-3 rounded-lg font-medium transition-all ${
            scenario === "merge"
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <GitMerge className="w-5 h-5 mx-auto mb-1" />
          Merge
        </button>
        <button
          onClick={() => { setScenario("conflict"); reset(); }}
          className={`px-4 py-3 rounded-lg font-medium transition-all ${
            scenario === "conflict"
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <GitMerge className="w-5 h-5 mx-auto mb-1" />
          Conflicto
        </button>
      </div>

      {/* Info Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-1">{scenarios[scenario].title}</h3>
        <p className="text-sm text-gray-700">{scenarios[scenario].description}</p>
      </div>

      {/* Visualization Canvas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden" style={{ height: "300px" }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="absolute top-0 left-0"
          />

          {/* Commit Nodes */}
          <AnimatePresence>
            {commits.map((commit, idx) => (
              <motion.div
                key={commit.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: idx * 0.2 }}
                style={{
                  position: "absolute",
                  left: `${commit.x - 20}px`,
                  top: `${commit.y - 20}px`,
                }}
                className="group"
              >
                <div
                  style={{ backgroundColor: commit.color }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform"
                >
                  {commit.id.substring(1)}
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  <div className="font-semibold">{commit.id}</div>
                  <div className="text-gray-300">{commit.message}</div>
                  <div className="text-gray-400 text-[10px]">{commit.branch}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Branch Labels */}
          <div className="absolute top-4 left-4 space-y-2">
            <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              main
            </div>
            {commits.some(c => c.branch === "feature") && (
              <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                feature
              </div>
            )}
          </div>
        </div>

        {/* Command Display */}
        <div className="mt-4 bg-gray-900 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Comando Git:</div>
          <code className="text-green-400 font-mono text-sm">
            {scenarios[scenario].steps[step]?.command || ""}
          </code>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>
            <button
              onClick={nextStep}
              disabled={step === scenarios[scenario].steps.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente →
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={playAnimation}
              disabled={isPlaying}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Reproducir
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Paso {step + 1} de {scenarios[scenario].steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / scenarios[scenario].steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Git Commands Reference */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Comandos Git Esenciales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <code className="text-blue-600 font-semibold">git init</code>
            <p className="text-gray-600 mt-1">Inicializar repositorio</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <code className="text-blue-600 font-semibold">git add .</code>
            <p className="text-gray-600 mt-1">Agregar cambios al staging</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <code className="text-blue-600 font-semibold">git commit -m "msg"</code>
            <p className="text-gray-600 mt-1">Crear commit con mensaje</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <code className="text-blue-600 font-semibold">git branch nombre</code>
            <p className="text-gray-600 mt-1">Crear nueva rama</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <code className="text-blue-600 font-semibold">git checkout rama</code>
            <p className="text-gray-600 mt-1">Cambiar a otra rama</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <code className="text-blue-600 font-semibold">git merge rama</code>
            <p className="text-gray-600 mt-1">Fusionar rama actual con otra</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <code className="text-blue-600 font-semibold">git pull</code>
            <p className="text-gray-600 mt-1">Traer cambios del remoto</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <code className="text-blue-600 font-semibold">git push</code>
            <p className="text-gray-600 mt-1">Enviar commits al remoto</p>
          </div>
        </div>
      </div>
    </div>
  );
}
