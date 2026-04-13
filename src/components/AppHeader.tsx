import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../theme';

type Props = { eyebrow?: string; title: string; description?: string; rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap; onRightPress?: () => void };

export function AppHeader({ eyebrow, title, description, rightIcon, onRightPress }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        {rightIcon ? (
          <Pressable onPress={onRightPress} style={styles.iconButton}>
            <MaterialCommunityIcons color={colors.onSurface} name={rightIcon} size={22} />
          </Pressable>
        ) : null}
      </View>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  eyebrow: { ...typography.label, color: colors.tertiary, marginBottom: spacing.xs },
  title: { ...typography.display, color: colors.onSurface },
  description: { ...typography.body, color: colors.secondary, maxWidth: 340, marginLeft: spacing.md },
  rule: { width: 72, height: 4, backgroundColor: colors.primary, marginLeft: spacing.md, marginTop: spacing.xs },
  iconButton: { width: 42, height: 42, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceContainerHigh },
});
