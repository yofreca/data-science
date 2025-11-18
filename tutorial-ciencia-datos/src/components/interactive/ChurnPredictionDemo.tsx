"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, User, DollarSign, Calendar, PhoneCall } from "lucide-react";

type CustomerProfile = {
  tenure: number;           // Months with company (0-72)
  monthlyCharges: number;   // Monthly bill amount (20-200)
  totalCharges: number;     // Total spent  (100-8000)
  supportCalls: number;     // Customer support calls (0-10)
  contractType: "month" | "1year" | "2year";
  hasOnlineService: boolean;
};

export default function ChurnPredictionDemo() {
  const [profile, setProfile] = useState<CustomerProfile>({
    tenure: 12,
    monthlyCharges: 70,
    totalCharges: 840,
    supportCalls: 2,
    contractType: "month",
    hasOnlineService: true
  });

  const [prediction, setPrediction] = useState<{ churnProb: number; risk: "low" | "medium" | "high" } | null>(null);

  // Simple churn prediction model (rule-based for demo)
  const predictChurn = (p: CustomerProfile): { churnProb: number; risk: "low" | "medium" | "high" } => {
    let churnScore = 0;

    // Tenure (longer = less churn)
    if (p.tenure < 6) churnScore += 30;
    else if (p.tenure < 12) churnScore += 20;
    else if (p.tenure < 24) churnScore += 10;

    // Monthly charges (higher = more churn if not value-matched)
    if (p.monthlyCharges > 100) churnScore += 15;
    else if (p.monthlyCharges > 80) churnScore += 10;

    // Support calls (more calls = potential dissatisfaction)
    if (p.supportCalls > 5) churnScore += 25;
    else if (p.supportCalls > 3) churnScore += 15;
    else if (p.supportCalls > 1) churnScore += 5;

    // Contract type (month-to-month = higher churn)
    if (p.contractType === "month") churnScore += 20;
    else if (p.contractType === "1year") churnScore += 5;

    // Online service (has service = less churn)
    if (!p.hasOnlineService) churnScore += 10;

    // Normalize to 0-100
    const churnProb = Math.min(churnScore, 100);

    let risk: "low" | "medium" | "high";
    if (churnProb < 30) risk = "low";
    else if (churnProb < 60) risk = "medium";
    else risk = "high";

    return { churnProb, risk };
  };

  const handlePredict = () => {
    const result = predictChurn(profile);
    setPrediction(result);
  };

  const updateProfile = (field: keyof CustomerProfile, value: any) => {
    setProfile({ ...profile, [field]: value });
    setPrediction(null);
  };

  const getRiskColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low": return { bg: "bg-green-50", border: "border-green-500", text: "text-green-900", bar: "bg-green-500" };
      case "medium": return { bg: "bg-yellow-50", border: "border-yellow-500", text: "text-yellow-900", bar: "bg-yellow-500" };
      case "high": return { bg: "bg-red-50", border: "border-red-500", text: "text-red-900", bar: "bg-red-500" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Profile Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Perfil del Cliente
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tenure */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Antigüedad (meses): {profile.tenure}
            </label>
            <input
              type="range"
              min="0"
              max="72"
              value={profile.tenure}
              onChange={(e) => updateProfile("tenure", parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Nuevo</span>
              <span>Leal (6 años)</span>
            </div>
          </div>

          {/* Monthly Charges */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign className="w-4 h-4" />
              Cargo Mensual: ${profile.monthlyCharges}
            </label>
            <input
              type="range"
              min="20"
              max="200"
              value={profile.monthlyCharges}
              onChange={(e) => {
                const monthly = parseInt(e.target.value);
                updateProfile("monthlyCharges", monthly);
                updateProfile("totalCharges", monthly * profile.tenure);
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$20</span>
              <span>$200</span>
            </div>
          </div>

          {/* Support Calls */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <PhoneCall className="w-4 h-4" />
              Llamadas a Soporte: {profile.supportCalls}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={profile.supportCalls}
              onChange={(e) => updateProfile("supportCalls", parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Ninguna</span>
              <span>Frecuentes</span>
            </div>
          </div>

          {/* Contract Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Tipo de Contrato</label>
            <div className="flex gap-2">
              {["month", "1year", "2year"].map((type) => (
                <button
                  key={type}
                  onClick={() => updateProfile("contractType", type)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    profile.contractType === type
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type === "month" ? "Mensual" : type === "1year" ? "1 Año" : "2 Años"}
                </button>
              ))}
            </div>
          </div>

          {/* Online Service */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasOnlineService}
                onChange={(e) => updateProfile("hasOnlineService", e.target.checked)}
                className="w-5 h-5 text-orange-600 rounded"
              />
              <span className="text-sm font-semibold text-gray-700">Tiene Servicio Online</span>
            </label>
          </div>
        </div>

        <button
          onClick={handlePredict}
          className="mt-6 w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all shadow-lg"
        >
          Predecir Riesgo de Churn
        </button>
      </div>

      {/* Prediction Result */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl shadow-lg p-6 border-l-4 ${getRiskColor(prediction.risk).bg} ${getRiskColor(prediction.risk).border}`}
        >
          <h3 className="font-bold text-gray-800 mb-6 text-xl">Resultado de la Predicción</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Level */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${
                prediction.risk === "low" ? "bg-green-100" :
                prediction.risk === "medium" ? "bg-yellow-100" : "bg-red-100"
              }`}>
                {prediction.risk === "low" && <CheckCircle className="w-16 h-16 text-green-600" />}
                {prediction.risk !== "low" && <AlertTriangle className="w-16 h-16 text-orange-600" />}
              </div>
              <div className="font-bold text-3xl text-gray-800 capitalize mb-1">
                Riesgo {prediction.risk === "low" ? "Bajo" : prediction.risk === "medium" ? "Medio" : "Alto"}
              </div>
              <div className="text-sm text-gray-600">
                {prediction.risk === "low" && "Cliente estable, baja probabilidad de abandono"}
                {prediction.risk === "medium" && "Cliente en riesgo, requiere atención"}
                {prediction.risk === "high" && "Cliente de alto riesgo, acción urgente requerida"}
              </div>
            </div>

            {/* Churn Probability */}
            <div className="text-center">
              <div className="text-6xl font-bold text-orange-600 mb-2">
                {prediction.churnProb.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 font-semibold mb-3">Probabilidad de Churn</div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className={`h-6 rounded-full transition-all ${getRiskColor(prediction.risk).bar}`}
                  style={{ width: `${prediction.churnProb}%` }}
                />
              </div>

              {/* Recommendations */}
              <div className="mt-6 text-left bg-white p-4 rounded-lg">
                <div className="font-semibold text-gray-800 mb-2">Recomendaciones:</div>
                <ul className="text-sm text-gray-700 space-y-1">
                  {prediction.risk === "high" && (
                    <>
                      <li>• Contacto inmediato con descuento especial</li>
                      <li>• Ofrecer upgrade a contrato anual</li>
                      <li>• Asignar account manager dedicado</li>
                    </>
                  )}
                  {prediction.risk === "medium" && (
                    <>
                      <li>• Seguimiento proactivo mensual</li>
                      <li>• Ofrecer servicios adicionales</li>
                      <li>• Mejorar soporte al cliente</li>
                    </>
                  )}
                  {prediction.risk === "low" && (
                    <>
                      <li>• Mantener calidad del servicio</li>
                      <li>• Programa de referidos</li>
                      <li>• Encuestas de satisfacción periódicas</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Feature Importance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">Factores de Riesgo</h3>
        <div className="space-y-3">
          {[
            { name: "Antigüedad Baja (<12 meses)", impact: "Alta", value: profile.tenure < 12 ? 70 : 20 },
            { name: "Contrato Mensual", impact: "Alta", value: profile.contractType === "month" ? 80 : 10 },
            { name: "Llamadas de Soporte Frecuentes (>3)", impact: "Media", value: profile.supportCalls > 3 ? 60 : 20 },
            { name: "Sin Servicio Online", impact: "Baja", value: !profile.hasOnlineService ? 40 : 10 }
          ].map((factor, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">{factor.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  factor.impact === "Alta" ? "bg-red-100 text-red-800" :
                  factor.impact === "Media" ? "bg-yellow-100 text-yellow-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  Impacto {factor.impact}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${factor.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Python Code */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Código Python (Scikit-learn):</div>
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

# Cargar datos
df = pd.read_csv('customer_churn.csv')

# Feature engineering
X = df[['tenure', 'monthly_charges', 'total_charges',
        'support_calls', 'contract_type', 'online_service']]
y = df['churn']  # 0 or 1

# One-hot encoding para categorías
X = pd.get_dummies(X, columns=['contract_type'])

# Split train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Entrenar modelo
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluar
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred))
print(f"ROC-AUC Score: {roc_auc_score(y_test, y_proba):.3f}")

# Feature importance
importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

# Predecir nuevo cliente
new_customer = [[12, 70, 840, 2, 0, 1]]  # Encoded features
churn_probability = model.predict_proba(new_customer)[0][1]
print(f"Churn Probability: {churn_probability:.2%}")`}
        </pre>
      </div>
    </div>
  );
}
