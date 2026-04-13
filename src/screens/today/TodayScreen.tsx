import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { ExerciseCard } from '../../components/ExerciseCard';
import { Screen } from '../../components/Screen';
import { getTodayDossier, type TodayDossier } from '../../db/today';
import { colors, spacing, typography } from '../../theme';

export function TodayScreen() {
  const navigation = useNavigation<any>();
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
        eyebrow={dossier?.todayLabel?.toUpperCase() ?? 'CARGANDO DOSSIER'}
        title="PROGRAMA DE HOY"
        description={
          dossier
            ? `Operacion: ${dossier.program.name}. ${dossier.program.description ?? 'Tension constante, ejecucion limpia y nada de repeticiones regaladas.'}`
            : 'Preparando regimen y lectura del programa del dia.'
        }
        rightIcon="account-circle-outline"
        onRightPress={() => navigation.navigate('Profile')}
      />

      <View style={styles.grid}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Leyendo rutina de hoy...</Text>
          </View>
        ) : null}
        {!loading && dossier?.isRestDay ? (
          <View style={styles.restBox}>
            <Text style={styles.restTitle}>DIA DE DESCANSO</Text>
            <Text style={styles.restCopy}>
              El programa activo no tiene bloque asignado hoy. Recuperacion, movilidad suave y vuelta
              al manual manana.
            </Text>
          </View>
        ) : null}
        {dossier?.exercises.map((exercise, index) => (
          <ExerciseCard
            key={`${exercise.movementSlug ?? exercise.movementName}-${exercise.position}`}
            figure={exercise.stepNumber ? `PASO ${String(exercise.stepNumber).padStart(2, '0')}` : undefined}
            sample={`MUESTRA ${String(index + 1).padStart(2, '0')}`}
            subtitle={`${exercise.stepName ?? 'Trabajo auxiliar'} · ${exercise.prescription ?? 'sin prescripcion'}`}
            title={exercise.movementName}
            onPress={() =>
              exercise.movementSlug
                ? navigation.navigate('BibliotecaStack', {
                    screen: 'StepDetail',
                    params: {
                      slug: exercise.movementSlug,
                      stepNumber: exercise.stepNumber ?? undefined,
                      name: exercise.stepName ?? exercise.movementName,
                    },
                  })
                : undefined
            }
          />
        ))}
      </View>

      <View style={styles.ctaBlock}>
        <Text style={styles.ready}>
          {dossier?.isRestDay ? 'RECUPERACION EN CURSO' : 'PREPARADO PARA EL DESPLIEGUE'}
        </Text>
        {!dossier?.isRestDay ? (
          <AppButton label="INICIAR SESION" onPress={() => navigation.navigate('ActiveSession')} />
        ) : null}
        <Text style={styles.quote}>"El dolor es temporal, el orgullo es para siempre."</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { marginTop: spacing.xl, backgroundColor: colors.outlineVariant, gap: 1 },
  loadingBox: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  restBox: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm },
  restTitle: { ...typography.label, color: colors.primary },
  restCopy: { ...typography.body, color: colors.onSurfaceVariant },
  ctaBlock: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, gap: spacing.lg, alignItems: 'center' },
  ready: { ...typography.label, color: colors.secondary },
  quote: { ...typography.caption, color: colors.onSurfaceVariant, fontFamily: 'Newsreader_400Regular_Italic' },
});
