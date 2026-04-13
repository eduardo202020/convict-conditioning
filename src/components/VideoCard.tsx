import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../theme';

type Props = { title: string; meta: string; onPress?: () => void };

export function VideoCard({ title, meta, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.thumb}>
        <MaterialCommunityIcons color={colors.onPrimary} name="play" size={28} />
      </View>
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, backgroundColor: colors.surfaceContainerHigh },
  thumb: { width: 72, height: 72, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.bodyStrong, color: colors.onSurface },
  meta: { ...typography.caption, color: colors.onSurfaceVariant },
});
