import { useEffect, useRef, useState, useCallback } from 'react';

export function useMediaPipe(videoElement) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    ear: 0, mar: 0, headTilt: 0,
    blinkCount: 0, afi: 0, emotion: 'Neutral',
  });

  const faceMeshRef = useRef(null);
  const lastBlinkTime = useRef(Date.now());
  const frameId = useRef(null);

  const onResults = useCallback((results) => {
    if (!results.multiFaceLandmarks?.length) return;
    const lm = results.multiFaceLandmarks[0];

    // EAR (Eye Aspect Ratio)
    const earCalc = (u, d, l, r) => {
      const v = Math.hypot(lm[u].x - lm[d].x, lm[u].y - lm[d].y);
      const h = Math.hypot(lm[l].x - lm[r].x, lm[l].y - lm[r].y);
      return v / (h || 1);
    };
    const leftEAR = earCalc(385, 380, 362, 263);
    const rightEAR = earCalc(160, 144, 33, 133);
    const ear = (leftEAR + rightEAR) / 2;

    // Blink detection
    if (ear < 0.2 && Date.now() - lastBlinkTime.current > 300) {
      setMetrics(p => ({ ...p, blinkCount: p.blinkCount + 1 }));
      lastBlinkTime.current = Date.now();
    }

    // MAR (Mouth Aspect Ratio)
    const mar = Math.abs(lm[13].y - lm[14].y);

    // Head tilt
    const headTilt = Math.abs(lm[1].x - lm[152].x);

    // AFI calculation (0-100)
    const eyePenalty = ear < 0.25 ? 40 : 0;
    const yawnPenalty = mar > 0.05 ? 30 : 0;
    const tiltPenalty = headTilt > 0.05 ? 20 : 0;
    const afi = Math.min(100, Math.floor(eyePenalty + yawnPenalty + tiltPenalty + Math.random() * 5));

    const emotion = afi > 50 ? 'Tired' : afi > 20 ? 'Neutral' : 'Focused';

    setMetrics(p => ({ ...p, ear, mar, headTilt, afi, emotion }));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!videoElement) return;

    let cancelled = false;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        videoElement.srcObject = stream;
        await videoElement.play();

        if (!window.FaceMesh) {
          setError('MediaPipe failed to load. Refresh the page.');
          return;
        }

        const fm = new window.FaceMesh({
          locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
        });
        fm.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        fm.onResults(onResults);
        faceMeshRef.current = fm;

        const loop = async () => {
          if (cancelled) return;
          if (faceMeshRef.current && videoElement.readyState >= 2) {
            try { await faceMeshRef.current.send({ image: videoElement }); } catch {}
          }
          frameId.current = requestAnimationFrame(loop);
        };
        loop();
      } catch (err) {
        if (err.name === 'NotAllowedError') setError('Camera blocked. Click the lock icon in your address bar → Camera → Allow, then refresh.');
        else if (err.name === 'NotFoundError') setError('No camera found. Connect one and refresh.');
        else setError(`Camera error: ${err.message}`);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (frameId.current) cancelAnimationFrame(frameId.current);
      if (videoElement.srcObject) videoElement.srcObject.getTracks().forEach(t => t.stop());
      faceMeshRef.current?.close();
    };
  }, [videoElement, onResults]);

  return { ...metrics, isLoading, error };
}
