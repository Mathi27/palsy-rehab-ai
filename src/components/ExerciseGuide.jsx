import React, { useState, useCallback, useRef } from 'react';
import { useFaceMesh } from '../hooks/useFaceMesh';
import { useAudio } from '../hooks/useAudio';
import { FACIAL_LANDMARKS } from '../utils/landmarks';
import { saveSession } from '../utils/storage';

 
import { calculateEAR, calculateSymmetry, calculateEyebrowDistance, calculateMouthWidth } from '../utils/metrics';// Replace your EXERCISES array with this expanded one
const EXERCISES = [
  { id: 'eyes', name: 'Close Eyes', target: 'eyeClosure' },
  { id: 'smile', name: 'Smile Widely', target: 'symmetry' },
  { id: 'eyebrows', name: 'Raise Eyebrows', target: 'forehead' },
  { id: 'pucker', name: 'Pucker Lips', target: 'mouthWidth' }
];
 
export default function ExerciseGuide() {
  const [activeExercise, setActiveExercise] = useState(EXERCISES[0]);
  const [feedback, setFeedback] = useState("Position your face in the frame.");
  const [sessionScore, setSessionScore] = useState(0);
  
  const { speak, playAlert } = useAudio();
  const lastSpokenRef = useRef(0);
 
  const provideVoiceFeedback = (message, isAlert = false) => {
    const now = Date.now();
    if (now - lastSpokenRef.current > 3000) {  
      if (isAlert) playAlert();
      speak(message);
      lastSpokenRef.current = now;
    }
  };

  const onResults = useCallback((results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      setFeedback("No face detected. Please adjust lighting.");
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    
    if (activeExercise.id === 'eyes') {
      const leftEar = calculateEAR(FACIAL_LANDMARKS.LEFT_EYE, landmarks);
      const rightEar = calculateEAR(FACIAL_LANDMARKS.RIGHT_EYE, landmarks);
      
      const score = Math.max(0, 100 - ((leftEar + rightEar) * 200)); // Rough percentage calc
      setSessionScore(score.toFixed(0));

      if (leftEar > 0.15 && rightEar < 0.15) {
        setFeedback("Close your left eye more tightly.");
        provideVoiceFeedback("Close your left eye more", true);
      } else if (leftEar < 0.15 && rightEar < 0.15) {
        setFeedback("Perfect! Hold it.");
        provideVoiceFeedback("Perfect, hold it.");
      } else {
        setFeedback("Try to close both eyes tightly.");
      }
    } 
    else if (activeExercise.id === 'smile') {
      const mouthSym = calculateSymmetry(FACIAL_LANDMARKS, landmarks);
      setSessionScore((mouthSym * 100).toFixed(0));

      if (mouthSym < 0.85) {
        setFeedback("Try to pull the weaker side up more.");
        provideVoiceFeedback("Pull the weaker side up more", true);
      } else {
        setFeedback("Great symmetry! Hold the smile.");
        provideVoiceFeedback("Great smile, hold it.");
      }
    }else if (activeExercise.id === 'eyebrows') {
      const leftDist = calculateEyebrowDistance(FACIAL_LANDMARKS.LEFT_EYEBROW, FACIAL_LANDMARKS.LEFT_EYE, landmarks);
      const rightDist = calculateEyebrowDistance(FACIAL_LANDMARKS.RIGHT_EYEBROW, FACIAL_LANDMARKS.RIGHT_EYE, landmarks);

      // Calculate symmetry of the lift
      const symmetry = Math.min(leftDist, rightDist) / Math.max(leftDist, rightDist);
      setSessionScore((symmetry * 100).toFixed(0));

      if (leftDist < 0.08 && rightDist < 0.08) {
         setFeedback("Raise your eyebrows as high as you can.");
      } else if (symmetry < 0.85) {
         setFeedback("Try to raise the weaker side higher.");
         provideVoiceFeedback("Raise the weaker side more", true);
      } else {
         setFeedback("Great lift! Hold that stretch.");
         provideVoiceFeedback("Great job, hold it.");
      }
      
    } else if (activeExercise.id === 'pucker') {
      const width = calculateMouthWidth(FACIAL_LANDMARKS.MOUTH, landmarks);
      
     
      const puckerScore = Math.min(100, Math.max(0, (0.2 - width) * 1000));
      setSessionScore(puckerScore.toFixed(0));

      if (width > 0.12) {
         setFeedback("Bring your lips together like you are whistling.");
      } else {
         setFeedback("Perfect pucker! Hold it.");
         provideVoiceFeedback("Perfect, hold it.");
      }
    }
  }, [activeExercise]);

  const { videoRef, canvasRef, isReady } = useFaceMesh(onResults);

  const finishSession = () => {
    saveSession({
      [activeExercise.target]: parseInt(sessionScore, 10),
      symmetry: activeExercise.id === 'smile' ? parseInt(sessionScore, 10) : 85 // Mock fallback
    });
    speak("Session saved successfully.");
    alert("Session saved! Check your Dashboard.");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      
      {/* Exercise Selector */}
      <div className="flex gap-2 w-full overflow-x-auto pb-2">
        {EXERCISES.map(ex => (
          <button
            key={ex.id}
            onClick={() => setActiveExercise(ex)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              activeExercise.id === ex.id ? 'bg-medical text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Camera Feed Container */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-lg border-4 border-slate-800">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" playsInline muted />
        <canvas ref={canvasRef} width="640" height="480" className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-50" />
        
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-10">
            <div className="w-8 h-8 border-4 border-medical border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Initializing MediaPipe Vision...</p>
          </div>
        )}
      </div>

      {/* Real-time Feedback Panel */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Live Feedback</h3>
            <p className="text-xl font-medium text-slate-800">{feedback}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Score</h3>
            <p className="text-3xl font-bold text-medical">{sessionScore}%</p>
          </div>
        </div>
        
        <button 
          onClick={finishSession}
          className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition-colors shadow-sm"
        >
          Finish & Save Session
        </button>
      </div>
    </div>
  );
}