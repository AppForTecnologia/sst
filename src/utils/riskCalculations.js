export function calculateRiskLevel(probability, severity) {
  const riskValue = probability * severity;
  
  if (riskValue <= 4) return { level: 'Muito Baixo', color: 'risk-very-low', value: riskValue };
  if (riskValue <= 8) return { level: 'Baixo', color: 'risk-low', value: riskValue };
  if (riskValue <= 15) return { level: 'Médio', color: 'risk-medium', value: riskValue };
  if (riskValue <= 20) return { level: 'Alto', color: 'risk-high', value: riskValue };
  return { level: 'Muito Alto', color: 'risk-very-high', value: riskValue };
}

export function getRiskMatrix() {
  const matrix = [];
  for (let severity = 5; severity >= 1; severity--) {
    const row = [];
    for (let probability = 1; probability <= 5; probability++) {
      const risk = calculateRiskLevel(probability, severity);
      row.push({
        probability,
        severity,
        risk: risk.value,
        level: risk.level,
        color: risk.color
      });
    }
    matrix.push(row);
  }
  return matrix;
}