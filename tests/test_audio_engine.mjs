import test from "node:test";
import assert from "node:assert/strict";
import {
  PRESETS,
  SONGS,
  registerToSemitoneOffset,
  GuitarSequencer,
  FullSongPlayer,
  selectVoiceSlot,
  readFractionalDelay,
  getBackingStepEvents,
  BackingBandController,
} from "../static/js/audio-engine.js";

test("PRESETS contains all 6 pro studio styles including grand_piano with >= 4 chords and 4 phrases each", () => {
  for (const key of ["studio_acoustic", "grand_piano", "synth_lead", "flamenco", "rock", "celestial_harp"]) {
    assert.ok(PRESETS[key], `Missing preset ${key}`);
    assert.ok(PRESETS[key].chords.length >= 4, `${key} needs >= 4 chords`);
    assert.ok(Array.isArray(PRESETS[key].smartPhrases) && PRESETS[key].smartPhrases.length >= 4, `${key} needs >= 4 smartPhrases`);
    assert.ok(PRESETS[key].bpm >= 70 && PRESETS[key].bpm <= 140, `${key} needs valid bpm`);
  }
  assert.equal(PRESETS.grand_piano.engineType, "piano");
});

test("registerToSemitoneOffset maps SHORT/MID/LONG accurately", () => {
  assert.equal(registerToSemitoneOffset("SHORT"), 12);
  assert.equal(registerToSemitoneOffset("MID"), 0);
  assert.equal(registerToSemitoneOffset("LONG"), -5);
});

test("GuitarSequencer smart mode cycles 4 evolving phrases and wraps chords", () => {
  const seqMid = new GuitarSequencer("flamenco", "smart");
  const phrase1 = seqMid.triggerStrum({ velocity: 0.8, t: 0.5, register: "MID" });
  const phrase2 = seqMid.triggerStrum({ velocity: 0.8, t: 0.5, register: "MID" });
  assert.ok(phrase1.length >= 5, "Smart mode should schedule rich pro phrase");
  assert.ok(Math.max(...phrase1.map((n) => n.delaySec)) > 0.3);
  assert.notDeepEqual(
    phrase1.map((n) => n.delaySec),
    phrase2.map((n) => n.delaySec),
    "Consecutive strums should vary phrasing like a real pro guitarist"
  );

  const seqShort = new GuitarSequencer("flamenco", "smart");
  const notesShort = seqShort.triggerStrum({ velocity: 0.8, t: 0.5, register: "SHORT" });
  assert.equal(notesShort[0].midi, phrase1[0].midi + 12);

  // Advance remaining chords to wrap back to chord 0
  const chordCount = PRESETS.flamenco.chords.length;
  for (let i = 2; i < chordCount; i++) {
    seqMid.triggerStrum({ velocity: 0.7, t: 0.5, register: "MID" });
  }
  const wrapped = seqMid.triggerStrum({ velocity: 0.8, t: 0.5, register: "MID" });
  assert.equal(wrapped[0].chordName, phrase1[0].chordName);
});

test("GuitarSequencer live mode schedules tight chord sweep and clamps brightness", () => {
  const seq = new GuitarSequencer("rock", "live");
  const notes = seq.triggerStrum({ velocity: 0.9, t: 0.99, register: "MID" });
  assert.ok(notes.length >= 3);
  assert.ok(Math.max(...notes.map((n) => n.delaySec)) < 0.15);
  for (const n of notes) {
    assert.ok(n.brightness >= 0.2 && n.brightness <= 1.0);
  }
});

test("selectVoiceSlot prefers inactive voice before stealing lowest-energy active voice", () => {
  const voices = [
    { active: true, energy: 0.9 },
    { active: true, energy: 0.12 },
    { active: false, energy: 0.0 },
    { active: true, energy: 0.5 },
  ];
  assert.equal(selectVoiceSlot(voices), 2);
  voices[2].active = true;
  voices[2].energy = 0.8;
  assert.equal(selectVoiceSlot(voices), 1);
});

