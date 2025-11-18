"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Dices, RotateCcw, TrendingUp } from "lucide-react";

export default function ProbabilitySimulator() {
  const [coinFlips, setCoinFlips] = useState(0);
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentFlip, setCurrentFlip] = useState<"heads" | "tails" | null>(null);
  const [diceRolls, setDiceRolls] = useState(0);
  const [diceResults, setDiceResults] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [currentDice, setCurrentDice] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<"coin" | "dice">("coin");

  const flipCoin = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    const result = Math.random() < 0.5 ? "heads" : "tails";

    // Animación de giro
    setTimeout(() => {
      setCurrentFlip(result);
      if (result === "heads") {
        setHeads((prev) => prev + 1);
      } else {
        setTails((prev) => prev + 1);
      }
      setCoinFlips((prev) => prev + 1);
      setIsFlipping(false);
    }, 500);
  };

  const flip10Coins = () => {
    if (isFlipping) return;

    for (let i = 0; i < 10; i++) {
      setTimeout(() => flipCoin(), i * 600);
    }
  };

  const rollDice = () => {
    const result = Math.floor(Math.random() * 6) + 1;
    setCurrentDice(result);
    setDiceResults((prev) => {
      const newResults = [...prev];
      newResults[result - 1]++;
      return newResults;
    });
    setDiceRolls((prev) => prev + 1);
  };

  const roll10Dice = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => rollDice(), i * 300);
    }
  };

  const reset = () => {
    setCoinFlips(0);
    setHeads(0);
    setTails(0);
    setCurrentFlip(null);
    setDiceRolls(0);
    setDiceResults([0, 0, 0, 0, 0, 0]);
    setCurrentDice(null);
  };

  const headsPercentage = coinFlips > 0 ? (heads / coinFlips) * 100 : 50;
  const tailsPercentage = coinFlips > 0 ? (tails / coinFlips) * 100 : 50;

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex gap-2 p-2 glass-effect rounded-xl w-fit">
        <TabButton
          label="🪙 Moneda"
          active={selectedTab === "coin"}
          onClick={() => setSelectedTab("coin")}
        />
        <TabButton
          label="🎲 Dado"
          active={selectedTab === "dice"}
          onClick={() => setSelectedTab("dice")}
        />
      </div>

      {/* Coin Simulator */}
      {selectedTab === "coin" && (
        <div className="glass-effect p-8 rounded-2xl space-y-6">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-2">
              Simulador de Lanzamiento de Moneda
            </h3>
            <p className="text-gray-600">
              Lanza una moneda múltiples veces y observa cómo la probabilidad
              converge a 50% para cada resultado.
            </p>
          </div>

          {/* Coin Animation */}
          <div className="flex justify-center py-8">
            <motion.div
              animate={
                isFlipping
                  ? {
                      rotateY: [0, 1080],
                      scale: [1, 1.2, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl ${
                currentFlip === "heads"
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900"
                  : currentFlip === "tails"
                  ? "bg-gradient-to-br from-gray-400 to-gray-600 text-gray-900"
                  : "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
              }`}
            >
              {currentFlip === "heads" ? "👑" : currentFlip === "tails" ? "⚡" : "?"}
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard
              label="Total Lanzamientos"
              value={coinFlips}
              color="from-blue-500 to-cyan-500"
              icon="🔢"
            />
            <StatCard
              label="Caras (👑)"
              value={heads}
              subtitle={`${headsPercentage.toFixed(1)}%`}
              color="from-yellow-500 to-orange-500"
              icon="👑"
            />
            <StatCard
              label="Cruces (⚡)"
              value={tails}
              subtitle={`${tailsPercentage.toFixed(1)}%`}
              color="from-gray-500 to-gray-700"
              icon="⚡"
            />
          </div>

          {/* Probability Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Caras</span>
                <span className="text-sm font-bold gradient-text">
                  {headsPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "50%" }}
                  animate={{ width: `${headsPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Cruces</span>
                <span className="text-sm font-bold gradient-text">
                  {tailsPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "50%" }}
                  animate={{ width: `${tailsPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-gray-400 to-gray-600"
                />
              </div>
            </div>

            {/* Expected Line */}
            <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <div className="w-8 h-0.5 bg-red-500 border-t-2 border-dashed border-red-500"></div>
              <span>50% (esperado)</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={flipCoin}
              disabled={isFlipping}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanzar 1 vez
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={flip10Coins}
              disabled={isFlipping}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanzar 10 veces
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Reiniciar
            </motion.button>
          </div>

          {/* Insight */}
          {coinFlips >= 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border-2 border-green-500 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <strong className="text-green-800">
                    ¡Ley de los Grandes Números!
                  </strong>
                  <p>
                    Con {coinFlips} lanzamientos, las probabilidades están convergiendo
                    hacia el 50% esperado. Cuantos más lanzamientos, más cerca
                    estaremos del valor teórico.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Dice Simulator */}
      {selectedTab === "dice" && (
        <div className="glass-effect p-8 rounded-2xl space-y-6">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-2">
              Simulador de Lanzamiento de Dado
            </h3>
            <p className="text-gray-600">
              Lanza un dado y observa la distribución de resultados. Cada cara
              debería aparecer aproximadamente 16.67% de las veces.
            </p>
          </div>

          {/* Dice Display */}
          <div className="flex justify-center py-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <span className="text-6xl">{currentDice || "?"}</span>
            </motion.div>
          </div>

          {/* Dice Distribution Chart */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((face) => {
              const count = diceResults[face - 1];
              const percentage = diceRolls > 0 ? (count / diceRolls) * 100 : 0;
              const maxCount = Math.max(...diceResults);

              return (
                <div key={face}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Cara {face}: {count} veces
                    </span>
                    <span className="text-sm font-bold gradient-text">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-lg overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage * 6}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full bg-gradient-to-r ${
                        count === maxCount && count > 0
                          ? "from-green-500 to-emerald-500"
                          : "from-blue-500 to-purple-500"
                      }`}
                    />
                    {/* Expected line at 16.67% */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 border-l-2 border-dashed"
                      style={{ left: "16.67%" }}
                    ></div>
                  </div>
                </div>
              );
            })}

            <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2 pt-2">
              <div className="w-8 h-0.5 bg-red-500 border-t-2 border-dashed border-red-500"></div>
              <span>16.67% (esperado para cada cara)</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <StatCard
              label="Total Lanzamientos"
              value={diceRolls}
              color="from-blue-500 to-cyan-500"
              icon="🎲"
            />
            <StatCard
              label="Promedio"
              value={diceRolls > 0
                ? (diceResults.reduce((sum, count, idx) => sum + count * (idx + 1), 0) / diceRolls).toFixed(2)
                : "0.00"
              }
              subtitle="Esperado: 3.50"
              color="from-purple-500 to-pink-500"
              icon="📊"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={rollDice}
              className="btn-primary"
            >
              <Dices className="w-5 h-5 inline mr-2" />
              Lanzar 1 vez
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={roll10Dice}
              className="btn-secondary"
            >
              Lanzar 10 veces
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Reiniciar
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
        active
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </motion.button>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  color,
  icon,
}: {
  label: string;
  value: number | string;
  subtitle?: string;
  color: string;
  icon: string;
}) {
  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${color} text-white`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold opacity-90">{label}</span>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && <div className="text-sm opacity-80 mt-1">{subtitle}</div>}
    </div>
  );
}
