"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, XCircle, Lightbulb, RotateCcw, Trophy } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface InteractiveQuizProps {
  questions: Question[];
}

export default function InteractiveQuiz({ questions }: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
    setAnsweredQuestions(new Array(questions.length).fill(false));
  };

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-effect p-8 rounded-2xl text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <Trophy className="w-24 h-24 mx-auto text-yellow-500" />
        </motion.div>

        <h3 className="text-3xl font-bold gradient-text">
          ¡Quiz Completado!
        </h3>

        <div className="space-y-2">
          <p className="text-5xl font-bold text-gray-800">
            {percentage}%
          </p>
          <p className="text-xl text-gray-600">
            {score} de {questions.length} respuestas correctas
          </p>
        </div>

        {percentage === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl"
          >
            <p className="font-bold">¡Perfecto! 🎉</p>
            <p className="text-sm">Has dominado este tema completamente</p>
          </motion.div>
        )}

        {percentage >= 70 && percentage < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl"
          >
            <p className="font-bold">¡Muy bien! 👏</p>
            <p className="text-sm">Tienes un buen entendimiento del tema</p>
          </motion.div>
        )}

        {percentage < 70 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl"
          >
            <p className="font-bold">Sigue practicando 💪</p>
            <p className="text-sm">Revisa el contenido y vuelve a intentarlo</p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="flex items-center gap-2 btn-primary mx-auto"
        >
          <RotateCcw className="w-5 h-5" />
          Reintentar Quiz
        </motion.button>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="glass-effect p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Pregunta {currentQuestion + 1} de {questions.length}
          </span>
          <span className="text-sm font-bold gradient-text">
            Puntuación: {score}/{answeredQuestions.filter(Boolean).length}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="glass-effect p-8 rounded-2xl space-y-6"
        >
          <h3 className="text-2xl font-bold text-gray-800">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctAnswer;
              const showCorrect = showExplanation && isCorrectOption;
              const showIncorrect = showExplanation && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  whileHover={selectedAnswer === null ? { scale: 1.02, x: 5 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerClick(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    showCorrect
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : showIncorrect
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                      : isSelected
                      ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
                      : "glass-effect text-gray-700 hover:bg-gray-50"
                  } ${selectedAnswer !== null ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <CheckCircle2 className="w-6 h-6" />}
                    {showIncorrect && <XCircle className="w-6 h-6" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 rounded-xl ${
                  isCorrect
                    ? "bg-green-50 border-2 border-green-500"
                    : "bg-red-50 border-2 border-red-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className={`w-6 h-6 mt-1 ${isCorrect ? "text-green-600" : "text-red-600"}`} />
                  <div>
                    <h4 className={`font-bold mb-2 ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                      {isCorrect ? "¡Correcto! 🎉" : "Incorrecto 😔"}
                    </h4>
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="btn-primary"
              >
                {currentQuestion < questions.length - 1 ? "Siguiente Pregunta →" : "Ver Resultados"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
