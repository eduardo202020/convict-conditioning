import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { getSessionSummary, type SessionSummary as SessionSummaryData } from '../../db/session';
import { HoyStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<HoyStackParamList, 'SessionSummary'>;

export function SessionSummaryScreen({ route }: Props) {
  const [summary, setSummary] = useState<SessionSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getSessionSummary(route.params.sessionId)
      .then((data) => {
        if (mounted) setSummary(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [route.params.sessionId]);

  return (
    <Screen>
      <AppHeader
        eyebrow="CIERRE DE SESION"
        title="PARTE COMPLETADO"
        description={
          summary
            ? `${summary.programName}. Trabajo ejecutado con exito. La progresion se gana con repeticiones honestas.`
            : 'Recopilando resultados de la sesion.'
        }
      />

      <View style={styles.panel}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Cargando resumen...</Text>
          </View>
        ) : null}
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Series registradas</Text>
          <Text style={styles.metricValue}>{summary?.totalSets ?? 0}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Bloques con trabajo</Text>
          <Text style={styles.metricValue}>
            {summary?.completedExercises ?? 0}/{summary?.totalExercises ?? 0}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Estado</Text>
          <Text style={styles.metricNote}>
            {summary?.finishedAt ? 'Sesion cerrada y guardada en el historial local.' : 'Sesion aun abierta.'}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: { marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.lg },
  loadingBox: { gap: spacing.sm, alignItems: 'center', paddingBottom: spacing.md },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  metric: { gap: spacing.xs },
  metricLabel: { ...typography.label, color: colors.secondary },
  metricValue: { ...typography.display, color: colors.primary, fontSize: 32, lineHeight: 32 },
  metricNote: { ...typography.body, color: colors.onSurface },
});
