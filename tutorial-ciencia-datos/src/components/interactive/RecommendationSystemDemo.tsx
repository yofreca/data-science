"use client";

import { useState } from "motion/react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, Film, Info } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  genres: string[];
  year: number;
  rating: number;
};

export default function RecommendationSystemDemo() {
  const movies: Movie[] = [
    { id: 1, title: "Matrix", genres: ["Sci-Fi", "Action"], year: 1999, rating: 8.7 },
    { id: 2, title: "Inception", genres: ["Sci-Fi", "Thriller"], year: 2010, rating: 8.8 },
    { id: 3, title: "Interstellar", genres: ["Sci-Fi", "Drama"], year: 2014, rating: 8.6 },
    { id: 4, title: "The Dark Knight", genres: ["Action", "Crime"], year: 2008, rating: 9.0 },
    { id: 5, title: "Pulp Fiction", genres: ["Crime", "Drama"], year: 1994, rating: 8.9 },
    { id: 6, title: "Fight Club", genres: ["Drama", "Thriller"], year: 1999, rating: 8.8 },
    { id: 7, title: "Forrest Gump", genres: ["Drama", "Romance"], year: 1994, rating: 8.8 },
    { id: 8, title: "The Shawshank Redemption", genres: ["Drama"], year: 1994, rating: 9.3 },
    { id: 9, title: "Gladiator", genres: ["Action", "Drama"], year: 2000, rating: 8.5 },
    { id: 10, title: "The Prestige", genres: ["Drama", "Mystery", "Thriller"], year: 2006, rating: 8.5 },
    { id: 11, title: "Blade Runner 2049", genres: ["Sci-Fi", "Thriller"], year: 2017, rating: 8.0 },
    { id: 12, title: "The Godfather", genres: ["Crime", "Drama"], year: 1972, rating: 9.2 },
    { id: 13, title: "Titanic", genres: ["Drama", "Romance"], year: 1997, rating: 7.9 },
    { id: 14, title: "Die Hard", genres: ["Action", "Thriller"], year: 1988, rating: 8.2 },
    { id: 15, title: "The Silence of the Lambs", genres: ["Crime", "Thriller"], year: 1991, rating: 8.6 }
  ];

  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [recommendations, setRecommendations] = useState<Array<{ movie: Movie; score: number }>>([]);

  // Calculate cosine similarity based on genres
  const calculateSimilarity = (movie1: Movie, movie2: Movie): number => {
    const allGenres = Array.from(new Set([...movie1.genres, ...movie2.genres]));

    const vector1 = allGenres.map(genre => movie1.genres.includes(genre) ? 1 : 0);
    const vector2 = allGenres.map(genre => movie2.genres.includes(genre) ? 1 : 0);

    const dotProduct = vector1.reduce((sum, val, idx) => sum + val * vector2[idx], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitude1 * magnitude2);
  };

  const generateRecommendations = () => {
    if (likedMovies.length === 0) {
      setRecommendations([]);
      return;
    }

    const liked = movies.filter(m => likedMovies.includes(m.id));
    const candidates = movies.filter(m => !likedMovies.includes(m.id));

    // Calculate average similarity to all liked movies
    const scored = candidates.map(candidate => {
      const similarities = liked.map(likedMovie =>
        calculateSimilarity(candidate, likedMovie)
      );
      const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;

      return { movie: candidate, score: avgSimilarity };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    setRecommendations(scored.slice(0, 5));
  };

  const toggleLike = (movieId: number) => {
    if (likedMovies.includes(movieId)) {
      setLikedMovies(likedMovies.filter(id => id !== movieId));
    } else {
      setLikedMovies([...likedMovies, movieId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Panel */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-900">
            <p className="font-semibold mb-1">Sistema de Recomendación Basado en Contenido</p>
            <p className="text-purple-800">
              Selecciona películas que te gustan y el sistema recomendará películas similares
              basándose en la similitud de géneros usando similitud de coseno.
            </p>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Film className="w-5 h-5" />
          Catálogo de Películas - Selecciona tus favoritas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => {
            const isLiked = likedMovies.includes(movie.id);
            return (
              <motion.div
                key={movie.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-purple-50 border-purple-500 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => toggleLike(movie.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{movie.title}</h4>
                    <p className="text-xs text-gray-500">{movie.year}</p>
                  </div>
                  <div className={`p-2 rounded-full transition-all ${
                    isLiked ? 'bg-purple-500' : 'bg-gray-200'
                  }`}>
                    <ThumbsUp className={`w-4 h-4 ${
                      isLiked ? 'text-white' : 'text-gray-500'
                    }`} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {movie.genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700">{movie.rating}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={generateRecommendations}
          disabled={likedMovies.length === 0}
          className={`px-8 py-4 rounded-lg font-semibold transition-all ${
            likedMovies.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          Generar Recomendaciones ({likedMovies.length} películas seleccionadas)
        </button>
      </div>

      {/* Recommendations */}
      <AnimatePresence>
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6"
          >
            <h3 className="font-bold text-gray-800 mb-4 text-xl">
              Top 5 Recomendaciones Para Ti
            </h3>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <motion.div
                  key={rec.movie.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold text-purple-600">#{idx + 1}</span>
                        <h4 className="font-semibold text-gray-800 text-lg">{rec.movie.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{rec.movie.year}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {rec.movie.genres.map((genre, gIdx) => (
                          <span
                            key={gIdx}
                            className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-gray-700">{rec.movie.rating}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">Similitud:</span>{" "}
                          <span className="font-mono text-purple-700">{(rec.score * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {(rec.score * 100).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it Works */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Cómo Funciona</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="bg-blue-50 p-3 rounded">
            <div className="font-semibold text-blue-900 mb-1">1. Vectorización de Géneros</div>
            <div className="text-blue-800">
              Cada película se representa como un vector binario donde 1 = tiene el género, 0 = no tiene.
              Ejemplo: Matrix [1,1,0,0,0] para Sci-Fi=1, Action=1, Drama=0, etc.
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <div className="font-semibold text-purple-900 mb-1">2. Similitud de Coseno</div>
            <div className="text-purple-800">
              Se calcula el coseno del ángulo entre vectores: cos(θ) = (A·B) / (||A|| ||B||).
              Valores cercanos a 1 = muy similar, cercanos a 0 = muy diferente.
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="font-semibold text-green-900 mb-1">3. Promedio de Similitudes</div>
            <div className="text-green-800">
              Para cada película candidata, se calcula la similitud promedio con todas
              tus películas favoritas, priorizando las más similares.
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {likedMovies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-sm text-purple-700 font-semibold">Películas Gustadas</div>
            <div className="text-2xl font-bold text-purple-900">{likedMovies.length}</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg">
            <div className="text-sm text-pink-700 font-semibold">Candidatas</div>
            <div className="text-2xl font-bold text-pink-900">{movies.length - likedMovies.length}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-sm text-blue-700 font-semibold">Géneros Únicos</div>
            <div className="text-2xl font-bold text-blue-900">
              {new Set(movies.flatMap(m => m.genres)).size}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-sm text-green-700 font-semibold">Rating Promedio</div>
            <div className="text-2xl font-bold text-green-900">
              {(movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1)}
            </div>
          </div>
        </div>
      )}

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (Scikit-learn):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Dataset de películas
movies = pd.DataFrame({
    'title': ['Matrix', 'Inception', 'Interstellar', ...],
    'genres': ['Sci-Fi Action', 'Sci-Fi Thriller', 'Sci-Fi Drama', ...]
})

# Vectorizar géneros
cv = CountVectorizer()
count_matrix = cv.fit_transform(movies['genres'])

# Calcular matriz de similitud
cosine_sim = cosine_similarity(count_matrix, count_matrix)

# Función de recomendación
def get_recommendations(title, n=5):
    idx = movies[movies['title'] == title].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:n+1]  # Excluir la misma película
    movie_indices = [i[0] for i in sim_scores]
    return movies['title'].iloc[movie_indices]

# Obtener recomendaciones
recommendations = get_recommendations('Matrix', n=5)
print(recommendations)

# Sistema colaborativo (basado en usuarios)
# Requiere matriz de ratings usuario-película
from sklearn.neighbors import NearestNeighbors

# ratings: matriz usuarios x películas
knn = NearestNeighbors(metric='cosine', algorithm='brute')
knn.fit(ratings)
distances, indices = knn.kneighbors(user_profile, n_neighbors=5)`}
        </pre>
      </div>
    </div>
  );
}
