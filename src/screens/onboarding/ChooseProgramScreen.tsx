import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { programs } from '../../data/mockData';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseProgram'>;

export function ChooseProgramScreen({ navigation }: Props) {
  return (
    <Screen>
      <AppHeader
        eyebrow="PROTOCOLO DE ENTRADA"
        title="ELIGE TU PROGRAMA"
        description="Cinco regimenes. Una sola regla: elige el que puedas sostener con disciplina."
      />

      <View style={styles.grid}>
        {programs.map((program) => (
          <Pressable
            key={program.code}
            onPress={() => navigation.navigate('SetInitialLevels')}
            style={styles.card}
          >
            <Text style={styles.label}>{program.difficulty}</Text>
            <Text style={styles.title}>{program.name}</Text>
            <Text style={styles.meta}>{program.daysPerWeek} dias por semana</Text>
            <Text style={styles.copy}>{program.philosophy}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: 1, backgroundColor: colors.outlineVariant },
  card: { backgroundColor: colors.surfaceContainerLow, padding: spacing.lg, gap: spacing.sm },
  label: { ...typography.label, color: colors.tertiary },
  title: { ...typography.headline, color: colors.onSurface },
  meta: { ...typography.caption, color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 },
  copy: { ...typography.body, color: colors.onSurfaceVariant },
});
