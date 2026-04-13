import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { getMovementSteps, type LibraryStep } from '../../db/library';
import { BibliotecaStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<BibliotecaStackParamList, 'Movement'>;

export function MovementScreen({ navigation, route }: Props) {
  const [steps, setSteps] = useState<LibraryStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getMovementSteps(route.params.slug)
      .then((data) => {
        if (mounted) setSteps(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [route.params.slug]);

  return (
    <Screen>
      <AppHeader
        eyebrow="SERIE DE PROGRESION"
        title={route.params.name.toUpperCase()}
        description="Diez pasos. Una escalera. La meta no es hacer mas repeticiones, sino subir con control."
      />

      <View style={styles.list}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Cargando escalera de progresion...</Text>
          </View>
        ) : null}
        {steps.map((step) => (
          <Pressable
            key={step.id}
            onPress={() =>
              navigation.navigate('StepDetail', {
                slug: route.params.slug,
                stepNumber: step.stepNumber,
                name: step.name,
              })
            }
            style={styles.row}
          >
            <Text style={styles.stepNumber}>{String(step.stepNumber).padStart(2, '0')}</Text>
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
  loadingBox: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  row: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, flexDirection: 'row', gap: spacing.md },
  stepNumber: { ...typography.display, color: colors.primary, fontSize: 28, lineHeight: 28, width: 40 },
  name: { ...typography.title, color: colors.onSurface },
  goal: { ...typography.caption, color: colors.onSurfaceVariant, marginTop: spacing.xs },
});
