import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { colors, spacing, typography } from '../../theme';

export function SessionSummaryScreen() {
  return (
    <Screen>
      <AppHeader
        eyebrow="CIERRE DE SESION"
        title="PARTE COMPLETADO"
        description="Trabajo ejecutado con exito. La progresion se gana con repeticiones honestas."
      />

      <View style={styles.panel}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Series registradas</Text>
          <Text style={styles.metricValue}>5</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>RPE medio</Text>
          <Text style={styles.metricValue}>8/10</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Proxima alerta</Text>
          <Text style={styles.metricNote}>Pull-Ups cerca del siguiente paso</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: { marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.lg },
  metric: { gap: spacing.xs },
  metricLabel: { ...typography.label, color: colors.secondary },
  metricValue: { ...typography.display, color: colors.primary, fontSize: 32, lineHeight: 32 },
  metricNote: { ...typography.body, color: colors.onSurface },
});
