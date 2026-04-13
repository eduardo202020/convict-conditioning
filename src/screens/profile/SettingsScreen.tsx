import { StyleSheet, Switch, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { colors, spacing, typography } from '../../theme';

export function SettingsScreen() {
  return (
    <Screen>
      <AppHeader
        eyebrow="AJUSTES"
        title="SISTEMA"
        description="Opciones compactas para controlar temporizador, comportamiento de progresion y entorno."
      />

      <View style={styles.list}>
        {['Temporizador automatico de descanso', 'Sugerir progresion al cumplir objetivo', 'Mostrar medios al iniciar ejercicio'].map((item, index) => (
          <View key={item} style={styles.row}>
            <Text style={styles.text}>{item}</Text>
            <Switch thumbColor={colors.primary} trackColor={{ false: colors.outlineVariant, true: colors.tertiary }} value={index !== 2} />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { marginHorizontal: spacing.lg, marginTop: spacing.xl, gap: spacing.sm },
  row: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  text: { ...typography.body, color: colors.onSurface, flex: 1 },
});
