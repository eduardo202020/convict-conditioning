import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getLocalExerciseImages } from '../../assets/exerciseImages';
import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { VideoCard } from '../../components/VideoCard';
import { getStepDetail, type StepDetail } from '../../db/library';
import { BibliotecaStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<BibliotecaStackParamList, 'StepDetail'>;

export function StepDetailScreen({ navigation, route }: Props) {
  const [detail, setDetail] = useState<StepDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getStepDetail(route.params.slug, route.params.stepNumber)
      .then((data) => {
        if (mounted) setDetail(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [route.params.slug, route.params.stepNumber]);

  const displayTitle = detail?.name ?? route.params.name ?? 'Step Detail';
  const primaryTarget = useMemo(
    () => detail?.targets.find((target) => target.schemeCode === 'initial') ?? detail?.targets[0] ?? null,
    [detail],
  );
  const localImages = useMemo(
    () =>
      detail
        ? getLocalExerciseImages(detail.movementSlug, detail.stepNumber)
        : route.params.stepNumber
          ? getLocalExerciseImages(route.params.slug, route.params.stepNumber)
          : [],
    [detail, route.params.slug, route.params.stepNumber],
  );
  const externalGuideCount =
    detail?.media.filter((media) => media.kind !== 'generated_image_placeholder').length ?? 0;

  return (
    <Screen>
      <AppHeader
        eyebrow={`PASO ${detail?.stepNumber ?? route.params.stepNumber ?? '?'}`}
        title={displayTitle.toUpperCase()}
        description="Guia tecnica, objetivo actual y medio de referencia para ejecucion honesta."
      />

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Abriendo expediente del paso...</Text>
          </View>
        ) : null}
        <View style={styles.mediaPlate}>
          <Image
            source={localImages[0] ?? require('../../../data/Convict.webp')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.dossier}>
          <Text style={styles.label}>Objetivo del paso</Text>
          <Text style={styles.value}>
            {primaryTarget ? `${primaryTarget.schemeName}: ${primaryTarget.rawTarget}` : 'Sin objetivo cargado'}
          </Text>
          <Text style={styles.copy}>
            {detail?.goal ||
              detail?.techniqueNotes ||
              'Mantener alineacion, rango limpio y tension constante. El movimiento debe verse sobrio, no espectacular.'}
          </Text>
          <Text style={styles.copy}>
            Laminas locales: {localImages.length} · Medios externos: {externalGuideCount}
          </Text>
        </View>

        <VideoCard
          title="Abrir referencia multimedia"
          meta={`${localImages.length} imagenes locales · ${externalGuideCount} medios externos`}
          onPress={() =>
            navigation.navigate('MediaViewer', {
              slug: route.params.slug,
              stepNumber: route.params.stepNumber,
              title: displayTitle,
            })
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.lg },
  loadingBox: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  loadingText: { ...typography.caption, color: colors.onSurfaceVariant },
  mediaPlate: { height: 280, backgroundColor: colors.surfaceContainerHigh, overflow: 'hidden' },
  image: { width: '100%', height: '100%', opacity: 0.7 },
  dossier: { backgroundColor: colors.surfaceContainer, padding: spacing.lg, gap: spacing.sm },
  label: { ...typography.label, color: colors.tertiary },
  value: { ...typography.title, color: colors.onSurface },
  copy: { ...typography.body, color: colors.onSurfaceVariant },
});
