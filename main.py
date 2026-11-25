"""FastAPI backend, MJPEG camera stream, and instant-push WebSocket telemetry server."""

import asyncio
import json
import math
import os
import sys
import threading
import time
from collections import deque
from contextlib import asynccontextmanager
from typing import Deque, Dict, List, Optional, Tuple

import cv2
import numpy as np
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from core.detector import HandDetector
from core.gestures import GestureAnalyzer
from core.guitar_engine import GuitarEngine


def _build_placeholder_jpeg(width: int = 640, height: int = 480) -> bytes:
    """Create a dark studio placeholder JPEG when no physical webcam is available."""
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    frame[:, :] = (18, 16, 26)
    cv2.putText(
        frame,
        "AIR GUITAR STUDIO - CAMERA STANDBY",
        (80, height // 2),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (0, 220, 255),
        2,
        cv2.LINE_AA,
    )
    ok, buf = cv2.imencode(".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
    return buf.tobytes() if ok else b""


class AirGuitarManager:
    """Background camera + hand-tracking worker feeding MJPEG and instant WebSocket clients."""

    OK_MATCH_MAX_DIST = 0.22

    def __init__(
        self,
        camera_id: int = 0,
        width: int = 640,
        height: int = 480,
        enable_camera: bool = True,
    ) -> None:
        self.camera_id = camera_id
        self.width = width
        self.height = height
        self.enable_camera = enable_camera

        self.analyzer = GestureAnalyzer()
        self.engine = GuitarEngine(aspect=width / float(height), multi_string=True)
        self.detector: Optional[HandDetector] = None

        self._lock = threading.Lock()
        self._frame_cond = threading.Condition(self._lock)
        self._frame_seq = 0

        self._placeholder_jpeg = _build_placeholder_jpeg(width, height)
        self._latest_jpeg: bytes = self._placeholder_jpeg
        self._camera_ready = False
        self._prev_ok_points: List[Tuple[Tuple[float, float], bool]] = []

        self._event_seq = 0
        self._event_buffer: Deque[Tuple[int, Dict]] = deque(maxlen=64)

        self._latest_snapshot: Dict = {
            "fps": 0,
            "frame_w": width,
            "frame_h": height,
            "camera_ready": False,
            "state": self.engine.state,
            "string": None,
            "strings": [],
            "stretching": None,
            "clear_progress": 0.0,
            "hands": [],
        }

        self._is_running = False
        self._thread: Optional[threading.Thread] = None
        self._cap = None

    def start(self) -> None:
        if self._is_running:
            return
        self._is_running = True
        if self.enable_camera:
            self._thread = threading.Thread(target=self._capture_loop, daemon=True)
            self._thread.start()

    def stop(self) -> None:
        self._is_running = False
        with self._frame_cond:
            self._frame_cond.notify_all()
        if self._thread is not None:
            self._thread.join(timeout=2.5)
            self._thread = None
        if self._cap is not None:
            self._cap.release()
            self._cap = None
        if self.detector is not None:
            self.detector.close()
            self.detector = None

    def get_latest_jpeg(self) -> bytes:
        with self._lock:
            return self._latest_jpeg

    def current_event_seq(self) -> int:
        with self._lock:
            return self._event_seq

    def wait_next_packet(self, last_frame_seq: int, last_event_seq: int, timeout: float = 0.05) -> Tuple[Dict, int, int]:
        """Block briefly until a new processed frame arrives so WS pushes with zero polling lag."""
        with self._frame_cond:
            if self._frame_seq == last_frame_seq:
                self._frame_cond.wait(timeout=timeout)
            snapshot = dict(self._latest_snapshot)
            events = [ev for seq, ev in self._event_buffer if seq > last_event_seq]
            new_frame_seq = self._frame_seq
            new_event_seq = self._event_seq
        snapshot["events"] = events
        return snapshot, new_frame_seq, new_event_seq

    def get_telemetry_for_client(self, last_event_seq: int) -> Tuple[Dict, int]:
        with self._lock:
            snapshot = dict(self._latest_snapshot)
            events = [ev for seq, ev in self._event_buffer if seq > last_event_seq]
            newest_seq = self._event_seq
        snapshot["events"] = events
        return snapshot, newest_seq

    def _sync_snapshot_locked(self) -> None:
        self._latest_snapshot["state"] = self.engine.state
        self._latest_snapshot["strings"] = [
            self.engine._serialize_segment(s["p1"], s["p2"], s["id"])
            for s in self.engine.locked_strings
        ]
        self._latest_snapshot["string"] = (
            self._latest_snapshot["strings"][-1] if self._latest_snapshot["strings"] else None
        )
        self._latest_snapshot["stretching"] = None
        self._latest_snapshot["clear_progress"] = 0.0
        self._frame_seq += 1
        self._frame_cond.notify_all()

    def handle_ws_command(self, raw_text: str) -> None:
        try:
            payload = json.loads(raw_text)
        except Exception:
            return
        if not isinstance(payload, dict):
            return

        cmd = payload.get("type")
        with self._lock:
            if cmd == "reset":
                self.engine.reset()
                self._event_buffer.clear()
                self._sync_snapshot_locked()
            elif cmd == "undo":
                self.engine.undo_last_string()
                self._sync_snapshot_locked()
            elif cmd == "set_multi_string":
                val = payload.get("value", True)
                if isinstance(val, bool):
                    self.engine.set_multi_string(val)
                    self._sync_snapshot_locked()
            elif cmd == "set_sensitivity":
                raw_val = payload.get("value", 1.0)
                if isinstance(raw_val, bool):
                    return
                try:
                    val = float(raw_val)
                except (TypeError, ValueError):
                    return
                if not math.isfinite(val):
                    return
                self.engine.set_sensitivity(val)

    def _lookup_prev_ok(self, wrist_norm: Tuple[float, float]) -> bool:
        best_dist = self.OK_MATCH_MAX_DIST
        best_ok = False
        for pt, was_ok in self._prev_ok_points:
            d = math.hypot(wrist_norm[0] - pt[0], wrist_norm[1] - pt[1])
            if d < best_dist:
                best_dist = d
                best_ok = was_ok
        return best_ok

    def _open_camera(self):
        cap = cv2.VideoCapture(self.camera_id, cv2.CAP_DSHOW)
        if not cap.isOpened():
            cap = cv2.VideoCapture(self.camera_id)
        if cap.isOpened():
            cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*"MJPG"))
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
            cap.set(cv2.CAP_PROP_FPS, 60)
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        return cap

    def _capture_loop(self) -> None:
        self.detector = HandDetector(max_hands=2, detection_con=0.60, track_con=0.55)
        self._cap = self._open_camera()
        prev_time = time.perf_counter()

        while self._is_running:
            if self._cap is None or not self._cap.isOpened():
                with self._lock:
                    self._camera_ready = False
                    self._latest_snapshot["camera_ready"] = False
                time.sleep(0.5)
                self._cap = self._open_camera()
                continue

            ok, frame = self._cap.read()
            if not ok:
                time.sleep(0.008)
                continue

            img = self.detector.process_frame(frame, flip=True)
            h, w = img.shape[:2]
            raw_hands = self.detector.extract_hands(w, h)

            analyzed_hands: List[Dict] = []
            public_hands: List[Dict] = []
            next_ok_points: List[Tuple[Tuple[float, float], bool]] = []

            for hand in raw_hands:
                idx = hand["index"]
                wrist_pt = hand["norm_landmarks"][0]
                prev_ok = self._lookup_prev_ok(wrist_pt)
                info = self.analyzer.analyze(hand, prev_ok=prev_ok)
                next_ok_points.append((wrist_pt, info["is_ok"]))

                analyzed_hands.append(
                    {
                        "index": idx,
                        "label": hand["label"],
                        "is_ok": info["is_ok"],
                        "is_fist": info["is_fist"],
                        "pinch_point": info["pinch_point"],
                        "probe_point": info["probe_point"],
                    }
                )
                public_hands.append(
                    {
                        "index": idx,
                        "label": hand["label"],
                        "gesture": info["gesture"],
                        "gesture_ar": info["gesture_ar"],
                        "emoji": info["emoji"],
                        "is_ok": info["is_ok"],
                        "is_fist": info["is_fist"],
                        "pinch": [round(info["pinch_point"][0], 4), round(info["pinch_point"][1], 4)],
                        "probe": [round(info["probe_point"][0], 4), round(info["probe_point"][1], 4)],
                        "landmarks": [
                            [round(hand["norm_landmarks"][i][0], 4), round(hand["norm_landmarks"][i][1], 4)]
                            for i in range(21)
                        ],
                    }
                )

            self._prev_ok_points = next_ok_points

            now_perf = time.perf_counter()
            fps = int(round(1.0 / max(1e-4, now_perf - prev_time)))
            prev_time = now_perf

            ok_encode, jpg_buf = cv2.imencode(".jpg", img, [int(cv2.IMWRITE_JPEG_QUALITY), 75])

            with self._frame_cond:
                self.engine.aspect = w / float(h)
                engine_out = self.engine.update(analyzed_hands)
                for ev in engine_out["events"]:
                    self._event_seq += 1
                    self._event_buffer.append((self._event_seq, ev))

                if ok_encode:
                    self._latest_jpeg = jpg_buf.tobytes()
                self._camera_ready = True

                self._latest_snapshot = {
                    "fps": fps,
                    "frame_w": w,
                    "frame_h": h,
                    "camera_ready": True,
                    "state": engine_out["state"],
                    "string": engine_out["string"],
                    "strings": engine_out["strings"],
                    "stretching": engine_out["stretching"],
                    "clear_progress": engine_out["clear_progress"],
                    "hands": public_hands,
                }
                self._frame_seq += 1
                self._frame_cond.notify_all()


