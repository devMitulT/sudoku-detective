import { DarkTheme, DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { useTheme } from '@/theme';
import {
  CaseIntroScreen,
  CaseSelectScreen,
  CourtroomScreen,
  EvidenceRevealScreen,
  InvestigationBoardScreen,
  MainMenuScreen,
  NotebookScreen,
  ResultsScreen,
  SettingsScreen,
  ShopScreen,
  SplashScreen,
  SudokuScreen,
  SuspectBoardScreen,
} from '@/screens';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors, isDark } = useTheme();

  const navTheme: Theme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        background: colors.background,
        card: colors.card,
        text: colors.foreground,
        border: colors.border,
        primary: colors.foreground,
      },
    }),
    [colors, isDark],
  );

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="CaseSelect" component={CaseSelectScreen} />
        <Stack.Screen name="CaseIntro" component={CaseIntroScreen} />
        <Stack.Screen name="InvestigationBoard" component={InvestigationBoardScreen} />
        <Stack.Screen name="Sudoku" component={SudokuScreen} />
        <Stack.Screen
          name="EvidenceReveal"
          component={EvidenceRevealScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="Notebook" component={NotebookScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="SuspectBoard" component={SuspectBoardScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Courtroom" component={CourtroomScreen} />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
