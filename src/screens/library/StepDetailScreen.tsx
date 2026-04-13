import { Image, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { VideoCard } from '../../components/VideoCard';
import { BibliotecaStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<BibliotecaStackParamList, 'StepDetail'>;

export function StepDetailScreen({ navigation, route }: Props) {
  const stepName = route.params.name ?? 'Step Detail';

  return (
    <Screen>
      <AppHeader
        eyebrow={`PASO ${route.params.stepNumber ?? '?'}`}
        title={stepName.toUpperCase()}
        description="Guia tecnica, objetivo actual y medio de referencia para ejecucion honesta."
      />

      <View style={styles.content}>
        <View style={styles.mediaPlate}>
          <Image source={require('../../../data/Convict.webp')} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.dossier}>
          <Text style={styles.label}>Objetivo del paso</Text>
          <Text style={styles.value}>Consultar objetivo segun esquema actual</Text>
          <Text style={styles.copy}>
            Mantener alineacion, rango limpio y tension constante. El movimiento debe verse
            sobrio, no espectacular.
          </Text>
        </View>

        <VideoCard
          title="Abrir referencia multimedia"
          meta="Video guia · imagen tecnica · notas del paso"
          onPress={() => navigation.navigate('MediaViewer', { title: stepName })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.lg },
  mediaPlate: { height: 280, backgroundColor: colors.surfaceContainerHigh, overflow: 'hidden' },
  image: { width: '100%', height: '100%', opacity: 0.7 },
  dossier: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm },
  label: { ...typography.label, color: colors.tertiary },
  value: { ...typography.title, color: colors.onSurface },
  copy: { ...typography.body, color: colors.onSurfaceVariant },
});
