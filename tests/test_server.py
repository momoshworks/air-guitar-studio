import json
import os
import socket
import sys
import threading
import time
import unittest
import urllib.request

os.environ["AIR_GUITAR_NO_CAMERA"] = "1"
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import uvicorn
from websockets.sync.client import connect as ws_connect
from main import app, manager


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


class TestServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.port = _free_port()
        config = uvicorn.Config(app, host="127.0.0.1", port=cls.port, log_level="error")
        cls.server = uvicorn.Server(config)
        cls.thread = threading.Thread(target=cls.server.run, daemon=True)
        cls.thread.start()
        deadline = time.time() + 5.0
        while time.time() < deadline:
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{cls.port}/health", timeout=0.5) as r:
                    if r.status == 200:
                        break
            except Exception:
                time.sleep(0.05)

    @classmethod
    def tearDownClass(cls):
        cls.server.should_exit = True
        cls.thread.join(timeout=3.0)

    def test_health_endpoint_returns_ok(self):
        with urllib.request.urlopen(f"http://127.0.0.1:{self.port}/health", timeout=2.0) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode("utf-8"))
            self.assertEqual(data["status"], "ok")
            self.assertEqual(data["state"], "IDLE")
            self.assertIn("camera_ready", data)

    def test_index_returns_html(self):
        with urllib.request.urlopen(f"http://127.0.0.1:{self.port}/", timeout=2.0) as resp:
            self.assertEqual(resp.status, 200)
            self.assertIn("text/html", resp.headers.get("Content-Type", ""))
            body = resp.read().decode("utf-8")
            self.assertIn("Air Guitar Studio", body)

    def test_ws_reset_and_malformed_sensitivity_commands(self):
        with ws_connect(f"ws://127.0.0.1:{self.port}/ws") as ws:
            first = json.loads(ws.recv(timeout=2.0))
            self.assertIn("state", first)
            self.assertIn("hands", first)
            self.assertIn("frame_w", first)
            self.assertIn("frame_h", first)

            ws.send(json.dumps({"type": "set_sensitivity", "value": 99.0}))
            ws.send(json.dumps({"type": "set_sensitivity", "value": "NaN"}))
            ws.send(json.dumps({"type": "set_sensitivity", "value": True}))
            ws.send(json.dumps({"type": "set_multi_string", "value": False}))
            ws.send("not-json")
            ws.send(json.dumps({"type": "reset"}))

            nxt = json.loads(ws.recv(timeout=2.0))
            self.assertEqual(nxt["state"], "IDLE")
            self.assertEqual(manager.engine.sensitivity, 1.5)
            self.assertFalse(manager.engine.multi_string)
            ws.send(json.dumps({"type": "set_multi_string", "value": True}))

    def test_new_ws_client_does_not_replay_historical_strums(self):
        with manager._lock:
            manager._event_seq += 1
            manager._event_buffer.append((manager._event_seq, {"type": "strum", "t": 0.5, "velocity": 0.9, "hand_index": 0}))

        with ws_connect(f"ws://127.0.0.1:{self.port}/ws") as ws:
            first = json.loads(ws.recv(timeout=2.0))
            self.assertEqual(first["events"], [])

        # Reset must also clear pending buffer
        manager.handle_ws_command(json.dumps({"type": "reset"}))
        self.assertEqual(len(manager._event_buffer), 0)

    def test_placeholder_jpeg_valid_when_camera_disabled(self):
        jpeg = manager.get_latest_jpeg()
        self.assertIsNotNone(jpeg)
        self.assertTrue(jpeg.startswith(b"\xff\xd8"))


if __name__ == "__main__":
    unittest.main()
