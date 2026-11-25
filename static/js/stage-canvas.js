/**
 * 60 FPS HTML5 Canvas stage renderer for Air Guitar Studio.
 * Renders multi-string standing waves, fret ruler ticks, spark fountains, and hand HUDs.
 */

export function computeStringWavePoints(p1, p2, energy = 0, phase = 0, samples = 48) {
  const count = Math.max(2, samples);
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  const maxAmp = Math.min(36, Math.max(12, len * 0.06)) * Math.max(0, energy);
  const pts = [];

  for (let i = 0; i < count; i++) {
    const u = i / (count - 1);
    const bx = p1.x + dx * u;
    const by = p1.y + dy * u;

    if (i === 0 || i === count - 1 || energy <= 0.001) {
      pts.push({ x: bx, y: by });
      continue;
    }

    const disp =
      maxAmp *
      (Math.sin(Math.PI * u) * Math.sin(phase) +
        0.38 * Math.sin(2 * Math.PI * u) * Math.sin(phase * 1.9 + 0.7) +
        0.18 * Math.sin(3 * Math.PI * u) * Math.sin(phase * 2.8 + 1.4));

    pts.push({
      x: bx + nx * disp,
      y: by + ny * disp,
    });
  }
  return pts;
}

const HAND_BONES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

const STRING_PALETTE = [
  "#70d6ff",
  "#a7f070",
  "#ffd500",
  "#ff70a6",
  "#c77dff",
  "#ff9e00",
  "#4cc9f0",
  "#e0fbfc",
];

