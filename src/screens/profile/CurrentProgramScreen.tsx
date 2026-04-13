import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { getProgramSchedule, type ProgramDaySchedule, type CurrentProgram } from '../../db/today';
import { colors, spacing, typography } from '../../theme';

export function CurrentProgramScreen() {
  const [program, setProgram] = useState<CurrentProgram | null>(null);
  const [schedule, setSchedule] = useState<ProgramDaySchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getProgramSchedule()
      .then((data) => {
        if (!mounted) return;
        setProgram(data.program);
        setSchedule(data.schedule);
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
        eyebrow="REGIMEN ACTIVO"
        title={(program?.name ?? 'VETERANO').toUpperCase()}
        description={
          program
            ? `${program.daysPerWeek} dias por semana. ${program.description ?? 'Sesiones cortas, foco absoluto.'}`
            : 'Leyendo estructura semanal del regimen actual.'
        }
      />

      <View style={styles.sheet}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Cargando cronograma...</Text>
          </View>
        ) : null}
        {schedule.map((day) => (
          <View key={day.dayIndex} style={styles.dayBlock}>
            <Text style={styles.dayTitle}>Dia {day.dayIndex}</Text>
            {day.items.map((item) => (
              <Text key={`${day.dayIndex}-${item.position}`} style={styles.item}>
                {item.movementName}
                {item.prescription ? ` · ${item.prescription}` : ''}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: { marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.md },
  loadingBox: { gap: spacing.sm, alignItems: 'center', paddingVertical: spacing.md },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  dayBlock: { gap: spacing.xs },
  dayTitle: { ...typography.label, color: colors.tertiary },
  item: { ...typography.bodyStrong, color: colors.onSurface },
});
