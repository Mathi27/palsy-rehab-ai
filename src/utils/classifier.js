export const classifyPalsyPattern = (leftForeheadDist, rightForeheadDist, mouthSymmetry) => {
  const foreheadAsymmetryThreshold = 0.15; // 15% difference
  const mouthAsymmetryThreshold = 0.85; // Below 85% symmetry is considered weak

  const foreheadSymmetrical = Math.abs(leftForeheadDist - rightForeheadDist) / Math.max(leftForeheadDist, rightForeheadDist) < foreheadAsymmetryThreshold;
  const mouthWeak = mouthSymmetry < mouthAsymmetryThreshold;

  if (foreheadSymmetrical && mouthWeak) {
    return "Likely UMN Pattern (Forehead Spared)";
  } else if (!foreheadSymmetrical && mouthWeak) {
    return "Likely LMN Pattern (Complete Hemifacial)";
  }
  
  return "Unclear / Normal Variance";
};