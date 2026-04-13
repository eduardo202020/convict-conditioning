import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { getPrograms, type SelectableProgram } from '../../db/user';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseProgram'>;

export function ChooseProgramScreen({ navigation }: Props) {
  const [programs, setPrograms] = useState<SelectableProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getPrograms()
      .then((data) => {
        if (mounted) setPrograms(data);
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
        eyebrow="PROTOCOLO DE ENTRADA"
        title="ELIGE TU PROGRAMA"
        description="Cinco regimenes. Una sola regla: elige el que puedas sostener con disciplina."
      />

      <View style={styles.grid}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Cargando regimenes...</Text>
          </View>
        ) : null}
        {programs.map((program) => (
          <Pressable
            key={program.code}
            onPress={() => navigation.navigate('SetInitialLevels', { programCode: program.code })}
            style={styles.card}
          >
            <Text style={styles.label}>{program.isActive ? 'ACTIVO' : 'PROGRAMA'}</Text>
            <Text style={styles.title}>{program.name}</Text>
            <Text style={styles.meta}>{program.daysPerWeek} dias por semana</Text>
            <Text style={styles.copy}>{program.description ?? 'Sin descripcion cargada.'}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: 1, backgroundColor: colors.outlineVariant },
  loadingBox: { backgroundColor: colors.surfaceContainerLow, padding: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  card: { backgroundColor: colors.surfaceContainerLow, padding: spacing.lg, gap: spacing.sm },
  label: { ...typography.label, color: colors.tertiary },
  title: { ...typography.headline, color: colors.onSurface },
  meta: { ...typography.caption, color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 },
  copy: { ...typography.body, color: colors.onSurfaceVariant },
});