ENABLE_CAMERA = os.environ.get("AIR_GUITAR_NO_CAMERA", "0") != "1"
manager = AirGuitarManager(enable_camera=ENABLE_CAMERA)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    manager.start()
    try:
        yield
    finally:
        manager.stop()


app = FastAPI(title="Air Guitar Studio", version="1.2.0", lifespan=lifespan)
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse(request, "index.html")


@app.get("/health")
async def health():
    snapshot, _ = manager.get_telemetry_for_client(0)
    return JSONResponse(
        {
            "status": "ok",
            "state": snapshot["state"],
            "fps": snapshot["fps"],
            "camera_ready": snapshot["camera_ready"],
        }
    )


def _mjpeg_generator():
    while True:
        frame = manager.get_latest_jpeg()
        if frame:
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n"
                + f"Content-Length: {len(frame)}\r\n\r\n".encode("ascii")
                + frame
                + b"\r\n"
            )
        time.sleep(0.016)


@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(_mjpeg_generator(), media_type="multipart/x-mixed-replace; boundary=frame")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    last_event_seq = manager.current_event_seq()
    last_frame_seq = -1

    async def receiver():
        try:
            while True:
                raw = await websocket.receive_text()
                manager.handle_ws_command(raw)
        except WebSocketDisconnect:
            pass
        except Exception:
            pass

    recv_task = asyncio.create_task(receiver())
    try:
        while not recv_task.done():
            packet, last_frame_seq, last_event_seq = await asyncio.to_thread(
                manager.wait_next_packet, last_frame_seq, last_event_seq, 0.04
            )
            await websocket.send_json(packet)
    except WebSocketDisconnect:
        pass
    finally:
        recv_task.cancel()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)
