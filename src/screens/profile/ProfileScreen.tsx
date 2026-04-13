import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { athleteProfile } from '../../data/mockData';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  return (
    <Screen>
      <AppHeader
        eyebrow="PERFIL DE ATLETA"
        title={athleteProfile.alias.toUpperCase()}
        description="Configuracion practica, resumen del regimen activo y acceso a ajustes."
      />

      <View style={styles.block}>
        <Text style={styles.stat}>Programa activo: {athleteProfile.activeProgram}</Text>
        <Text style={styles.stat}>Sesiones completadas: {athleteProfile.sessions}</Text>
        <Text style={styles.stat}>Racha actual: {athleteProfile.streak} dias</Text>
      </View>

      <View style={styles.links}>
        <Pressable onPress={() => navigation.navigate('CurrentProgram')} style={styles.linkRow}>
          <Text style={styles.link}>PROGRAMA ACTUAL</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Settings')} style={styles.linkRow}>
          <Text style={styles.link}>AJUSTES</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginHorizontal: spacing.lg, marginTop: spacing.xl, backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm },
  stat: { ...typography.body, color: colors.onSurface },
  links: { marginHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.sm },
  linkRow: { backgroundColor: colors.surfaceContainerHigh, padding: spacing.lg },
  link: { ...typography.label, color: colors.tertiary },
});
