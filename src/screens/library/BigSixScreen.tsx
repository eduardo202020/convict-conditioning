import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { movements } from '../../data/mockData';
import { BibliotecaStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<BibliotecaStackParamList, 'BigSix'>;

export function BigSixScreen({ navigation }: Props) {
  return (
    <Screen>
      <AppHeader
        eyebrow="ARCHIVO CENTRAL"
        title="BIBLIOTECA"
        description="Los Seis Grandes organizados como capitulos de un manual. Entra, estudia y ejecuta."
      />

      <View style={styles.grid}>
        {movements.map((movement) => (
          <Pressable
            key={movement.slug}
            onPress={() => navigation.navigate('Movement', { slug: movement.slug, name: movement.name })}
            style={styles.card}
          >
            <Text style={styles.focus}>{movement.focus}</Text>
            <Text style={styles.name}>{movement.name}</Text>
            <Text style={styles.step}>10 pasos · progreso completo</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.md },
  card: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm },
  focus: { ...typography.label, color: colors.tertiary },
  name: { ...typography.headline, color: colors.onSurface },
  step: { ...typography.caption, color: colors.onSurfaceVariant },
});
