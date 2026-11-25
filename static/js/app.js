import { ProGuitarAudioEngine, PRESETS, SONGS } from "./audio-engine.js";
import { StageCanvas } from "./stage-canvas.js";

const audio = new ProGuitarAudioEngine();
const canvasEl = document.getElementById("stageCanvas");
const videoStageEl = document.querySelector(".video-stage");
const videoFeedEl = document.getElementById("videoFeed");
const stage = new StageCanvas(canvasEl);

const stateBanner = document.getElementById("stateBanner");
const fpsVal = document.getElementById("fpsVal");
const stringsCountBadge = document.getElementById("stringsCountBadge");
const connDot = document.getElementById("connDot");
const connText = document.getElementById("connText");
const chordBadge = document.getElementById("chordBadge");
const bandBadge = document.getElementById("bandBadge");
const bandBadgeWrap = document.getElementById("bandBadgeWrap");
const registerBadge = document.getElementById("registerBadge");
const songProgressWrap = document.getElementById("songProgressWrap");
const songProgressFill = document.getElementById("songProgressFill");
const audioOverlay = document.getElementById("audioOverlay");
const btnUnlockAudio = document.getElementById("btnUnlockAudio");
const btnUndo = document.getElementById("btnUndo");
const btnReset = document.getElementById("btnReset");
const btnStopSong = document.getElementById("btnStopSong");
const sensitivitySlider = document.getElementById("sensitivitySlider");
const sensitivityVal = document.getElementById("sensitivityVal");

let ws = null;
let currentRegister = "MID";
let isMultiString = true;
let prevState = "IDLE";

const STATE_MESSAGES = {
  IDLE: "اعمل إشارة تمام 👌 بإيديك الاتنين واسحب طول الوتر",
  STRETCHING: "اسحب إيديك لطول الوتر المطلوب.. وفك إيدك عشان يتثبت!",
  LOCKED: "الوتر مثبّت في الهوا 🎸 اهزّه للعزف أو اعمل 👌👌 لإضافة وتر جديد!",
};

const REGISTER_LABELS = {
  SHORT: "طبقة عالية (Lead)",
  MID: "طبقة متوسطة (Standard)",
  LONG: "طبقة عميقة (Bass)",
};

audio.onSongEvent = ({ chordName, progress, isLead, gain, finished }) => {
  if (chordName) {
    chordBadge.textContent = chordName;
  }
  if (songProgressWrap && songProgressFill) {
    songProgressWrap.classList.toggle("active", !finished && audio.songPlayer.isPlaying);
    songProgressFill.style.width = `${Math.round((progress || 0) * 100)}%`;
  }
  if (!finished && gain > 0) {
    stage.triggerSongPulse(gain, isLead);
  }
};

function updateHud(packet) {
  if (packet.frame_w > 0 && packet.frame_h > 0 && videoStageEl) {
    videoStageEl.style.setProperty("--stage-aspect", `${packet.frame_w} / ${packet.frame_h}`);
  } else if (videoFeedEl && videoFeedEl.naturalWidth > 0 && videoFeedEl.naturalHeight > 0 && videoStageEl) {
    videoStageEl.style.setProperty("--stage-aspect", `${videoFeedEl.naturalWidth} / ${videoFeedEl.naturalHeight}`);
  }

  fpsVal.textContent = packet.fps ?? 0;
  const count = Array.isArray(packet.strings) ? packet.strings.length : packet.string ? 1 : 0;
  if (stringsCountBadge) {
    stringsCountBadge.textContent = `${count} أوتار`;
  }

  if (prevState === "LOCKED" && packet.state === "IDLE") {
    audio.stopSong();
    if (songProgressWrap) songProgressWrap.classList.remove("active");
  }
  prevState = packet.state || "IDLE";

  stateBanner.textContent =
    audio.songPlayer.isPlaying && packet.state === "LOCKED"
      ? `🎶 شغال الآن: ${SONGS[audio.songPlayer.songId]?.titleAr || ""} — اهز الوتر لإضافة كورد!`
      : STATE_MESSAGES[packet.state] || STATE_MESSAGES.IDLE;
  stateBanner.dataset.state = packet.state || "IDLE";

  if (packet.string) {
    currentRegister = packet.string.register || "MID";
    registerBadge.textContent = REGISTER_LABELS[currentRegister] || REGISTER_LABELS.MID;
  } else {
    registerBadge.textContent = "بانتظار الوتر";
  }

  if (Array.isArray(packet.events)) {
    for (const ev of packet.events) {
      if (ev.type === "strum") {
        stage.triggerVibration(ev.t, ev.velocity, ev.string_id || 0);
        const res = audio.playStrum({
          velocity: ev.velocity,
          t: ev.t,
          register: currentRegister,
          stringIndex: ev.string_index || 0,
        });
        if (res?.chordName) {
          chordBadge.textContent = res.chordName;
          chordBadge.classList.remove("pulse");
          void chordBadge.offsetWidth;
          chordBadge.classList.add("pulse");
        }
      }
    }
  }
}

