import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.guitar_engine import GuitarEngine


def h(index: int, is_ok: bool = False, is_fist: bool = False, pinch=(0.5, 0.5), probe=(0.5, 0.5)) -> dict:
    return {
        "index": index,
        "is_ok": is_ok,
        "is_fist": is_fist,
        "pinch_point": pinch,
        "probe_point": probe,
    }


class TestGuitarEngine(unittest.TestCase):
    def setUp(self):
        self.engine = GuitarEngine(aspect=4.0 / 3.0, multi_string=True)

    def _stretch_and_lock(self, p1=(0.25, 0.5), p2=(0.75, 0.5), start_t=10.0, engine=None):
        eng = engine or self.engine
        t = start_t
        for _ in range(2):
            res = eng.update([h(0, is_ok=True, pinch=p1), h(1, is_ok=True, pinch=p2)], now=t)
            t += 0.025
        self.assertEqual(res["state"], "STRETCHING")
        for _ in range(2):
            res = eng.update([h(0, is_ok=False, probe=p1), h(1, is_ok=False, probe=p2)], now=t)
            t += 0.025
        self.assertEqual(res["state"], "LOCKED")
        return res, t

    def test_fast_double_ok_enters_stretching_in_2_frames_and_locks_in_2_frames(self):
        r1 = self.engine.update([h(0, is_ok=True, pinch=(0.2, 0.5)), h(1, is_ok=True, pinch=(0.7, 0.5))], now=1.0)
        self.assertEqual(r1["state"], "IDLE")

        r2 = self.engine.update([h(0, is_ok=True, pinch=(0.2, 0.5)), h(1, is_ok=True, pinch=(0.7, 0.5))], now=1.025)
        self.assertEqual(r2["state"], "STRETCHING")
        self.assertIsNotNone(r2["string"])

        # Release OK -> 1 frame flicker stays STRETCHING, 2nd frame locks immediately
        r_rel1 = self.engine.update([h(0, is_ok=False), h(1, is_ok=False)], now=1.05)
        self.assertEqual(r_rel1["state"], "STRETCHING")
        locked = self.engine.update([h(0, is_ok=False), h(1, is_ok=False)], now=1.075)
        self.assertEqual(locked["state"], "LOCKED")
        self.assertEqual(len(locked["strings"]), 1)
        self.assertGreaterEqual(locked["string"]["length"], 0.12)

    def test_single_frame_flicker_does_not_abort_stretching(self):
        for i in range(2):
            self.engine.update([h(0, is_ok=True, pinch=(0.2, 0.5)), h(1, is_ok=True, pinch=(0.7, 0.5))], now=2.0 + i * 0.025)

        flicker = self.engine.update([h(0, is_ok=True, pinch=(0.2, 0.5)), h(1, is_ok=False)], now=2.075)
        self.assertEqual(flicker["state"], "STRETCHING")

        restored = self.engine.update([h(0, is_ok=True, pinch=(0.2, 0.5)), h(1, is_ok=True, pinch=(0.7, 0.5))], now=2.10)
        self.assertEqual(restored["state"], "STRETCHING")

    def test_microscopic_pinch_below_0_12_does_not_lock(self):
        self._stretch_and_lock(p1=(0.25, 0.5), p2=(0.75, 0.5), start_t=3.0)
        t = 4.0
        for _ in range(2):
            self.engine.update([h(0, is_ok=True, pinch=(0.50, 0.5)), h(1, is_ok=True, pinch=(0.55, 0.5))], now=t)
            t += 0.025
        for _ in range(2):
            res = self.engine.update([h(0, is_ok=False), h(1, is_ok=False)], now=t)
            t += 0.025
        self.assertEqual(res["state"], "LOCKED")
        self.assertEqual(len(res["strings"]), 1)
        self.assertAlmostEqual(res["string"]["length"], 0.50, places=2)

        fresh = GuitarEngine(aspect=4.0 / 3.0)
        for i in range(2):
            fresh.update([h(0, is_ok=True, pinch=(0.50, 0.5)), h(1, is_ok=True, pinch=(0.54, 0.5))], now=1.0 + i * 0.025)
        for i in range(2):
            res2 = fresh.update([h(0, is_ok=False), h(1, is_ok=False)], now=1.1 + i * 0.025)
        self.assertEqual(res2["state"], "IDLE")
        self.assertIsNone(res2["string"])
        self.assertEqual(res2["strings"], [])

    def test_post_lock_grace_and_fast_segment_intersection_strum(self):
        _, lock_done_t = self._stretch_and_lock(p1=(0.2, 0.5), p2=(0.8, 0.5), start_t=5.0)
        # Cross string immediately within 0.14s grace
        self.engine.update([h(0, probe=(0.5, 0.45))], now=lock_done_t + 0.02)
        early = self.engine.update([h(0, probe=(0.5, 0.55))], now=lock_done_t + 0.06)
        self.assertEqual(early["events"], [])

        # Fast wide swipe crossing string after 0.14s grace (even > 0.10 distance away!)
        self.engine.update([h(0, probe=(0.5, 0.62))], now=lock_done_t + 0.20)
        fast_swipe = self.engine.update([h(0, probe=(0.5, 0.28))], now=lock_done_t + 0.23)
        self.assertEqual(len(fast_swipe["events"]), 1)
        self.assertEqual(fast_swipe["events"][0]["type"], "strum")
        self.assertAlmostEqual(fast_swipe["events"][0]["t"], 0.5, places=1)

    def test_multi_string_pinning_and_sweep_strums_all_crossed_strings(self):
        _, t = self._stretch_and_lock(p1=(0.2, 0.35), p2=(0.8, 0.35), start_t=5.5)
        res2, t = self._stretch_and_lock(p1=(0.2, 0.65), p2=(0.8, 0.65), start_t=t + 0.2)
        self.assertEqual(len(res2["strings"]), 2)
        self.assertNotEqual(res2["strings"][0]["id"], res2["strings"][1]["id"])

        # Sweep vertically across both strings in one fast motion
        t += 0.25
        self.engine.update([h(0, probe=(0.5, 0.28))], now=t)
        sweep = self.engine.update([h(0, probe=(0.5, 0.72))], now=t + 0.04)
        self.assertEqual(len(sweep["events"]), 2)
        self.assertEqual({ev["string_index"] for ev in sweep["events"]}, {0, 1})

    def test_single_string_mode_replaces_existing_string(self):
        single = GuitarEngine(aspect=4.0 / 3.0, multi_string=False)
        self._stretch_and_lock(p1=(0.2, 0.35), p2=(0.8, 0.35), start_t=6.0, engine=single)
        res2, _ = self._stretch_and_lock(p1=(0.2, 0.65), p2=(0.8, 0.65), start_t=7.0, engine=single)
        self.assertEqual(len(res2["strings"]), 1)
        self.assertAlmostEqual(res2["strings"][0]["y1"], 0.65, places=1)

    def test_shake_near_locked_string_triggers_without_full_crossing(self):
        _, t = self._stretch_and_lock(p1=(0.2, 0.5), p2=(0.8, 0.5), start_t=6.0)
        t += 0.25
        self.engine.update([h(0, probe=(0.5, 0.48))], now=t)
        self.engine.update([h(0, probe=(0.5, 0.46))], now=t + 0.025)
        shake1 = self.engine.update([h(0, probe=(0.5, 0.49))], now=t + 0.05)
        self.assertEqual(len(shake1["events"]), 1)
        self.assertEqual(shake1["events"][0]["type"], "strum")

        # Cooldown (< 0.08s) blocks double-fire on immediate frame
        self.engine.update([h(0, probe=(0.5, 0.46))], now=t + 0.07)
        cooldown_blocked = self.engine.update([h(0, probe=(0.5, 0.49))], now=t + 0.09)
        self.assertEqual(cooldown_blocked["events"], [])

    def test_diagonal_string_crossing_and_register_zones(self):
        short_res, _ = self._stretch_and_lock(p1=(0.4, 0.5), p2=(0.6, 0.5), start_t=7.0)
        self.assertEqual(short_res["string"]["register"], "SHORT")

        diag_engine = GuitarEngine(aspect=4.0 / 3.0)
        _, t = self._stretch_and_lock(p1=(0.2, 0.8), p2=(0.8, 0.2), start_t=8.0, engine=diag_engine)
        self.assertEqual(diag_engine.update([], now=t + 0.02)["string"]["register"], "LONG")

        t += 0.25
        diag_engine.update([h(0, probe=(0.45, 0.45))], now=t)
        hit = diag_engine.update([h(0, probe=(0.55, 0.55))], now=t + 0.03)
        self.assertEqual(len(hit["events"]), 1)

    def test_fist_hold_clears_locked_strings(self):
        _, t = self._stretch_and_lock(p1=(0.2, 0.5), p2=(0.8, 0.5), start_t=9.0)
        self.engine.update([h(0, is_fist=True)], now=t + 0.05)
        mid = self.engine.update([h(0, is_fist=True)], now=t + 0.45)
        self.assertEqual(mid["state"], "LOCKED")
        self.assertGreater(mid["clear_progress"], 0.4)

        done = self.engine.update([h(0, is_fist=True)], now=t + 0.90)
        self.assertEqual(done["state"], "IDLE")
        self.assertEqual(done["strings"], [])
        self.assertEqual(done["clear_progress"], 0.0)

    def test_probe_teleport_on_hand_swap_does_not_fire_phantom_strum(self):
        _, t = self._stretch_and_lock(p1=(0.15, 0.5), p2=(0.85, 0.5), start_t=11.0)
        t += 0.25
        self.engine.update([h(0, probe=(0.25, 0.42))], now=t)
        swap = self.engine.update([h(0, probe=(0.75, 0.58))], now=t + 0.025)
        self.assertEqual(swap["events"], [])

    def test_hand_index_swap_does_not_cause_phantom_strum(self):
        _, t = self._stretch_and_lock(p1=(0.15, 0.5), p2=(0.85, 0.5), start_t=12.0)
        t += 0.25
        self.engine.update([h(0, probe=(0.30, 0.45)), h(1, probe=(0.70, 0.55))], now=t)
        res = self.engine.update([h(0, probe=(0.70, 0.55)), h(1, probe=(0.30, 0.45))], now=t + 0.025)
        self.assertEqual(res["events"], [])

    def test_vertical_string_stretch_does_not_invert_endpoints(self):
        t = 13.0
        for _ in range(2):
            self.engine.update([h(0, is_ok=True, pinch=(0.50, 0.20)), h(1, is_ok=True, pinch=(0.51, 0.80))], now=t)
            t += 0.025
        res = self.engine.update([h(0, is_ok=True, pinch=(0.51, 0.21)), h(1, is_ok=True, pinch=(0.50, 0.79))], now=t)
        self.assertEqual(res["state"], "STRETCHING")
        self.assertGreater(res["string"]["length"], 0.40)


if __name__ == "__main__":
    unittest.main()
