/**
 * Web Audio Studio Guitar Synthesizer, Full-Song Engine, Multi-Phrase Sequencer,
 * and Synchronized Backing Band Engine (Drums + Bass + Pad).
 */

export const PRESETS = {
  studio_acoustic: {
    id: "studio_acoustic",
    name: "Studio Acoustic Ballad",
    nameAr: "أكوستيك ستوديو",
    bpm: 96,
    damping: 0.34,
    decay: 0.9964,
    warmth: 0.58,
    drive: 0.02,
    driveMakeup: 1.0,
    reverbMix: 0.42,
    chorusMix: 0.24,
    delayMix: 0.14,
    chords: [
      { name: "Em9", notes: [40, 47, 52, 55, 59, 66] },
      { name: "Cmaj7", notes: [48, 55, 60, 64, 67, 71] },
      { name: "G6", notes: [43, 50, 55, 59, 62, 67] },
      { name: "Dsus4", notes: [50, 57, 62, 67, 69, 74] },
    ],
    smartPhrases: [
      [
        [0, 0.0, 0.96, 0], [2, 0.12, 0.80, 0], [3, 0.24, 0.85, 0],
        [5, 0.36, 0.92, 0], [4, 0.48, 0.78, 0], [3, 0.60, 0.75, 0],
        [1, 0.72, 0.72, 0], [4, 0.84, 0.82, 0],
      ],
      [
        [0, 0.0, 0.95, 0], [1, 0.035, 0.78, 0], [4, 0.14, 0.86, 0],
        [5, 0.20, 0.92, 0], [3, 0.36, 0.82, 0], [2, 0.50, 0.75, 0],
        [5, 0.64, 0.84, 12], [4, 0.80, 0.78, 0],
      ],
      [
        [0, 0.0, 0.92, 0], [1, 0.10, 0.78, 0], [2, 0.20, 0.82, 0],
        [3, 0.30, 0.86, 0], [4, 0.40, 0.90, 0], [5, 0.50, 0.96, 0],
        [5, 0.68, 0.74, 12], [3, 0.84, 0.72, 0],
      ],
      [
        [0, 0.0, 0.96, 0], [3, 0.022, 0.82, 0], [4, 0.044, 0.85, 0],
        [5, 0.066, 0.92, 0], [2, 0.28, 0.76, 0], [4, 0.44, 0.82, 0],
        [5, 0.60, 0.88, 0], [3, 0.78, 0.74, 0],
      ],
    ],
    groove: {
      kit: "acoustic",
      kick:  [1, 0, 0, 0, 0, 0, 0.65, 0, 0.85, 0, 0, 0, 0, 0, 0.5, 0],
      snare: [0, 0, 0, 0, 0.75, 0, 0, 0, 0, 0, 0, 0, 0.8, 0, 0, 0],
      hat:   [0.45, 0.25, 0.5, 0.25, 0.45, 0.25, 0.55, 0.25, 0.45, 0.25, 0.5, 0.25, 0.45, 0.3, 0.6, 0.3],
      bass:  [1, 0, 0, 0, 0, 0, 0, 0, 0.82, 0, 0, 0, 0, 0, 0.65, 0],
    },
  },
  grand_piano: {
    id: "grand_piano",
    name: "Concert Grand Piano",
    nameAr: "بيانو جراند",
    engineType: "piano",
    bpm: 90,
    damping: 0.30,
    decay: 0.9968,
    warmth: 0.65,
    drive: 0.0,
    driveMakeup: 1.0,
    reverbMix: 0.46,
    chorusMix: 0.14,
    delayMix: 0.10,
    chords: [
      { name: "F#m7", notes: [42, 49, 54, 57, 61, 66] },
      { name: "Dmaj7", notes: [50, 57, 61, 66, 69, 73] },
      { name: "A", notes: [45, 52, 57, 61, 64, 69] },
      { name: "E", notes: [40, 47, 52, 56, 59, 64] },
    ],
    smartPhrases: [
      [
        [0, 0.0, 0.95, 0], [1, 0.11, 0.80, 0], [2, 0.22, 0.84, 0],
        [4, 0.33, 0.92, 0], [5, 0.44, 0.96, 0], [4, 0.60, 0.78, 0],
        [2, 0.76, 0.74, 0], [5, 0.90, 0.86, 12],
      ],
      [
        [0, 0.0, 0.92, 0], [3, 0.02, 0.84, 0], [5, 0.04, 0.90, 12],
        [4, 0.20, 0.84, 12], [5, 0.32, 0.92, 12], [3, 0.46, 0.80, 12],
        [2, 0.62, 0.76, 0], [4, 0.78, 0.84, 0],
      ],
      [
        [0, 0.0, 0.94, 0], [1, 0.09, 0.78, 0], [2, 0.18, 0.82, 0],
        [3, 0.27, 0.86, 0], [4, 0.36, 0.90, 0], [5, 0.45, 0.95, 0],
        [5, 0.62, 0.86, 12], [4, 0.80, 0.76, 12],
      ],
      [
        [0, 0.0, 0.96, 0], [2, 0.015, 0.85, 0], [4, 0.03, 0.88, 0],
        [5, 0.16, 0.94, 12], [4, 0.32, 0.82, 12], [3, 0.48, 0.78, 0],
        [4, 0.64, 0.84, 0], [5, 0.82, 0.90, 0],
      ],
    ],
    groove: {
      kit: "acoustic",
      kick:  [0.9, 0, 0, 0, 0, 0, 0.55, 0, 0.8, 0, 0, 0, 0, 0, 0.45, 0],
      snare: [0, 0, 0, 0, 0.65, 0, 0, 0, 0, 0, 0, 0, 0.7, 0, 0, 0],
      hat:   [0.35, 0.2, 0.4, 0.2, 0.35, 0.2, 0.45, 0.2, 0.35, 0.2, 0.4, 0.2, 0.35, 0.25, 0.5, 0.25],
      bass:  [0.9, 0, 0, 0, 0, 0, 0, 0, 0.75, 0, 0, 0, 0, 0, 0.6, 0],
    },
  },
  synth_lead: {
    id: "synth_lead",
    name: "Crystal Synth-Guitar",
    nameAr: "كريستال سينث",
    bpm: 110,
    damping: 0.52,
    decay: 0.9968,
    warmth: 0.40,
    drive: 0.08,
    driveMakeup: 1.05,
    reverbMix: 0.48,
    chorusMix: 0.40,
    delayMix: 0.32,
    chords: [
      { name: "Am9", notes: [45, 52, 57, 60, 64, 71] },
      { name: "Fmaj9", notes: [41, 48, 53, 57, 60, 67] },
      { name: "Cmaj7", notes: [48, 55, 60, 64, 67, 71] },
      { name: "G6", notes: [43, 50, 55, 59, 62, 67] },
    ],
    smartPhrases: [
      [
        [2, 0.0, 0.92, 12], [3, 0.08, 0.86, 12], [4, 0.16, 0.90, 12],
        [5, 0.24, 0.98, 12], [4, 0.36, 0.80, 12], [3, 0.48, 0.82, 12],
        [0, 0.60, 0.90, 0], [5, 0.72, 0.92, 12],
      ],
      [
        [5, 0.0, 0.95, 12], [4, 0.09, 0.85, 12], [3, 0.18, 0.82, 12],
        [2, 0.27, 0.84, 12], [4, 0.40, 0.88, 12], [5, 0.54, 0.94, 12],
        [0, 0.68, 0.90, 0], [3, 0.80, 0.78, 12],
      ],
      [
        [0, 0.0, 0.92, 0], [2, 0.03, 0.82, 12], [4, 0.06, 0.88, 12],
        [5, 0.18, 0.96, 12], [3, 0.34, 0.80, 12], [5, 0.50, 0.90, 12],
        [4, 0.66, 0.82, 12], [2, 0.82, 0.76, 12],
      ],
      [
        [3, 0.0, 0.90, 12], [4, 0.07, 0.88, 12], [5, 0.14, 0.95, 12],
        [5, 0.28, 0.84, 24], [4, 0.44, 0.82, 12], [3, 0.58, 0.80, 12],
        [0, 0.72, 0.90, 0], [4, 0.86, 0.82, 12],
      ],
    ],
    groove: {
      kit: "lofi",
      kick:  [1, 0, 0, 0, 0, 0, 0.7, 0, 0.9, 0, 0, 0, 0, 0, 0.6, 0],
      snare: [0, 0, 0, 0, 0.85, 0, 0, 0, 0, 0, 0, 0, 0.88, 0, 0, 0.3],
      hat:   [0.5, 0.25, 0.6, 0.3, 0.5, 0.25, 0.65, 0.3, 0.5, 0.25, 0.6, 0.3, 0.5, 0.3, 0.7, 0.35],
      bass:  [1, 0, 0, 0, 0.7, 0, 0, 0, 0.9, 0, 0, 0, 0.75, 0, 0, 0],
    },
  },
  flamenco: {
    id: "flamenco",
    name: "Spanish Flamenco",
    nameAr: "فلامنكو إسباني",
    bpm: 112,
    damping: 0.42,
    decay: 0.9952,
    warmth: 0.55,
    drive: 0.04,
    driveMakeup: 1.0,
    reverbMix: 0.36,
    chorusMix: 0.14,
    delayMix: 0.08,
    chords: [
      { name: "Am", notes: [45, 52, 57, 60, 64, 69] },
      { name: "G", notes: [43, 50, 55, 59, 62, 67] },
      { name: "Fmaj7", notes: [41, 48, 53, 57, 60, 64] },
      { name: "E7", notes: [40, 47, 52, 56, 59, 64] },
    ],
    smartPhrases: [
      [
        [0, 0.0, 0.98, 0], [1, 0.022, 0.86, 0], [2, 0.044, 0.88, 0],
        [3, 0.066, 0.92, 0], [4, 0.088, 0.96, 0], [5, 0.11, 1.0, 0],
        [4, 0.27, 0.72, 0], [5, 0.36, 0.86, 0], [3, 0.45, 0.74, 0],
        [4, 0.56, 0.80, 0], [5, 0.70, 0.92, 0], [2, 0.86, 0.68, 0],
      ],
      [
        [0, 0.0, 1.0, 0], [5, 0.12, 0.88, 0], [4, 0.21, 0.82, 0],
        [3, 0.30, 0.80, 0], [4, 0.39, 0.84, 0], [5, 0.48, 0.92, 0],
        [5, 0.57, 0.85, 12], [4, 0.68, 0.76, 0], [1, 0.80, 0.84, 0],
        [3, 0.92, 0.74, 0],
      ],
      [
        [0, 0.0, 0.95, 0], [2, 0.09, 0.78, 0], [4, 0.18, 0.85, 0],
        [0, 0.30, 0.92, 0], [3, 0.39, 0.80, 0], [5, 0.48, 0.94, 0],
        [4, 0.60, 0.78, 0], [5, 0.72, 0.90, 0], [3, 0.84, 0.72, 0],
      ],
      [
        [0, 0.0, 1.0, 0], [1, 0.03, 0.85, 0], [3, 0.06, 0.88, 0],
        [5, 0.09, 0.98, 0], [5, 0.24, 0.76, 12], [4, 0.38, 0.72, 12],
        [2, 0.52, 0.82, 0], [4, 0.64, 0.86, 0], [5, 0.78, 0.94, 0],
      ],
    ],
    groove: {
      kit: "flamenco",
      kick:  [1, 0, 0, 0.5, 0, 0, 0.8, 0, 0, 0, 0.9, 0, 0.7, 0, 0, 0],
      snare: [0, 0, 0, 0, 0.85, 0, 0, 0.45, 0, 0.5, 0, 0, 0.9, 0, 0.5, 0],
      hat:   [0.5, 0.3, 0.6, 0.3, 0.5, 0.3, 0.7, 0.3, 0.5, 0.3, 0.6, 0.3, 0.7, 0.4, 0.6, 0.4],
      bass:  [1, 0, 0, 0, 0, 0, 0.8, 0, 0, 0, 0.85, 0, 0, 0, 0.6, 0],
    },
  },
  rock: {
    id: "rock",
    name: "Electric Rock Riff",
    nameAr: "روك كهربائي",
    bpm: 122,
    damping: 0.56,
    decay: 0.9968,
    warmth: 0.35,
    drive: 0.52,
    driveMakeup: 1.55,
    reverbMix: 0.28,
    chorusMix: 0.18,
    delayMix: 0.22,
    chords: [
      { name: "E5", notes: [40, 47, 52, 55, 59, 64] },
      { name: "G5", notes: [43, 50, 55, 58, 62, 67] },
      { name: "A5", notes: [45, 52, 57, 60, 64, 69] },
      { name: "C5", notes: [48, 55, 60, 63, 67, 72] },
      { name: "D5", notes: [50, 57, 62, 65, 69, 74] },
    ],
    smartPhrases: [
      [
        [0, 0.0, 1.0, 0], [1, 0.015, 0.95, 0], [2, 0.03, 0.92, 0],
        [0, 0.22, 0.85, 0], [3, 0.36, 0.90, 0], [4, 0.50, 0.92, 0],
        [5, 0.64, 0.98, 0], [3, 0.80, 0.80, 0],
      ],
      [
        [0, 0.0, 1.0, 0], [0, 0.12, 0.86, 0], [3, 0.24, 0.90, 12],
        [4, 0.34, 0.94, 12], [5, 0.44, 1.0, 12], [4, 0.58, 0.84, 12],
        [2, 0.72, 0.86, 0], [5, 0.84, 0.92, 0],
      ],
      [
        [0, 0.0, 1.0, 0], [1, 0.02, 0.94, 0], [0, 0.13, 0.84, 0],
        [0, 0.25, 0.90, 0], [2, 0.38, 0.88, 0], [4, 0.50, 0.94, 0],
        [5, 0.62, 1.0, 12], [4, 0.76, 0.82, 0],
      ],
      [
        [0, 0.0, 1.0, 0], [1, 0.016, 0.95, 0], [2, 0.032, 0.94, 0],
        [5, 0.05, 0.96, 12], [4, 0.28, 0.88, 12], [5, 0.42, 0.96, 12],
        [3, 0.58, 0.86, 0], [5, 0.74, 0.94, 0],
      ],
    ],
    groove: {
      kit: "rock",
      kick:  [1, 0, 0, 0, 0, 0, 0.8, 0, 0.95, 0, 0.6, 0, 0, 0, 0.75, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0.35],
      hat:   [0.7, 0.4, 0.65, 0.4, 0.8, 0.4, 0.65, 0.4, 0.75, 0.4, 0.65, 0.4, 0.8, 0.4, 0.7, 0.5],
      bass:  [1, 0, 0.7, 0, 0.8, 0, 0.75, 0, 1, 0, 0.7, 0, 0.85, 0, 0.75, 0],
    },
  },
  celestial_harp: {
    id: "celestial_harp",
    name: "Celestial Harp & Strings",
    nameAr: "هارب سماوي",
    bpm: 84,
    damping: 0.24,
    decay: 0.9972,
    warmth: 0.70,
    drive: 0.01,
    driveMakeup: 1.0,
    reverbMix: 0.58,
    chorusMix: 0.36,
    delayMix: 0.26,
    chords: [
      { name: "Dm9", notes: [50, 57, 60, 64, 65, 69] },
      { name: "G13", notes: [43, 53, 59, 62, 64, 67] },
      { name: "Cmaj9", notes: [48, 55, 59, 62, 64, 67] },
      { name: "Am11", notes: [45, 52, 57, 60, 64, 72] },
    ],
    smartPhrases: [
      [
        [0, 0.0, 0.88, 0], [1, 0.06, 0.78, 0], [2, 0.12, 0.82, 0],
        [3, 0.18, 0.85, 0], [4, 0.24, 0.88, 0], [5, 0.30, 0.92, 0],
        [5, 0.45, 0.75, 12], [4, 0.62, 0.72, 12],
      ],
      [
        [5, 0.0, 0.90, 12], [4, 0.08, 0.82, 12], [3, 0.16, 0.78, 0],
        [2, 0.24, 0.76, 0], [1, 0.32, 0.74, 0], [0, 0.40, 0.88, 0],
        [3, 0.56, 0.80, 12], [5, 0.72, 0.84, 12],
      ],
      [
        [0, 0.0, 0.90, 0], [2, 0.09, 0.80, 0], [4, 0.18, 0.86, 0],
        [5, 0.27, 0.90, 12], [3, 0.42, 0.78, 12], [4, 0.58, 0.82, 12],
        [5, 0.74, 0.88, 12],
      ],
      [
        [0, 0.0, 0.92, 0], [1, 0.04, 0.78, 0], [3, 0.08, 0.82, 0],
        [5, 0.12, 0.92, 0], [4, 0.30, 0.78, 12], [5, 0.48, 0.86, 12],
        [3, 0.66, 0.76, 12], [2, 0.84, 0.72, 0],
      ],
    ],
    groove: {
      kit: "lofi",
      kick:  [0.85, 0, 0, 0, 0, 0, 0.45, 0, 0, 0.65, 0, 0, 0, 0, 0.4, 0],
      snare: [0, 0, 0, 0, 0.55, 0, 0, 0, 0, 0, 0, 0, 0.6, 0, 0, 0],
      hat:   [0.35, 0.2, 0.4, 0.2, 0.35, 0.2, 0.45, 0.2, 0.35, 0.2, 0.4, 0.2, 0.35, 0.2, 0.45, 0.2],
      bass:  [0.9, 0, 0, 0, 0, 0, 0, 0, 0, 0.75, 0, 0, 0, 0, 0.55, 0],
    },
  },
};

