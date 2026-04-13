import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { getMovementLevels, saveInitialSetup, type MovementLevel } from '../../db/user';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SetInitialLevels'>;

export function SetInitialLevelsScreen({ navigation, route }: Props) {
  const [levels, setLevels] = useState<MovementLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    getMovementLevels()
      .then((data) => {
        if (mounted) setLevels(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  function updateStep(movementId: number, delta: number) {
    setLevels((current) =>
      current.map((movement) =>
        movement.movementId === movementId
          ? {
              ...movement,
              currentStepNumber: Math.max(1, Math.min(10, movement.currentStepNumber + delta)),
            }
          : movement,
      ),
    );
  }

  async function handleConfirm() {
    setSaving(true);
    try {
      await saveInitialSetup(
        route.params.programCode,
        levels.map((movement) => ({
          movementId: movement.movementId,
          stepNumber: movement.currentStepNumber,
        })),
      );
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <AppHeader
        eyebrow="CALIBRACION"
        title="NIVELES INICIALES"
        description="Marca tu paso actual en cada familia de movimiento. Esto define tus sesiones desde hoy."
      />

      <View style={styles.list}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Cargando movimientos...</Text>
          </View>
        ) : null}
        {levels.map((movement) => (
          <View key={movement.movementSlug} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{movement.movementName}</Text>
              <Text style={styles.step}>
                Paso {movement.currentStepNumber}
              </Text>
            </View>
            <View style={styles.adjuster}>
              <Pressable onPress={() => updateStep(movement.movementId, -1)} style={styles.iconButton}>
                <MaterialCommunityIcons color={colors.tertiary} name="minus" size={18} />
              </Pressable>
              <Text style={styles.stepBadge}>{movement.currentStepNumber}</Text>
              <Pressable onPress={() => updateStep(movement.movementId, 1)} style={styles.iconButton}>
                <MaterialCommunityIcons color={colors.tertiary} name="plus" size={18} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton label={saving ? 'GUARDANDO...' : 'CONFIRMAR Y ENTRAR'} onPress={handleConfirm} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.sm },
  loadingBox: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  row: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { ...typography.title, color: colors.onSurface },
  step: { ...typography.caption, color: colors.onSurfaceVariant, marginTop: spacing.xs },
  adjuster: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  iconButton: { width: 36, height: 36, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  stepBadge: { ...typography.bodyStrong, color: colors.primary, minWidth: 28, textAlign: 'center' },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
});
