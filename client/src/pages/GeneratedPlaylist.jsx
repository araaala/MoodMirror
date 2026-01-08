import { useLocation, useNavigate } from "react-router-dom";

export default function GeneratedPlaylist() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const mood = state?.mood || "Unknown";
  const confidence = state?.confidence ?? null;
  const source = state?.source || "unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-500 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-3xl border border-white/30 bg-white/10 backdrop-blur-md p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <h1 className="text-white text-5xl font-extrabold mb-4">
          Generated Playlist
        </h1>

        <p className="text-white/90 text-2xl">
          Mood detected: <span className="font-extrabold">{mood}</span>
        </p>

        <div className="mt-4 text-white/80">
          <div>Source: {source}</div>
          {confidence !== null && (
            <div>Confidence: {(confidence * 100).toFixed(0)}%</div>
          )}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => navigate("/mood-detection")}
            className="px-6 py-4 rounded-2xl bg-white/15 text-white font-bold hover:bg-white/20 transition"
          >
            Back to Mood Selection
          </button>

          <button
            onClick={() => navigate("/face-detection")}
            className="px-6 py-4 rounded-2xl bg-green-500 text-black font-extrabold shadow-[0_10px_0_rgba(0,0,0,0.25)]
                       active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.25)]"
          >
            Try Face Detection Again
          </button>
        </div>

        <div className="mt-8 text-white/70">
          Spotify playlist generation will be connected once login scopes are fixed.
        </div>
      </div>
    </div>
  );
}