function buildSongFromSections(id, title, titleAr, bpm, grooveId, sections) {
  const beatSec = 60 / bpm;
  const events = [];
  const chords = [];
  let cursorBeat = 0;

  for (const sec of sections) {
    const startSec = cursorBeat * beatSec;
    chords.push({
      name: sec.chord.name,
      notes: sec.chord.notes,
      timeSec: startSec,
    });
    // Backing rhythm arpeggio / strum
    for (const [noteIdx, beatOffset, gain] of sec.accompaniment) {
      events.push({
        timeSec: (cursorBeat + beatOffset) * beatSec,
        midi: sec.chord.notes[noteIdx % sec.chord.notes.length],
        gain,
        brightness: 0.52,
        chordName: sec.chord.name,
        chord: sec.chord,
        role: "chord",
      });
    }
    // Lead melody line
    for (const [midi, beatOffset, gain] of sec.melody) {
      events.push({
        timeSec: (cursorBeat + beatOffset) * beatSec,
        midi,
        gain,
        brightness: 0.85,
        chordName: sec.chord.name,
        chord: sec.chord,
        role: "lead",
      });
    }
    cursorBeat += sec.beats;
  }

  events.sort((a, b) => a.timeSec - b.timeSec);
  return {
    id,
    title,
    titleAr,
    bpm,
    grooveId,
    durationSec: cursorBeat * beatSec,
    chords,
    events,
  };
}

