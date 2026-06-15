import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useProgressStore } from '@/store/useProgressStore';

// expo-haptics is a no-op / unavailable on web — gate every call on both the
// platform and the user's preference so the web build never throws.
const isWeb = Platform.OS === 'web';
const enabled = () => !isWeb && useProgressStore.getState().player.settings.hapticsEnabled;

export const haptics = {
  light: () => {
    if (enabled()) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  medium: () => {
    if (enabled()) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  heavy: () => {
    if (enabled()) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  success: () => {
    if (enabled()) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  warning: () => {
    if (enabled()) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  error: () => {
    if (enabled()) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
  selection: () => {
    if (enabled()) void Haptics.selectionAsync();
  },
};
