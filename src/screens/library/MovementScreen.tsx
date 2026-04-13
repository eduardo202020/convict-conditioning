import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { stepCatalog } from '../../data/mockData';
import { BibliotecaStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<BibliotecaStackParamList, 'Movement'>;

export function MovementScreen({ navigation, route }: Props) {
  const steps = stepCatalog[route.params.slug] ?? [];

  return (
    <Screen>
      <AppHeader
        eyebrow="SERIE DE PROGRESION"
        title={route.params.name.toUpperCase()}
        description="Diez pasos. Una escalera. La meta no es hacer mas repeticiones, sino subir con control."
      />

      <View style={styles.list}>
        {steps.map((step) => (
          <Pressable
            key={step.number}
            onPress={() =>
              navigation.navigate('StepDetail', {
                slug: route.params.slug,
                stepNumber: step.number,
                name: step.name,
              })
            }
            style={styles.row}
          >
            <Text style={styles.stepNumber}>{String(step.number).padStart(2, '0')}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{step.name}</Text>
              <Text style={styles.goal}>Objetivo base: {step.goal}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.sm },
  row: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, flexDirection: 'row', gap: spacing.md },
  stepNumber: { ...typography.display, color: colors.primary, fontSize: 28, lineHeight: 28, width: 40 },
  name: { ...typography.title, color: colors.onSurface },
  goal: { ...typography.caption, color: colors.onSurfaceVariant, marginTop: spacing.xs },
});
