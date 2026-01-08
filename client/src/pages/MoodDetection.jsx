import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/moodmirror_logo.png";

function getInitial(name) {
  if (!name) return "U";
  return name.trim().charAt(0).toUpperCase();
}

function MoodIcon({ mood }) {
  // Simple inline SVG faces so you don't need extra image assets
  // (You can swap these out later with your own icons.)
  const common = "w-14 h-14 md:w-16 md:h-16";
  const face = (bg = "#F5D04C", stroke = "#111") => (
    <svg className={common} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill={bg} stroke={stroke} strokeWidth="3" />
      <circle cx="24" cy="28" r="3" fill={stroke} />
      <circle cx="40" cy="28" r="3" fill={stroke} />
      {mood === "happy" && (
        <path d="M22 38c3 6 17 6 20 0" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      )}
      {mood === "sad" && (
        <path d="M22 44c3-6 17-6 20 0" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      )}
      {mood === "angry" && (
        <>
          <path d="M20 23l8 4" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
          <path d="M44 23l-8 4" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
          <path d="M24 44h16" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {mood === "surprised" && (
        <>
          <circle cx="32" cy="44" r="6" stroke={stroke} strokeWidth="4" />
        </>
      )}
      {mood === "fearful" && (
        <>
          <path d="M24 44c4-4 12-4 16 0" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {mood === "disgusted" && (
        <>
          <path d="M24 42c4 2 12 2 16 0" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
          <path d="M28 34h8" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );

  // Different face colors per mood (optional)
  if (mood === "sad") return face("#5B7CFF");
  if (mood === "angry") return face("#D84A3A");
  if (mood === "surprised") return face("#FF66B3");
  if (mood === "fearful") return face("#6E3DD6");
  if (mood === "disgusted") return face("#53D04A");
  return face("#F5C84C");
}

function MoodButton({ label, mood, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full rounded-2xl border-2 border-black shadow-[0_10px_0_rgba(0,0,0,0.25)]",
        "px-6 py-6 md:py-7 flex items-center gap-5",
        "transition active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.25)]",
        className,
      ].join(" ")}
    >
      <MoodIcon mood={mood} />
      <span className="text-white text-4xl md:text-5xl font-extrabold drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]">
        {label}
      </span>
    </button>
  );
}

export default function MoodDetection() {
  const navigate = useNavigate();

  // If you saved Spotify display name somewhere, you can read it here.
  // For now: fallback is "User"
  const displayName = localStorage.getItem("displayName") || "Jerome";
  const initial = getInitial(displayName);

  const handleManualMood = (mood) => {
    // Later, you’ll call your backend to generate playlist.
    // For now we route to your generated playlist page with state/query.
    navigate("/generated-playlist", { state: { mood } });
    // OR: navigate(`/generated-playlist?mood=${mood}`);
  };

  const goFaceDetection = () => navigate("/face-detection");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-500" />

      {/* Soft noise overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 px-8 py-6">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MoodMirror" className="w-14 h-14 object-contain" />
            <div className="text-white text-3xl font-extrabold tracking-wide">
              MoodMirror
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-white text-2xl font-semibold">
              Welcome, {displayName}!
            </div>
            <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center text-xl font-bold text-slate-700">
              {initial}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Manual Selection */}
          <section>
            <h2 className="text-center text-white/30 text-4xl font-extrabold mb-8">
              Manual Selection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <MoodButton
                label="Happy"
                mood="happy"
                className="bg-amber-500"
                onClick={() => handleManualMood("happy")}
              />
              <MoodButton
                label="Fearful"
                mood="fearful"
                className="bg-purple-700"
                onClick={() => handleManualMood("fearful")}
              />
              <MoodButton
                label="Sad"
                mood="sad"
                className="bg-blue-700"
                onClick={() => handleManualMood("sad")}
              />
              <MoodButton
                label="Surprised"
                mood="surprised"
                className="bg-pink-500"
                onClick={() => handleManualMood("surprised")}
              />
              <MoodButton
                label="Angry"
                mood="angry"
                className="bg-red-700"
                onClick={() => handleManualMood("angry")}
              />
              <MoodButton
                label="Disgusted"
                mood="disgusted"
                className="bg-green-600"
                onClick={() => handleManualMood("disgusted")}
              />
            </div>
          </section>

          {/* Facial Recognition */}
          <section className="flex flex-col items-center">
            <h2 className="text-center text-white/30 text-4xl font-extrabold mb-10">
              Facial Recognition
            </h2>

            <button
              onClick={goFaceDetection}
              className="group relative w-full max-w-md rounded-3xl border-2 border-white/30 bg-white/10 backdrop-blur-md p-10
                         hover:bg-white/15 transition shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
            >
              {/* Big “face frame” icon */}
              <div className="mx-auto w-56 h-56 md:w-64 md:h-64 opacity-90 flex items-center justify-center">
                <svg viewBox="0 0 256 256" className="w-full h-full">
                  <path
                    d="M56 88V56h32M200 88V56h-32M56 168v32h32M200 168v32h-32"
                    stroke="white"
                    strokeWidth="14"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.9"
                  />
                  <path
                    d="M128 84c-24 0-44 20-44 44v16c0 24 20 44 44 44s44-20 44-44v-16c0-24-20-44-44-44Z"
                    fill="white"
                    opacity="0.20"
                  />
                  <path
                    d="M128 92c-20 0-36 16-36 36v16c0 20 16 36 36 36s36-16 36-36v-16c0-20-16-36-36-36Z"
                    stroke="white"
                    strokeWidth="10"
                    fill="none"
                    opacity="0.55"
                  />
                </svg>
              </div>

              <div className="mt-6 text-white text-xl font-semibold group-hover:opacity-100 opacity-90">
                Use webcam to detect mood →
              </div>
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