export const SONGS = {
  despacito: buildSongFromSections("despacito", "Despacito Latin Guitar", "ديسباسيتو لاتين", 89, "flamenco", [
    {
      chord: { name: "Bm", notes: [47, 54, 59, 62, 66, 71] },
      beats: 4,
      accompaniment: [[0, 0, 0.85], [2, 0.5, 0.65], [3, 1.0, 0.7], [4, 1.5, 0.75], [0, 2.0, 0.8], [3, 2.75, 0.7], [4, 3.5, 0.75]],
      melody: [[74, 0, 0.95], [73, 0.5, 0.85], [74, 1.0, 0.92], [73, 1.5, 0.85], [74, 2.0, 0.95], [76, 2.5, 0.9], [78, 3.0, 0.98], [76, 3.5, 0.88]],
    },
    {
      chord: { name: "G", notes: [43, 50, 55, 59, 62, 67] },
      beats: 4,
      accompaniment: [[0, 0, 0.85], [2, 0.5, 0.65], [3, 1.0, 0.7], [4, 1.5, 0.75], [0, 2.0, 0.8], [3, 2.75, 0.7], [4, 3.5, 0.75]],
      melody: [[74, 0, 0.96], [71, 0.75, 0.88], [71, 1.5, 0.86], [71, 2.0, 0.9], [74, 2.5, 0.92], [76, 3.0, 0.95], [74, 3.5, 0.88]],
    },
    {
      chord: { name: "D", notes: [50, 57, 62, 66, 69, 74] },
      beats: 4,
      accompaniment: [[0, 0, 0.85], [1, 0.5, 0.65], [2, 1.0, 0.7], [3, 1.5, 0.75], [0, 2.0, 0.8], [2, 2.75, 0.7], [4, 3.5, 0.75]],
      melody: [[78, 0, 0.98], [76, 0.75, 0.88], [74, 1.5, 0.86], [74, 2.0, 0.92], [76, 2.5, 0.9], [78, 3.0, 0.98], [76, 3.5, 0.88]],
    },
    {
      chord: { name: "A", notes: [45, 52, 57, 61, 64, 69] },
      beats: 4,
      accompaniment: [[0, 0, 0.85], [2, 0.5, 0.65], [3, 1.0, 0.7], [4, 1.5, 0.75], [0, 2.0, 0.8], [3, 2.75, 0.7], [4, 3.5, 0.75]],
      melody: [[73, 0, 0.96], [69, 0.75, 0.86], [69, 1.5, 0.84], [73, 2.25, 0.9], [74, 2.75, 0.92], [73, 3.25, 0.9], [71, 3.75, 0.86]],
    },
    // Chorus lift (2nd pass higher energy)
    {
      chord: { name: "Bm", notes: [47, 54, 59, 62, 66, 71] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [1, 0.03, 0.78], [2, 0.06, 0.8], [4, 1.0, 0.75], [0, 2.0, 0.85], [3, 2.75, 0.75], [5, 3.5, 0.8]],
      melody: [[78, 0, 1.0], [78, 0.5, 0.9], [78, 1.0, 0.94], [76, 1.5, 0.88], [74, 2.0, 0.96], [73, 2.5, 0.9], [71, 3.0, 0.95], [74, 3.5, 0.9]],
    },
    {
      chord: { name: "G", notes: [43, 50, 55, 59, 62, 67] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [1, 0.03, 0.78], [3, 1.0, 0.75], [0, 2.0, 0.85], [4, 3.0, 0.78]],
      melody: [[79, 0, 1.0], [78, 0.5, 0.92], [76, 1.0, 0.94], [74, 1.5, 0.88], [71, 2.25, 0.92], [74, 3.0, 0.95], [76, 3.5, 0.9]],
    },
    {
      chord: { name: "D", notes: [50, 57, 62, 66, 69, 74] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [2, 0.03, 0.8], [4, 1.0, 0.75], [0, 2.0, 0.85], [3, 3.0, 0.78]],
      melody: [[78, 0, 1.0], [76, 0.5, 0.9], [74, 1.0, 0.92], [73, 1.5, 0.88], [74, 2.25, 0.96], [78, 3.0, 0.98], [76, 3.5, 0.9]],
    },
    {
      chord: { name: "A", notes: [45, 52, 57, 61, 64, 69] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [2, 0.03, 0.8], [3, 1.0, 0.75], [4, 2.0, 0.85], [5, 3.0, 0.88]],
      melody: [[73, 0, 0.98], [71, 0.75, 0.9], [69, 1.5, 0.88], [73, 2.25, 0.94], [74, 3.0, 0.98], [73, 3.5, 0.92]],
    },
  ]),

  romance: buildSongFromSections("romance", "Spanish Romance Classical", "رومانس الإسبانية", 108, "studio_acoustic", [
    {
      chord: { name: "Em", notes: [40, 47, 52, 55, 59, 64] },
      beats: 3,
      accompaniment: [[0, 0, 0.88], [4, 0.33, 0.62], [3, 0.66, 0.6], [4, 1.33, 0.62], [3, 1.66, 0.6], [4, 2.33, 0.62], [3, 2.66, 0.6]],
      melody: [[71, 0, 0.95], [71, 1.0, 0.92], [71, 2.0, 0.94]],
    },
    {
      chord: { name: "Em", notes: [40, 47, 52, 55, 59, 64] },
      beats: 3,
      accompaniment: [[0, 0, 0.85], [4, 0.33, 0.62], [3, 0.66, 0.6], [4, 1.33, 0.62], [3, 1.66, 0.6], [4, 2.33, 0.62], [3, 2.66, 0.6]],
      melody: [[71, 0, 0.94], [69, 1.0, 0.90], [67, 2.0, 0.92]],
    },
    {
      chord: { name: "Em", notes: [40, 47, 52, 55, 59, 64] },
      beats: 3,
      accompaniment: [[0, 0, 0.86], [4, 0.33, 0.62], [3, 0.66, 0.6], [4, 1.33, 0.62], [3, 1.66, 0.6], [4, 2.33, 0.62], [3, 2.66, 0.6]],
      melody: [[67, 0, 0.92], [66, 1.0, 0.88], [64, 2.0, 0.90]],
    },
    {
      chord: { name: "Em", notes: [40, 47, 52, 55, 59, 64] },
      beats: 3,
      accompaniment: [[0, 0, 0.88], [4, 0.33, 0.62], [3, 0.66, 0.6], [4, 1.33, 0.62], [3, 1.66, 0.6], [4, 2.33, 0.62], [3, 2.66, 0.6]],
      melody: [[64, 0, 0.9], [67, 1.0, 0.92], [71, 2.0, 0.96]],
    },
    {
      chord: { name: "Em7", notes: [40, 47, 52, 55, 59, 64] },
      beats: 3,
      accompaniment: [[0, 0, 0.9], [4, 0.33, 0.64], [3, 0.66, 0.6], [4, 1.33, 0.64], [3, 1.66, 0.6], [4, 2.33, 0.64], [3, 2.66, 0.6]],
      melody: [[76, 0, 1.0], [76, 1.0, 0.95], [76, 2.0, 0.96]],
    },
    {
      chord: { name: "Am", notes: [45, 52, 57, 60, 64, 69] },
      beats: 3,
      accompaniment: [[0, 0, 0.9], [4, 0.33, 0.64], [3, 0.66, 0.62], [4, 1.33, 0.64], [3, 1.66, 0.62], [4, 2.33, 0.64], [3, 2.66, 0.62]],
      melody: [[76, 0, 0.96], [74, 1.0, 0.92], [72, 2.0, 0.94]],
    },
    {
      chord: { name: "B7", notes: [47, 54, 57, 63, 66, 71] },
      beats: 3,
      accompaniment: [[0, 0, 0.9], [3, 0.33, 0.64], [2, 0.66, 0.6], [3, 1.33, 0.64], [2, 1.66, 0.6], [3, 2.33, 0.64], [2, 2.66, 0.6]],
      melody: [[71, 0, 0.96], [69, 1.0, 0.92], [67, 2.0, 0.90]],
    },
    {
      chord: { name: "Em", notes: [40, 47, 52, 55, 59, 64] },
      beats: 3,
      accompaniment: [[0, 0, 0.92], [1, 0.04, 0.78], [2, 0.08, 0.8], [3, 0.12, 0.84], [4, 0.16, 0.88]],
      melody: [[64, 0.2, 0.98], [76, 1.5, 0.86]],
    },
  ]),

  rock_ballad: buildSongFromSections("rock_ballad", "Classic Rock Ballad", "روك بالاد أسطوري", 84, "rock", [
    {
      chord: { name: "Bm", notes: [47, 54, 59, 62, 66, 71] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [1, 0.5, 0.75], [2, 1.0, 0.8], [4, 1.5, 0.82], [3, 2.0, 0.78], [2, 2.5, 0.75], [4, 3.0, 0.84], [3, 3.5, 0.76]],
      melody: [[74, 0, 0.96], [73, 1.5, 0.9], [71, 2.5, 0.92]],
    },
    {
      chord: { name: "F#7", notes: [42, 49, 54, 58, 61, 66] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [1, 0.5, 0.75], [2, 1.0, 0.8], [4, 1.5, 0.82], [3, 2.0, 0.78], [2, 2.5, 0.75], [4, 3.0, 0.84], [3, 3.5, 0.76]],
      melody: [[73, 0, 0.96], [70, 1.5, 0.9], [73, 2.75, 0.94]],
    },
    {
      chord: { name: "A", notes: [45, 52, 57, 61, 64, 69] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [1, 0.5, 0.75], [2, 1.0, 0.8], [4, 1.5, 0.82], [3, 2.0, 0.78], [2, 2.5, 0.75], [4, 3.0, 0.84], [3, 3.5, 0.76]],
      melody: [[76, 0, 0.98], [73, 1.5, 0.9], [69, 2.5, 0.92]],
    },
    {
      chord: { name: "E", notes: [40, 47, 52, 56, 59, 64] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [1, 0.5, 0.75], [2, 1.0, 0.8], [4, 1.5, 0.82], [3, 2.0, 0.78], [2, 2.5, 0.75], [4, 3.0, 0.84], [3, 3.5, 0.76]],
      melody: [[71, 0, 0.96], [74, 1.5, 0.92], [71, 2.75, 0.9]],
    },
    {
      chord: { name: "G", notes: [43, 50, 55, 59, 62, 67] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [1, 0.5, 0.75], [2, 1.0, 0.8], [4, 1.5, 0.82], [3, 2.0, 0.78], [2, 2.5, 0.75], [4, 3.0, 0.84], [3, 3.5, 0.76]],
      melody: [[74, 0, 0.98], [79, 1.5, 0.95], [78, 2.75, 0.92]],
    },
    {
      chord: { name: "D", notes: [50, 57, 62, 66, 69, 74] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [1, 0.5, 0.75], [2, 1.0, 0.8], [4, 1.5, 0.82], [3, 2.0, 0.78], [2, 2.5, 0.75], [4, 3.0, 0.84], [3, 3.5, 0.76]],
      melody: [[78, 0, 0.98], [74, 1.5, 0.92], [76, 2.75, 0.94]],
    },
    {
      chord: { name: "Em", notes: [40, 47, 52, 55, 59, 64] },
      beats: 4,
      accompaniment: [[0, 0, 0.92], [1, 0.5, 0.78], [2, 1.0, 0.82], [4, 1.5, 0.84], [3, 2.0, 0.8], [2, 2.5, 0.78], [4, 3.0, 0.86]],
      melody: [[76, 0, 0.98], [74, 1.5, 0.92], [71, 2.75, 0.92]],
    },
    {
      chord: { name: "F#", notes: [42, 49, 54, 58, 61, 66] },
      beats: 4,
      accompaniment: [[0, 0, 0.95], [1, 0.03, 0.84], [2, 0.06, 0.88], [3, 0.09, 0.9], [4, 0.12, 0.94]],
      melody: [[73, 0.15, 1.0], [78, 1.5, 0.95], [73, 2.75, 0.9]],
    },
  ]),

  epic_pirates: buildSongFromSections("epic_pirates", "Epic Pirates Anthem", "ملحمة القراصنة", 132, "rock", [
    {
      chord: { name: "Dm", notes: [50, 57, 62, 65, 69, 74] },
      beats: 4,
      accompaniment: [[0, 0, 0.92], [1, 1.0, 0.78], [0, 2.0, 0.88], [2, 3.0, 0.8]],
      melody: [[62, 0, 0.92], [65, 0.5, 0.9], [67, 1.0, 0.96], [67, 2.0, 0.94], [67, 2.5, 0.88], [69, 3.0, 0.96], [70, 3.5, 0.94]],
    },
    {
      chord: { name: "Bb", notes: [46, 53, 58, 62, 65, 70] },
      beats: 4,
      accompaniment: [[0, 0, 0.92], [1, 1.0, 0.78], [0, 2.0, 0.88], [2, 3.0, 0.8]],
      melody: [[70, 0, 0.96], [70, 1.0, 0.94], [72, 1.5, 0.9], [69, 2.0, 0.98], [69, 3.0, 0.92], [67, 3.5, 0.88]],
    },
    {
      chord: { name: "C", notes: [48, 55, 60, 64, 67, 72] },
      beats: 4,
      accompaniment: [[0, 0, 0.92], [1, 1.0, 0.78], [0, 2.0, 0.88], [2, 3.0, 0.8]],
      melody: [[65, 0, 0.94], [65, 0.5, 0.88], [67, 1.0, 0.96], [64, 2.0, 0.94], [67, 3.0, 0.94], [69, 3.5, 0.92]],
    },
    {
      chord: { name: "Dm", notes: [50, 57, 62, 65, 69, 74] },
      beats: 4,
      accompaniment: [[0, 0, 0.95], [1, 0.03, 0.85], [2, 0.06, 0.88], [0, 2.0, 0.88], [2, 3.0, 0.82]],
      melody: [[69, 0, 1.0], [70, 1.0, 0.94], [72, 1.5, 0.92], [74, 2.0, 1.0], [72, 3.0, 0.92], [69, 3.5, 0.9]],
    },
    {
      chord: { name: "Gm", notes: [43, 50, 55, 58, 62, 67] },
      beats: 4,
      accompaniment: [[0, 0, 0.92], [1, 1.0, 0.8], [0, 2.0, 0.88], [2, 3.0, 0.82]],
      melody: [[74, 0, 1.0], [75, 0.5, 0.94], [77, 1.0, 0.98], [77, 2.0, 0.96], [74, 3.0, 0.92], [72, 3.5, 0.9]],
    },
    {
      chord: { name: "Dm", notes: [50, 57, 62, 65, 69, 74] },
      beats: 4,
      accompaniment: [[0, 0, 0.92], [1, 1.0, 0.8], [0, 2.0, 0.88], [2, 3.0, 0.82]],
      melody: [[74, 0, 0.98], [70, 1.0, 0.94], [69, 2.0, 0.96], [67, 3.0, 0.92]],
    },
    {
      chord: { name: "A7", notes: [45, 52, 57, 61, 64, 69] },
      beats: 4,
      accompaniment: [[0, 0, 0.92], [1, 1.0, 0.8], [0, 2.0, 0.88], [2, 3.0, 0.82]],
      melody: [[69, 0, 0.96], [70, 1.0, 0.94], [69, 2.0, 0.96], [67, 3.0, 0.92], [65, 3.5, 0.9]],
    },
    {
      chord: { name: "Dm", notes: [50, 57, 62, 65, 69, 74] },
      beats: 4,
      accompaniment: [[0, 0, 0.96], [1, 0.025, 0.86], [2, 0.05, 0.9], [3, 0.075, 0.94], [4, 0.1, 0.98]],
      melody: [[62, 0.12, 1.0], [74, 1.5, 0.98]],
    },
  ]),

  lofi_dream: buildSongFromSections("lofi_dream", "Midnight Lo-Fi Dream", "أغنية لو-فاي حالمة", 84, "celestial_harp", [
    {
      chord: { name: "Dm9", notes: [50, 57, 60, 64, 65, 69] },
      beats: 4,
      accompaniment: [[0, 0, 0.88], [1, 0.06, 0.72], [2, 0.12, 0.76], [3, 0.18, 0.8], [4, 1.5, 0.74], [2, 2.5, 0.7]],
      melody: [[76, 0.5, 0.92], [74, 1.25, 0.86], [72, 2.0, 0.9], [74, 3.0, 0.88], [76, 3.5, 0.92]],
    },
    {
      chord: { name: "G13", notes: [43, 53, 59, 62, 64, 67] },
      beats: 4,
      accompaniment: [[0, 0, 0.88], [1, 0.06, 0.72], [2, 0.12, 0.76], [3, 0.18, 0.8], [4, 1.5, 0.74], [2, 2.5, 0.7]],
      melody: [[79, 0.5, 0.95], [76, 1.5, 0.88], [74, 2.25, 0.86], [71, 3.0, 0.9]],
    },
    {
      chord: { name: "Cmaj9", notes: [48, 55, 59, 62, 64, 67] },
      beats: 4,
      accompaniment: [[0, 0, 0.88], [1, 0.06, 0.72], [2, 0.12, 0.76], [3, 0.18, 0.8], [4, 1.5, 0.74], [2, 2.5, 0.7]],
      melody: [[76, 0.25, 0.94], [79, 1.0, 0.96], [83, 2.0, 0.98], [79, 3.0, 0.9], [76, 3.5, 0.86]],
    },
    {
      chord: { name: "Am11", notes: [45, 52, 57, 60, 64, 72] },
      beats: 4,
      accompaniment: [[0, 0, 0.88], [1, 0.06, 0.72], [2, 0.12, 0.76], [3, 0.18, 0.8], [4, 1.5, 0.74], [2, 2.5, 0.7]],
      melody: [[72, 0.5, 0.92], [74, 1.25, 0.88], [76, 2.0, 0.94], [72, 3.25, 0.86]],
    },
    {
      chord: { name: "Dm9", notes: [50, 57, 60, 64, 65, 69] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [2, 0.5, 0.76], [4, 1.0, 0.8], [5, 2.0, 0.82], [3, 3.0, 0.76]],
      melody: [[81, 0.25, 0.96], [79, 1.0, 0.9], [76, 1.75, 0.88], [74, 2.5, 0.9], [76, 3.25, 0.92]],
    },
    {
      chord: { name: "G13", notes: [43, 53, 59, 62, 64, 67] },
      beats: 4,
      accompaniment: [[0, 0, 0.9], [2, 0.5, 0.76], [4, 1.0, 0.8], [5, 2.0, 0.82], [3, 3.0, 0.76]],
      melody: [[79, 0.5, 0.96], [77, 1.25, 0.9], [76, 2.0, 0.92], [74, 2.75, 0.88], [71, 3.5, 0.86]],
    },
    {
      chord: { name: "Cmaj9", notes: [48, 55, 59, 62, 64, 67] },
      beats: 4,
      accompaniment: [[0, 0, 0.92], [1, 0.04, 0.76], [2, 0.08, 0.8], [3, 0.12, 0.84], [4, 0.16, 0.88]],
      melody: [[72, 0.25, 0.98], [76, 1.0, 0.92], [79, 1.75, 0.96], [84, 2.75, 0.98]],
    },
  ]),

  piano_river: buildSongFromSections("piano_river", "River Piano Ballad", "سيمفونية بيانو", 90, "grand_piano", [
    {
      chord: { name: "F#m", notes: [42, 49, 54, 57, 61, 66] },
      beats: 4,
      accompaniment: [[0, 0, 0.86], [1, 0.5, 0.72], [2, 1.0, 0.76], [4, 2.0, 0.74], [1, 3.0, 0.72]],
      melody: [[81, 0, 0.96], [80, 0.5, 0.9], [81, 1.0, 0.94], [80, 1.5, 0.9], [81, 2.0, 0.96], [76, 2.5, 0.88], [81, 3.0, 0.94], [74, 3.5, 0.88]],
    },
    {
      chord: { name: "Dmaj7", notes: [50, 57, 61, 66, 69, 73] },
      beats: 4,
      accompaniment: [[0, 0, 0.86], [1, 0.5, 0.72], [2, 1.0, 0.76], [3, 2.0, 0.74], [1, 3.0, 0.72]],
      melody: [[81, 0, 0.96], [76, 0.75, 0.88], [81, 1.5, 0.92], [80, 2.25, 0.9], [78, 3.0, 0.92], [76, 3.5, 0.88]],
    },
    {
      chord: { name: "A", notes: [45, 52, 57, 61, 64, 69] },
      beats: 4,
      accompaniment: [[0, 0, 0.86], [1, 0.5, 0.72], [2, 1.0, 0.76], [4, 2.0, 0.74], [1, 3.0, 0.72]],
      melody: [[76, 0, 0.96], [74, 0.5, 0.9], [73, 1.0, 0.92], [71, 1.5, 0.88], [69, 2.0, 0.92], [73, 2.5, 0.88], [76, 3.0, 0.94], [81, 3.5, 0.96]],
    },
    {
      chord: { name: "E", notes: [40, 47, 52, 56, 59, 64] },
      beats: 4,
      accompaniment: [[0, 0, 0.86], [1, 0.5, 0.72], [2, 1.0, 0.76], [3, 2.0, 0.74], [1, 3.0, 0.72]],
      melody: [[80, 0, 0.96], [76, 0.75, 0.88], [74, 1.5, 0.9], [73, 2.25, 0.9], [71, 3.0, 0.92], [76, 3.5, 0.88]],
    },
    {
      chord: { name: "F#m", notes: [42, 49, 54, 57, 61, 66] },
      beats: 4,
      accompaniment: [[0, 0, 0.88], [1, 0.5, 0.74], [2, 1.0, 0.78], [4, 2.0, 0.76], [5, 3.0, 0.74]],
      melody: [[81, 0, 0.98], [83, 0.5, 0.92], [85, 1.0, 0.98], [83, 1.5, 0.92], [81, 2.0, 0.96], [80, 2.5, 0.9], [78, 3.0, 0.94], [76, 3.5, 0.9]],
    },
    {
      chord: { name: "D", notes: [50, 57, 62, 66, 69, 74] },
      beats: 4,
      accompaniment: [[0, 0, 0.88], [1, 0.5, 0.74], [2, 1.0, 0.78], [4, 2.0, 0.76], [5, 3.0, 0.74]],
      melody: [[78, 0, 0.98], [81, 0.75, 0.94], [86, 1.5, 1.0], [85, 2.25, 0.94], [81, 3.0, 0.94], [78, 3.5, 0.9]],
    },
    {
      chord: { name: "A", notes: [45, 52, 57, 61, 64, 69] },
      beats: 4,
      accompaniment: [[0, 0, 0.88], [1, 0.5, 0.74], [2, 1.0, 0.78], [4, 2.0, 0.76], [5, 3.0, 0.74]],
      melody: [[76, 0, 0.98], [81, 0.75, 0.94], [85, 1.5, 0.98], [83, 2.25, 0.92], [81, 3.0, 0.94], [76, 3.5, 0.9]],
    },
    {
      chord: { name: "E", notes: [40, 47, 52, 56, 59, 64] },
      beats: 4,
      accompaniment: [[0, 0, 0.92], [1, 0.04, 0.78], [2, 0.08, 0.82], [3, 0.12, 0.86], [4, 0.16, 0.9]],
      melody: [[80, 0.2, 0.98], [81, 1.5, 0.96], [76, 2.75, 0.9]],
    },
  ]),
};

