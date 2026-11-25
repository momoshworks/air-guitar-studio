import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.gestures import GestureAnalyzer


def make_hand(
    scale: float = 100.0,
    pinch_ratio: float = 0.25,
    middle_up: bool = True,
    ring_up: bool = True,
    pinky_up: bool = True,
    index_up: bool = True,
    frame_w: float = 640.0,
    frame_h: float = 480.0,
) -> dict:
    """Build synthetic hand landmarks parameterized by palm scale and finger states."""
    wx, wy = 320.0, 360.0
    landmarks = {i: (wx, wy, 0.0) for i in range(21)}
    landmarks[0] = (wx, wy, 0.0)
    landmarks[9] = (wx, wy - scale, 0.0)  # palm_scale == scale

    # PIP joints above wrist
    pip_ids = {1: 6, 2: 10, 3: 14, 4: 18}
    tip_ids = {1: 8, 2: 12, 3: 16, 4: 20}
    x_offsets = {1: -25.0, 2: 0.0, 3: 25.0, 4: 50.0}
    states = {1: index_up, 2: middle_up, 3: ring_up, 4: pinky_up}

    for finger_idx in (1, 2, 3, 4):
        ox = x_offsets[finger_idx]
        pip_dist = scale * 0.9
        tip_dist = scale * 1.4 if states[finger_idx] else scale * 0.65
        landmarks[pip_ids[finger_idx]] = (wx + ox, wy - pip_dist, 0.0)
        landmarks[tip_ids[finger_idx]] = (wx + ox, wy - tip_dist, 0.0)

    # Place thumb tip relative to index tip at desired pinch_ratio * scale
    ix, iy, _ = landmarks[8]
    landmarks[4] = (ix + pinch_ratio * scale, iy, 0.0)

    norm_landmarks = {
        idx: (pt[0] / frame_w, pt[1] / frame_h)
        for idx, pt in landmarks.items()
    }
    return {
        "index": 0,
        "label": "Right",
        "score": 0.99,
        "landmarks": landmarks,
        "norm_landmarks": norm_landmarks,
    }


class TestGestureAnalyzer(unittest.TestCase):
    def setUp(self):
        self.analyzer = GestureAnalyzer()

    def test_ok_detected_at_near_and_far_scales(self):
        near = self.analyzer.analyze(make_hand(scale=160.0, pinch_ratio=0.25))
        far = self.analyzer.analyze(make_hand(scale=50.0, pinch_ratio=0.25))
        self.assertTrue(near["is_ok"])
        self.assertEqual(near["gesture"], "OK Sign")
        self.assertTrue(far["is_ok"])
        self.assertEqual(far["gesture"], "OK Sign")

    def test_ok_hysteresis_keeps_active_up_to_0_45(self):
        hand = make_hand(scale=100.0, pinch_ratio=0.40)
        without_prev = self.analyzer.analyze(hand, prev_ok=False)
        with_prev = self.analyzer.analyze(hand, prev_ok=True)
        self.assertFalse(without_prev["is_ok"])
        self.assertTrue(with_prev["is_ok"])

    def test_fist_detected_when_all_fingers_folded(self):
        hand = make_hand(
            scale=100.0,
            pinch_ratio=0.60,
            index_up=False,
            middle_up=False,
            ring_up=False,
            pinky_up=False,
        )
        res = self.analyzer.analyze(hand)
        self.assertTrue(res["is_fist"])
        self.assertFalse(res["is_ok"])
        self.assertEqual(res["gesture"], "Fist")

    def test_pinch_and_probe_points_normalized(self):
        hand = make_hand(scale=100.0, pinch_ratio=0.20)
        res = self.analyzer.analyze(hand)
        n4 = hand["norm_landmarks"][4]
        n8 = hand["norm_landmarks"][8]
        n9 = hand["norm_landmarks"][9]
        expected_pinch = ((n4[0] + n8[0]) / 2.0, (n4[1] + n8[1]) / 2.0)
        expected_probe = (0.65 * n8[0] + 0.35 * n9[0], 0.65 * n8[1] + 0.35 * n9[1])
        self.assertAlmostEqual(res["pinch_point"][0], expected_pinch[0], places=5)
        self.assertAlmostEqual(res["pinch_point"][1], expected_pinch[1], places=5)
        self.assertAlmostEqual(res["probe_point"][0], expected_probe[0], places=5)
        self.assertAlmostEqual(res["probe_point"][1], expected_probe[1], places=5)


if __name__ == "__main__":
    unittest.main()
