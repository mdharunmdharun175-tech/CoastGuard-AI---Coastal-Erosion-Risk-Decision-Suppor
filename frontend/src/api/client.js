const API_BASE = import.meta.env.VITE_API_URL || "";

export async function fetchZones() {
  const res = await fetch(`${API_BASE}/api/zones`);
  if (!res.ok) throw new Error("Failed to fetch coastal zones");
  return res.json();
}

export async function predictSusceptibility(features) {
  const res = await fetch(`${API_BASE}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features)
  });
  if (!res.ok) throw new Error("Prediction API failed");
  return res.json();
}

export async function explainPrediction(features) {
  const res = await fetch(`${API_BASE}/api/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features)
  });
  if (!res.ok) throw new Error("Explainability API failed");
  return res.json();
}

export async function getRecommendations(features, top_factors, risk_class) {
  const res = await fetch(`${API_BASE}/api/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features, top_factors, risk_class })
  });
  if (!res.ok) throw new Error("Recommendation API failed");
  return res.json();
}

export async function fetchBenchmark() {
  const res = await fetch(`${API_BASE}/api/benchmark`);
  if (!res.ok) throw new Error("Benchmark API failed");
  return res.json();
}
