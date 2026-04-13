import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { colors, spacing, typography } from '../../theme';

export function CurrentProgramScreen() {
  return (
    <Screen>
      <AppHeader
        eyebrow="REGIMEN ACTIVO"
        title="VETERANO"
        description="Seis dias por semana. Un movimiento por dia. Sesiones cortas, foco absoluto."
      />

      <View style={styles.sheet}>
        {['Lunes · Pull-Ups', 'Martes · Bridges', 'Miercoles · Handstand Push-Ups', 'Jueves · Leg Raises', 'Viernes · Squats', 'Sabado · Push-Ups'].map((item) => (
          <Text key={item} style={styles.item}>{item}</Text>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: { marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.md },
  item: { ...typography.bodyStrong, color: colors.onSurface },
});
