import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import {
  getMovementProgressDetail,
  getRecentMovementSessions,
  type ProgressMovementDetail,
  type RecentMovementSession,
} from '../../db/progress';
import { ProgresoStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<ProgresoStackParamList, 'MovementProgress'>;

export function MovementProgressScreen({ route }: Props) {
  const [detail, setDetail] = useState<ProgressMovementDetail | null>(null);
  const [recentSessions, setRecentSessions] = useState<RecentMovementSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const slug = route.params?.slug ?? 'pushup';

    Promise.all([getMovementProgressDetail(slug), getRecentMovementSessions(slug)])
      .then(([detailData, recentData]) => {
        if (!mounted) return;
        setDetail(detailData);
        setRecentSessions(recentData);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [route.params?.slug]);

  return (
    <Screen>
      <AppHeader
        eyebrow="EXPEDIENTE DE PROGRESION"
        title={(detail?.name ?? 'PROGRESO').toUpperCase()}
        description={
          detail
            ? `Paso actual: ${detail.currentStepName}. El progreso real es gradual y acumulativo.`
            : 'Abriendo expediente del movimiento.'
        }
      />

      <View style={styles.panel}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Cargando detalle de progreso...</Text>
          </View>
        ) : null}
        <Text style={styles.label}>Estado actual</Text>
        <Text style={styles.value}>Paso {detail?.currentStepNumber ?? 1}</Text>
        <Text style={styles.copy}>
          Objetivo actual: {detail?.currentStepGoal ?? 'Sin objetivo cargado'}
        </Text>
        <Text style={styles.copy}>
          Siguiente paso: {detail?.nextStepNumber ? `Paso ${detail.nextStepNumber} · ${detail.nextStepName}` : 'Paso maestro alcanzado'}
        </Text>
        <Text style={styles.copy}>
          Requisito siguiente: {detail?.nextStepGoal ?? 'No hay requisito posterior'}
        </Text>
        <Text style={styles.copy}>Paso maestro: {detail?.masterStepName ?? 'No disponible'}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.label}>Sesiones recientes</Text>
        {recentSessions.length ? (
          recentSessions.map((session) => (
            <View key={session.sessionId} style={styles.historyRow}>
              <View style={styles.historyCopy}>
                <Text style={styles.historyName}>
                  Paso {session.stepNumber} · {session.stepName}
                </Text>
                <Text style={styles.historyMeta}>
                  {new Date(session.startedAt).toLocaleDateString('es-PE')} · {session.totalSets} series
                </Text>
              </View>
              <Text style={styles.historyMetric}>
                {session.totalReps
                  ? `${session.totalReps} reps`
                  : session.totalHoldSec
                    ? `${session.totalHoldSec}s`
                    : 'Sin volumen'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.copy}>
            Aun no hay sesiones registradas para este movimiento.
          </Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: { marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm },
  loadingBox: { gap: spacing.sm, alignItems: 'center', paddingBottom: spacing.md },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  label: { ...typography.label, color: colors.tertiary },
  value: { ...typography.display, color: colors.primary, fontSize: 34, lineHeight: 34 },
  copy: { ...typography.body, color: colors.onSurface },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outline,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  historyCopy: { flex: 1, gap: spacing.xs },
  historyName: { ...typography.bodyStrong, color: colors.primary },
  historyMeta: { ...typography.caption, color: colors.onSurfaceVariant },
  historyMetric: { ...typography.label, color: colors.secondary },
});
