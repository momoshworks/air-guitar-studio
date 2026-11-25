"""Scale-invariant hand gesture classification for Air Guitar Studio."""

import math
from typing import Dict, List, Tuple


class GestureAnalyzer:
    """Detects OK pinch, Fist, and normalized interaction points reliably across scales."""

    FINGER_JOINTS: Tuple[Tuple[int, int], ...] = (
        (8, 6),    # Index
        (12, 10),  # Middle
        (16, 14),  # Ring
        (20, 18),  # Pinky
    )

    OK_ENTER_RATIO = 0.36
    OK_EXIT_RATIO = 0.45
    EXTENSION_RATIO = 1.08

    @staticmethod
    def _dist2d(p1: Tuple[float, ...], p2: Tuple[float, ...]) -> float:
        return math.hypot(p1[0] - p2[0], p1[1] - p2[1])

    def analyze(self, hand: Dict, prev_ok: bool = False) -> Dict:
        """Classify gesture and extract normalized pinch and strum probe coordinates."""
        lms = hand["landmarks"]
        norm = hand["norm_landmarks"]

        palm_scale = max(20.0, self._dist2d(lms[0], lms[9]))

        extended: List[int] = []
        wrist = lms[0]
        for tip_id, pip_id in self.FINGER_JOINTS:
            d_tip = self._dist2d(lms[tip_id], wrist)
            d_pip = self._dist2d(lms[pip_id], wrist)
            extended.append(1 if d_tip > d_pip * self.EXTENSION_RATIO else 0)

        pinch_dist = self._dist2d(lms[4], lms[8])
        pinch_ratio = pinch_dist / palm_scale
        ok_threshold = self.OK_EXIT_RATIO if prev_ok else self.OK_ENTER_RATIO

        # Require at least 2 of middle/ring/pinky extended so a tight fist isn't misread as OK.
        is_ok = (pinch_ratio < ok_threshold) and (sum(extended[1:]) >= 2)
        is_fist = (sum(extended) == 0) and (not is_ok)

        if is_ok:
            gesture, gesture_ar, emoji = "OK Sign", "إشارة تمام", "👌"
        elif is_fist:
            gesture, gesture_ar, emoji = "Fist", "قبضة مغلقة", "✊"
        elif sum(extended) == 4:
            gesture, gesture_ar, emoji = "Open Palm", "كف مفتوح", "✋"
        elif extended[0] == 1 and sum(extended[1:]) == 0:
            gesture, gesture_ar, emoji = "Pointing", "إشارة السبابة", "👉"
        else:
            gesture, gesture_ar, emoji = "Hand Ready", "يد جاهزة", "🎸"

        n4 = norm[4]
        n8 = norm[8]
        n9 = norm[9]
        pinch_point = ((n4[0] + n8[0]) * 0.5, (n4[1] + n8[1]) * 0.5)
        probe_point = (0.65 * n8[0] + 0.35 * n9[0], 0.65 * n8[1] + 0.35 * n9[1])

        return {
            "gesture": gesture,
            "gesture_ar": gesture_ar,
            "emoji": emoji,
            "is_ok": is_ok,
            "is_fist": is_fist,
            "pinch_point": pinch_point,
            "probe_point": probe_point,
            "palm_scale": palm_scale,
        }
