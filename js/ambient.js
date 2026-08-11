(function () {
  "use strict";

  class AmbientSoundscape {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.ready = false;
      this.active = false;
      this.volume = 0.55;
      this.timers = [];
    }

    async start() {
      await this.ensureReady();
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(0.001, t);
      this.master.gain.linearRampToValueAtTime(this.volume, t + 0.4);
      this.active = true;
    }

    async stop() {
      if (!this.ready || !this.active) return;
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(this.master.gain.value, t);
      this.master.gain.linearRampToValueAtTime(0.001, t + 0.25);
      this.active = false;
    }

    async setVolume(v) {
      this.volume = v;
      if (!this.ready) return;
      await this.ctx.resume();
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(v, t + 0.08);
    }

    async ensureReady() {
      if (this.ready) {
        if (this.ctx.state === "suspended") await this.ctx.resume();
        return;
      }

      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) throw new Error("Web Audio not supported");

      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.001;
      this.master.connect(this.ctx.destination);

      this.buildLayers();
      this.ready = true;

      if (this.ctx.state === "suspended") await this.ctx.resume();
    }

    later(fn, ms) {
      const id = window.setTimeout(fn, ms);
      this.timers.push(id);
    }

    makeNoiseBuffer(smooth) {
      const len = this.ctx.sampleRate * 3;
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        last = last * smooth + (Math.random() * 2 - 1) * (1 - smooth);
        data[i] = last * 5;
      }
      return buf;
    }

    loopNoise(buffer, setupFilter, level) {
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;

      const filter = this.ctx.createBiquadFilter();
      setupFilter(filter);

      const gain = this.ctx.createGain();
      gain.gain.value = level;

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      src.start();
    }

    buildLayers() {
      /* Kettle steam */
      this.loopNoise(this.makeNoiseBuffer(0.97), (f) => {
        f.type = "bandpass";
        f.frequency.value = 2600;
        f.Q.value = 0.7;
      }, 0.18);

      /* Street traffic rumble */
      this.loopNoise(this.makeNoiseBuffer(0.992), (f) => {
        f.type = "lowpass";
        f.frequency.value = 280;
      }, 0.32);

      /* Second traffic layer — mid rumble */
      this.loopNoise(this.makeNoiseBuffer(0.985), (f) => {
        f.type = "lowpass";
        f.frequency.value = 600;
      }, 0.12);

      /* Light breeze / leaf rustle */
      this.loopNoise(this.makeNoiseBuffer(0.94), (f) => {
        f.type = "highpass";
        f.frequency.value = 900;
      }, 0.06);

      /* Distant crowd murmur */
      this.loopNoise(this.makeNoiseBuffer(0.988), (f) => {
        f.type = "bandpass";
        f.frequency.value = 420;
        f.Q.value = 1.2;
      }, 0.08);

      this.scheduleWhistle();
      this.scheduleHorn();
      this.scheduleBirds();
      this.scheduleBicycleBell();
      this.scheduleCupClink();
      this.scheduleRickshawCreak();
      this.scheduleAutoHorn();
      this.scheduleKettleBubble();
    }

    scheduleBirds() {
      const chirp = () => {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        const count = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const start = t + i * (0.08 + Math.random() * 0.12);
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          const base = 2800 + Math.random() * 2200;
          osc.frequency.setValueAtTime(base, start);
          osc.frequency.exponentialRampToValueAtTime(base * (1.1 + Math.random() * 0.3), start + 0.04);
          osc.frequency.exponentialRampToValueAtTime(base * 0.85, start + 0.1);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.035, start + 0.01);
          gain.gain.linearRampToValueAtTime(0, start + 0.12);
          osc.connect(gain);
          gain.connect(this.master);
          osc.start(start);
          osc.stop(start + 0.14);
        }
        this.later(chirp, 7000 + Math.random() * 15000);
      };
      this.later(chirp, 3000);
    }

    scheduleBicycleBell() {
      const ring = () => {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        [1800, 2400, 1800].forEach((freq, i) => {
          const start = t + i * 0.09;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.05, start + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
          osc.connect(gain);
          gain.connect(this.master);
          osc.start(start);
          osc.stop(start + 0.4);
        });
        this.later(ring, 12000 + Math.random() * 20000);
      };
      this.later(ring, 6000);
    }

    scheduleCupClink() {
      const clink = () => {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(3200, t);
        osc.frequency.exponentialRampToValueAtTime(1800, t + 0.06);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.055, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start(t);
        osc.stop(t + 0.2);

        const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.04), this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const nGain = this.ctx.createGain();
        nGain.gain.value = 0.025;
        src.connect(nGain);
        nGain.connect(this.master);
        src.start(t);

        this.later(clink, 8000 + Math.random() * 18000);
      };
      this.later(clink, 5000);
    }

    scheduleRickshawCreak() {
      const creak = () => {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.linearRampToValueAtTime(140, t + 1.8);
        filter.type = "bandpass";
        filter.frequency.value = 320;
        filter.Q.value = 2.5;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.028, t + 0.2);
        gain.gain.linearRampToValueAtTime(0.018, t + 1.2);
        gain.gain.linearRampToValueAtTime(0, t + 2.1);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);
        osc.start(t);
        osc.stop(t + 2.2);
        this.later(creak, 14000 + Math.random() * 22000);
      };
      this.later(creak, 9000);
    }

    scheduleAutoHorn() {
      const twoTone = () => {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        [380, 320].forEach((freq, i) => {
          const start = t + i * 0.22;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "square";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.04, start + 0.02);
          gain.gain.linearRampToValueAtTime(0, start + 0.2);
          osc.connect(gain);
          gain.connect(this.master);
          osc.start(start);
          osc.stop(start + 0.22);
        });
        this.later(twoTone, 18000 + Math.random() * 25000);
      };
      this.later(twoTone, 11000);
    }

    scheduleKettleBubble() {
      const bubble = () => {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        const pops = 2 + Math.floor(Math.random() * 4);
        for (let i = 0; i < pops; i++) {
          const start = t + i * (0.15 + Math.random() * 0.25);
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(120 + Math.random() * 80, start);
          osc.frequency.exponentialRampToValueAtTime(60, start + 0.08);
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.04, start + 0.01);
          gain.gain.linearRampToValueAtTime(0, start + 0.1);
          osc.connect(gain);
          gain.connect(this.master);
          osc.start(start);
          osc.stop(start + 0.12);
        }
        this.later(bubble, 5000 + Math.random() * 9000);
      };
      this.later(bubble, 2000);
    }

    scheduleWhistle() {
      const blow = () => {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1900, t);
        osc.frequency.linearRampToValueAtTime(2400, t + 0.35);
        osc.frequency.linearRampToValueAtTime(1700, t + 1.1);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.09, t + 0.08);
        gain.gain.linearRampToValueAtTime(0.05, t + 0.7);
        gain.gain.linearRampToValueAtTime(0, t + 1.3);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start(t);
        osc.stop(t + 1.35);
        this.later(blow, 9000 + Math.random() * 12000);
      };
      this.later(blow, 2500);
    }

    scheduleHorn() {
      const honk = () => {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.linearRampToValueAtTime(220, t + 0.2);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.07, t + 0.03);
        gain.gain.linearRampToValueAtTime(0, t + 0.45);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start(t);
        osc.stop(t + 0.5);
        this.later(honk, 6000 + Math.random() * 14000);
      };

      const bell = () => {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.045, t + 0.02);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start(t);
        osc.stop(t + 0.35);
        this.later(bell, 11000 + Math.random() * 16000);
      };

      this.later(honk, 4000);
      this.later(bell, 8000);
    }
  }

  window.ChaiAmbient = new AmbientSoundscape();
})();
