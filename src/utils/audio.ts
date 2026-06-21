/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio API is not supported in this environment.", e);
    }
  }

  setMuted(mute: boolean) {
    this.isMuted = mute;
    if (mute && this.ctx && this.ctx.state === "running") {
      this.ctx.suspend();
    } else if (!mute && this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  getMuted() {
    return this.isMuted;
  }

  // Play click on selection
  playSelect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Play Chess Move sound
  playMove(faction: "jesus" | "caan") {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (faction === "jesus") {
      // Light wooden block/bell click
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    } else {
      // Cybernetic lock/synthetic pulse
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Laser Zap extreme: Dalek "EXTERMINATE!"
  playExterminate() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // We chain a frequency modulator for that harsh robot-screech vibe
    const carrier = this.ctx.createOscillator();
    const modulator = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const mainGain = this.ctx.createGain();

    carrier.type = "sawtooth";
    carrier.frequency.setValueAtTime(180, this.ctx.currentTime);
    // Descending death frequency
    carrier.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.8);

    modulator.type = "square";
    modulator.frequency.setValueAtTime(140, this.ctx.currentTime); // Ring-mod frequency

    modGain.gain.setValueAtTime(400, this.ctx.currentTime); // frequency offset amount

    filter.type = "peaking";
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(10, this.ctx.currentTime);

    mainGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    mainGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    carrier.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(this.ctx.destination);

    carrier.start();
    modulator.start();

    carrier.stop(this.ctx.currentTime + 0.8);
    modulator.stop(this.ctx.currentTime + 0.8);
  }

  // Shimmering chime for miracles
  playMiracle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Beautiful C Major Arpeggio

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  // Resurrection chime (rising chords sweep)
  playResurrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const rootOsc1 = this.ctx.createOscillator();
    const rootOsc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    rootOsc1.type = "sine";
    rootOsc1.frequency.setValueAtTime(150, now);
    rootOsc1.frequency.exponentialRampToValueAtTime(600, now + 1.2);

    rootOsc2.type = "triangle";
    rootOsc2.frequency.setValueAtTime(225, now);
    rootOsc2.frequency.exponentialRampToValueAtTime(900, now + 1.2);

    filter.type = "lowpass";
    filter.Q.value = 8;
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(4000, now + 1.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    rootOsc1.connect(filter);
    rootOsc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    rootOsc1.start();
    rootOsc2.start();

    rootOsc1.stop(now + 1.2);
    rootOsc2.stop(now + 1.2);
  }

  // Temporal/Teleport whoosh
  playTeleport() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.6);

    lfo.type = "sawtooth";
    lfo.frequency.value = 35; // Fast vibrato

    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start();
    osc.start();

    lfo.stop(this.ctx.currentTime + 0.6);
    osc.stop(this.ctx.currentTime + 0.6);
  }

  // Cyber upgraded robotic hum
  playCyberUpgraded() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(330, this.ctx.currentTime + 0.45);

    subOsc.type = "square";
    subOsc.frequency.setValueAtTime(50, this.ctx.currentTime);
    subOsc.frequency.linearRampToValueAtTime(165, this.ctx.currentTime + 0.45);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    subOsc.start();

    osc.stop(this.ctx.currentTime + 0.5);
    subOsc.stop(this.ctx.currentTime + 0.5);
  }

  // Capturing / Explosion sfx using white noise or detuned waves
  playExplode() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    const noise = this.ctx.createOscillator(); // custom noise clone using sub-audio
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

    sub.type = "triangle";
    sub.frequency.setValueAtTime(90, now);
    sub.frequency.exponentialRampToValueAtTime(10, now + 0.4);

    noise.type = "square";
    noise.frequency.value = 1000; // detuned hiss feel

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    sub.start();
    osc.stop(now + 0.4);
    sub.stop(now + 0.4);
  }

  // Play a glorious victory chorus/alert
  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.50]; // perfect C major
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start();
      osc.stop(now + 1.5);
    });
  }
}

export const audio = new SoundEngine();