export function registerToSemitoneOffset(register) {
  if (register === "SHORT") return 12;
  if (register === "LONG") return -5;
  return 0;
}

export function midiToFreq(midi) {
  return 440.0 * Math.pow(2, (midi - 69) / 12);
}

export function selectVoiceSlot(voices) {
  let lowestIdx = 0;
  let lowestEnergy = Infinity;
  for (let i = 0; i < voices.length; i++) {
    if (!voices[i].active) return i;
    if (voices[i].energy < lowestEnergy) {
      lowestEnergy = voices[i].energy;
      lowestIdx = i;
    }
  }
  return lowestIdx;
}

export function readFractionalDelay(buf, writeIdx, period) {
  const n = buf.length;
  const d0 = Math.floor(period);
  const frac = period - d0;
  const idxA = ((writeIdx - d0) % n + n) % n;
  const idxB = ((writeIdx - d0 - 1) % n + n) % n;
  return buf[idxA] * (1.0 - frac) + buf[idxB] * frac;
}

export function getBackingStepEvents(presetId, stepIndex, chord, register = "MID") {
  const preset = PRESETS[presetId] || PRESETS.studio_acoustic;
  const step = ((stepIndex % 16) + 16) % 16;
  const groove = preset.groove;
  const semitoneOffset = registerToSemitoneOffset(register);
  const activeChord = chord || preset.chords[0];

  const rootMidi = activeChord.notes[0] + semitoneOffset;
  const bassRoot = rootMidi > 42 ? rootMidi - 12 : rootMidi;
  const bassVel = groove.bass[step] || 0;
  const bassMidi = bassVel > 0 ? (step >= 12 ? bassRoot + 7 : bassRoot) : null;

  const padNotes =
    step === 0
      ? [
          activeChord.notes[1] + semitoneOffset,
          activeChord.notes[2] + semitoneOffset,
          activeChord.notes[3] + semitoneOffset,
        ]
      : [];

  return {
    kit: groove.kit,
    kick: groove.kick[step] || 0,
    snare: groove.snare[step] || 0,
    hat: groove.hat[step] || 0,
    bassVel,
    bassMidi,
    padNotes,
  };
}

