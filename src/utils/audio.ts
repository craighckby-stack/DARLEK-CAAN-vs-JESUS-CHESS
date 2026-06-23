/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * @description DARLEK CANN Audio Engine v5.0 - Unified Synthetic Sound Synthesis Architecture
 * Integrated with Unitary-Core signal processing patterns.
 */

export type Faction = 'jesus' | 'caan';

class AudioController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private activeNodes: Set<AudioNode> = new Set();

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  public setMuted(mute: boolean): void {
    this.isMuted = mute;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(mute ? 0 : 1, this.getContext().currentTime, 0.05);
    }
  }

  private cleanupNode(node: AudioNode) {
    node.disconnect();
    this.activeNodes.delete(node);
  }

  private playTone(freq: number, type: OscillatorType, duration: number, attack: number = 0.01): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    this.activeNodes.add(osc);
    this.activeNodes.add(gain);

    osc.start();
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => {
      this.cleanupNode(osc);
      this.cleanupNode(gain);
    };
  }

  public playSelect(): void { this.playTone(800, 'sine', 0.05); }

  public playMove(faction: Faction): void {
    const isJesus = faction === 'jesus';
    this.playTone(isJesus ? 440 : 220, isJesus ? 'sine' : 'sawtooth', 0.15);
  }

  public playExterminate(): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const carrier = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    const mainGain = ctx.createGain();

    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(180, now);
    carrier.frequency.exponentialRampToValueAtTime(30, now + 0.8);
    mod.frequency.setValueAtTime(140, now);
    modGain.gain.setValueAtTime(400, now);
    mainGain.gain.setValueAtTime(0.2, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(mainGain);
    mainGain.connect(this.masterGain!);

    carrier.start(); mod.start();
    carrier.stop(now + 0.8);
    carrier.onended = () => { carrier.disconnect(); mod.disconnect(); modGain.disconnect(); mainGain.disconnect(); };
  }

  public playVictory(): void {
    const sequence = [523.25, 659.25, 783.99, 1046.50];
    sequence.forEach((freq, i) => setTimeout(() => this.playTone(freq, 'sine', 0.5), i * 150));
  }
}

export const audio = new AudioController();




































