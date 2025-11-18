"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AnimatedHero() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Visual", "Interactivo", "Divertido", "Completo"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">Aprende</span>
            <br />
            <span className="text-gray-800">Ciencia de Datos</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-16"
        >
          <p className="text-2xl md:text-3xl text-gray-700">
            De forma{" "}
            <motion.span
              key={currentWord}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="font-bold gradient-text inline-block"
            >
              {words[currentWord]}
            </motion.span>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Domina matemáticas, estadística, programación y machine learning con
          visualizaciones animadas y ejercicios interactivos
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            Comenzar Gratis
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
          >
            Ver Demo
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </motion.div>
      </div>

      {/* Floating Data Icons */}
      <FloatingIcon
        delay={0}
        emoji="📊"
        initialX={100}
        initialY={100}
      />
      <FloatingIcon
        delay={0.5}
        emoji="🤖"
        initialX={-100}
        initialY={200}
      />
      <FloatingIcon
        delay={1}
        emoji="📈"
        initialX={150}
        initialY={300}
      />
      <FloatingIcon
        delay={1.5}
        emoji="🧮"
        initialX={-150}
        initialY={400}
      />
    </section>
  );
}

function FloatingIcon({ delay, emoji, initialX, initialY }: { delay: number; emoji: string; initialX: number; initialY: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: initialY }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [initialY, initialY - 100, initialY - 200, initialY - 300],
        x: [initialX, initialX + 20, initialX - 20, initialX],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute text-4xl pointer-events-none"
    >
      {emoji}
    </motion.div>
  );
}
