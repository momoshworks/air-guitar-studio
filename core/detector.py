"""MediaPipe hand landmark detector wrapper for two-hand Air Guitar tracking."""

import os
import time
import urllib.request
from typing import Dict, List, Optional

import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"


class HandDetector:
    """High-FPS MediaPipe HandLandmarker wrapper running in VIDEO mode."""

    def __init__(
        self,
        max_hands: int = 2,
        detection_con: float = 0.65,
        track_con: float = 0.6,
    ) -> None:
        self.max_hands = max_hands
        self.detection_con = detection_con
        self.track_con = track_con
        self.model_path = self.resolve_model_path()
        self._ensure_model_exists()

        base_options = python.BaseOptions(model_asset_path=self.model_path)
        options = vision.HandLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.VIDEO,
            num_hands=self.max_hands,
            min_hand_detection_confidence=self.detection_con,
            min_hand_presence_confidence=self.track_con,
            min_tracking_confidence=self.track_con,
        )
        self.detector = vision.HandLandmarker.create_from_options(options)
        self.detection_result = None
        self._last_timestamp_ms = 0

    @staticmethod
    def resolve_model_path() -> str:
        """Return local model path or fall back to sibling hand-tracking-studio model."""
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        local_model = os.path.join(project_root, "models", "hand_landmarker.task")
        if os.path.exists(local_model):
            return local_model

        sibling_model = os.path.join(
            os.path.dirname(project_root),
            "hand-tracking-studio",
            "models",
            "hand_landmarker.task",
        )
        if os.path.exists(sibling_model):
            return sibling_model

        return local_model

    def _ensure_model_exists(self) -> None:
        if not os.path.exists(self.model_path):
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            urllib.request.urlretrieve(MODEL_URL, self.model_path)

    def process_frame(self, img: np.ndarray, flip: bool = True) -> np.ndarray:
        """Process a BGR camera frame and update detection_result."""
        if flip:
            img = cv2.flip(img, 1)

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)

        now_ms = int(time.time() * 1000)
        if now_ms <= self._last_timestamp_ms:
            now_ms = self._last_timestamp_ms + 1
        self._last_timestamp_ms = now_ms

        self.detection_result = self.detector.detect_for_video(mp_image, now_ms)
        return img

    def extract_hands(self, frame_width: int, frame_height: int) -> List[Dict]:
        """Extract normalized and pixel-space hand landmarks for each detected hand."""
        hands: List[Dict] = []
        if not self.detection_result or not self.detection_result.hand_landmarks:
            return hands

        handedness_list = self.detection_result.handedness or []
        for idx, hand_lms in enumerate(self.detection_result.hand_landmarks):
            label = "Hand"
            score = 0.99
            if idx < len(handedness_list) and len(handedness_list[idx]) > 0:
                label = handedness_list[idx][0].category_name
                score = float(handedness_list[idx][0].score)

            landmarks = {}
            norm_landmarks = {}
            for lm_id, lm in enumerate(hand_lms):
                landmarks[lm_id] = (
                    float(lm.x * frame_width),
                    float(lm.y * frame_height),
                    float(lm.z),
                )
                norm_landmarks[lm_id] = (float(lm.x), float(lm.y))

            hands.append(
                {
                    "index": idx,
                    "label": label,
                    "score": score,
                    "landmarks": landmarks,
                    "norm_landmarks": norm_landmarks,
                }
            )

        return hands

    def close(self) -> None:
        """Release underlying MediaPipe resources."""
        if getattr(self, "detector", None) is not None:
            self.detector.close()
            self.detector = None
