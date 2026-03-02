const MusicController = {
    ctx: null,
    master: null,
    theme: 'rome',
    tick: 0,
    nextNoteTime: 0,
    tempo: 0.13,
    muted: false,
    initialized: false,

    // 8-bit note frequencies (Equal Temperament)
    notes: {
        'G2': 98.00, 'A2': 110.00, 'B2': 123.47, 'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'B3': 246.94,
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'B4': 493.88,
        'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
    },

    // Themes
    rome: {
        // Tarantella Napoletana (6/8 feel represented in 12/8 ticks)
        // Tempo should be fast (~160bpm for dotted quarter), so tick is ~0.11s
        tempo: 0.11,
        bass: [
            'A2', '', '', '', '', '', 'E2', '', '', '', '', '',
            'A2', '', '', '', '', '', 'E2', '', '', '', '', ''
        ],
        // Melody: A(dot)-A(dot)-A(dot)-A(dot) | A(dot)-A(dot)-A(dot)-E(dot) ?
        // Actually Tarantella typical rhythm is: da-da-da da-da-da (123 456)
        // Melody: A4 . . A4 . . | A4 . . A4 . . | A4 . . A4 . . | E4 . . F4 E4 .
        lead: [
            'A4', '', '', 'A4', '', '', 'A4', '', '', 'A4', '', '', // Bar 1
            'A4', '', '', 'E4', '', '', 'F4', '', 'E4', 'D4', '', ''  // Bar 2
        ]
    },

    munich: {
        // Bavarian Polka (2/4 feel) - 16 tick loop
        // Oom-pah rhythm: Bass on 1 and 2 (ticks 0 and 8 in 16-step)? No, 2/4 is 1-and-2-and
        // Tick 0: Bass, Tick 4: Chord, Tick 8: Bass, Tick 12: Chord
        tempo: 0.14,
        bass: [
            'C3', '', '', '', 'G3', '', '', '', // C - G bass alternate
            'C3', '', '', '', 'G3', '', '', ''
        ],
        // Melody: Polka bounce
        lead: [
            'E4', '', 'E4', '', 'G4', 'G4', 'E4', '',
            'F4', '', 'F4', '', 'D4', 'D4', 'B3', '',
            'G3', '', 'D4', '', 'F4', 'F4', 'D4', '',
            'E4', '', 'E4', '', 'C4', 'C4', 'G3', '' // Requires 32 length! extend logic
        ]
    },

    init: function () {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.master = this.ctx.createGain();
            this.master.gain.value = 0.1;
            this.master.connect(this.ctx.destination);
            this.initialized = true;
            this.nextNoteTime = this.ctx.currentTime + 0.1;
        } catch (e) { console.error('Audio init failed', e); }
    },

    reset: function () {
        this.theme = 'rome';
        this.tempo = this.rome.tempo;
        this.tick = 0;
        if (this.ctx) this.nextNoteTime = this.ctx.currentTime + 0.1;
    },

    toggleMute: function () {
        this.muted = !this.muted;
        if (this.master) {
            const now = this.ctx.currentTime;
            this.master.gain.cancelScheduledValues(now);
            this.master.gain.setValueAtTime(this.master.gain.value, now);
            this.master.gain.linearRampToValueAtTime(this.muted ? 0 : 0.1, now + 0.1);
        }
        const btn = document.getElementById('game-mute-btn');
        if (btn) btn.textContent = this.muted ? '🔇' : '🔊';
    },

    schedule: function () {
        if (!this.ctx || this.muted || this.ctx.state === 'suspended') return;

        const lookahead = 0.1;
        while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
            this.playTick(this.nextNoteTime);
            this.nextNoteTime += this.tempo;
            this.tick++;
        }
    },

    playTick: function (time) {
        const pattern = this[this.theme];
        if (!pattern) return;

        // Wrap tick based on pattern length
        const len = pattern.lead.length; // 24 or 32
        const beat = this.tick % len;

        // Bass
        const bassLen = pattern.bass.length;
        const bassNote = pattern.bass[this.tick % bassLen];
        if (bassNote && this.notes[bassNote]) {
            this.playTone(this.notes[bassNote], 'square', 0.08, time, 0.08);
        }

        // Lead
        const leadNote = pattern.lead[beat];
        if (leadNote && this.notes[leadNote]) {
            this.playTone(this.notes[leadNote], 'triangle', 0.12, time, 0.06);
        }
    },

    playTone: function (freq, type, dur, time, vol) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.master);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(vol, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

        osc.start(time);
        osc.stop(time + dur + 0.1);
    },

    checkZone: function (x) {
        const MUC_ZONE = 1500;
        if (x > MUC_ZONE && this.theme !== 'munich') {
            this.theme = 'munich';
            this.tempo = this.munich.tempo;
            this.tick = 0;
        } else if (x <= MUC_ZONE && this.theme !== 'rome') {
            this.theme = 'rome';
            this.tempo = this.rome.tempo;
            this.tick = 0;
        }
    }
};

export default MusicController;
