"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Info, TrendingDown } from "lucide-react";

type NetworkState = {
  // Input
  x: number;
  target: number;

  // Weights
  w1: number;
  w2: number;

  // Forward pass
  h: number;  // hidden neuron
  y: number;  // output

  // Loss
  loss: number;

  // Gradients
  dL_dy: number;
  dL_dw2: number;
  dL_dh: number;
  dL_dw1: number;
};

export default function BackpropagationDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<NetworkState>({
    x: 2.0,
    target: 5.0,
    w1: 0.5,
    w2: 0.5,
    h: 0,
    y: 0,
    loss: 0,
    dL_dy: 0,
    dL_dw2: 0,
    dL_dh: 0,
    dL_dw1: 0
  });
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const learningRate = 0.1;

  // Simple sigmoid
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const sigmoidDerivative = (x: number) => {
    const s = sigmoid(x);
    return s * (1 - s);
  };

  // Forward pass
  const forwardPass = (x: number, w1: number, w2: number): Partial<NetworkState> => {
    const h = sigmoid(x * w1);
    const y = sigmoid(h * w2);
    const loss = 0.5 * Math.pow(y - state.target, 2); // MSE
    return { h, y, loss };
  };

  // Backward pass
  const backwardPass = (x: number, h: number, y: number, w2: number): Partial<NetworkState> => {
    // dL/dy = y - target (derivative of MSE)
    const dL_dy = y - state.target;

    // dL/dw2 = dL/dy * dy/dw2 = dL/dy * sigmoid'(h*w2) * h
    const dL_dw2 = dL_dy * sigmoidDerivative(h * w2) * h;

    // dL/dh = dL/dy * dy/dh = dL/dy * sigmoid'(h*w2) * w2
    const dL_dh = dL_dy * sigmoidDerivative(h * w2) * w2;

    // dL/dw1 = dL/dh * dh/dw1 = dL/dh * sigmoid'(x*w1) * x
    const dL_dw1 = dL_dh * sigmoidDerivative(x * w1) * x;

    return { dL_dy, dL_dw2, dL_dh, dL_dw1 };
  };

  // Draw network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 800;
    const canvasHeight = 400;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Neuron positions
    const neurons = {
      input: { x: 150, y: 200 },
      hidden: { x: 400, y: 200 },
      output: { x: 650, y: 200 }
    };

    // Draw connections with weights
    const drawConnection = (from: {x: number, y: number}, to: {x: number, y: number}, weight: number, gradient: number | null, isHighlighted: boolean) => {
      ctx.strokeStyle = isHighlighted ? "#ef4444" : "#9ca3af";
      ctx.lineWidth = isHighlighted ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      // Weight label
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2 - 20;
      ctx.fillStyle = "#1f2937";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`w=${weight.toFixed(2)}`, midX, midY);

      // Gradient label (if available)
      if (gradient !== null) {
        ctx.fillStyle = "#ef4444";
        ctx.fillText(`∇=${gradient.toFixed(3)}`, midX, midY + 15);
      }
    };

    // Draw w1 connection
    drawConnection(
      neurons.input,
      neurons.hidden,
      state.w1,
      step >= 4 ? state.dL_dw1 : null,
      step === 4
    );

    // Draw w2 connection
    drawConnection(
      neurons.hidden,
      neurons.output,
      state.w2,
      step >= 2 ? state.dL_dw2 : null,
      step === 2
    );

    // Draw neurons
    const drawNeuron = (pos: {x: number, y: number}, value: number, label: string, isHighlighted: boolean) => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = isHighlighted ? "#fef3c7" : "#f3f4f6";
      ctx.fill();
      ctx.strokeStyle = isHighlighted ? "#f59e0b" : "#9ca3af";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Value
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(value.toFixed(2), pos.x, pos.y + 5);

      // Label
      ctx.font = "12px sans-serif";
      ctx.fillText(label, pos.x, pos.y - 50);
    };

    drawNeuron(neurons.input, state.x, "Input (x)", step === 0);
    drawNeuron(neurons.hidden, state.h, "Hidden (h)", step === 1 || step === 3);
    drawNeuron(neurons.output, state.y, "Output (y)", step === 1);

    // Draw target and loss
    ctx.fillStyle = "#059669";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Target: ${state.target.toFixed(2)}`, 650, 280);
    ctx.fillStyle = step >= 1 ? "#dc2626" : "#6b7280";
    ctx.fillText(`Loss: ${state.loss.toFixed(4)}`, 650, 300);

    // Draw gradient flow indicators
    if (step >= 2) {
      // Backward arrow from output
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      if (step === 2) {
        // dL/dy at output
        ctx.beginPath();
        ctx.moveTo(650, 240);
        ctx.lineTo(650, 310);
        ctx.stroke();
        ctx.fillStyle = "#ef4444";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`dL/dy=${state.dL_dy.toFixed(3)}`, 650, 330);
      }

      if (step === 3) {
        // dL/dh at hidden
        ctx.beginPath();
        ctx.moveTo(400, 240);
        ctx.lineTo(400, 310);
        ctx.stroke();
        ctx.fillStyle = "#ef4444";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`dL/dh=${state.dL_dh.toFixed(3)}`, 400, 330);
      }

      ctx.setLineDash([]);
    }

    // Step description
    const steps = [
      "Paso 0: Forward - Input",
      "Paso 1: Forward - Calcular output y loss",
      "Paso 2: Backward - Calcular dL/dy y dL/dw2",
      "Paso 3: Backward - Calcular dL/dh",
      "Paso 4: Backward - Calcular dL/dw1",
      "Paso 5: Update - Actualizar pesos"
    ];

    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(steps[step] || "Completo", canvasWidth / 2, 50);

  }, [state, step]);

  const runStep = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Step 0: Show input
    setStep(0);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Step 1: Forward pass
    setStep(1);
    const forward = forwardPass(state.x, state.w1, state.w2);
    setState(prev => ({ ...prev, ...forward }));
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Calculate dL/dy and dL/dw2
    setStep(2);
    let backward = backwardPass(state.x, forward.h!, forward.y!, state.w2);
    setState(prev => ({ ...prev, ...backward }));
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Calculate dL/dh
    setStep(3);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 4: Calculate dL/dw1
    setStep(4);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 5: Update weights
    setStep(5);
    const newW1 = state.w1 - learningRate * backward.dL_dw1!;
    const newW2 = state.w2 - learningRate * backward.dL_dw2!;
    setState(prev => ({ ...prev, w1: newW1, w2: newW2 }));
    setEpoch(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setStep(0);
    setIsAnimating(false);
  };

  const reset = () => {
    setState({
      x: 2.0,
      target: 5.0,
      w1: 0.5,
      w2: 0.5,
      h: 0,
      y: 0,
      loss: 0,
      dL_dy: 0,
      dL_dw2: 0,
      dL_dh: 0,
      dL_dw1: 0
    });
    setStep(0);
    setEpoch(0);
  };

  const trainMultiple = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    for (let i = 0; i < 10; i++) {
      const forward = forwardPass(state.x, state.w1, state.w2);
      const backward = backwardPass(state.x, forward.h!, forward.y!, state.w2);

      const newW1 = state.w1 - learningRate * backward.dL_dw1!;
      const newW2 = state.w2 - learningRate * backward.dL_dw2!;

      setState(prev => ({
        ...prev,
        ...forward,
        ...backward,
        w1: newW1,
        w2: newW2
      }));

      setEpoch(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsAnimating(false);
  };

  return (
    <div className="space-y-6">
      {/* Info Panel */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-900">
            <p className="font-semibold mb-1">Backpropagation Simplificado</p>
            <p className="text-green-800">
              Red de 2 capas: Input (x) → Hidden (h) → Output (y). Objetivo: predecir target={state.target}.
              Backpropagation calcula gradientes de la loss con respecto a cada peso usando la regla de la cadena.
              Learning rate = {learningRate}
            </p>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full"
        />
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center flex-wrap">
        <button
          onClick={runStep}
          disabled={isAnimating}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            isAnimating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
          }`}
        >
          <Play className="w-5 h-5" />
          1 Paso (Forward + Backward)
        </button>
        <button
          onClick={trainMultiple}
          disabled={isAnimating}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            isAnimating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          <TrendingDown className="w-5 h-5" />
          Entrenar 10 Épocas
        </button>
        <button
          onClick={reset}
          disabled={isAnimating}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-sm text-blue-700 font-semibold">Época</div>
          <div className="text-2xl font-bold text-blue-900">{epoch}</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
          <div className="text-sm text-red-700 font-semibold">Loss (MSE)</div>
          <div className="text-2xl font-bold text-red-900">{state.loss.toFixed(4)}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-sm text-purple-700 font-semibold">Predicción</div>
          <div className="text-2xl font-bold text-purple-900">{state.y.toFixed(3)}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="text-sm text-green-700 font-semibold">Target</div>
          <div className="text-2xl font-bold text-green-900">{state.target.toFixed(2)}</div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-800 mb-3">Algoritmo de Backpropagation</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="bg-white p-4 rounded border-l-4 border-blue-500">
            <div className="font-bold text-blue-900 mb-1">1. Forward Pass</div>
            <div className="font-mono text-xs space-y-1">
              <div>h = sigmoid(x * w1) = sigmoid({state.x} * {state.w1.toFixed(2)}) = {state.h.toFixed(3)}</div>
              <div>y = sigmoid(h * w2) = sigmoid({state.h.toFixed(3)} * {state.w2.toFixed(2)}) = {state.y.toFixed(3)}</div>
              <div>Loss = 0.5 * (y - target)² = 0.5 * ({state.y.toFixed(3)} - {state.target})² = {state.loss.toFixed(4)}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border-l-4 border-red-500">
            <div className="font-bold text-red-900 mb-1">2. Backward Pass (Chain Rule)</div>
            <div className="font-mono text-xs space-y-1">
              <div>dL/dy = y - target = {state.dL_dy.toFixed(4)}</div>
              <div>dL/dw2 = dL/dy * sigmoid'(h*w2) * h = {state.dL_dw2.toFixed(4)}</div>
              <div>dL/dh = dL/dy * sigmoid'(h*w2) * w2 = {state.dL_dh.toFixed(4)}</div>
              <div>dL/dw1 = dL/dh * sigmoid'(x*w1) * x = {state.dL_dw1.toFixed(4)}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border-l-4 border-green-500">
            <div className="font-bold text-green-900 mb-1">3. Weight Update (Gradient Descent)</div>
            <div className="font-mono text-xs space-y-1">
              <div>w1_new = w1 - lr * dL/dw1 = {state.w1.toFixed(4)} - {learningRate} * {state.dL_dw1.toFixed(4)}</div>
              <div>w2_new = w2 - lr * dL/dw2 = {state.w2.toFixed(4)} - {learningRate} * {state.dL_dw2.toFixed(4)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (NumPy):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    s = sigmoid(x)
    return s * (1 - s)

# Initialize
x = 2.0
target = 5.0
w1, w2 = 0.5, 0.5
lr = 0.1

# Training loop
for epoch in range(100):
    # Forward pass
    h = sigmoid(x * w1)
    y = sigmoid(h * w2)
    loss = 0.5 * (y - target) ** 2

    # Backward pass
    dL_dy = y - target
    dL_dw2 = dL_dy * sigmoid_derivative(h * w2) * h
    dL_dh = dL_dy * sigmoid_derivative(h * w2) * w2
    dL_dw1 = dL_dh * sigmoid_derivative(x * w1) * x

    # Update weights
    w1 -= lr * dL_dw1
    w2 -= lr * dL_dw2

    if epoch % 10 == 0:
        print(f"Epoch {epoch}: Loss={loss:.4f}, y={y:.3f}")`}
        </pre>
      </div>
    </div>
  );
}
