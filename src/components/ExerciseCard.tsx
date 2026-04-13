import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../theme';

type Props = { sample: string; title: string; subtitle: string; figure?: string; onPress?: () => void };

export function ExerciseCard({ sample, title, subtitle, figure, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}>
      <Text style={styles.sample}>{sample}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.mediaBox}>
        <MaterialCommunityIcons color={colors.secondary} name="image-outline" size={32} />
        {figure ? <Text style={styles.figure}>{figure}</Text> : null}
      </View>
      <View style={styles.linkRow}>
        <MaterialCommunityIcons color={colors.tertiary} name="information-outline" size={16} />
        <Text style={styles.link}>VER DETALLES TECNICOS</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surfaceContainerLow, padding: spacing.lg, gap: spacing.sm },
  sample: { ...typography.label, color: colors.tertiary, opacity: 0.65 },
  title: { ...typography.headline, color: colors.onSurface },
  subtitle: { ...typography.caption, color: colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1 },
  mediaBox: { marginTop: spacing.sm, height: 160, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  figure: { ...typography.label, color: colors.onSurface, position: 'absolute', bottom: spacing.sm, left: spacing.sm, backgroundColor: colors.background, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  link: { ...typography.label, color: colors.tertiary },
});
