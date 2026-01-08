from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import cv2
import numpy as np

from deepface import DeepFace  # ✅ DeepFace emotion recognition

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DetectRequest(BaseModel):
    imageBase64: str

@app.get("/health")
def health():
    return {"status": "pyservice running"}

def _parse_deepface_result(result):
    """
    DeepFace can return either:
      - a dict
      - a list of dicts
    We normalize it to a single dict.
    """
    if isinstance(result, list) and len(result) > 0:
        return result[0]
    return result

@app.post("/detect")
def detect(req: DetectRequest):
    # 1) Decode base64 image from client
    b64 = req.imageBase64
    if "," in b64:
        b64 = b64.split(",", 1)[1]

    img_bytes = base64.b64decode(b64)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    img_bgr = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    if img_bgr is None:
        return {"error": "Invalid image"}

    # DeepFace expects RGB images typically
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    try:
        # 2) Analyze emotion with DeepFace
        result = DeepFace.analyze(
            img_path=img_rgb,
            actions=["emotion"],
            enforce_detection=False,  # don't hard-fail if no face is found
        )

        r = _parse_deepface_result(result)

        dominant = r.get("dominant_emotion")
        emotion_scores = r.get("emotion", {})  # emotion -> score (0-100)

        if not dominant or dominant not in emotion_scores:
            # If DeepFace couldn't decide, fallback:
            return {
                "detectedMood": "neutral",
                "confidence": 0.40,
                "source": "deepface-unknown"
            }

        # 3) Confidence as 0-1
        confidence = float(emotion_scores[dominant]) / 100.0

        # 4) Map labels to match your UI naming
        # DeepFace uses: happy, sad, angry, fear, disgust, surprise, neutral
        label_map = {
            "surprise": "surprised",
        }
        detected = label_map.get(dominant, dominant)

        return {
            "detectedMood": detected,
            "confidence": confidence,
            "source": "deepface"
        }

    except Exception as e:
        # If DeepFace fails (install/model issues), return safe fallback
        return {
            "detectedMood": "neutral",
            "confidence": 0.40,
            "source": f"deepface-error: {str(e)[:120]}"
        }