export class StageCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.telemetry = {
      state: "IDLE",
      string: null,
      strings: [],
      stretching: null,
      clear_progress: 0,
      hands: [],
    };
    this.stringWaves = new Map();
    this.globalVibrationEnergy = 0;
    this.particles = [];
    this.bandActive = false;
    this.beatEnergy = 0;
    this.lastTime = performance.now();
  }

  setAudioVisuals({ bandActive = false, beatEnergy = 0 } = {}) {
    this.bandActive = Boolean(bandActive);
    this.beatEnergy = Math.max(0, Math.min(1, Number(beatEnergy) || 0));
  }

  updateTelemetry(packet) {
    this.telemetry = packet;
  }

  triggerSongPulse(gain = 0.7, isLead = false) {
    const list = this.telemetry.strings?.length
      ? this.telemetry.strings
      : this.telemetry.string
      ? [this.telemetry.string]
      : [];
    if (!list.length) return;
    const energy = Math.min(1.1, 0.25 + gain * (isLead ? 0.65 : 0.35));
    this.globalVibrationEnergy = Math.max(this.globalVibrationEnergy, energy);
    for (const s of list) {
      const prevWave = this.stringWaves.get(s.id) || { energy: 0, phase: 0, hitT: 0.5 };
      this.stringWaves.set(s.id, {
        energy: Math.max(prevWave.energy, energy),
        phase: prevWave.phase,
        hitT: 0.5,
      });
    }
  }

  triggerVibration(t = 0.5, velocity = 0.8, stringId = 0) {
    const hitT = Math.max(0, Math.min(1, t));
    const energy = Math.min(1.4, 0.5 + velocity * 0.9);
    this.globalVibrationEnergy = Math.max(this.globalVibrationEnergy, energy);

    const prevWave = this.stringWaves.get(stringId) || { energy: 0, phase: 0, hitT };
    this.stringWaves.set(stringId, {
      energy: Math.max(prevWave.energy, energy),
      phase: prevWave.phase,
      hitT,
    });

    const list = this.telemetry.strings?.length
      ? this.telemetry.strings
      : this.telemetry.string
      ? [this.telemetry.string]
      : [];
    const target = list.find((s) => s.id === stringId) || list[0];

    if (target) {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const hx = (target.x1 + (target.x2 - target.x1) * hitT) * w;
      const hy = (target.y1 + (target.y2 - target.y1) * hitT) * h;
      const count = Math.round(18 + velocity * 24);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 80 + Math.random() * 250 * velocity;
        this.particles.push({
          x: hx,
          y: hy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          size: 2 + Math.random() * 4.0,
          hue: Math.random() > 0.35 ? 44 : 188,
        });
      }
    }
  }

  resizeToDisplaySize() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      if (this.canvas.width !== Math.round(rect.width) || this.canvas.height !== Math.round(rect.height)) {
        this.canvas.width = Math.round(rect.width);
        this.canvas.height = Math.round(rect.height);
      }
    }
  }

  renderFrame(nowMs = performance.now()) {
    this.resizeToDisplaySize();
    const dt = Math.min(0.05, Math.max(0.001, (nowMs - this.lastTime) / 1000));
    this.lastTime = nowMs;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, w, h);

    this.globalVibrationEnergy *= Math.pow(0.14, dt);
    if (this.globalVibrationEnergy < 0.003) this.globalVibrationEnergy = 0;

    for (const [sid, wave] of this.stringWaves.entries()) {
      wave.phase += dt * 84;
      wave.energy *= Math.pow(0.12, dt);
      if (wave.energy < 0.003) {
        this.stringWaves.delete(sid);
      }
    }

    this._drawHands(ctx, w, h);
    this._drawAllStrings(ctx, w, h);
    this._drawParticles(ctx, dt);
    this._drawBeatVisualizer(ctx, w, h, nowMs);
  }

  _drawHands(ctx, w, h) {
    const hands = this.telemetry.hands || [];
    const clearProg = this.telemetry.clear_progress || 0;

    for (const hand of hands) {
      const lms = hand.landmarks || [];
      if (lms.length === 21) {
        ctx.save();
        ctx.strokeStyle = hand.is_ok ? "rgba(255, 213, 0, 0.72)" : "rgba(74, 222, 128, 0.55)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (const [a, b] of HAND_BONES) {
          ctx.moveTo(lms[a][0] * w, lms[a][1] * h);
          ctx.lineTo(lms[b][0] * w, lms[b][1] * h);
        }
        ctx.stroke();

        for (const tipId of [4, 8, 12, 16, 20]) {
          ctx.fillStyle = hand.is_ok ? "#ffd500" : "#ff4d6d";
          ctx.beginPath();
          ctx.arc(lms[tipId][0] * w, lms[tipId][1] * h, 4.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (hand.is_ok && hand.pinch) {
        const px = hand.pinch[0] * w;
        const py = hand.pinch[1] * h;
        ctx.save();
        ctx.strokeStyle = "#ffd500";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#ffd500";
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(px, py, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (hand.probe && this.telemetry.state === "LOCKED") {
        const px = hand.probe[0] * w;
        const py = hand.probe[1] * h;
        ctx.save();
        ctx.fillStyle = "rgba(112, 214, 255, 0.9)";
        ctx.shadowColor = "#70d6ff";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(px, py, 7.5, 0, Math.PI * 2);
        ctx.fill();

        if (hand.is_fist && clearProg > 0) {
          ctx.strokeStyle = "#ff4d6d";
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(px, py, 24, -Math.PI / 2, -Math.PI / 2 + clearProg * Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }
    }
  }

  _drawAllStrings(ctx, w, h) {
    const lockedList = this.telemetry.strings?.length
      ? this.telemetry.strings
      : this.telemetry.state === "LOCKED" && this.telemetry.string
      ? [this.telemetry.string]
      : [];

    lockedList.forEach((str, idx) => {
      const wave = this.stringWaves.get(str.id) || { energy: 0, phase: 0 };
      const color = STRING_PALETTE[idx % STRING_PALETTE.length];
      this._drawSingleString(ctx, w, h, str, true, wave.energy, wave.phase, color);
    });

    const stretching =
      this.telemetry.stretching ||
      (this.telemetry.state === "STRETCHING" ? this.telemetry.string : null);
    if (stretching) {
      this._drawSingleString(ctx, w, h, stretching, false, 0, 0, "#ffd500");
    }
  }

  _drawSingleString(ctx, w, h, str, isLocked, energy, phase, color) {
    const p1 = { x: str.x1 * w, y: str.y1 * h };
    const p2 = { x: str.x2 * w, y: str.y2 * h };
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    const ptsMain = computeStringWavePoints(p1, p2, energy, phase, 56);

    ctx.save();
    // Outer neon halo
    ctx.beginPath();
    ptsMain.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });

    if (!isLocked) {
      ctx.strokeStyle = "#ffd500";
      ctx.lineWidth = 3.5;
      ctx.setLineDash([10, 6]);
      ctx.shadowColor = "#ffd500";
      ctx.shadowBlur = 16;
      ctx.stroke();
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = 4.2 + energy * 3.0;
      ctx.setLineDash([]);
      ctx.shadowColor = color;
      ctx.shadowBlur = 16 + energy * 28;
      ctx.stroke();

      // White-hot string core like the video
      ctx.beginPath();
      ptsMain.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
      ctx.lineWidth = 1.6 + energy * 1.4;
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Ruler / fret tick marks along pinned string
      const tickCount = Math.max(5, Math.min(12, Math.floor(len / 45)));
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
      ctx.lineWidth = 1.4;
      for (let f = 1; f < tickCount; f++) {
        const u = f / tickCount;
        const fx = p1.x + dx * u;
        const fy = p1.y + dy * u;
        const tickLen = f % 2 === 0 ? 9 : 5;
        ctx.beginPath();
        ctx.moveTo(fx - nx * tickLen, fy - ny * tickLen);
        ctx.lineTo(fx + nx * tickLen, fy + ny * tickLen);
        ctx.stroke();
      }
    }

    // Anchor end pins
    for (const end of [p1, p2]) {
      ctx.fillStyle = isLocked ? color : "#ffd500";
      ctx.shadowColor = isLocked ? color : "#ffd500";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(end.x, end.y, isLocked ? 7.5 : 9.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(end.x, end.y, 3.0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawParticles(ctx, dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.93;
      p.vy *= 0.93;
      p.life -= dt * 2.3;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = `hsl(${p.hue}, 100%, 72%)`;
      ctx.shadowColor = `hsl(${p.hue}, 100%, 72%)`;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  _drawBeatVisualizer(ctx, w, h, nowMs) {
    const energy = Math.max(this.globalVibrationEnergy * 0.75, this.beatEnergy);
    if (!this.bandActive && energy <= 0.03) return;

    const bars = 24;
    const barW = Math.max(4, Math.floor((w * 0.44) / bars));
    const gap = 4;
    const totalW = bars * (barW + gap) - gap;
    const startX = (w - totalW) * 0.5;
    const baseY = h - 10;
    const t = nowMs * 0.009;

    ctx.save();
    for (let i = 0; i < bars; i++) {
      const wave = 0.45 + 0.55 * Math.abs(Math.sin(t + i * 0.48));
      const amp = Math.max(4, (10 + energy * 34) * wave);
      const x = startX + i * (barW + gap);
      const grad = ctx.createLinearGradient(0, baseY - amp, 0, baseY);
      grad.addColorStop(0, "#ffd500");
      grad.addColorStop(1, "#70d6ff");
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.75;
      ctx.fillRect(x, baseY - amp, barW, amp);
    }
    ctx.restore();
  }
}