test("GuitarSequencer guards NaN t/velocity inputs cleanly", () => {
  const seq = new GuitarSequencer("studio_acoustic", "smart");
  const notes = seq.triggerStrum({ velocity: Number.NaN, t: "bad", register: "MID" });
  for (const n of notes) {
    assert.ok(Number.isFinite(n.gain) && n.gain >= 0.25 && n.gain <= 1.0);
    assert.ok(Number.isFinite(n.brightness) && n.brightness >= 0.2 && n.brightness <= 1.0);
  }
});

test("GuitarSequencer single-string pluck mode plays specific harmonic string_index cleanly", () => {
  const seq = new GuitarSequencer("studio_acoustic", "pluck");
  const n0 = seq.triggerStrum({ velocity: 0.85, t: 0.5, register: "MID", stringIndex: 0 });
  const n3 = seq.triggerStrum({ velocity: 0.85, t: 0.5, register: "MID", stringIndex: 3 });
  assert.equal(n0.length, 2); // fundamental + warm octave shimmer
  assert.ok(n3[0].midi > n0[0].midi, "Higher string index maps to higher chord tone");
});

test("readFractionalDelay interpolates non-integer periods accurately", () => {
  const buf = new Float32Array([0, 10, 20, 30, 40, 50]);
  assert.ok(Math.abs(readFractionalDelay(buf, 5, 2.5) - 25) < 1e-6);
});

test("getBackingStepEvents generates drums, bass locked to chord, and pad on step 0", () => {
  const chord = PRESETS.rock.chords[0];
  const step0 = getBackingStepEvents("rock", 0, chord, "MID");
  assert.ok(step0.kick > 0, "Step 0 should trigger kick");
  assert.ok(step0.bassMidi === chord.notes[0] - 12 || step0.bassMidi === chord.notes[0], "Bass should anchor to chord root");
  assert.ok(Array.isArray(step0.padNotes) && step0.padNotes.length >= 2, "Step 0 should trigger warm pad chord");

  const step4 = getBackingStepEvents("rock", 4, chord, "MID");
  assert.ok(step4.snare > 0, "Step 4 (beat 2) should trigger snare");
});

test("BackingBandController auto mode activates on play and idles after 4000ms", () => {
  const ctrl = new BackingBandController("auto");
  assert.equal(ctrl.isActiveAt(1000), false);
  ctrl.notifyActivity(1000);
  assert.equal(ctrl.isActiveAt(2500), true);
  assert.equal(ctrl.isActiveAt(5500), false);

  ctrl.setMode("always");
  assert.equal(ctrl.isActiveAt(99999), true);
  ctrl.setMode("off");
  assert.equal(ctrl.isActiveAt(1100), false);
});

test("SONGS catalog has full multi-bar songs spanning >= 10 seconds and >= 24 notes", () => {
  for (const key of ["despacito", "romance", "rock_ballad", "epic_pirates", "lofi_dream", "piano_river"]) {
    const song = SONGS[key];
    assert.ok(song, `Missing song ${key}`);
    assert.ok(song.durationSec >= 10, `${key} durationSec should be >= 10s`);
    assert.ok(song.events.length >= 24, `${key} should have >= 24 musical events`);
    assert.ok(song.chords.length >= 4, `${key} should have >= 4 chord sections`);
  }
});

test("FullSongPlayer plays chronological notes, supports non-restarting accents, and finishes cleanly", () => {
  const player = new FullSongPlayer("despacito");
  assert.equal(player.isPlaying, false);

  player.start(1000, "MID");
  assert.equal(player.isPlaying, true);

  // Pull first 1.5s of notes
  const batch1 = player.collectDueEvents(2500);
  assert.ok(batch1.notes.length >= 4, "Should emit opening song notes");

  // Calling collectDueEvents again at same time should not duplicate notes
  const dup = player.collectDueEvents(2500);
  assert.equal(dup.notes.length, 0);

  // Accent strum while song is active should keep song running and emit chord notes
  const accent = player.buildAccentNotes(0.85, 0.5, "MID");
  assert.ok(accent.length >= 3);
  assert.equal(player.isPlaying, true);

  // Fast-forward past end of song
  const songDurMs = SONGS.despacito.durationSec * 1000;
  player.collectDueEvents(1000 + songDurMs + 500);
  assert.equal(player.isPlaying, false);
});
