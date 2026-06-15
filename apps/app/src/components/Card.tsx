import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '@/theme';
import { Panel3D } from './Panel3D';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  accent?: string;
  raised?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  onPress,
  disabled,
  accent,
  raised = true,
  padded = true,
  style,
}: CardProps) {
  return (
    <Panel3D
      variant={raised ? 'raised' : 'inset'}
      depth={raised ? 'md' : 'sm'}
      accent={accent}
      onPress={onPress}
      disabled={disabled}
      padded={padded}
      style={[styles.card, style]}
    >
      {children}
    </Panel3D>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.none },
});
