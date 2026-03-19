// Euclidean distance between two 3D points
const euclideanDistance = (p1, p2) => {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + 
    Math.pow(p1.y - p2.y, 2)
  );
};

// Calculate Eye Aspect Ratio (EAR) for eye closure
export const calculateEAR = (eyeLandmarks, allPoints) => {
  const p1 = allPoints[eyeLandmarks[0]]; // Left corner
  const p2 = allPoints[eyeLandmarks[1]]; // Top left
  const p3 = allPoints[eyeLandmarks[2]]; // Top right
  const p4 = allPoints[eyeLandmarks[3]]; // Right corner
  const p5 = allPoints[eyeLandmarks[4]]; // Bottom right
  const p6 = allPoints[eyeLandmarks[5]]; // Bottom left

  const vertical1 = euclideanDistance(p2, p6);
  const vertical2 = euclideanDistance(p3, p5);
  const horizontal = euclideanDistance(p1, p4);

  return (vertical1 + vertical2) / (2.0 * horizontal);
};

// Calculate symmetry of mouth corners relative to nose
export const calculateSymmetry = (landmarks, allPoints) => {
  const leftMouthCorner = allPoints[landmarks.MOUTH[0]];
  const rightMouthCorner = allPoints[landmarks.MOUTH[1]];
  const nose = allPoints[landmarks.NOSE_TIP[0]];

  const leftDist = euclideanDistance(leftMouthCorner, nose);
  const rightDist = euclideanDistance(rightMouthCorner, nose);

  // Returns ratio: 1 is perfectly symmetrical. <1 or >1 implies asymmetry
  return Math.min(leftDist, rightDist) / Math.max(leftDist, rightDist);
};

// Eyebrow lift relative to eye
export const calculateEyebrowLift = (eyebrowPoints, eyePoints, allPoints) => {
    const eyebrowMid = allPoints[eyebrowPoints[2]];
    const eyeMid = allPoints[eyePoints[0]]; 
    return euclideanDistance(eyebrowMid, eyeMid);

    
}
// Calculate the distance between the eyebrow arch and the top of the eye
export const calculateEyebrowDistance = (eyebrowLandmarks, eyeLandmarks, allPoints) => {
  const eyebrowArch = allPoints[eyebrowLandmarks[2]]; 
  const topOfEye = allPoints[eyeLandmarks[1]]; 
  return euclideanDistance(eyebrowArch, topOfEye);
};

// Calculate the width of the mouth from left corner to right corner
export const calculateMouthWidth = (mouthLandmarks, allPoints) => {
  const leftCorner = allPoints[mouthLandmarks[0]]; 
  const rightCorner = allPoints[mouthLandmarks[1]]; 
  return euclideanDistance(leftCorner, rightCorner);


};
// Clear all session history
export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear session data:", error);
  }
};