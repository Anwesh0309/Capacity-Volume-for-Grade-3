// Core audio engine — ElevenLabs pre-generated mp3 + Web Audio API SFX
import audioMap from './audioMap.js';

let currentAudio = null;
let isEnabled = true;
let narrationQueue = [];
let isPlaying = false;

export function setAudioEnabled(val) {
  isEnabled = val;
  if (!val) stopNarration();
}

function playMp3(text) {
  return new Promise((resolve) => {
    const path = audioMap[text];
    if (!path || !isEnabled) { resolve(); return; }
    const audio = new Audio(path);
    currentAudio = audio;
    audio.onended = () => { currentAudio = null; resolve(); };
    audio.onerror = () => { currentAudio = null; resolve(); };
    audio.play().catch(() => resolve());
  });
}

// Web Audio API SFX
function playTone(frequencies, durations) {
  if (!isEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let time = ctx.currentTime;
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + (durations[i] || 200) / 1000);
      osc.start(time);
      osc.stop(time + (durations[i] || 200) / 1000);
      time += (durations[i] || 200) / 1000;
    });
    setTimeout(() => ctx.close(), 2000);
  } catch (e) { /* silent fail */ }
}

export const SOUND_EFFECTS = {
  correct: () => playTone([880, 1100], [150, 150]),
  wrong:   () => playTone([220], [300]),
  badge:   () => playTone([523, 659, 784, 1047], [100, 100, 100, 200]),
  streak:  () => playTone([440, 880], [100, 200]),
  levelUp: () => playTone([523, 659, 784, 1047, 1319], [80, 80, 80, 80, 300]),
};

// Narration helpers — call with text string
export const say       = (text) => ({ type: 'statement', text });
export const ask       = (text) => ({ type: 'question',   text });
export const celebrate = (text) => ({ type: 'celebration', text });
export const think     = (text) => ({ type: 'thinking',   text });
export const encourage = (text) => ({ type: 'encouragement', text });
export const emphasize = (text) => ({ type: 'emphasis',   text });

// Play a queue of narration items sequentially
export async function narrate(items, autoplay = true) {
  if (!autoplay || !isEnabled) return;
  stopNarration();
  narrationQueue = [...items];
  isPlaying = true;
  for (const item of narrationQueue) {
    if (!isPlaying) break;
    await playMp3(item.text);
  }
  isPlaying = false;
}

export function stopNarration() {
  isPlaying = false;
  narrationQueue = [];
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

export function playCorrectSfx() { SOUND_EFFECTS.correct(); }
export function playWrongSfx()   { SOUND_EFFECTS.wrong(); }
export function playBadgeSfx()   { SOUND_EFFECTS.badge(); }
export function playStreakSfx()  { SOUND_EFFECTS.streak(); }
export function playLevelUpSfx() { SOUND_EFFECTS.levelUp(); }
