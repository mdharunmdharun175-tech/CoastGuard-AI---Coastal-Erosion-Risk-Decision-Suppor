/**
 * CoastGuard AI - Emergency Audio Alarm & Siren Synthesizer
 * Uses browser Web Audio API to synthesize a high-urgency maritime/civil defense coastal emergency siren.
 * No external audio files or network requests required.
 */

class EmergencyAlarmSystem {
  private audioCtx: AudioContext | null = null;
  private primaryOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private listeners: Set<(playing: boolean) => void> = new Set();

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  public subscribe(listener: (playing: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }

  public startAlarm(volume: number = 0.85): boolean {
    if (this.isPlaying) return true;

    try {
      this.initAudio();
      if (!this.audioCtx) {
        console.warn("Web Audio API not supported on this browser.");
        return false;
      }

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Master Gain for smooth volume ramp
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(Math.min(volume, 1.0), now + 0.3);
      this.masterGain.connect(ctx.destination);

      // Low-Frequency Oscillator (LFO) for warbling siren modulation (0.6 Hz cycle)
      this.lfo = ctx.createOscillator();
      this.lfo.type = "sawtooth";
      this.lfo.frequency.setValueAtTime(0.8, now); // 0.8 Hz rise/fall cycle

      // LFO Gain determines frequency modulation depth (siren pitch swing between 650Hz and 1050Hz)
      this.lfoGain = ctx.createGain();
      this.lfoGain.gain.setValueAtTime(240, now);
      this.lfo.connect(this.lfoGain);

      // Primary Siren Oscillator
      this.primaryOsc = ctx.createOscillator();
      this.primaryOsc.type = "sawtooth"; // Distinctive civil defense emergency siren timbre
      this.primaryOsc.frequency.setValueAtTime(820, now);
      this.lfoGain.connect(this.primaryOsc.frequency);
      this.primaryOsc.connect(this.masterGain);

      // Sub-Oscillator (Square wave 1 octave down for body & urgency)
      this.subOsc = ctx.createOscillator();
      this.subOsc.type = "triangle";
      this.subOsc.frequency.setValueAtTime(410, now);
      this.lfoGain.connect(this.subOsc.frequency);
      
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.4, now);
      this.subOsc.connect(subGain);
      subGain.connect(this.masterGain);

      // Start sound nodes
      this.lfo.start(now);
      this.primaryOsc.start(now);
      this.subOsc.start(now);

      this.isPlaying = true;
      this.notify();
      return true;
    } catch (e) {
      console.error("Failed to start emergency audio alarm:", e);
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public stopAlarm(): void {
    if (!this.isPlaying || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      }

      setTimeout(() => {
        try {
          this.primaryOsc?.stop();
          this.primaryOsc?.disconnect();
          this.subOsc?.stop();
          this.subOsc?.disconnect();
          this.lfo?.stop();
          this.lfo?.disconnect();
          this.lfoGain?.disconnect();
          this.masterGain?.disconnect();
        } catch (_) {}

        this.primaryOsc = null;
        this.subOsc = null;
        this.lfo = null;
        this.lfoGain = null;
        this.masterGain = null;
        this.isPlaying = false;
        this.notify();
      }, 260);
    } catch (e) {
      console.error("Error stopping alarm:", e);
      this.isPlaying = false;
      this.notify();
    }
  }

  public toggleAlarm(volume: number = 0.85): boolean {
    if (this.isPlaying) {
      this.stopAlarm();
      return false;
    } else {
      return this.startAlarm(volume);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const emergencyAlarm = new EmergencyAlarmSystem();
