import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useProgressStore } from '@/store';
import { Appearance, themeTokens, ThemeColors } from './tokens';

interface ThemeContextValue {
  appearance: Appearance;
  isDark: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  appearance: 'dark',
  isDark: true,
  colors: themeTokens.dark,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setting = useProgressStore((s) => s.player.settings.appearance);
  const system = useColorScheme();

  const appearance: Appearance =
    setting === 'system' ? (system === 'light' ? 'light' : 'dark') : setting;

  const value = useMemo(
    () => ({
      appearance,
      isDark: appearance === 'dark',
      colors: themeTokens[appearance],
    }),
    [appearance],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
