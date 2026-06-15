import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import { Icon, IconName } from './Icon';
import { AppTextProps, Text } from './Text';

export interface IconTextProps {
  name: IconName;
  children: React.ReactNode;
  color?: string;
  iconColor?: string;
  size?: number;
  variant?: AppTextProps['variant'];
  muted?: boolean;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconText({
  name,
  children,
  color,
  iconColor,
  size = 14,
  variant = 'caption',
  muted = true,
  gap = 5,
  style,
}: IconTextProps) {
  const { colors } = useTheme();
  const resolved = color ?? (muted ? colors.mutedForeground : colors.foreground);
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>
      <Icon name={name} size={size} color={iconColor ?? resolved} strokeWidth={1.75} />
      <Text variant={variant} muted={muted} color={color}>
        {children}
      </Text>
    </View>
  );
}
