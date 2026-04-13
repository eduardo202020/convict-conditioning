import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { movements } from '../../data/mockData';
import { ProgresoStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<ProgresoStackParamList, 'MovementProgress'>;

export function MovementProgressScreen({ route }: Props) {
  const movement = movements.find((item) => item.slug === route.params?.slug) ?? movements[0];

  return (
    <Screen>
      <AppHeader
        eyebrow="EXPEDIENTE DE PROGRESION"
        title={movement.name.toUpperCase()}
        description={`Paso actual: ${movement.currentStepName}. Foco: ${movement.focus}.`}
      />

      <View style={styles.panel}>
        <Text style={styles.label}>Estado actual</Text>
        <Text style={styles.value}>Paso {movement.currentStep}</Text>
        <Text style={styles.copy}>Siguiente requisito: {movement.nextGoal}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: { marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm },
  label: { ...typography.label, color: colors.tertiary },
  value: { ...typography.display, color: colors.primary, fontSize: 34, lineHeight: 34 },
  copy: { ...typography.body, color: colors.onSurface },
});
