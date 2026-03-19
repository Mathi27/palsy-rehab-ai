import { useEffect, useRef, useState } from 'react';

export const useFaceMesh = (onResultsCallback) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    // Pull FaceMesh and Camera from the global window object (loaded via index.html)
    const FaceMesh = window.FaceMesh;
    const Camera = window.Camera;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResultsCallback);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start().then(() => setIsReady(true));

    return () => {
      camera.stop();
      faceMesh.close();
    };
  }, [onResultsCallback]);

  return { videoRef, canvasRef, isReady };
};