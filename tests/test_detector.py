import os
import sys
import unittest
from types import SimpleNamespace

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.detector import HandDetector


class TestHandDetector(unittest.TestCase):
    def test_resolve_model_path_finds_existing_model(self):
        path = HandDetector.resolve_model_path()
        self.assertTrue(os.path.exists(path), f"Expected model at {path}")

    def test_extract_hands_returns_empty_when_no_detection(self):
        det = HandDetector.__new__(HandDetector)
        det.detection_result = None
        self.assertEqual(det.extract_hands(640, 480), [])

    def test_extract_hands_formats_pixel_and_normalized_coords(self):
        det = HandDetector.__new__(HandDetector)
        fake_lms = [SimpleNamespace(x=0.5, y=0.25, z=-0.02) for _ in range(21)]
        fake_cat = SimpleNamespace(category_name="Right", score=0.95)
        det.detection_result = SimpleNamespace(
            hand_landmarks=[fake_lms],
            handedness=[[fake_cat]],
        )
        hands = det.extract_hands(640, 480)
        self.assertEqual(len(hands), 1)
        self.assertEqual(hands[0]["label"], "Right")
        self.assertEqual(hands[0]["landmarks"][0], (320.0, 120.0, -0.02))
        self.assertEqual(hands[0]["norm_landmarks"][8], (0.5, 0.25))


if __name__ == "__main__":
    unittest.main()