export class BackingBandController {
  constructor(mode = "auto", idleTimeoutMs = 4200) {
    this.mode = ["auto", "always", "off"].includes(mode) ? mode : "auto";
    this.idleTimeoutMs = idleTimeoutMs;
    this.lastActivityMs = -Infinity;
  }

  setMode(mode) {
    if (["auto", "always", "off"].includes(mode)) {
      this.mode = mode;
    }
  }

  notifyActivity(nowMs = Date.now()) {
    this.lastActivityMs = nowMs;
  }

  isActiveAt(nowMs = Date.now()) {
    if (this.mode === "off") return false;
    if (this.mode === "always") return true;
    return nowMs - this.lastActivityMs <= this.idleTimeoutMs;
  }
}

export class FullSongPlayer {
  constructor(songId = "despacito") {
    this.songId = SONGS[songId] ? songId : "despacito";
    this.isPlaying = false;
    this.startMs = 0;
    this.cursor = 0;
    this.register = "MID";
    this.activeChord = SONGS[this.songId].chords[0];
  }

  setSong(songId) {
    if (SONGS[songId]) {
      this.songId = songId;
      this.stop();
      this.activeChord = SONGS[songId].chords[0];
    }
  }

  start(nowMs = Date.now(), register = "MID") {
    const song = SONGS[this.songId];
    this.isPlaying = true;
    this.startMs = nowMs;
    this.cursor = 0;
    this.register = register || "MID";
    this.activeChord = song.chords[0];
    return song;
  }

  stop() {
    this.isPlaying = false;
    this.cursor = 0;
  }

  getProgress(nowMs = Date.now()) {
    if (!this.isPlaying) return 0;
    const song = SONGS[this.songId];
    return Math.max(0, Math.min(1, (nowMs - this.startMs) / (song.durationSec * 1000)));
  }

  collectDueEvents(nowMs = Date.now()) {
    const song = SONGS[this.songId];
    if (!this.isPlaying) {
      return { notes: [], chord: this.activeChord, finished: false };
    }

    const elapsedSec = (nowMs - this.startMs) / 1000;
    const semitoneOffset = registerToSemitoneOffset(this.register);
    const due = [];

    while (this.cursor < song.events.length && song.events[this.cursor].timeSec <= elapsedSec) {
      const ev = song.events[this.cursor];
      this.activeChord = ev.chord;
      due.push({
        midi: ev.midi + semitoneOffset,
        chordName: ev.chordName,
        delaySec: Math.max(0, ev.timeSec - Math.max(0, elapsedSec - 0.08)),
        durationSec: 1.6,
        gain: ev.gain,
        brightness: ev.brightness,
        role: ev.role,
      });
      this.cursor++;
    }

    let finished = false;
    if (elapsedSec >= song.durationSec) {
      this.isPlaying = false;
      finished = true;
    }

    return { notes: due, chord: this.activeChord, finished };
  }

