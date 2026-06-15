import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { useProgressStore } from '@/store/useProgressStore';

/**
 * Lightweight offline audio layer for Sudoku Detective.
 *
 * - One looping ambient "noir" BGM track.
 * - A small set of one-shot SFX, each backed by a single reusable player that
 *   we rewind + replay (cheap, good enough for UI feedback).
 *
 * Everything respects the player's sound/music settings, and BGM lazily starts
 * on the first interaction so web autoplay policies don't block it.
 */
export type Sfx = 'click' | 'place' | 'error' | 'success' | 'reveal' | 'win' | 'fail';

const SFX_SOURCES: Record<Sfx, number> = {
  click: require('../../assets/audio/click.wav'),
  place: require('../../assets/audio/place.wav'),
  error: require('../../assets/audio/error.wav'),
  success: require('../../assets/audio/success.wav'),
  reveal: require('../../assets/audio/reveal.wav'),
  win: require('../../assets/audio/win.wav'),
  fail: require('../../assets/audio/fail.wav'),
};
const BGM_SOURCE = require('../../assets/audio/bgm.wav');

const SFX_VOLUME = 0.6;
const BGM_VOLUME = 0.35;

const settings = () => useProgressStore.getState().player.settings;

class AudioManager {
  private players: Partial<Record<Sfx, AudioPlayer>> = {};
  private bgm: AudioPlayer | null = null;
  private initialized = false;

  private init() {
    if (this.initialized) return;
    this.initialized = true;
    try {
      void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false });
    } catch {
      /* not critical */
    }
  }

  private sfxPlayer(name: Sfx): AudioPlayer | null {
    this.init();
    try {
      if (!this.players[name]) {
        const p = createAudioPlayer(SFX_SOURCES[name]);
        p.volume = SFX_VOLUME;
        this.players[name] = p;
      }
      return this.players[name] ?? null;
    } catch {
      return null;
    }
  }

  /** Play a one-shot sound effect (no-op when sound is disabled). */
  play(name: Sfx) {
    if (!settings().soundEnabled) return;
    const p = this.sfxPlayer(name);
    if (!p) return;
    try {
      p.seekTo(0);
      p.play();
    } catch {
      /* ignore */
    }
    // Any interaction is a good moment to (re)start the music on web.
    this.ensureBgm();
  }

  /** Start the looping background music if music is enabled. */
  startBgm() {
    this.init();
    if (!settings().musicEnabled) return;
    try {
      if (!this.bgm) {
        this.bgm = createAudioPlayer(BGM_SOURCE);
        this.bgm.loop = true;
        this.bgm.volume = BGM_VOLUME;
      }
      this.bgm.play();
    } catch {
      /* autoplay blocked — will retry on next interaction */
    }
  }

  /** Resume BGM if it should be playing but isn't (e.g. after web autoplay block). */
  ensureBgm() {
    if (!settings().musicEnabled) return;
    if (!this.bgm) {
      this.startBgm();
      return;
    }
    try {
      if (!this.bgm.playing) this.bgm.play();
    } catch {
      /* ignore */
    }
  }

  stopBgm() {
    try {
      this.bgm?.pause();
    } catch {
      /* ignore */
    }
  }

  /** React to a settings change (called from the Settings screen). */
  applyMusicSetting(enabled: boolean) {
    if (enabled) this.startBgm();
    else this.stopBgm();
  }
}

export const audio = new AudioManager();
