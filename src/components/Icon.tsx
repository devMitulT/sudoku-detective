import {
  AlertCircle,
  Brain,
  Check,
  CheckCircle,
  ChevronLeft,
  CloudFog,
  Cctv,
  Clock,
  Coins,
  Eraser,
  Eye,
  FileText,
  Fingerprint,
  FlaskConical,
  Gavel,
  Lightbulb,
  Lock,
  Mail,
  Medal,
  Microscope,
  NotebookPen,
  Pencil,
  Puzzle,
  Scale,
  ScanSearch,
  Search,
  Settings,
  Star,
  Target,
  Trophy,
  User,
  Users,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react-native';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

const ICONS = {
  brand: ScanSearch,
  back: ChevronLeft,
  settings: Settings,
  close: X,
  crimeScene: Search,
  witness: Users,
  forensics: FlaskConical,
  cctv: Cctv,
  analysis: Brain,
  fingerprint: Fingerprint,
  eye: Eye,
  microscope: Microscope,
  document: FileText,
  email: Mail,
  clue: Search,
  deduction: Puzzle,
  suspect: User,
  motive: Target,
  people: Users,
  clock: Clock,
  mistakes: AlertCircle,
  coin: Coins,
  medal: Medal,
  trophy: Trophy,
  star: Star,
  starOutline: Star,
  lock: Lock,
  check: Check,
  checkCircle: CheckCircle,
  wrong: XCircle,
  notebook: NotebookPen,
  scale: Scale,
  gavel: Gavel,
  hint: Lightbulb,
  pencil: Pencil,
  erase: Eraser,
  fog: CloudFog,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  /** Filled star / solid icon */
  filled?: boolean;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export function Icon({
  name,
  size = 20,
  color,
  filled,
  strokeWidth = 1.75,
  style,
}: IconProps) {
  const { colors } = useTheme();
  const LucideIcon = ICONS[name];
  const resolved = color ?? colors.foreground;
  const isStarOutline = name === 'starOutline';
  const isStar = name === 'star';

  return (
    <LucideIcon
      size={size}
      color={resolved}
      strokeWidth={strokeWidth}
      fill={filled || (isStar && !isStarOutline) ? resolved : isStarOutline ? 'transparent' : undefined}
      style={style}
    />
  );
}
