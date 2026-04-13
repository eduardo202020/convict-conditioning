import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getLocalExerciseImages, getLocalImageSource } from '../../assets/exerciseImages';
import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { getStepDetail, type StepMedia } from '../../db/library';
import { BibliotecaStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<BibliotecaStackParamList, 'MediaViewer'>;

export function MediaViewerScreen({ route }: Props) {
  const [media, setMedia] = useState<StepMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const localImages =
    media
      .filter((item) => item.kind === 'local_image')
      .map((item) => getLocalImageSource(item.uri))
      .filter(Boolean) || [];
  const fallbackImages = getLocalExerciseImages(route.params.slug, route.params.stepNumber ?? 1);
  const galleryImages = localImages.length ? localImages : fallbackImages;
  const externalMedia = media.filter(
    (item) => !['local_image', 'generated_image_placeholder'].includes(item.kind),
  );

  useEffect(() => {
    let mounted = true;

    getStepDetail(route.params.slug, route.params.stepNumber)
      .then((detail) => {
        if (mounted) {
          setMedia(detail?.media ?? []);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [route.params.slug, route.params.stepNumber]);

  return (
    <Screen>
      <AppHeader
        eyebrow="VISOR MULTIMEDIA"
        title={route.params.title.toUpperCase()}
        description="Espacio limpio para inspeccionar imagenes y referencias de video del ejercicio."
      />

      <View style={styles.viewer}>
        {loading ? (
          <>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.copy}>Cargando medios del paso...</Text>
          </>
        ) : galleryImages.length || externalMedia.length ? (
          <>
            {galleryImages.length ? (
              <View style={styles.localSection}>
                <Text style={styles.sectionTitle}>Laminas locales</Text>
                {galleryImages.map((imageSource, index) => (
                  <View key={`local-${index}`} style={styles.localImageCard}>
                    <Image source={imageSource} style={styles.localImage} resizeMode="contain" />
                    <Text style={styles.localImageLabel}>Vista {index + 1}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {externalMedia.length ? (
              <View style={styles.localSection}>
                <Text style={styles.sectionTitle}>Referencias externas</Text>
                {externalMedia.map((item) => (
                  <Pressable key={item.id} onPress={() => Linking.openURL(item.uri)} style={styles.mediaRow}>
                    <MaterialCommunityIcons
                      color={item.kind === 'video_guide' ? colors.primary : colors.tertiary}
                      name={item.kind === 'video_guide' ? 'play-box-outline' : 'image-outline'}
                      size={24}
                    />
                    <View style={{ flex: 1, gap: spacing.xxs }}>
                      <Text style={styles.mediaKind}>{item.kind}</Text>
                      <Text numberOfLines={2} style={styles.mediaUri}>
                        {item.uri}
                      </Text>
                      {item.credit ? <Text style={styles.mediaCredit}>{item.credit}</Text> : null}
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </>
        ) : (
          <>
            <MaterialCommunityIcons color={colors.primary} name="image-filter-center-focus" size={42} />
            <Text style={styles.copy}>No hay medios asociados a este paso.</Text>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  viewer: { marginHorizontal: spacing.lg, marginTop: spacing.xl, minHeight: 320, backgroundColor: colors.surfaceContainer, gap: spacing.md, padding: spacing.lg },
  copy: { ...typography.body, color: colors.onSurfaceVariant, textAlign: 'center' },
  localSection: { gap: spacing.md },
  sectionTitle: { ...typography.label, color: colors.tertiary },
  localImageCard: { backgroundColor: colors.surfaceContainerHigh, padding: spacing.md, gap: spacing.sm },
  localImage: { width: '100%', height: 280, backgroundColor: colors.background },
  localImageLabel: { ...typography.caption, color: colors.onSurfaceVariant, textAlign: 'center' },
  mediaRow: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.surfaceContainerHigh, padding: spacing.md, alignItems: 'flex-start' },
  mediaKind: { ...typography.label, color: colors.onSurface },
  mediaUri: { ...typography.caption, color: colors.tertiary },
  mediaCredit: { ...typography.caption, color: colors.onSurfaceVariant },
});
