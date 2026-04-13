import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { getTodayDossier, type TodayDossier } from '../../db/today';
import { HoyStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<HoyStackParamList, 'ActiveSession'>;

export function ActiveSessionScreen({ navigation }: Props) {
  const [dossier, setDossier] = useState<TodayDossier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getTodayDossier()
      .then((data) => {
        if (mounted) setDossier(data);
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
        eyebrow="SESION ACTIVA"
        title="REGISTRO DE TRABAJO"
        description={
          dossier ? `${dossier.program.name}. Bloques del dia segun programa y paso actual.` : 'Cargando bloques del dia.'
        }
      />

      <View style={styles.list}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Preparando sesion...</Text>
          </View>
        ) : null}
        {dossier?.exercises.map((exercise, index) => (
          <View key={`${exercise.movementSlug ?? exercise.movementName}-${exercise.position}`} style={styles.card}>
            <Text style={styles.index}>BLOQUE {String(index + 1).padStart(2, '0')}</Text>
            <Text style={styles.title}>{exercise.movementName}</Text>
            <Text style={styles.subtitle}>{exercise.stepName ?? 'Trabajo auxiliar'}</Text>
            <View style={styles.stats}>
              <View>
                <Text style={styles.statLabel}>Objetivo</Text>
                <Text style={styles.statValue}>{exercise.prescription ?? 'sin prescripcion'}</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Descanso</Text>
                <Text style={styles.statValue}>90 SEC</Text>
              </View>
            </View>
            <View style={styles.buttons}>
              <AppButton label="REGISTRAR SERIE" onPress={() => {}} />
              <AppButton label="VER GUIA" onPress={() => {}} variant="ghost" />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton label="CERRAR SESION" onPress={() => navigation.navigate('SessionSummary')} />
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
