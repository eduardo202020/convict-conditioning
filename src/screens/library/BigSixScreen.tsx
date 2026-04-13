import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { getLibraryMovements, type LibraryMovement } from '../../db/library';
import { BibliotecaStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<BibliotecaStackParamList, 'BigSix'>;

export function BigSixScreen({ navigation }: Props) {
  const [items, setItems] = useState<LibraryMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getLibraryMovements()
      .then((data) => {
        if (mounted) setItems(data);
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
        eyebrow="ARCHIVO CENTRAL"
        title="BIBLIOTECA"
        description="Los Seis Grandes organizados como capitulos de un manual. Entra, estudia y ejecuta."
      />

      <View style={styles.grid}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Cargando archivo de movimientos...</Text>
          </View>
        ) : null}
        {items.map((movement) => (
          <Pressable
            key={movement.slug}
            onPress={() => navigation.navigate('Movement', { slug: movement.slug, name: movement.name })}
            style={styles.card}
          >
            <Text style={styles.focus}>{movement.description ?? 'Big Six'}</Text>
            <Text style={styles.name}>{movement.name}</Text>
            <Text style={styles.step}>{movement.stepCount} pasos · progreso completo</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.md },
  card: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm },
  loadingBox: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  focus: { ...typography.label, color: colors.tertiary },
  name: { ...typography.headline, color: colors.onSurface },
  step: { ...typography.caption, color: colors.onSurfaceVariant },
});
