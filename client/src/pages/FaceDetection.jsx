import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FaceDetection() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState("Starting camera...");
  const [apiStatus, setApiStatus] = useState("Checking AI service...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Use 127.0.0.1 to avoid localhost IPv6 issues on Windows sometimes
  const PY_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    startCamera();
    checkApi();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkApi() {
    try {
      const res = await fetch(`${PY_URL}/health`);
      if (!res.ok) throw new Error("health not ok");
      setApiStatus("AI service: OK");
    } catch {
      setApiStatus("AI service: NOT REACHABLE (start pyservice on :8000)");
    }
  }

  async function startCamera() {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 960, height: 540 },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("Camera on");
    } catch {
      setStatus("Error");
      setError("Camera blocked. Allow camera permission in the browser.");
    }
  }

  function stopCamera() {
    const stream = streamRef.current;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function captureFrameAsBase64() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 540;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.9); // "data:image/jpeg;base64,..."
  }

  async function handleDetectMood() {
    setLoading(true);
    setError("");

    try {
      setStatus("Detecting mood...");

      const imageBase64 = captureFrameAsBase64();
      if (!imageBase64) throw new Error("No camera frame available.");

      const res = await fetch(`${PY_URL}/detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      const data = await res.json();
      if (data?.error) throw new Error(data.error);

      const mood = data?.detectedMood;
      const confidence = data?.confidence;
      const source = data?.source;

      if (!mood) throw new Error("No detectedMood returned.");

      setStatus(`Detected: ${mood}`);

      navigate("/generated-playlist", {
        state: { mood, confidence, source },
      });
    } catch (e) {
      setStatus("Error");
      setError(
        e?.message ||
          "Failed to fetch. Make sure pyservice is running at http://127.0.0.1:8000"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background similar to your design */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
      <div className="absolute inset-0 opacity-20 bg-black" />

      <div className="relative z-10 px-6 py-10">
        {/* Top bar */}
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-white text-3xl font-extrabold tracking-wide">
            MoodSwinger
          </div>

          <div className="flex items-center gap-4">
            <div className="text-white text-2xl font-semibold">
              Welcome, Ara!
            </div>
            <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center text-xl font-bold text-slate-700">
              J
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-white text-6xl font-extrabold mt-10 mb-8">
          Detect Your Mood
        </h1>

        {/* Center card */}
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="w-full rounded-[2.5rem] bg-white/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="w-full rounded-3xl overflow-hidden bg-black/20">
              <div className="aspect-video w-full">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-8 flex flex-col items-center gap-5">
              <button
                onClick={handleDetectMood}
                disabled={loading}
                className="w-80 max-w-full py-4 rounded-full bg-green-600 text-white text-xl font-extrabold
                           shadow-[0_10px_0_rgba(0,0,0,0.25)]
                           active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.25)]
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Detecting..." : "Detect Mood"}
              </button>

              <button
                onClick={() => navigate("/mood-detection")}
                className="w-96 max-w-full py-3 rounded-full border-2 border-white/70 text-white font-semibold
                           bg-white/10 hover:bg-white/15 transition"
              >
                Skip &amp; Choose Mood Manually
              </button>

              <div className="text-white/90 font-semibold mt-2">
                {status} • {apiStatus}
              </div>

              {error && (
                <div className="w-full mt-2 rounded-2xl bg-red-500/20 border border-red-500/40 p-4 text-white">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
