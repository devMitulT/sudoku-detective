import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconText, ScreenContainer, Tag, Text, TopBar } from '@/components';
import { COIN_PRICES } from '@/store/economy';
import { spacing } from '@/theme';
import { useProgressStore } from '@/store';
import { useAppNavigation } from '@/navigation/types';

const ITEMS = [
  {
    key: 'extraHint',
    title: 'Extra Hint',
    description: 'Reveal one cell during a puzzle when your free hints run out.',
    price: COIN_PRICES.extraHint,
    where: 'Sudoku puzzle',
  },
  {
    key: 'retryPuzzle',
    title: 'Puzzle Retry',
    description: 'Restart a failed puzzle without leaving the investigation node.',
    price: COIN_PRICES.retryPuzzle,
    where: 'Sudoku puzzle',
  },
  {
    key: 'skipNode',
    title: 'Skip Investigation Node',
    description: 'Complete a node instantly and collect its evidence — no puzzle required.',
    price: COIN_PRICES.skipNode,
    where: 'Investigation board',
  },
] as const;

export function ShopScreen() {
  const navigation = useAppNavigation();
  const coins = useProgressStore((s) => s.player.coins);

  return (
    <ScreenContainer scroll>
      <TopBar title="Detective Shop" onBack={() => navigation.goBack()} />

      <Card style={styles.balance}>
        <Text variant="label" muted>Your balance</Text>
        <IconText name="coin" muted={false} variant="title" size={22} style={{ marginTop: spacing.xs }}>
          {coins}
        </IconText>
        <Text variant="caption" muted style={{ marginTop: spacing.sm }}>
          Earn coins by solving cases. Higher star ratings award bonus coins.
        </Text>
      </Card>

      <Text variant="label" muted style={styles.section}>
        Available purchases
      </Text>

      {ITEMS.map((item) => (
        <Card key={item.key} style={styles.item}>
          <View style={styles.itemHead}>
            <Text variant="subtitle">{item.title}</Text>
            <Tag label={`${item.price} coins`} variant="default" />
          </View>
          <Text variant="body" muted style={{ marginTop: spacing.sm }}>
            {item.description}
          </Text>
          <Text variant="caption" muted style={{ marginTop: spacing.xs }}>
            Buy during: {item.where}
          </Text>
        </Card>
      ))}

      <Text variant="caption" muted center style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
        Star bonuses on first solve: 3★ +50 · 2★ +25 · 1★ +0 coins
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  balance: { marginBottom: spacing.lg },
  section: { marginBottom: spacing.sm },
  item: { marginBottom: spacing.md },
  itemHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
