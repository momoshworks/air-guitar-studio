"""Fast-response state machine, multi-string pinning, and segment-sweep strum engine."""

import math
import time
from typing import Dict, List, Optional, Tuple

Point2D = Tuple[float, float]


class GuitarEngine:
    """Manages two-hand OK stretching, multi-string mid-air pinning, and fast strum/shake detection."""

    STATE_IDLE = "IDLE"
    STATE_STRETCHING = "STRETCHING"
    STATE_LOCKED = "LOCKED"

    OK_ENTER_FRAMES_IDLE = 2
    OK_ENTER_FRAMES_LOCKED = 2
    RELEASE_FRAMES = 2
    MIN_STRING_LENGTH = 0.12
    MAX_STRINGS = 8
    EMA_ALPHA = 0.55
    POST_LOCK_GRACE_SEC = 0.14
    FIST_CLEAR_SEC = 0.85
    STRUM_COOLDOWN_SEC = 0.08

    HIT_T_MIN = -0.08
    HIT_T_MAX = 1.08
    CROSS_DIST_MAX = 0.12
    CROSS_SPEED_MIN = 0.22
    SHAKE_DIST_MAX = 0.06
    SHAKE_SPEED_MIN = 0.30

    MAX_PROBE_MATCH_DIST = 0.45
    MAX_PROBE_DT = 0.25

    def __init__(self, aspect: float = 4.0 / 3.0, multi_string: bool = True) -> None:
        self.aspect = max(0.5, float(aspect))
        self.multi_string = bool(multi_string)
        self.sensitivity = 1.0
        self.state = self.STATE_IDLE

        self._next_string_id = 1
        self.locked_strings: List[Dict] = []
        self.stretching_string: Optional[Tuple[Point2D, Point2D]] = None

        self._ok_streak = 0
        self._release_streak = 0
        self._fist_start: Optional[float] = None
        self._next_track_id = 1
        self._probe_tracks: Dict[int, Dict] = {}

    def set_sensitivity(self, value: float) -> None:
        """Clamp and store strum sensitivity multiplier in [0.5, 1.5]."""
        if isinstance(value, bool):
            return
        val = float(value)
        if not math.isfinite(val):
            return
        self.sensitivity = max(0.5, min(1.5, val))

    def set_multi_string(self, enabled: bool) -> None:
        """Toggle multi-string stacking mode."""
        self.multi_string = bool(enabled)
        if not self.multi_string and len(self.locked_strings) > 1:
            self.locked_strings = [self.locked_strings[-1]]

    def undo_last_string(self) -> None:
        """Remove the most recently pinned string."""
        if self.locked_strings:
            self.locked_strings.pop()
        if not self.locked_strings and self.stretching_string is None:
            self.state = self.STATE_IDLE
        self._probe_tracks.clear()

    def reset(self) -> None:
        """Clear all pinned/stretching strings and return to IDLE."""
        self.state = self.STATE_IDLE
        self.locked_strings.clear()
        self.stretching_string = None
        self._ok_streak = 0
        self._release_streak = 0
        self._fist_start = None
        self._probe_tracks.clear()

    def _aspect_length(self, p1: Point2D, p2: Point2D) -> float:
        return math.hypot(p2[0] - p1[0], (p2[1] - p1[1]) / self.aspect)

    @staticmethod
    def _order_endpoints(p1: Point2D, p2: Point2D) -> Tuple[Point2D, Point2D]:
        return (p1, p2) if p1[0] <= p2[0] else (p2, p1)

    @staticmethod
    def _pair_endpoints(
        old_p1: Point2D, old_p2: Point2D, raw_a: Point2D, raw_b: Point2D
    ) -> Tuple[Point2D, Point2D]:
        d_same = (raw_a[0] - old_p1[0]) ** 2 + (raw_a[1] - old_p1[1]) ** 2 + (
            raw_b[0] - old_p2[0]
        ) ** 2 + (raw_b[1] - old_p2[1]) ** 2
        d_swap = (raw_b[0] - old_p1[0]) ** 2 + (raw_b[1] - old_p1[1]) ** 2 + (
            raw_a[0] - old_p2[0]
        ) ** 2 + (raw_a[1] - old_p2[1]) ** 2
        return (raw_a, raw_b) if d_same <= d_swap else (raw_b, raw_a)

    def _classify_register(self, length: float) -> str:
        if length < 0.32:
            return "SHORT"
        if length <= 0.52:
            return "MID"
        return "LONG"

    def _serialize_segment(self, p1: Point2D, p2: Point2D, string_id: int = 0) -> Dict:
        length = self._aspect_length(p1, p2)
        return {
            "id": string_id,
            "x1": round(p1[0], 5),
            "y1": round(p1[1], 5),
            "x2": round(p2[0], 5),
            "y2": round(p2[1], 5),
            "length": round(length, 5),
            "register": self._classify_register(length),
        }

    def _project_point_on(self, pt: Point2D, p1: Point2D, p2: Point2D) -> Tuple[float, float]:
        ax = p2[0] - p1[0]
        ay = (p2[1] - p1[1]) / self.aspect
        seg_len = math.hypot(ax, ay)
        if seg_len < 1e-6:
            return 0.0, 999.0

        tx, ty = ax / seg_len, ay / seg_len
        nx, ny = -ty, tx
        rx = pt[0] - p1[0]
        ry = (pt[1] - p1[1]) / self.aspect

        t = (rx * tx + ry * ty) / seg_len
        d = rx * nx + ry * ny
        return t, d

    @staticmethod
    def _segments_intersect(a1: Point2D, a2: Point2D, b1: Point2D, b2: Point2D) -> Optional[float]:
        """Return parameter u in [0,1] along b1->b2 if segment a1->a2 intersects b1->b2."""
        r_x, r_y = a2[0] - a1[0], a2[1] - a1[1]
        s_x, s_y = b2[0] - b1[0], b2[1] - b1[1]
        denom = r_x * s_y - r_y * s_x
        if abs(denom) < 1e-8:
            return None
        qpx, qpy = b1[0] - a1[0], b1[1] - a1[1]
        t_hand = (qpx * s_y - qpy * s_x) / denom
        u_str = (qpx * r_y - qpy * r_x) / denom
        if 0.0 <= t_hand <= 1.0 and -0.06 <= u_str <= 1.06:
            return max(0.0, min(1.0, u_str))
        return None

    def _match_probe_tracks(self, probes: List[Tuple[int, str, Point2D]]) -> List[Tuple[int, int, str, Point2D]]:
        candidates = []
        for hand_idx, label, pt in probes:
            for tid, track in self._probe_tracks.items():
                if label and track["label"] and label != track["label"]:
                    continue
                dist = math.hypot(pt[0] - track["x"], pt[1] - track["y"])
                if dist <= self.MAX_PROBE_MATCH_DIST:
                    candidates.append((dist, hand_idx, tid, label, pt))
        candidates.sort(key=lambda item: item[0])

        assigned_hands = set()
        used_tracks = set()
        matched: List[Tuple[int, int, str, Point2D]] = []
        for _dist, hand_idx, tid, label, pt in candidates:
            if hand_idx in assigned_hands or tid in used_tracks:
                continue
            assigned_hands.add(hand_idx)
            used_tracks.add(tid)
            matched.append((tid, hand_idx, label, pt))

        for hand_idx, label, pt in probes:
            if hand_idx not in assigned_hands:
                tid = self._next_track_id
                self._next_track_id += 1
                matched.append((tid, hand_idx, label, pt))

        active_tids = {m[0] for m in matched}
        for stale_tid in list(self._probe_tracks.keys()):
            if stale_tid not in active_tids:
                self._probe_tracks.pop(stale_tid, None)
        return matched

    def _detect_strums(self, hands: List[Dict], now: float) -> List[Dict]:
        events: List[Dict] = []
        if not self.locked_strings:
            return events

        cross_speed_thresh = self.CROSS_SPEED_MIN / self.sensitivity
        shake_speed_thresh = self.SHAKE_SPEED_MIN / self.sensitivity

        probes: List[Tuple[int, str, Point2D]] = []
        for i, hand in enumerate(hands):
            probe = hand.get("probe_point") or hand.get("pinch_point")
            if probe is not None:
                probes.append((int(hand.get("index", i)), str(hand.get("label", "")), probe))

        for tid, hand_idx, label, probe in self._match_probe_tracks(probes):
            track = self._probe_tracks.get(tid)
            if track is None:
                per_string = {}
                for str_obj in self.locked_strings:
                    _, d_init = self._project_point_on(probe, str_obj["p1"], str_obj["p2"])
                    per_string[str_obj["id"]] = {"d": d_init, "v_perp": 0.0, "last_strum": -10.0}
                self._probe_tracks[tid] = {
                    "x": probe[0],
                    "y": probe[1],
                    "label": label,
                    "t_sec": now,
                    "per_string": per_string,
                }
                continue

            dt = now - track["t_sec"]
            prev_pt = (track["x"], track["y"])
            if dt <= 0.0 or dt > self.MAX_PROBE_DT:
                track["x"], track["y"], track["t_sec"] = probe[0], probe[1], now
                track["per_string"].clear()
                continue

            dt_safe = max(1e-3, dt)
            total_speed = math.hypot(probe[0] - prev_pt[0], (probe[1] - prev_pt[1]) / self.aspect) / dt_safe

            for s_idx, str_obj in enumerate(self.locked_strings):
                in_grace = (now - str_obj["lock_time"]) < self.POST_LOCK_GRACE_SEC
                sid = str_obj["id"]
                p1, p2 = str_obj["p1"], str_obj["p2"]
                t_proj, d_curr = self._project_point_on(probe, p1, p2)
                s_hist = track["per_string"].get(sid)

                if s_hist is None:
                    track["per_string"][sid] = {
                        "d": d_curr,
                        "v_perp": 0.0,
                        "last_strum": -10.0,
                    }
                    continue

                d_prev = s_hist["d"]
                v_perp = (d_curr - d_prev) / dt_safe
                v_prev = s_hist["v_perp"]
                perp_speed = abs(v_perp)
                in_segment = self.HIT_T_MIN <= t_proj <= self.HIT_T_MAX

                if not in_grace:
                    u_hit = self._segments_intersect(prev_pt, probe, p1, p2)
                    segment_crossed = u_hit is not None and max(perp_speed, total_speed) >= cross_speed_thresh

                    near_crossed = (
                        in_segment
                        and abs(d_prev) < self.CROSS_DIST_MAX
                        and abs(d_curr) < self.CROSS_DIST_MAX
                        and (d_prev * d_curr < 0.0 or (d_curr == 0.0 and d_prev != 0.0))
                        and perp_speed >= cross_speed_thresh
                    )

                    shaken = (
                        in_segment
                        and abs(d_curr) <= self.SHAKE_DIST_MAX
                        and (v_prev * v_perp < 0.0)
                        and perp_speed >= shake_speed_thresh
                    )

                    if (segment_crossed or near_crossed or shaken) and (now - s_hist["last_strum"]) >= self.STRUM_COOLDOWN_SEC:
                        hit_t = u_hit if u_hit is not None else max(0.0, min(1.0, t_proj))
                        eff_speed = max(perp_speed, total_speed * 0.8)
                        velocity = max(0.28, min(1.0, eff_speed / 2.0))
                        events.append(
                            {
                                "type": "strum",
                                "string_id": sid,
                                "string_index": s_idx,
                                "t": round(hit_t, 4),
                                "velocity": round(velocity, 4),
                                "hand_index": hand_idx,
                            }
                        )
                        s_hist["last_strum"] = now

                s_hist["d"] = d_curr
                s_hist["v_perp"] = v_perp

            track["x"], track["y"], track["t_sec"] = probe[0], probe[1], now

        return events

    def update(self, hands: List[Dict], now: Optional[float] = None) -> Dict:
        """Advance string state machine and return current telemetry and strum events."""
        ts = time.monotonic() if now is None else float(now)
        ok_hands = [h for h in hands if h.get("is_ok")]
        double_ok = len(ok_hands) >= 2
        any_fist = any(h.get("is_fist") for h in hands)
        events: List[Dict] = []
        clear_progress = 0.0

        if self.state == self.STATE_IDLE:
            if double_ok:
                self._ok_streak += 1
                if self._ok_streak >= self.OK_ENTER_FRAMES_IDLE:
                    p1, p2 = self._order_endpoints(ok_hands[0]["pinch_point"], ok_hands[1]["pinch_point"])
                    self.stretching_string = (p1, p2)
                    self.state = self.STATE_STRETCHING
                    self._release_streak = 0
                    self._ok_streak = 0
            else:
                self._ok_streak = 0

        elif self.state == self.STATE_STRETCHING:
            if double_ok:
                self._release_streak = 0
                raw_a, raw_b = ok_hands[0]["pinch_point"], ok_hands[1]["pinch_point"]
                if self.stretching_string is None:
                    self.stretching_string = self._order_endpoints(raw_a, raw_b)
                else:
                    old_p1, old_p2 = self.stretching_string
                    raw_p1, raw_p2 = self._pair_endpoints(old_p1, old_p2, raw_a, raw_b)
                    a = self.EMA_ALPHA
                    sm_p1 = (old_p1[0] * (1.0 - a) + raw_p1[0] * a, old_p1[1] * (1.0 - a) + raw_p1[1] * a)
                    sm_p2 = (old_p2[0] * (1.0 - a) + raw_p2[0] * a, old_p2[1] * (1.0 - a) + raw_p2[1] * a)
                    self.stretching_string = (sm_p1, sm_p2)
            else:
                self._release_streak += 1
                if self._release_streak >= self.RELEASE_FRAMES:
                    self._release_streak = 0
                    valid_new = (
                        self.stretching_string is not None
                        and self._aspect_length(*self.stretching_string) >= self.MIN_STRING_LENGTH
                    )
                    if valid_new and self.stretching_string is not None:
                        sid = self._next_string_id
                        self._next_string_id += 1
                        new_entry = {
                            "id": sid,
                            "p1": self.stretching_string[0],
                            "p2": self.stretching_string[1],
                            "lock_time": ts,
                        }
                        if self.multi_string:
                            self.locked_strings.append(new_entry)
                            if len(self.locked_strings) > self.MAX_STRINGS:
                                self.locked_strings.pop(0)
                        else:
                            self.locked_strings = [new_entry]
                    self.stretching_string = None
                    if self.locked_strings:
                        self.state = self.STATE_LOCKED
                        self._probe_tracks.clear()
                    else:
                        self.state = self.STATE_IDLE

        elif self.state == self.STATE_LOCKED:
            if double_ok:
                self._fist_start = None
                self._ok_streak += 1
                if self._ok_streak >= self.OK_ENTER_FRAMES_LOCKED:
                    p1, p2 = self._order_endpoints(ok_hands[0]["pinch_point"], ok_hands[1]["pinch_point"])
                    self.stretching_string = (p1, p2)
                    self.state = self.STATE_STRETCHING
                    self._ok_streak = 0
                    self._release_streak = 0
            else:
                self._ok_streak = 0
                if any_fist:
                    self._probe_tracks.clear()
                    if self._fist_start is None:
                        self._fist_start = ts
                    elapsed = ts - self._fist_start
                    if elapsed >= self.FIST_CLEAR_SEC - 1e-6:
                        self.reset()
                        clear_progress = 0.0
                    else:
                        clear_progress = round(min(1.0, elapsed / self.FIST_CLEAR_SEC), 4)
                else:
                    self._fist_start = None
                    events = self._detect_strums(hands, ts)

        serialized_locked = [
            self._serialize_segment(s["p1"], s["p2"], s["id"])
            for s in self.locked_strings
        ]
        primary_string = (
            self._serialize_segment(self.stretching_string[0], self.stretching_string[1], 0)
            if self.stretching_string is not None
            else (serialized_locked[-1] if serialized_locked else None)
        )

        return {
            "state": self.state,
            "string": primary_string,
            "strings": serialized_locked,
            "stretching": self._serialize_segment(self.stretching_string[0], self.stretching_string[1], 0)
            if self.stretching_string is not None
            else None,
            "clear_progress": clear_progress,
            "events": events,
        }
