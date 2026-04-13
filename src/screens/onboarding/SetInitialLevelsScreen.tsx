import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { movements } from '../../data/mockData';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SetInitialLevels'>;

export function SetInitialLevelsScreen({ navigation }: Props) {
  return (
    <Screen>
      <AppHeader
        eyebrow="CALIBRACION"
        title="NIVELES INICIALES"
        description="Marca tu paso actual en cada familia de movimiento. Esto define tus sesiones desde hoy."
      />

      <View style={styles.list}>
        {movements.map((movement) => (
          <View key={movement.slug} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{movement.name}</Text>
              <Text style={styles.step}>
                Paso {movement.currentStep} · {movement.currentStepName}
              </Text>
            </View>
            <Pressable style={styles.selector}>
              <Text style={styles.selectorText}>AJUSTAR</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton label="CONFIRMAR Y ENTRAR" onPress={() => navigation.replace('MainTabs')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.sm },
  row: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { ...typography.title, color: colors.onSurface },
  step: { ...typography.caption, color: colors.onSurfaceVariant, marginTop: spacing.xs },
  selector: { backgroundColor: colors.surfaceContainerHigh, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  selectorText: { ...typography.label, color: colors.tertiary },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
});
