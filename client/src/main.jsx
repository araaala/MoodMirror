import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MoodDetection from "./pages/MoodDetection.jsx";
import FaceDetection from "./pages/FaceDetection.jsx";
import GeneratedPlaylist from "./pages/GeneratedPlaylist.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* DEFAULT PAGE */}
        <Route path="/" element={<MoodDetection />} />

        {/* FLOW */}
        <Route path="/face-detection" element={<FaceDetection />} />
        <Route path="/generated-playlist" element={<GeneratedPlaylist />} />

        {/* SAFETY */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
