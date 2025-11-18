"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, ThumbsDown, Meh, Sparkles } from "lucide-react";

type Sentiment = "positive" | "negative" | "neutral";

type SampleReview = {
  text: string;
  actualSentiment: Sentiment;
};

export default function SentimentAnalysisDemo() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<{ sentiment: Sentiment; score: number; confidence: number } | null>(null);

  const sampleReviews: SampleReview[] = [
    { text: "Este producto es excelente, superó todas mis expectativas. Lo recomiendo totalmente!", actualSentiment: "positive" },
    { text: "Muy mal servicio, tardaron mucho y el producto llegó dañado. Decepcionante.", actualSentiment: "negative" },
    { text: "El producto está bien, cumple su función pero nada extraordinario.", actualSentiment: "neutral" },
    { text: "Increíble calidad y precio. Muy satisfecho con mi compra. 5 estrellas!", actualSentiment: "positive" },
    { text: "No funciona como esperaba, mala calidad y precio excesivo. No lo compraría de nuevo.", actualSentiment: "negative" }
  ];

  // Simple sentiment analysis using keyword matching
  const analyzeSentiment = (text: string): { sentiment: Sentiment; score: number; confidence: number } => {
    const positiveWords = [
      "excelente", "bueno", "genial", "perfecto", "increíble", "maravilloso",
      "fantástico", "recomiendo", "satisfecho", "calidad", "mejor", "amor", "feliz"
    ];

    const negativeWords = [
      "malo", "pésimo", "horrible", "decepcionante", "terrible", "defectuoso",
      "inútil", "basura", "no funciona", "dañado", "peor", "odio", "triste"
    ];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });

    const totalWords = lowerText.split(/\s+/).length;
    const sentimentWords = positiveCount + negativeCount;
    const confidence = Math.min((sentimentWords / Math.max(totalWords, 1)) * 100, 100);

    let sentiment: Sentiment;
    let score: number;

    if (positiveCount > negativeCount) {
      sentiment = "positive";
      score = positiveCount / Math.max(sentimentWords, 1);
    } else if (negativeCount > positiveCount) {
      sentiment = "negative";
      score = negativeCount / Math.max(sentimentWords, 1);
    } else {
      sentiment = "neutral";
      score = 0.5;
    }

    return {
      sentiment,
      score: score * 100,
      confidence: Math.max(confidence, 30) // Minimum 30% confidence
    };
  };

  const handleAnalyze = () => {
    if (inputText.trim().length < 10) return;
    const analysis = analyzeSentiment(inputText);
    setResult(analysis);
  };

  const useSample = (review: SampleReview) => {
    setInputText(review.text);
    setResult(null);
  };

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive": return { bg: "bg-green-50", border: "border-green-500", text: "text-green-900", icon: ThumbsUp };
      case "negative": return { bg: "bg-red-50", border: "border-red-500", text: "text-red-900", icon: ThumbsDown };
      case "neutral": return { bg: "bg-gray-50", border: "border-gray-500", text: "text-gray-900", icon: Meh };
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Area */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Escribe o selecciona un review
        </h3>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe un review de producto, servicio, etc..."
          className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-gray-500">{inputText.length} caracteres</span>
          <button
            onClick={handleAnalyze}
            disabled={inputText.trim().length < 10}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              inputText.trim().length < 10
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Analizar Sentimiento
            </span>
          </button>
        </div>
      </div>

      {/* Sample Reviews */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Reviews de Ejemplo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleReviews.map((review, idx) => {
            const colors = getSentimentColor(review.actualSentiment);
            return (
              <button
                key={idx}
                onClick={() => useSample(review)}
                className="p-3 rounded-lg border-2 border-gray-200 hover:border-green-400 text-left transition-all"
              >
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{review.text}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} font-semibold`}>
                  {review.actualSentiment === "positive" ? "Positivo" :
                   review.actualSentiment === "negative" ? "Negativo" : "Neutral"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl shadow-lg p-6 border-l-4 ${getSentimentColor(result.sentiment).bg} ${getSentimentColor(result.sentiment).border}`}
        >
          <h3 className="font-bold text-gray-800 mb-4 text-xl">Resultado del Análisis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-3 ${
                result.sentiment === "positive" ? "bg-green-100" :
                result.sentiment === "negative" ? "bg-red-100" : "bg-gray-100"
              }`}>
                {result.sentiment === "positive" && <ThumbsUp className="w-12 h-12 text-green-600" />}
                {result.sentiment === "negative" && <ThumbsDown className="w-12 h-12 text-red-600" />}
                {result.sentiment === "neutral" && <Meh className="w-12 h-12 text-gray-600" />}
              </div>
              <div className="font-bold text-2xl text-gray-800 capitalize">{result.sentiment}</div>
              <div className="text-sm text-gray-600">
                {result.sentiment === "positive" ? "Sentimiento Positivo" :
                 result.sentiment === "negative" ? "Sentimiento Negativo" : "Sentimiento Neutral"}
              </div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {result.score.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600 font-semibold mb-1">Score de Sentimiento</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    result.sentiment === "positive" ? "bg-green-500" :
                    result.sentiment === "negative" ? "bg-red-500" : "bg-gray-500"
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {result.confidence.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 font-semibold mb-1">Confianza</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Explanation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-3">Cómo Funciona</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>1. Tokenización:</strong> El texto se divide en palabras individuales</p>
          <p><strong>2. Diccionario de Sentimientos:</strong> Se comparan palabras contra listas de palabras positivas/negativas</p>
          <p><strong>3. Scoring:</strong> Se cuenta cuántas palabras positivas vs negativas aparecen</p>
          <p><strong>4. Clasificación:</strong> Más positivas = Positivo, más negativas = Negativo, equilibrado = Neutral</p>
          <p><strong>5. Confianza:</strong> Basada en la proporción de palabras de sentimiento encontradas</p>
        </div>
      </div>

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (NLTK + TextBlob):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`from textblob import TextBlob
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Método 1: TextBlob (simple)
def analyze_sentiment_textblob(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1 a 1
    if polarity > 0.1:
        return "positive", polarity
    elif polarity < -0.1:
        return "negative", polarity
    else:
        return "neutral", polarity

# Método 2: VADER (mejor para redes sociales)
sia = SentimentIntensityAnalyzer()

def analyze_sentiment_vader(text):
    scores = sia.polarity_scores(text)
    compound = scores['compound']  # -1 a 1
    if compound >= 0.05:
        return "positive", compound
    elif compound <= -0.05:
        return "negative", compound
    else:
        return "neutral", compound

# Método 3: Machine Learning (más avanzado)
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Entrenar modelo
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', MultinomialNB())
])
pipeline.fit(X_train, y_train)

# Predecir
sentiment = pipeline.predict([text])[0]
probability = pipeline.predict_proba([text])[0]

print(f"Sentiment: {sentiment}, Confidence: {max(probability):.2f}")`}
        </pre>
      </div>
    </div>
  );
}
