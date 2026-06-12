import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, StateStorage } from 'zustand/middleware';

/**
 * Offline-first persistence backend. All stores serialize to AsyncStorage,
 * giving us a local-only save system with no network dependency.
 */
const asyncStorage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  removeItem: (name) => AsyncStorage.removeItem(name),
};

export const persistStorage = createJSONStorage(() => asyncStorage);

export const STORAGE_KEYS = {
  progress: 'sd.progress.v1',
  game: 'sd.game.v1',
} as const;
