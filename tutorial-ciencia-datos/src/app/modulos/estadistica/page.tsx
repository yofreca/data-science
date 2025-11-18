"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BarChart3, TrendingUp, Target, Zap } from "lucide-react";
import Link from "next/link";
import DistributionVisualizer from "@/components/interactive/DistributionVisualizer";
import DescriptiveStatsDemo from "@/components/interactive/DescriptiveStatsDemo";
import ConfidenceIntervalDemo from "@/components/interactive/ConfidenceIntervalDemo";
import HypothesisTestingDemo from "@/components/interactive/HypothesisTestingDemo";
import CentralLimitTheoremDemo from "@/components/interactive/CentralLimitTheoremDemo";
import InteractiveQuiz from "@/components/interactive/InteractiveQuiz";

export default function EstadisticaPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <Link href="/modulos">
          <motion.div
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver a Módulos</span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              Módulo 3: Estadística Fundamental
            </h1>
            <p className="text-gray-600 mt-2">
              Estadística descriptiva, inferencial y pruebas de hipótesis de forma visual
            </p>
          </div>
        </div>
      </motion.div>

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-effect p-6 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ¿Por qué Estadística en Data Science?
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          La estadística es el corazón de la ciencia de datos. Nos permite tomar muestras
          del mundo real y hacer inferencias sobre poblaciones completas. Sin estadística,
          no podríamos validar nuestros modelos ni cuantificar la incertidumbre.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <InfoCard
            emoji="📊"
            title="Describir Datos"
            description="Resúmenes numéricos: media, mediana, desviación"
          />
          <InfoCard
            emoji="🎯"
            title="Inferir Poblaciones"
            description="De muestras pequeñas a conclusiones generales"
          />
          <InfoCard
            emoji="✅"
            title="Validar Hipótesis"
            description="Decisiones basadas en evidencia estadística"
          />
        </div>
      </motion.div>

      {/* Section 1: Estadística Descriptiva */}
      <Section
        title="Estadística Descriptiva"
        icon={BarChart3}
        color="from-blue-500 to-cyan-500"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Resumir Datos con Números
            </h3>
            <p className="text-gray-700 leading-relaxed">
              La estadística descriptiva nos permite resumir grandes cantidades de datos
              con unas pocas métricas clave: tendencia central (media, mediana, moda),
              dispersión (desviación estándar, rango), y forma de la distribución.
            </p>
          </motion.div>

          <DescriptiveStatsDemo />
        </div>
      </Section>

      {/* Section 2: Distribuciones */}
      <Section
        title="Distribuciones de Probabilidad"
        icon={TrendingUp}
        color="from-purple-500 to-pink-500"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Distribuciones Comunes
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Las distribuciones de probabilidad modelan cómo se distribuyen los datos.
              La distribución normal es la más importante en estadística y aparece
              naturalmente en muchos fenómenos.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoCard
                emoji="🔔"
                title="Normal (Gaussiana)"
                description="Curva de campana - la más común en naturaleza"
              />
              <InfoCard
                emoji="🎲"
                title="Binomial"
                description="Éxitos/fracasos en n intentos"
              />
            </div>
          </motion.div>

          <DistributionVisualizer />
        </div>
      </Section>

      {/* Section 3: Teorema del Límite Central */}
      <Section
        title="Teorema del Límite Central"
        icon={Zap}
        color="from-orange-500 to-red-500"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              El Teorema Más Importante
            </h3>
            <p className="text-gray-700 leading-relaxed">
              El Teorema del Límite Central (CLT) dice que las medias de muestras aleatorias
              siguen una distribución normal, sin importar la distribución original de los datos.
              Esto es la base de la inferencia estadística.
            </p>
          </motion.div>

          <CentralLimitTheoremDemo />
        </div>
      </Section>

      {/* Section 4: Intervalos de Confianza */}
      <Section
        title="Intervalos de Confianza"
        icon={Target}
        color="from-green-500 to-emerald-500"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Cuantificar la Incertidumbre
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Un intervalo de confianza nos da un rango donde creemos que está el
              parámetro poblacional verdadero. Por ejemplo: "Estamos 95% seguros de que
              la media está entre 45 y 55".
            </p>
          </motion.div>

          <ConfidenceIntervalDemo />
        </div>
      </Section>

      {/* Section 5: Pruebas de Hipótesis */}
      <Section
        title="Pruebas de Hipótesis"
        icon={Target}
        color="from-pink-500 to-rose-500"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Decisiones Basadas en Datos
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Las pruebas de hipótesis nos permiten tomar decisiones formales:
              ¿Este medicamento funciona? ¿Esta campaña aumentó las ventas?
              Usamos p-valores para cuantificar la evidencia.
            </p>
          </motion.div>

          <HypothesisTestingDemo />
        </div>
      </Section>

      {/* Quiz */}
      <Section
        title="Evalúa tu Conocimiento"
        icon={BarChart3}
        color="from-indigo-500 to-purple-500"
      >
        <InteractiveQuiz
          questions={[
            {
              question: "¿Cuál es la diferencia entre media y mediana?",
              options: [
                "Son lo mismo",
                "La media es sensible a outliers, la mediana no",
                "La mediana es sensible a outliers, la media no",
                "Solo se usan en diferentes países"
              ],
              correctAnswer: 1,
              explanation: "La media (promedio) se ve afectada por valores extremos (outliers), mientras que la mediana es más robusta y representa el valor central."
            },
            {
              question: "¿Qué nos dice el Teorema del Límite Central?",
              options: [
                "Todos los datos son normales",
                "Las medias de muestras tienden a ser normales",
                "Solo funciona con datos normales",
                "Los datos pequeños son mejores"
              ],
              correctAnswer: 1,
              explanation: "El CLT establece que las medias de muestras aleatorias siguen una distribución normal, sin importar la distribución original de los datos."
            },
            {
              question: "¿Qué significa un intervalo de confianza del 95%?",
              options: [
                "95% de los datos están en ese rango",
                "Si repetimos el experimento 100 veces, 95 intervalos contendrán el parámetro verdadero",
                "Estamos 95% seguros de todo",
                "El 95% de las muestras son correctas"
              ],
              correctAnswer: 1,
              explanation: "Un IC del 95% significa que si repetimos el muestreo muchas veces, aproximadamente el 95% de los intervalos calculados contendrán el parámetro poblacional verdadero."
            },
            {
              question: "¿Qué es un p-valor?",
              options: [
                "La probabilidad de que nuestra hipótesis sea verdadera",
                "La probabilidad de obtener resultados tan extremos si H0 es cierta",
                "El valor promedio de la población",
                "La diferencia entre dos grupos"
              ],
              correctAnswer: 1,
              explanation: "El p-valor es la probabilidad de obtener resultados tan extremos como los observados, asumiendo que la hipótesis nula es verdadera."
            },
            {
              question: "¿Cuándo usamos la desviación estándar vs el rango?",
              options: [
                "Son intercambiables",
                "Desviación estándar usa todos los datos, rango solo min y max",
                "Rango es mejor siempre",
                "Depende del idioma"
              ],
              correctAnswer: 1,
              explanation: "La desviación estándar considera todos los datos y es más informativa. El rango solo usa el mínimo y máximo, ignorando la distribución de valores intermedios."
            }
          ]}
        />
      </Section>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-effect p-8 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🎓 Resumen del Módulo
        </h3>
        <div className="space-y-3 text-gray-700">
          <p>✅ <strong>Estadística Descriptiva:</strong> Media, mediana, moda, desviación estándar</p>
          <p>✅ <strong>Distribuciones:</strong> Normal, binomial, uniforme</p>
          <p>✅ <strong>Teorema del Límite Central:</strong> Fundamento de la inferencia</p>
          <p>✅ <strong>Intervalos de Confianza:</strong> Cuantificar incertidumbre</p>
          <p>✅ <strong>Pruebas de Hipótesis:</strong> Decisiones basadas en evidencia</p>
          <p className="mt-4 text-sm italic">
            Ahora entiendes cómo hacer inferencias válidas sobre poblaciones usando muestras.
            ¡Estás listo para aplicar esto en machine learning!
          </p>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-between items-center pt-12 border-t border-gray-200"
      >
        <Link href="/modulos/matematicas">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Anterior: Matemáticas
          </motion.button>
        </Link>

        <Link href="/modulos/programacion">
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 btn-primary"
          >
            Siguiente: Programación
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  color,
  children
}: {
  title: string;
  icon: any;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

function InfoCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass-effect p-6 rounded-xl text-center space-y-3 cursor-pointer"
    >
      <div className="text-4xl">{emoji}</div>
      <h4 className="font-bold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
}
