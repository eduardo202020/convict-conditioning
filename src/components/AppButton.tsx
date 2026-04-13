import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
};

export function AppButton({ label, onPress, variant = 'primary', disabled = false }: Props) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: 4 },
  primary: { backgroundColor: colors.primary },
  ghost: { borderWidth: 1, borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainer },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
  label: { ...typography.label },
  primaryLabel: { color: colors.onPrimary },
  ghostLabel: { color: colors.tertiary },
});