  buildAccentNotes(velocity = 0.8, t = 0.5, register = "MID") {
    const chord = this.activeChord || SONGS[this.songId].chords[0];
    const semitoneOffset = registerToSemitoneOffset(register);
    const numVel = Number(velocity);
    const vel = Math.max(0.25, Math.min(1.0, Number.isFinite(numVel) ? numVel : 0.8));
    const numT = Number(t);
    const hitT = Math.max(0.0, Math.min(1.0, Number.isFinite(numT) ? numT : 0.5));
    const brightness = Math.max(0.2, Math.min(1.0, 0.45 + 0.55 * Math.abs(hitT - 0.5) * 2.0));

    return chord.notes.slice(0, 4).map((midi, idx) => ({
      midi: midi + semitoneOffset,
      chordName: chord.name,
      delaySec: idx * 0.015,
      durationSec: 1.1,
      gain: vel * 0.55,
      brightness,
    }));
  }
}

export class GuitarSequencer {
  constructor(presetId = "studio_acoustic", mode = "song") {
    this.presetId = PRESETS[presetId] ? presetId : "studio_acoustic";
    this.mode = ["song", "smart", "pluck", "live"].includes(mode) ? mode : "song";
    this.chordIndex = 0;
    this.phraseIndex = 0;
    this.pluckCounter = 0;
    this.activeChord = PRESETS[this.presetId].chords[0];
  }

  setPreset(presetId) {
    if (PRESETS[presetId]) {
      this.presetId = presetId;
      this.chordIndex = 0;
      this.phraseIndex = 0;
      this.pluckCounter = 0;
      this.activeChord = PRESETS[this.presetId].chords[0];
    }
  }

  setMode(mode) {
    if (["song", "smart", "pluck", "live"].includes(mode)) {
      this.mode = mode;
    }
  }

  getCurrentChord() {
    return this.activeChord;
  }

  getCurrentChordName() {
    return this.activeChord.name;
  }

  triggerStrum({ velocity = 0.75, t = 0.5, register = "MID", stringIndex = 0 } = {}) {
    const preset = PRESETS[this.presetId];
    const semitoneOffset = registerToSemitoneOffset(register);
    const numVel = Number(velocity);
    const vel = Math.max(0.25, Math.min(1.0, Number.isFinite(numVel) ? numVel : 0.75));
    const numT = Number(t);
    const hitT = Math.max(0.0, Math.min(1.0, Number.isFinite(numT) ? numT : 0.5));
    const edgeFactor = Math.abs(hitT - 0.5) * 2.0;
    const brightness = Math.max(0.2, Math.min(1.0, 0.45 + 0.55 * edgeFactor));

    if (this.mode === "pluck") {
      const idx = Math.max(0, Number(stringIndex) || 0);
      const chord = this.activeChord;
      this.pluckCounter++;
      if (this.pluckCounter >= 4) {
        this.pluckCounter = 0;
        this.chordIndex = (this.chordIndex + 1) % preset.chords.length;
        this.activeChord = preset.chords[this.chordIndex];
      }
      const noteMidi = chord.notes[idx % chord.notes.length] + Math.floor(idx / chord.notes.length) * 12 + semitoneOffset;
      return [
        {
          midi: noteMidi,
          chordName: chord.name,
          delaySec: 0,
          durationSec: 1.7,
          gain: vel,
          brightness,
        },
        {
          midi: noteMidi + 12,
          chordName: chord.name,
          delaySec: 0.014,
          durationSec: 1.3,
          gain: vel * 0.35,
          brightness: Math.min(1.0, brightness + 0.15),
        },
      ];
    }

    const chord = preset.chords[this.chordIndex % preset.chords.length];
    this.activeChord = chord;
    this.chordIndex = (this.chordIndex + 1) % preset.chords.length;

    if (this.mode === "live") {
      return chord.notes.map((midi, idx) => ({
        midi: midi + semitoneOffset,
        chordName: chord.name,
        delaySec: idx * 0.015,
        durationSec: 1.45,
        gain: Math.min(1.0, vel * (0.72 + idx * 0.04)),
        brightness,
      }));
    }

    const phrase = preset.smartPhrases[this.phraseIndex % preset.smartPhrases.length];
    this.phraseIndex = (this.phraseIndex + 1) % preset.smartPhrases.length;

    return phrase.map(([noteIdx, delaySec, gainMul, octShift = 0]) => {
      const baseMidi = chord.notes[noteIdx % chord.notes.length] + octShift;
      return {
        midi: baseMidi + semitoneOffset,
        chordName: chord.name,
        delaySec,
        durationSec: 1.6,
        gain: Math.min(1.0, vel * gainMul),
        brightness,
      };
    });
  }
}

const WORKLET_CODE = `
function selectVoiceSlot(voices) {
  let lowestIdx = 0;
  let lowestEnergy = Infinity;
  for (let i = 0; i < voices.length; i++) {
    if (!voices[i].active) return i;
    if (voices[i].energy < lowestEnergy) {
      lowestEnergy = voices[i].energy;
      lowestIdx = i;
    }
  }
  return lowestIdx;
}

function readFractionalDelay(buf, writeIdx, period) {
  const n = buf.length;
  const d0 = Math.floor(period);
  const frac = period - d0;
  const idxA = ((writeIdx - d0) % n + n) % n;
  const idxB = ((writeIdx - d0 - 1) % n + n) % n;
  return buf[idxA] * (1.0 - frac) + buf[idxB] * frac;
}

class KarplusStrongPool extends AudioWorkletProcessor {
  constructor() {
    super();
    this.maxVoices = 48;
    this.bufSize = 4096;
    this.voices = Array.from({ length: this.maxVoices }, () => ({
      active: false,
      delaySamples: 0,
      buf: new Float32Array(this.bufSize),
      writeIdx: 0,
      period: 100,
      decay: 0.995,
      damp: 0.4,
      prevSample: 0,
      energy: 0
    }));

    this.port.onmessage = (e) => {
      const msg = e.data;
      if (!msg || msg.type !== "pluck" || !Number.isFinite(msg.freq)) return;
      const slot = selectVoiceSlot(this.voices);
      const v = this.voices[slot];

      const freq = Math.max(45, Math.min(2400, msg.freq));
      const period = Math.max(8, Math.min(this.bufSize - 8, sampleRate / freq - 0.5));
      const fillLen = Math.ceil(period) + 2;
      const gain = Math.max(0.05, Math.min(1.0, Number.isFinite(msg.gain) ? msg.gain : 0.7));
      const warmth = Math.max(0.1, Math.min(0.85, Number.isFinite(msg.warmth) ? msg.warmth : 0.55));
      const pickPos = Math.max(0.08, Math.min(0.5, Number.isFinite(msg.pickPos) ? msg.pickPos : 0.24));
      const pickDelay = Math.max(1, Math.floor(fillLen * pickPos));

      v.buf.fill(0);
      const raw = new Float32Array(fillLen);
      let lp = 0;
      for (let i = 0; i < fillLen; i++) {
        const phase = (i / fillLen) * Math.PI * 2;
        const bodyWave = Math.sin(phase) * 0.65 + Math.sin(phase * 2) * 0.25;
        const white = Math.random() * 2 - 1;
        lp = lp * 0.62 + white * 0.38;
        raw[i] = (bodyWave * warmth + lp * (1.0 - warmth * 0.65)) * gain;
      }
      for (let i = 0; i < fillLen; i++) {
        const delayed = i >= pickDelay ? raw[i - pickDelay] : 0;
        v.buf[i] = raw[i] - 0.52 * delayed;
      }

      v.period = period;
      v.writeIdx = fillLen % this.bufSize;
      v.prevSample = 0;
      v.decay = Number.isFinite(msg.decay) ? msg.decay : 0.996;
      v.damp = Number.isFinite(msg.damp) ? msg.damp : 0.38;
      v.delaySamples = Math.max(0, Math.floor((Number.isFinite(msg.delaySec) ? msg.delaySec : 0) * sampleRate));
      v.energy = 1.0;
      v.active = true;
    };
  }

  process(_inputs, outputs) {
    const out = outputs[0][0];
    if (!out) return true;
    out.fill(0);

    for (let vi = 0; vi < this.maxVoices; vi++) {
      const v = this.voices[vi];
      if (!v.active) continue;

      for (let i = 0; i < out.length; i++) {
        if (v.delaySamples > 0) {
          v.delaySamples--;
          continue;
        }
        const delayed = readFractionalDelay(v.buf, v.writeIdx, v.period);
        const filtered = delayed * (1 - v.damp * 0.35) + v.prevSample * (v.damp * 0.35);
        v.prevSample = filtered;
        v.buf[v.writeIdx] = filtered * v.decay;
        v.writeIdx = (v.writeIdx + 1) % this.bufSize;
        out[i] += delayed * 0.34;
      }

      if (v.delaySamples <= 0) {
        v.energy *= 0.992;
        if (v.energy < 0.002) {
          v.active = false;
        }
      }
    }
    return true;
  }
}
registerProcessor("karplus-strong-pool", KarplusStrongPool);
`;

