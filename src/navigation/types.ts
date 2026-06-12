import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

/** Root stack route → params contract. */
export type RootStackParamList = {
  Splash: undefined;
  MainMenu: undefined;
  Settings: undefined;
  Shop: undefined;
  CaseSelect: undefined;
  CaseIntro: { caseId: string };
  InvestigationBoard: { caseId: string };
  Sudoku: { caseId: string; nodeId: string };
  EvidenceReveal: { caseId: string; nodeId: string };
  Notebook: { caseId: string };
  SuspectBoard: { caseId: string };
  Courtroom: { caseId: string };
  Results: { caseId: string; outcome: 'solved' | 'failed'; coinsEarned?: number };
};

export type ScreenName = keyof RootStackParamList;

export type AppNavigation = NativeStackNavigationProp<RootStackParamList>;

export const useAppNavigation = () => useNavigation<AppNavigation>();

export function useScreenRoute<T extends ScreenName>() {
  return useRoute<RouteProp<RootStackParamList, T>>();
}
