"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart3, Database, Cpu, Microscope } from "lucide-react";

const roles = [
  {
    id: 1,
    title: "Data Analyst",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-500",
    description: "Analiza datos para generar insights de negocio",
    skills: {
      "SQL": 90,
      "Excel/BI Tools": 95,
      "Python/R": 70,
      "Estadística": 75,
      "Visualización": 90,
      "Machine Learning": 30,
    },
    responsibilities: [
      "Crear dashboards y reportes",
      "Análisis de KPIs",
      "Visualización de datos",
      "Consultas SQL"
    ],
    tools: ["Excel", "Tableau", "Power BI", "SQL", "Python"]
  },
  {
    id: 2,
    title: "Data Engineer",
    icon: Database,
    color: "from-purple-500 to-pink-500",
    description: "Construye y mantiene la infraestructura de datos",
    skills: {
      "SQL": 95,
      "Programación": 90,
      "Big Data": 85,
      "Cloud": 80,
      "ETL/Pipelines": 95,
      "Machine Learning": 40,
    },
    responsibilities: [
      "Construir data pipelines",
      "Mantener bases de datos",
      "Optimizar consultas",
      "Arquitectura de datos"
    ],
    tools: ["Spark", "Airflow", "Kafka", "AWS/GCP", "Docker"]
  },
  {
    id: 3,
    title: "Data Scientist",
    icon: Microscope,
    color: "from-green-500 to-emerald-500",
    description: "Crea modelos predictivos y análisis avanzados",
    skills: {
      "Python/R": 95,
      "Machine Learning": 90,
      "Estadística": 95,
      "Matemáticas": 85,
      "Visualización": 80,
      "SQL": 75,
    },
    responsibilities: [
      "Crear modelos ML",
      "Análisis exploratorio",
      "Experimentos A/B",
      "Feature engineering"
    ],
    tools: ["Python", "Scikit-learn", "TensorFlow", "Jupyter", "R"]
  },
  {
    id: 4,
    title: "ML Engineer",
    icon: Cpu,
    color: "from-orange-500 to-red-500",
    description: "Despliega y escala modelos de ML en producción",
    skills: {
      "Programación": 95,
      "Machine Learning": 85,
      "DevOps": 90,
      "Cloud": 90,
      "Software Engineering": 95,
      "Estadística": 70,
    },
    responsibilities: [
      "Deploy de modelos",
      "MLOps y CI/CD",
      "Optimización de modelos",
      "Monitoreo en producción"
    ],
    tools: ["Docker", "Kubernetes", "MLflow", "FastAPI", "PyTorch"]
  }
];

export default function RolesComparison() {
  const [selectedRole, setSelectedRole] = useState(0);

  return (
    <div className="space-y-8">
      {/* Role Selection */}
      <div className="grid md:grid-cols-4 gap-4">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedRole(index)}
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-2xl transition-all ${
                  selectedRole === index
                    ? `bg-gradient-to-br ${role.color} text-white shadow-xl`
                    : "glass-effect text-gray-700 hover:shadow-lg"
                }`}
              >
                <Icon className={`w-10 h-10 mb-3 ${selectedRole === index ? "text-white" : "text-gray-600"}`} />
                <h3 className="font-bold text-lg mb-2">{role.title}</h3>
                <p className={`text-sm ${selectedRole === index ? "text-white/90" : "text-gray-600"}`}>
                  {role.description}
                </p>

                {selectedRole === index && (
                  <motion.div
                    layoutId="roleIndicator"
                    className="mt-4 h-1 bg-white rounded-full"
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Role Details */}
      <motion.div
        key={selectedRole}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-effect p-8 rounded-2xl"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Skills */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></span>
              Habilidades Requeridas
            </h3>
            <div className="space-y-4">
              {Object.entries(roles[selectedRole].skills).map(([skill, level]) => (
                <div key={skill}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{skill}</span>
                    <span className="text-sm font-bold gradient-text">{level}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${level}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full bg-gradient-to-r ${roles[selectedRole].color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities & Tools */}
          <div className="space-y-6">
            {/* Responsibilities */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></span>
                Responsabilidades
              </h3>
              <ul className="space-y-2">
                {roles[selectedRole].responsibilities.map((resp, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${roles[selectedRole].color}`}></span>
                    {resp}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></span>
                Herramientas Principales
              </h3>
              <div className="flex flex-wrap gap-2">
                {roles[selectedRole].tools.map((tool, index) => (
                  <motion.span
                    key={tool}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`px-4 py-2 bg-gradient-to-r ${roles[selectedRole].color} text-white rounded-full text-sm font-semibold shadow-md`}
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comparison Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-effect p-6 rounded-xl border-l-4 border-blue-600"
      >
        <p className="text-sm text-gray-700">
          <strong className="gradient-text">💡 Tip:</strong> Muchos profesionales combinan
          habilidades de múltiples roles. El camino ideal depende de tus intereses y fortalezas.
        </p>
      </motion.div>
    </div>
  );
}