function createOverdriveCurve(amount = 0.0) {
  const k = amount * 60;
  const n = 1024;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = k <= 0.1 ? x : ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

function createReverbImpulse(ctx, seconds = 2.0, decay = 2.3) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

function createNoiseBuffer(ctx, durationSec = 0.5) {
  const length = Math.floor(ctx.sampleRate * durationSec);
  const buf = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

export class ProGuitarAudioEngine {
  constructor() {
    this.sequencer = new GuitarSequencer("studio_acoustic", "song");
    this.songPlayer = new FullSongPlayer("despacito");
    this.bandController = new BackingBandController("auto", 4200);
    this.ctx = null;
    this.initPromise = null;
    this.workletNode = null;
    this.useWorklet = false;
    this.inputNode = null;
    this.driveNode = null;
    this.driveMakeupGain = null;
    this.reverbGain = null;
    this.chorusGain = null;
    this.delayGain = null;
    this.bandMasterGain = null;
    this.masterCompressor = null;
    this.noiseBuffer = null;
    this.isUnlocked = false;

    this.currentRegister = "MID";
    this._stepIndex = 0;
    this._nextStepTime = 0;
    this._schedulerTimer = null;
    this.lastBeatPulseMs = 0;
    this.lastBeatStrength = 0;
    this.onSongEvent = null;
  }

  async init() {
    if (typeof window === "undefined") return false;
    if (this.initPromise) return this.initPromise;
    this.initPromise = this._doInit().finally(() => {
      if (!this.isUnlocked) this.initPromise = null;
    });
    return this.initPromise;
  }

  async _doInit() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.noiseBuffer = createNoiseBuffer(this.ctx, 0.5);
      this._buildMasterChain();

      if (this.ctx.audioWorklet) {
        try {
          const blob = new Blob([WORKLET_CODE], { type: "application/javascript" });
          const url = URL.createObjectURL(blob);
          await this.ctx.audioWorklet.addModule(url);
          URL.revokeObjectURL(url);
          this.workletNode = new AudioWorkletNode(this.ctx, "karplus-strong-pool");
          this.workletNode.connect(this.inputNode);
          this.useWorklet = true;
        } catch (_err) {
          this.useWorklet = false;
        }
      }
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    this.isUnlocked = this.ctx.state === "running";
    this._applyPresetFx();
    this._startScheduler();
    return this.isUnlocked;
  }

  _buildMasterChain() {
    const ctx = this.ctx;
    this.inputNode = ctx.createGain();
    this.inputNode.gain.value = 1.0;

    const bodyLow = ctx.createBiquadFilter();
    bodyLow.type = "peaking";
    bodyLow.frequency.value = 115;
    bodyLow.Q.value = 1.4;
    bodyLow.gain.value = 4.5;

    const bodyMid = ctx.createBiquadFilter();
    bodyMid.type = "peaking";
    bodyMid.frequency.value = 250;
    bodyMid.Q.value = 1.2;
    bodyMid.gain.value = 2.8;

    this.driveNode = ctx.createWaveShaper();
    this.driveNode.oversample = "2x";
    this.driveNode.curve = createOverdriveCurve(0.02);

    this.driveMakeupGain = ctx.createGain();
    this.driveMakeupGain.gain.value = 1.0;

    const chorusDelayL = ctx.createDelay(0.05);
    const chorusDelayR = ctx.createDelay(0.05);
    chorusDelayL.delayTime.value = 0.017;
    chorusDelayR.delayTime.value = 0.023;
    const lfo = ctx.createOscillator();
    const lfoGainL = ctx.createGain();
    const lfoGainR = ctx.createGain();
    lfo.frequency.value = 0.75;
    lfoGainL.gain.value = 0.004;
    lfoGainR.gain.value = -0.004;
    lfo.connect(lfoGainL);
    lfo.connect(lfoGainR);
    lfoGainL.connect(chorusDelayL.delayTime);
    lfoGainR.connect(chorusDelayR.delayTime);
    lfo.start();

    const chorusMerger = ctx.createChannelMerger(2);
    chorusDelayL.connect(chorusMerger, 0, 0);
    chorusDelayR.connect(chorusMerger, 0, 1);
    this.chorusGain = ctx.createGain();
    this.chorusGain.gain.value = 0.24;

    const echoDelay = ctx.createDelay(1.0);
    echoDelay.delayTime.value = 0.28;
    const echoFeedback = ctx.createGain();
    echoFeedback.gain.value = 0.28;
    const echoFilter = ctx.createBiquadFilter();
    echoFilter.type = "lowpass";
    echoFilter.frequency.value = 2400;
    echoDelay.connect(echoFilter);
    echoFilter.connect(echoFeedback);
    echoFeedback.connect(echoDelay);
    this.delayGain = ctx.createGain();
    this.delayGain.gain.value = 0.14;

    const convolver = ctx.createConvolver();
    convolver.buffer = createReverbImpulse(ctx, 2.0, 2.3);
    this.reverbGain = ctx.createGain();
    this.reverbGain.gain.value = 0.42;

    this.masterCompressor = ctx.createDynamicsCompressor();
    this.masterCompressor.threshold.value = -13;
    this.masterCompressor.knee.value = 18;
    this.masterCompressor.ratio.value = 4;
    this.masterCompressor.attack.value = 0.005;
    this.masterCompressor.release.value = 0.15;

    this.bandMasterGain = ctx.createGain();
    this.bandMasterGain.gain.value = 0.0;
    this.bandMasterGain.connect(this.masterCompressor);

    this.inputNode.connect(bodyLow);
    bodyLow.connect(bodyMid);
    bodyMid.connect(this.driveNode);
    this.driveNode.connect(this.driveMakeupGain);

    this.driveMakeupGain.connect(this.masterCompressor);
    this.driveMakeupGain.connect(chorusDelayL);
    this.driveMakeupGain.connect(chorusDelayR);
    chorusMerger.connect(this.chorusGain);
    this.chorusGain.connect(this.masterCompressor);

    this.driveMakeupGain.connect(echoDelay);
    echoFilter.connect(this.delayGain);
    this.delayGain.connect(this.masterCompressor);

    this.driveMakeupGain.connect(convolver);
    convolver.connect(this.reverbGain);
    this.reverbGain.connect(this.masterCompressor);

    this.masterCompressor.connect(ctx.destination);
  }

  _applyPresetFx() {
    if (!this.ctx || !this.driveNode) return;
    const p = PRESETS[this.sequencer.presetId];
    this.driveNode.curve = createOverdriveCurve(p.drive);
    this.driveMakeupGain.gain.setTargetAtTime(p.driveMakeup || 1.0, this.ctx.currentTime, 0.05);
    this.reverbGain.gain.setTargetAtTime(p.reverbMix, this.ctx.currentTime, 0.05);
    this.chorusGain.gain.setTargetAtTime(p.chorusMix, this.ctx.currentTime, 0.05);
    this.delayGain.gain.setTargetAtTime(p.delayMix || 0.12, this.ctx.currentTime, 0.05);
  }

  setPreset(presetId) {
    this.sequencer.setPreset(presetId);
    this._applyPresetFx();
  }

  setSong(songId) {
    this.songPlayer.setSong(songId);
  }

  stopSong() {
    this.songPlayer.stop();
    this.bandController.lastActivityMs = -Infinity;
  }

  setMode(mode) {
    this.sequencer.setMode(mode);
    if (mode !== "song") {
      this.songPlayer.stop();
    }
  }

  setBandMode(mode) {
    this.bandController.setMode(mode);
    if (mode === "always" && this.ctx) {
      this._stepIndex = 0;
      this._nextStepTime = this.ctx.currentTime + 0.03;
    }
  }

  isBandActive() {
    return this.songPlayer.isPlaying
      ? this.bandController.mode !== "off"
      : this.bandController.isActiveAt(Date.now());
  }

  _startScheduler() {
    if (this._schedulerTimer !== null || typeof window === "undefined") return;
    this._nextStepTime = this.ctx.currentTime + 0.04;
    this._schedulerTimer = window.setInterval(() => this._tick(), 35);
  }

  _tick() {
    if (!this.ctx || !this.isUnlocked || !this.bandMasterGain) return;

    const nowMs = Date.now();
    if (this.songPlayer.isPlaying) {
      const { notes, chord, finished } = this.songPlayer.collectDueEvents(nowMs + 90);
      if (notes.length > 0) {
        this._dispatchNotes(notes);
        this.bandController.notifyActivity(nowMs);
        if (typeof this.onSongEvent === "function") {
          const leadHit = notes.find((n) => n.role === "lead") || notes[0];
          this.onSongEvent({
            chordName: chord.name,
            progress: this.songPlayer.getProgress(nowMs),
            isLead: leadHit.role === "lead",
            gain: leadHit.gain,
            finished,
          });
        }
      } else if (finished && typeof this.onSongEvent === "function") {
        this.onSongEvent({
          chordName: chord.name,
          progress: 0,
          isLead: false,
          gain: 0,
          finished: true,
        });
      }
    }

    const active = this.isBandActive();
    const targetGain = active ? 0.54 : 0.0;
    this.bandMasterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, active ? 0.035 : 0.25);

    if (!active) {
      this._nextStepTime = Math.max(this._nextStepTime, this.ctx.currentTime + 0.02);
      return;
    }

    const activeSong = this.songPlayer.isPlaying ? SONGS[this.songPlayer.songId] : null;
    const groovePresetId = activeSong ? activeSong.grooveId : this.sequencer.presetId;
    const bpm = activeSong ? activeSong.bpm : PRESETS[this.sequencer.presetId].bpm;
    const activeChord = activeSong ? this.songPlayer.activeChord : this.sequencer.getCurrentChord();
    const stepSec = 60 / bpm / 4;

    if (this._nextStepTime < this.ctx.currentTime - 0.15) {
      this._nextStepTime = this.ctx.currentTime + 0.02;
    }

    while (this._nextStepTime < this.ctx.currentTime + 0.12) {
      const ev = getBackingStepEvents(groovePresetId, this._stepIndex, activeChord, this.currentRegister);
      this._scheduleBandStep(ev, this._nextStepTime, stepSec);
      if (ev.kick > 0.6 || ev.snare > 0.6) {
        this.lastBeatPulseMs = performance.now();
        this.lastBeatStrength = Math.max(ev.kick, ev.snare);
      }
      this._nextStepTime += stepSec;
      this._stepIndex = (this._stepIndex + 1) % 16;
    }
  }

  _scheduleBandStep(ev, time, stepSec) {
    if (ev.kick > 0) this._playKick(time, ev.kick, ev.kit);
    if (ev.snare > 0) this._playSnare(time, ev.snare, ev.kit);
    if (ev.hat > 0) this._playHat(time, ev.hat);
    if (ev.bassMidi !== null && ev.bassVel > 0) {
      this._playBass(time, midiToFreq(ev.bassMidi), ev.bassVel, stepSec * 1.9);
    }
    if (ev.padNotes.length > 0) {
      this._playPad(time, ev.padNotes, stepSec * 15);
    }
  }

  _playKick(time, vel, kit) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const startFreq = kit === "flamenco" ? 115 : 145;
    const endFreq = kit === "flamenco" ? 56 : 44;
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.09);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.55 * vel, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.24);

    osc.connect(gain);
    gain.connect(this.bandMasterGain);
    osc.start(time);
    osc.stop(time + 0.26);
  }

  _playSnare(time, vel, kit) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = kit === "flamenco" ? "bandpass" : "highpass";
    filter.frequency.value = kit === "flamenco" ? 1400 : 950;
    filter.Q.value = kit === "flamenco" ? 2.2 : 0.9;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime((kit === "lofi" ? 0.22 : 0.34) * vel, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (kit === "flamenco" ? 0.08 : 0.16));

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.bandMasterGain);
    src.start(time);
    src.stop(time + 0.18);

    if (kit !== "flamenco") {
      const body = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      body.type = "triangle";
      body.frequency.setValueAtTime(185, time);
      body.frequency.exponentialRampToValueAtTime(110, time + 0.07);
      bodyGain.gain.setValueAtTime(0.2 * vel, time);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      body.connect(bodyGain);
      bodyGain.connect(this.bandMasterGain);
      body.start(time);
      body.stop(time + 0.11);
    }
  }

  _playHat(time, vel) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7200;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.11 * vel, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.048);

    src.connect(hp);
    hp.connect(gain);
    gain.connect(this.bandMasterGain);
    src.start(time);
    src.stop(time + 0.055);
  }

  _playBass(time, freq, vel, dur) {
    if (!Number.isFinite(freq)) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(Math.min(900, freq * 4.5), time);
    lp.frequency.exponentialRampToValueAtTime(Math.max(110, freq * 1.6), time + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.32 * vel, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(this.bandMasterGain);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  _playPad(time, midis, dur) {
    const ctx = this.ctx;
    for (const midi of midis) {
      const freq = midiToFreq(midi);
      if (!Number.isFinite(freq)) continue;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.05, time + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      osc.connect(gain);
      gain.connect(this.bandMasterGain);
      osc.start(time);
      osc.stop(time + dur + 0.05);
    }
  }

  _dispatchNotes(notes) {
    const preset = PRESETS[this.sequencer.presetId];
    for (const note of notes) {
      const freq = midiToFreq(note.midi);
      if (!Number.isFinite(freq)) continue;
      if (preset.engineType === "piano") {
        this._playPianoNote(freq, note.delaySec, note.gain, note.brightness, note.durationSec || 1.9);
        continue;
      }
      const damp = Math.max(0.15, Math.min(0.85, preset.damping * (1.25 - note.brightness * 0.45)));
      if (this.useWorklet && this.workletNode) {
        this.workletNode.port.postMessage({
          type: "pluck",
          freq,
          gain: note.gain,
          damp,
          warmth: preset.warmth ?? 0.55,
          decay: preset.decay,
          pickPos: 0.14 + (1.0 - note.brightness) * 0.25,
          delaySec: note.delaySec,
        });
      } else {
        this._playFallbackPluck(freq, note.delaySec, note.gain, note.brightness);
      }
    }
  }

  _playPianoNote(freq, delaySec, gain, brightness, durationSec = 2.1) {
    const ctx = this.ctx;
    const start = ctx.currentTime + Math.max(0, delaySec || 0);
    const dur = Math.max(0.8, durationSec);

    const oscMain = ctx.createOscillator();
    const oscOct = ctx.createOscillator();
    const oscThird = ctx.createOscillator();
    oscMain.type = "triangle";
    oscOct.type = "sine";
    oscThird.type = "sine";
    oscMain.frequency.setValueAtTime(freq, start);
    oscOct.frequency.setValueAtTime(freq * 2, start);
    oscOct.detune.setValueAtTime(2.5, start);
    oscThird.frequency.setValueAtTime(freq * 3, start);
    oscThird.detune.setValueAtTime(-2.5, start);

    const octGain = ctx.createGain();
    octGain.gain.value = 0.36;
    const thirdGain = ctx.createGain();
    thirdGain.gain.value = 0.14;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(11000, freq * (4.5 + brightness * 5.0)), start);
    filter.frequency.exponentialRampToValueAtTime(Math.max(180, freq * 1.85), start + dur * 0.75);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.linearRampToValueAtTime(gain * 0.30, start + 0.005);
    amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain * 0.08), start + 0.45);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    // Subtle felt piano hammer thump
    const hammer = ctx.createBufferSource();
    hammer.buffer = this.noiseBuffer;
    const hammerBp = ctx.createBiquadFilter();
    hammerBp.type = "bandpass";
    hammerBp.frequency.value = Math.min(3500, Math.max(300, freq * 2.2));
    hammerBp.Q.value = 2.0;
    const hammerGain = ctx.createGain();
    hammerGain.gain.setValueAtTime(gain * 0.12, start);
    hammerGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.022);
    hammer.connect(hammerBp);
    hammerBp.connect(hammerGain);
    hammerGain.connect(this.inputNode);
    hammer.start(start);
    hammer.stop(start + 0.03);

    oscMain.connect(filter);
    oscOct.connect(octGain);
    octGain.connect(filter);
    oscThird.connect(thirdGain);
    thirdGain.connect(filter);
    filter.connect(amp);
    amp.connect(this.inputNode);

    oscMain.start(start);
    oscOct.start(start);
    oscThird.start(start);
    oscMain.stop(start + dur + 0.05);
    oscOct.stop(start + dur + 0.05);
    oscThird.stop(start + dur + 0.05);
  }

  playStrum(params) {
    if (!this.ctx || !this.isUnlocked) return { chordName: this.sequencer.getCurrentChordName(), notes: [] };
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    const nowMs = Date.now();
    if (params?.register) {
      this.currentRegister = params.register;
    }

    if (this.sequencer.mode === "song") {
      this.bandController.notifyActivity(nowMs);
      if (!this.songPlayer.isPlaying) {
        this.songPlayer.start(nowMs, this.currentRegister);
        this._stepIndex = 0;
        this._nextStepTime = this.ctx.currentTime + 0.01;
        const { notes, chord } = this.songPlayer.collectDueEvents(nowMs + 90);
        this._dispatchNotes(notes);
        return {
          chordName: chord.name,
          notes,
          bandActive: this.isBandActive(),
          songTitle: SONGS[this.songPlayer.songId].titleAr,
        };
      }
      const accent = this.songPlayer.buildAccentNotes(params?.velocity, params?.t, this.currentRegister);
      this._dispatchNotes(accent);
      return {
        chordName: this.songPlayer.activeChord.name,
        notes: accent,
        bandActive: this.isBandActive(),
        songTitle: SONGS[this.songPlayer.songId].titleAr,
      };
    }

    const wasActive = this.bandController.isActiveAt(nowMs);
    this.bandController.notifyActivity(nowMs);
    if (!wasActive && this.bandController.mode === "auto") {
      this._stepIndex = 0;
      this._nextStepTime = this.ctx.currentTime + 0.01;
    }

    const scheduled = this.sequencer.triggerStrum(params);
    this._dispatchNotes(scheduled);

    return {
      chordName: scheduled[0]?.chordName || this.sequencer.getCurrentChordName(),
      notes: scheduled,
      bandActive: this.isBandActive(),
    };
  }

  _playFallbackPluck(freq, delaySec, gain, brightness) {
    const ctx = this.ctx;
    const start = ctx.currentTime + delaySec;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc2.type = "triangle";
    osc1.frequency.setValueAtTime(freq, start);
    osc2.frequency.setValueAtTime(freq * 2, start);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * (3 + brightness * 6), start);
    filter.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 1.4), start + 0.9);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.linearRampToValueAtTime(gain * 0.22, start + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + 1.35);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.25;

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(amp);
    amp.connect(this.inputNode);

    osc1.start(start);
    osc2.start(start);
    osc1.stop(start + 1.4);
    osc2.stop(start + 1.4);
  }
}