function connectWebSocket() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  ws = new WebSocket(`${proto}//${location.host}/ws`);

  ws.onopen = () => {
    connDot.classList.add("connected");
    connText.textContent = "متصل بالكاميرا";
    sendCommand({ type: "set_sensitivity", value: Number(sensitivitySlider.value) });
    sendCommand({ type: "set_multi_string", value: isMultiString });
  };

  ws.onmessage = (evt) => {
    try {
      const packet = JSON.parse(evt.data);
      stage.updateTelemetry(packet);
      updateHud(packet);
    } catch (_err) {
      // Ignore malformed packets
    }
  };

  ws.onclose = () => {
    connDot.classList.remove("connected");
    connText.textContent = "إعادة الاتصال...";
    setTimeout(connectWebSocket, 1000);
  };
}

function sendCommand(payload) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

async function unlockAudio() {
  const ok = await audio.init();
  if (ok) {
    audioOverlay.classList.add("hidden");
  }
}

btnUnlockAudio.addEventListener("click", (e) => {
  e.stopPropagation();
  unlockAudio();
});
audioOverlay.addEventListener("click", unlockAudio);

btnReset.addEventListener("click", () => {
  audio.stopSong();
  if (songProgressWrap) songProgressWrap.classList.remove("active");
  sendCommand({ type: "reset" });
});
if (btnUndo) {
  btnUndo.addEventListener("click", () => sendCommand({ type: "undo" }));
}
if (btnStopSong) {
  btnStopSong.addEventListener("click", () => {
    audio.stopSong();
    if (songProgressWrap) songProgressWrap.classList.remove("active");
    if (songProgressFill) songProgressFill.style.width = "0%";
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") {
    audio.stopSong();
    sendCommand({ type: "reset" });
  } else if (e.key === "z" || e.key === "Z") {
    sendCommand({ type: "undo" });
  } else if (e.key === " ") {
    audio.stopSong();
    if (songProgressWrap) songProgressWrap.classList.remove("active");
  }
});

sensitivitySlider.addEventListener("input", () => {
  const val = Number(sensitivitySlider.value);
  sensitivityVal.textContent = `${val.toFixed(1)}x`;
  sendCommand({ type: "set_sensitivity", value: val });
});

document.querySelectorAll("[data-preset]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const presetId = btn.dataset.preset;
    if (!PRESETS[presetId]) return;
    document.querySelectorAll("[data-preset]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    audio.setPreset(presetId);
    chordBadge.textContent = audio.sequencer.getCurrentChordName();
  });
});

document.querySelectorAll("[data-playmode]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.playmode;
    document.querySelectorAll("[data-playmode]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    audio.setMode(mode);
    if (mode !== "song" && songProgressWrap) {
      songProgressWrap.classList.remove("active");
    }
  });
});

document.querySelectorAll("[data-song]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const songId = btn.dataset.song;
    if (!SONGS[songId]) return;
    document.querySelectorAll("[data-song]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    audio.setSong(songId);
    if (songProgressWrap) songProgressWrap.classList.remove("active");
    if (songProgressFill) songProgressFill.style.width = "0%";
    chordBadge.textContent = SONGS[songId].chords[0].name;
  });
});

document.querySelectorAll("[data-bandmode]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.bandmode;
    document.querySelectorAll("[data-bandmode]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    audio.setBandMode(mode);
    updateBandBadge();
  });
});

document.querySelectorAll("[data-stringmode]").forEach((btn) => {
  btn.addEventListener("click", () => {
    isMultiString = btn.dataset.stringmode === "multi";
    document.querySelectorAll("[data-stringmode]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    sendCommand({ type: "set_multi_string", value: isMultiString });
  });
});

function updateBandBadge() {
  const mode = audio.bandController.mode;
  const active = audio.isUnlocked && audio.isBandActive();
  bandBadgeWrap.classList.toggle("active", active);
  if (mode === "off") {
    bandBadge.textContent = "الفرقة: صامتة";
  } else if (active) {
    bandBadge.textContent = "الفرقة: شغالة 🔥";
  } else {
    bandBadge.textContent = mode === "always" ? "الفرقة: مستمرة" : "الفرقة: عند العزف";
  }
}

function animationLoop(now) {
  const elapsedBeat = now - (audio.lastBeatPulseMs || 0);
  const beatEnergy = elapsedBeat < 260 ? (1 - elapsedBeat / 260) * (audio.lastBeatStrength || 0.8) : 0;
  stage.setAudioVisuals({
    bandActive: audio.isUnlocked && audio.isBandActive(),
    beatEnergy,
  });
  updateBandBadge();
  stage.renderFrame(now);
  requestAnimationFrame(animationLoop);
}

connectWebSocket();
requestAnimationFrame(animationLoop);
