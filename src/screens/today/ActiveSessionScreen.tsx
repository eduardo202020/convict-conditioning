import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import {
  finishSession,
  getOrCreateActiveSession,
  logSetForExercise,
  type ActiveSessionState,
} from '../../db/session';
import { HoyStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<HoyStackParamList, 'ActiveSession'>;

export function ActiveSessionScreen({ navigation }: Props) {
  const [session, setSession] = useState<ActiveSessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyExerciseId, setBusyExerciseId] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    let mounted = true;

    getOrCreateActiveSession()
      .then((data) => {
        if (mounted) setSession(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogSet(sessionExerciseId: number) {
    setBusyExerciseId(sessionExerciseId);
    try {
      const updated = await logSetForExercise(sessionExerciseId);
      setSession(updated);
    } finally {
      setBusyExerciseId(null);
    }
  }

  async function handleFinish() {
    if (!session) return;
    setClosing(true);
    try {
      const summary = await finishSession(session.sessionId);
      navigation.navigate('SessionSummary', { sessionId: summary.sessionId });
    } finally {
      setClosing(false);
    }
  }

  return (
    <Screen>
      <AppHeader
        eyebrow="SESION ACTIVA"
        title="REGISTRO DE TRABAJO"
        description={
          session ? `${session.programName}. Bloques del dia segun programa y paso actual.` : 'Cargando bloques del dia.'
        }
      />

      <View style={styles.list}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Preparando sesion...</Text>
          </View>
        ) : null}
        {session?.exercises.map((exercise, index) => (
          <View key={exercise.sessionExerciseId} style={styles.card}>
            <Text style={styles.index}>BLOQUE {String(index + 1).padStart(2, '0')}</Text>
            <Text style={styles.title}>{exercise.movementName}</Text>
            <Text style={styles.subtitle}>
              {exercise.stepName}
              {exercise.stepNumber ? ` · Paso ${exercise.stepNumber}` : ''}
            </Text>
            <View style={styles.stats}>
              <View>
                <Text style={styles.statLabel}>Objetivo</Text>
                <Text style={styles.statValue}>{exercise.targetRaw ?? 'sin objetivo'}</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Series</Text>
                <Text style={styles.statValue}>
                  {exercise.loggedSets}
                  {exercise.targetSets ? ` / ${exercise.targetSets}` : ''}
                </Text>
              </View>
            </View>
            <View style={styles.buttons}>
              <AppButton
                label={busyExerciseId === exercise.sessionExerciseId ? 'REGISTRANDO...' : 'REGISTRAR SERIE'}
                onPress={() => handleLogSet(exercise.sessionExerciseId)}
              />
              <AppButton label="VER GUIA" onPress={() => {}} variant="ghost" />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton label={closing ? 'CERRANDO...' : 'CERRAR SESION'} onPress={handleFinish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.md },
  loadingBox: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  card: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.md },
  index: { ...typography.label, color: colors.tertiary },
  title: { ...typography.headline, color: colors.onSurface },
  subtitle: { ...typography.body, color: colors.secondary },
  stats: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  statLabel: { ...typography.caption, color: colors.onSurfaceVariant, textTransform: 'uppercase' },
  statValue: { ...typography.bodyStrong, color: colors.primary, marginTop: spacing.xs },
  buttons: { gap: spacing.sm },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
});
