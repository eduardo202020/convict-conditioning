import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { movements } from '../../data/mockData';
import { ProgresoStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<ProgresoStackParamList, 'ProgressOverview'>;

export function ProgressOverviewScreen({ navigation }: Props) {
  return (
    <Screen>
      <AppHeader
        eyebrow="DOSSIER"
        title="PROGRESO"
        description="Cada familia de movimiento avanza a su propio ritmo. El sistema registra paciencia, no ego."
      />

      <View style={styles.list}>
        {movements.map((movement) => (
          <Pressable
            key={movement.slug}
            onPress={() => navigation.navigate('MovementProgress', { slug: movement.slug })}
            style={styles.card}
          >
            <Text style={styles.name}>{movement.name}</Text>
            <Text style={styles.step}>
              Paso {movement.currentStep} · {movement.currentStepName}
            </Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${movement.currentStep * 10}%` }]} />
            </View>
            <Text style={styles.goal}>Objetivo siguiente: {movement.nextGoal}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.md },
  card: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm },
  name: { ...typography.title, color: colors.onSurface },
  step: { ...typography.body, color: colors.secondary },
  barTrack: { marginTop: spacing.xs, height: 16, backgroundColor: colors.surfaceContainerHigh },
  barFill: { height: '100%', backgroundColor: colors.tertiary },
  goal: { ...typography.caption, color: colors.onSurfaceVariant },
});
