"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Info, ArrowRight } from "lucide-react";

type RNNState = {
  hiddenState: number[];
  outputs: number[];
};

export default function RNNSequenceDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sequence, setSequence] = useState([0.5, 0.8, 0.3, 0.9, 0.2]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hiddenSize] = useState(3);
  const [states, setStates] = useState<RNNState[]>([]);

  // Simple RNN forward pass simulation
  const tanh = (x: number) => Math.tanh(x);

  const rnnStep = (input: number, prevHidden: number[]): { hidden: number[], output: number } => {
    // Simulated weights (fixed for demo)
    const Wxh = [0.5, -0.3, 0.7]; // Input to hidden
    const Whh = [
      [0.5, -0.2, 0.3],
      [0.1, 0.6, -0.4],
      [-0.2, 0.4, 0.5]
    ]; // Hidden to hidden
    const Why = [0.6, -0.3, 0.8]; // Hidden to output

    // Calculate new hidden state: h_t = tanh(Wxh * x_t + Whh * h_{t-1})
    const newHidden = Wxh.map((w, i) => {
      const inputContribution = w * input;
      const hiddenContribution = Whh[i].reduce((sum, weight, j) =>
        sum + weight * prevHidden[j], 0
      );
      return tanh(inputContribution + hiddenContribution);
    });

    // Calculate output: y_t = Why * h_t
    const output = Why.reduce((sum, w, i) => sum + w * newHidden[i], 0);

    return { hidden: newHidden, output: tanh(output) };
  };

  // Process entire sequence
  const processSequence = () => {
    const newStates: RNNState[] = [];
    let hidden = Array(hiddenSize).fill(0); // Initial hidden state

    sequence.forEach((input) => {
      const result = rnnStep(input, hidden);
      hidden = result.hidden;
      newStates.push({
        hiddenState: [...hidden],
        outputs: [result.output]
      });
    });

    setStates(newStates);
  };

  useEffect(() => {
    processSequence();
  }, [sequence]);

  // Draw RNN visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || states.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = 1000;
    const canvasHeight = 400;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const cellWidth = 150;
    const cellHeight = 100;
    const spacing = 50;
    const startX = 50;
    const centerY = canvasHeight / 2;

    // Draw time steps
    sequence.forEach((input, t) => {
      const x = startX + t * (cellWidth + spacing);
      const isActive = t <= currentStep;
      const isCurrent = t === currentStep;

      // Draw RNN cell
      ctx.fillStyle = isCurrent ? "#fef3c7" : isActive ? "#e0e7ff" : "#f3f4f6";
      ctx.fillRect(x, centerY - cellHeight / 2, cellWidth, cellHeight);
      ctx.strokeStyle = isCurrent ? "#f59e0b" : isActive ? "#6366f1" : "#d1d5db";
      ctx.lineWidth = isCurrent ? 3 : 2;
      ctx.strokeRect(x, centerY - cellHeight / 2, cellWidth, cellHeight);

      // RNN label
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("RNN", x + cellWidth / 2, centerY);

      // Input arrow and value
      ctx.strokeStyle = isActive ? "#10b981" : "#d1d5db";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + cellWidth / 2, centerY - cellHeight / 2 - 40);
      ctx.lineTo(x + cellWidth / 2, centerY - cellHeight / 2);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(x + cellWidth / 2, centerY - cellHeight / 2);
      ctx.lineTo(x + cellWidth / 2 - 5, centerY - cellHeight / 2 - 8);
      ctx.moveTo(x + cellWidth / 2, centerY - cellHeight / 2);
      ctx.lineTo(x + cellWidth / 2 + 5, centerY - cellHeight / 2 - 8);
      ctx.stroke();

      // Input value
      ctx.fillStyle = isActive ? "#10b981" : "#9ca3af";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`x${t}=${input.toFixed(2)}`, x + cellWidth / 2, centerY - cellHeight / 2 - 50);

      // Output arrow and value
      if (isActive && states[t]) {
        ctx.strokeStyle = "#8b5cf6";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + cellWidth / 2, centerY + cellHeight / 2);
        ctx.lineTo(x + cellWidth / 2, centerY + cellHeight / 2 + 40);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(x + cellWidth / 2, centerY + cellHeight / 2 + 40);
        ctx.lineTo(x + cellWidth / 2 - 5, centerY + cellHeight / 2 + 32);
        ctx.moveTo(x + cellWidth / 2, centerY + cellHeight / 2 + 40);
        ctx.lineTo(x + cellWidth / 2 + 5, centerY + cellHeight / 2 + 32);
        ctx.stroke();

        // Output value
        ctx.fillStyle = "#8b5cf6";
        ctx.font = "12px monospace";
        ctx.fillText(`y${t}=${states[t].outputs[0].toFixed(2)}`, x + cellWidth / 2, centerY + cellHeight / 2 + 60);
      }

      // Hidden state connection to next cell
      if (t < sequence.length - 1) {
        const nextX = x + cellWidth + spacing;
        ctx.strokeStyle = isActive && t < currentStep ? "#ef4444" : "#d1d5db";
        ctx.lineWidth = isActive && t < currentStep ? 3 : 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x + cellWidth, centerY);
        ctx.lineTo(nextX, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(nextX, centerY);
        ctx.lineTo(nextX - 8, centerY - 5);
        ctx.moveTo(nextX, centerY);
        ctx.lineTo(nextX - 8, centerY + 5);
        ctx.stroke();

        // Hidden state label
        if (isActive && states[t]) {
          ctx.fillStyle = "#ef4444";
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`h${t}`, x + cellWidth + spacing / 2, centerY - 10);
        }
      }

      // Time step label
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`t=${t}`, x + cellWidth / 2, centerY + cellHeight / 2 + 85);
    });

  }, [states, currentStep, sequence]);

  const animate = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(0);

    for (let i = 0; i <= sequence.length - 1; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsAnimating(false);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const updateSequenceValue = (idx: number, value: number) => {
    const newSeq = [...sequence];
    newSeq[idx] = value;
    setSequence(newSeq);
    setCurrentStep(0);
  };

  return (
    <div className="space-y-6">
      {/* Info Panel */}
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-900">
            <p className="font-semibold mb-1">RNN - Procesamiento Secuencial</p>
            <p className="text-indigo-800">
              Las RNNs procesan secuencias paso a paso, manteniendo un estado oculto (h) que
              actúa como "memoria". Cada paso toma el input actual (x) y el estado anterior (h_{"{t-1}"}),
              produciendo un nuevo estado (h_t) y output (y_t).
            </p>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 overflow-x-auto">
        <h3 className="font-bold text-gray-800 mb-4">Unrolled RNN a través del tiempo</h3>
        <canvas
          ref={canvasRef}
          width={1000}
          height={400}
          className="w-full"
        />
      </div>

      {/* Sequence Input */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Secuencia de Entrada</h3>
        <div className="grid grid-cols-5 gap-4">
          {sequence.map((val, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                x{idx} (t={idx})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={val}
                onChange={(e) => updateSequenceValue(idx, parseFloat(e.target.value))}
                className="w-full"
                disabled={isAnimating}
              />
              <div className="text-center font-mono text-sm text-gray-600">
                {val.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={animate}
          disabled={isAnimating}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            isAnimating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
          }`}
        >
          <Play className="w-5 h-5" />
          {isAnimating ? 'Procesando...' : 'Procesar Secuencia'}
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

      {/* Hidden States Display */}
      {states.length > 0 && currentStep > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6"
        >
          <h3 className="font-bold text-gray-800 mb-4">
            Estado Oculto en t={currentStep}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {states[currentStep].hiddenState.map((val, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-600 mb-1">h{currentStep}[{idx}]</div>
                <div className="text-2xl font-bold text-red-900 font-mono">
                  {val.toFixed(3)}
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${(val + 1) * 50}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* RNN Equations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Ecuaciones de RNN</h3>
        <div className="space-y-4 text-sm">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="font-semibold text-purple-900 mb-2">Estado Oculto (Hidden State)</div>
            <div className="font-mono text-purple-800 bg-white p-2 rounded">
              h_t = tanh(W_xh * x_t + W_hh * h_{"{t-1}"} + b_h)
            </div>
            <div className="text-xs text-purple-700 mt-2">
              Combina input actual con estado anterior
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-semibold text-blue-900 mb-2">Output</div>
            <div className="font-mono text-blue-800 bg-white p-2 rounded">
              y_t = W_hy * h_t + b_y
            </div>
            <div className="text-xs text-blue-700 mt-2">
              Proyección del estado oculto al espacio de salida
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
          <h3 className="font-bold text-green-900 mb-3">Casos de Uso - RNNs</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>Procesamiento de Lenguaje:</strong> Traducción, sentiment analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>Series Temporales:</strong> Predicción de stock, clima</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>Generación de Texto:</strong> Autocompletado, chatbots</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>Reconocimiento de Voz:</strong> Speech-to-text</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
          <h3 className="font-bold text-orange-900 mb-3">Variantes Avanzadas</h3>
          <ul className="space-y-2 text-sm text-orange-800">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>LSTM:</strong> Long Short-Term Memory - memoria a largo plazo</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>GRU:</strong> Gated Recurrent Unit - versión simplificada de LSTM</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>Bidirectional RNN:</strong> Procesa secuencia en ambas direcciones</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>Seq2Seq:</strong> Encoder-Decoder para traducción</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (PyTorch):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import torch
import torch.nn as nn

# RNN simple
class SimpleRNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.hidden_size = hidden_size
        self.rnn = nn.RNN(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        # x shape: (batch, sequence_length, input_size)
        # h0: initial hidden state
        h0 = torch.zeros(1, x.size(0), self.hidden_size)

        # Forward propagate RNN
        out, hn = self.rnn(x, h0)  # out: (batch, seq, hidden)

        # Decode the last hidden state
        out = self.fc(out[:, -1, :])  # Take last time step
        return out

# Uso
model = SimpleRNN(input_size=10, hidden_size=20, output_size=1)
sequence = torch.randn(32, 5, 10)  # batch=32, seq_len=5, features=10
output = model(sequence)
print(f"Output shape: {output.shape}")  # [32, 1]

# LSTM (más común en práctica)
lstm = nn.LSTM(input_size=10, hidden_size=20, num_layers=2, batch_first=True)
output, (hn, cn) = lstm(sequence)  # cn: cell state`}
        </pre>
      </div>
    </div>
  );
}
