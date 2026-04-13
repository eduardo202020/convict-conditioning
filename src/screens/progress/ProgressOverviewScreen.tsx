import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import {
  getProgressSummary,
  getRecentSessions,
  type ProgressMovementSummary,
  type RecentSessionSummary,
} from '../../db/progress';
import { ProgresoStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<ProgresoStackParamList, 'ProgressOverview'>;

export function ProgressOverviewScreen({ navigation }: Props) {
  const [items, setItems] = useState<ProgressMovementSummary[]>([]);
  const [recentSessions, setRecentSessions] = useState<RecentSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([getProgressSummary(), getRecentSessions()])
      .then(([progressData, recentData]) => {
        if (!mounted) return;
        setItems(progressData);
        setRecentSessions(recentData);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Screen>
      <AppHeader
        eyebrow="DOSSIER"
        title="PROGRESO"
        description="Cada familia de movimiento avanza a su propio ritmo. El sistema registra paciencia, no ego."
      />

      <View style={styles.list}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Leyendo expediente de progreso...</Text>
          </View>
        ) : null}

        <View style={styles.historyPanel}>
          <Text style={styles.historyTitle}>Historial reciente</Text>
          {recentSessions.length ? (
            recentSessions.map((session) => (
              <View key={session.sessionId} style={styles.historyRow}>
                <View style={styles.historyCopy}>
                  <Text style={styles.historyName}>{session.programName}</Text>
                  <Text style={styles.historyMeta}>
                    {new Date(session.startedAt).toLocaleDateString('es-PE')} · {session.totalSets} series
                  </Text>
                </View>
                <Text style={styles.historyState}>
                  {session.finishedAt ? 'CERRADA' : 'ABIERTA'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.historyEmpty}>
              Aun no hay sesiones cerradas. Cuando entrenes, el historial aparecera aqui.
            </Text>
          )}
        </View>

        {items.map((movement) => (
          <Pressable
            key={movement.slug}
            onPress={() => navigation.navigate('MovementProgress', { slug: movement.slug })}
            style={styles.card}
          >
            <Text style={styles.name}>{movement.name}</Text>
            <Text style={styles.step}>
              Paso {movement.currentStepNumber} · {movement.currentStepName}
            </Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${movement.completionRatio * 100}%` }]} />
            </View>
            <Text style={styles.goal}>
              Progreso automatico: {Math.min(movement.autoProgressSuccessCount, movement.autoProgressRequiredCount)}/
              {movement.autoProgressRequiredCount} sesiones validas
            </Text>
            <Text style={styles.goal}>Objetivo siguiente: {movement.nextTarget ?? 'Paso maestro alcanzado'}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.md },
  loadingBox: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  historyPanel: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.md },
  historyTitle: { ...typography.title, color: colors.onSurface },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outline,
    paddingTop: spacing.md,
  },
  historyCopy: { flex: 1, gap: spacing.xs },
  historyName: { ...typography.bodyStrong, color: colors.primary },
  historyMeta: { ...typography.caption, color: colors.onSurfaceVariant },
  historyState: { ...typography.label, color: colors.tertiary },
  historyEmpty: { ...typography.body, color: colors.onSurfaceVariant },
  card: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm },
  name: { ...typography.title, color: colors.onSurface },
  step: { ...typography.body, color: colors.secondary },
  barTrack: { marginTop: spacing.xs, height: 16, backgroundColor: colors.surfaceContainerHigh },
  barFill: { height: '100%', backgroundColor: colors.tertiary },
  goal: { ...typography.caption, color: colors.onSurfaceVariant },
});
